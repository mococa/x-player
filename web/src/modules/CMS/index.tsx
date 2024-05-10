import Nullstack, { NullstackClientContext } from "nullstack";
import "./styles.scss";
import { MainTemplate } from "_common/templates/MainTemplate";
import { Input } from "_common/components/Input";
import { Button } from "_common/components/Button";
import { Assets } from "_Assets";
import axios from "axios";

export class CMS extends Nullstack {
  search: string = "";
  passcode: string = "";
  access_key: string = "";
  loading: boolean;
  file: File;

  async onsubmit({ services }: Partial<NullstackClientContext>) {
    if (this.passcode !== "123") return alert("wrong password");

    this.loading = true;
    try {
      const {
        data: { presigned_url },
      } = await services.songs.get_presigned_url(
        this.file.name,
        this.file.type
      );

      await services.songs.presign_url(presigned_url, this.file);

      const url = presigned_url.split("?")[0];

      const spotify = axios.create({ baseURL: "https://api.spotify.com" });

      const { data: spotify_result } = await spotify.get("/v1/search", {
        params: { q: this.search, type: "track", market: "US", limit: 1 },
        headers: {
          Authorization: `Bearer ${this.access_key.split(" ").join("")}`,
        },
      });

      const [{ album, artists, duration_ms, name }] =
        spotify_result.tracks.items;

      const song_details = {
        name,
        artist: artists.map(({ name }) => name).join(", "),
        cover_art: album.images[1]?.url,
        duration_ms,
      };

      await services.songs.add_song({ song_details, url });
    } catch (error) { }
    this.loading = false;
  }

  render() {
    return (
      <MainTemplate page_title="CMS" hide_bottomnav>
        <form class="cms-form" onsubmit={this.onsubmit}>
          <Input
            label="Song and artist name"
            name="search"
            input_type="input"
            bind={this.search}
          />

          <Input
            label="Spotify access key"
            name="access_key"
            input_type="input"
            bind={this.access_key}
          />

          <span>And</span>

          <div class="dropfile">
            <div>
              <Assets.Upload />

              <span>Upload song</span>

              <input
                type="file"
                onchange={({ event }) =>
                  (this.file = event.target.files.item(0))
                }
                accept=".mp3,audio/*"
              />
            </div>
          </div>

          <Input
            label="Admin passcode"
            name="passcode"
            input_type="input"
            type="password"
            bind={this.passcode}
          />

          <Button
            type="submit"
            disabled={!this.access_key && !this.search && !this.file}
            loading={this.loading}
          >
            Search info and add
          </Button>
        </form>
      </MainTemplate>
    );
  }
}
