import { MainTemplate } from "_common/templates/MainTemplate";
import Nullstack, { NullstackClientContext } from "nullstack";
import { Models } from "_@types/models";
import "./styles.scss";

export class Library extends Nullstack {
  renderSongItem({
    song_details,
    instances,
    sort_key,
    url,
  }: Partial<NullstackClientContext<Models.Song>>) {
    const { songs_library } = instances.library;

    return (
      <li
        onclick={async () => {
          if (instances.library.audio_ref) {
            instances.library.audio_ref.src = url;
            instances.library.audio_ref.pause();
            instances.library.audio_ref.currentTime = 0;
          }

          instances.library.song = sort_key;
          if (!instances.library.audio_ref)
            await new Promise((r) => {
              setTimeout(r, 100);
            });
          instances.library.audio_ref.play();
        }}
      >
        <img alt="song" src={song_details.cover_art} height={36} width={36} />

        <div>
          <header>{song_details.artist}</header>

          <div>
            <span>{song_details.name}</span>

            <span>{format_time(song_details.duration_ms / 1000)}</span>
          </div>
        </div>
      </li>
    );
  }

  render({ instances }: NullstackClientContext) {
    const { songs_library } = instances.library;

    return (
      <MainTemplate page_title="Library">
        <div class="library">
          <ul class="library-song-list">
            {songs_library.map(this.renderSongItem)}
          </ul>
        </div>
      </MainTemplate>
    );
  }
}

const format_time = (timeInput: number) => {
  const minute = Math.floor(timeInput / 60);
  const minute_str = String(minute < 10 ? "0" + minute : minute);

  const second = Math.floor(timeInput % 60);
  const second_str = String(second < 10 ? "0" + second : second);

  return `${minute_str}:${second_str}`;
};
