import { library } from "_@mocks";
import { Models } from "_@types/models";
import Nullstack, { NullstackClientContext } from "nullstack";

export class LibraryInstance extends Nullstack {
  song?: string;
  audio_ref: HTMLAudioElement;
  current_time: string = "00:00";
  playing: boolean;
  repeating: boolean;
  shuffling: boolean;
  songs_library: Models.Song[] = [];

  async hydrate({ services }: NullstackClientContext) {
    const { data } = await services.songs.get_songs();

    this.songs_library = data.songs;
  }

  onprevioussong() {
    this.audio_ref.currentTime = 0;

    if (Number(this.current_time.replace(":", "")) > 3) return;

    const song_index = this.songs_library.findIndex(
      ({ sort_key }) => sort_key === this.song
    );
    if (song_index === -1) return;

    const prev_song = this.songs_library[song_index - 1];
    if (!prev_song) return;

    const { sort_key, url } = prev_song;

    this.audio_ref.src = url;
    this.song = sort_key;
    this.audio_ref.play();
  }

  onnextsong() {
    this.audio_ref.currentTime = 0;

    const song_index = this.songs_library.findIndex(
      ({ sort_key }) => sort_key === this.song
    );
    if (song_index === -1) return;

    const next_song = this.songs_library[song_index + 1];
    if (!next_song) return;

    const { sort_key, url } = next_song;

    this.audio_ref.src = url;
    this.song = sort_key;
    this.audio_ref.play();
  }

  render() {
    const src =
      this.songs_library.find(({ sort_key }) => sort_key === this.song)?.url ||
      null;

    if (!src) return null;

    return (
      <audio
        autoplay
        ref={this.audio_ref}
        ontimeupdate={({ event }) => {
          const { currentTarget } = event;
          const { currentTime } = currentTarget;
          this.current_time = format_time(currentTime);
        }}
        onplay={() => (this.playing = true)}
        onpause={() => (this.playing = false)}
        loop={this.repeating}
        onended={this.shuffling && this.onnextsong}
      >
        <source src={src} type="audio/mp3" />
      </audio>
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
