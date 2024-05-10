import Nullstack, { NullstackClientContext } from "nullstack";
import "./styles.scss";
import { BottomSheet } from "nullstack-bottomsheet";
import { Assets } from "_Assets";
import { Models } from "_@types/models";

interface ControllerProps {
  playing: boolean;
  ontogglepause: () => void;
  onnextsong: () => void;
  onprevioussong: () => void;
}

class Controller extends Nullstack {
  clicking_on_tracker: boolean;
  updating_timestamp: boolean;
  current_time: string;
  track_ref: HTMLDivElement;

  hydrate({ instances }: NullstackClientContext) {
    const { audio_ref } = instances.library;

    document.addEventListener("mousemove", (event) => {
      if (!this.clicking_on_tracker) return;

      const { screenX } = event;
      const { clientWidth, offsetLeft } = this.track_ref;

      if (screenX - offsetLeft <= 0) return;
      if (screenX - offsetLeft > clientWidth) return;

      const position = (100 * (screenX - offsetLeft)) / clientWidth;
      const time = (audio_ref.duration * position) / 100;
      this.track_ref.style.setProperty("--position", `${position}%`);
      audio_ref.currentTime = time;
    });

    document.addEventListener("mouseup", () => {
      this.clicking_on_tracker = false;
    });

    audio_ref.ontimeupdate = () => this.ontimeupdate({});
  }

  terminate({ instances }: NullstackClientContext) {
    const { audio_ref } = instances.library;

    document.removeEventListener("mouseup", () => {
      this.clicking_on_tracker = false;
    });

    document.removeEventListener("mousemove", (event) => {
      if (!this.clicking_on_tracker) return;

      const { screenX } = event;
      const { clientWidth, offsetLeft } = this.track_ref;

      if (screenX - offsetLeft <= 0) return;
      if (screenX - offsetLeft > clientWidth) return;

      const position = (100 * (screenX - offsetLeft)) / clientWidth;
      const time = (audio_ref.duration * position) / 100;
      this.track_ref.style.setProperty("--position", `${position}%`);
      audio_ref.currentTime = time;
    });
  }

  ontimeupdate({
    instances,
  }: Partial<NullstackClientContext<ControllerProps>>) {
    if (this.updating_timestamp) return;

    const { duration, currentTime } = instances.library.audio_ref;
    const percentage = (currentTime / duration) * 100;

    this.current_time = format_time(currentTime);
    this.track_ref.style.setProperty("--position", `${percentage}%`);
  }

  ontouchmove({
    event,
    instances,
  }: NullstackClientContext<{ event: TouchEvent }>) {
    this.updating_timestamp = true;

    const { clientX, target } = event.touches[0];
    const { offsetLeft, offsetWidth } = (target as HTMLDivElement).offsetParent;
    const maximum = Math.min(clientX, offsetWidth + offsetLeft);
    const minimum = Math.min(Math.abs(clientX), 0);

    const position = Math.max(
      0,
      (clientX > maximum
        ? maximum
        : (clientX < minimum && minimum) || clientX) - offsetLeft
    );

    const track_position = (100 * position) / offsetWidth;
    this.track_ref.style.setProperty("--position", `${track_position}%`);

    const { audio_ref } = instances.library;
    const { duration } = audio_ref;
    this.current_time = format_time((track_position * duration) / 100);
  }

  onpointerup({ instances }: Partial<NullstackClientContext>) {
    this.clicking_on_tracker = false;
    this.updating_timestamp = false;
    const current_position =
      this.track_ref.style.getPropertyValue("--position");

    const { audio_ref } = instances.library;
    const time =
      (audio_ref.duration * Number.parseFloat(current_position)) / 100;
    audio_ref.currentTime = time;
  }

  onpointerdown({
    event,
    instances,
  }: Partial<NullstackClientContext<{ event: PointerEvent }>>) {
    this.clicking_on_tracker = true;

    const { layerX, target } = event as any;
    const { clientWidth } = target;

    const position = (100 * layerX) / clientWidth;

    const { audio_ref } = instances.library;

    const time =
      (audio_ref.duration * Number.parseFloat(String(position))) / 100;
    audio_ref.currentTime = time;
  }

  renderTracker({ instances }: Partial<NullstackClientContext>) {
    const { audio_ref, current_time } = instances.library;
    const { duration } = audio_ref || {};

    return (
      <div
        class="track-container"
        ontouchmove={this.ontouchmove}
        ontouchstart={this.ontouchmove}
        ontouchend={this.onpointerup}
      >
        <div
          class="track"
          ref={this.track_ref}
          onmouseup={this.onpointerup}
          onmousedown={this.onpointerdown}
        >
          <div class="track-circle" />
          <div class="track-completion" />
          <div class="track-bg" />
        </div>

        <div class="track-timestamps">
          <span>{current_time}</span>

          <span>{format_time(duration || 0)}</span>
        </div>
      </div>
    );
  }

  renderAudioControls({
    instances,
    ontogglepause,
    onnextsong,
    onprevioussong,
  }: Partial<NullstackClientContext<ControllerProps>>) {
    const { playing, repeating, shuffling } = instances.library;

    return (
      <div class="audio-controls">
        <button
          data-active={String(shuffling)}
          onclick={() => {
            instances.library.shuffling = !instances.library.shuffling;
            if (instances.library.shuffling)
              instances.library.repeating = false;
          }}
        >
          <Assets.Shuffle />
        </button>

        <button onclick={onprevioussong}>
          <Assets.Previous />
        </button>

        <button onclick={ontogglepause}>
          {playing ? <Assets.Pause /> : <Assets.Play />}
        </button>

        <button onclick={onnextsong}>
          <Assets.Next />
        </button>

        <button
          data-active={String(repeating)}
          onclick={() => {
            instances.library.repeating = !repeating;
            if (instances.library.repeating)
              instances.library.shuffling = false;
          }}
        >
          <Assets.Repeat />
        </button>
      </div>
    );
  }

  render() {
    return (
      <div class="controls" onclick={({ event }) => event.stopPropagation()}>
        {this.renderTracker({})}

        {this.renderAudioControls({})}
      </div>
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

export class LibrarySongController extends Nullstack {
  showing_bottom_sheet: boolean;
  bottom_sheet: BottomSheet;
  small_controller: HTMLDivElement;

  renderSongBottomsheet({
    song,
    instances,
  }: Partial<
    NullstackClientContext<{
      song: Models.Song;
      song_index: number;
    }>
  >) {
    return (
      <BottomSheet
        ref={this.bottom_sheet}
        close_on_snap_to_zero
        onclose={() => (this.showing_bottom_sheet = false)}
        snapping_time={300}
        snaps={[0, 85]}
        default_snap={85}
        id={song.song_details.name.replace(/\s/g, "-")}
      >
        <div class="song-bottomsheet">
          <img height={240} width={240} src={song.song_details.cover_art} />

          <span class="artist">{song.song_details.artist}</span>

          <span class="song">{song.song_details.name}</span>

          <Controller
            ontogglepause={() => {
              const { audio_ref, playing } = instances.library;

              if (playing) audio_ref.pause();
              else audio_ref.play();
            }}
            onprevioussong={instances.library.onprevioussong}
            onnextsong={instances.library.onnextsong}
          />
        </div>
      </BottomSheet>
    );
  }

  render({ instances }: NullstackClientContext) {
    const { song: song_sk, songs_library } = instances.library;
    if (!song_sk) return null;

    const song_index = songs_library.findIndex(
      ({ sort_key }) => sort_key === song_sk
    );
    if (song_index === -1) return null;

    const song = songs_library[song_index];
    const { audio_ref, current_time, playing } = instances.library;

    return (
      <div class="library-song-controller">
        <div
          class="small-controller"
          ref={this.small_controller}
          onclick={() => (this.showing_bottom_sheet = true)}
        >
          <div>
            <button
              onclick={({ event }) => {
                event.stopPropagation();

                if (playing) audio_ref.pause();
                else audio_ref.play();
              }}
            >
              {playing ? <Assets.Pause /> : <Assets.Play />}
            </button>

            <img src={song.song_details.cover_art} height={32} width={32} />

            <div>
              <span data-playing={playing ? "true" : "false"}>
                {song.song_details.artist} - {song.song_details.name}
              </span>
            </div>
          </div>

          <span>{current_time}</span>
        </div>

        {this.showing_bottom_sheet &&
          this.renderSongBottomsheet({ song, song_index })}
      </div>
    );
  }
}
