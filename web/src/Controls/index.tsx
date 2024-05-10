import Nullstack from "nullstack";
import { Assets } from "_Assets";
import "./styles.scss";

interface Props {
  src: string;
}

export class Controls extends Nullstack<Props> {
  audio_ref: HTMLAudioElement;
  playing = true;
  current_position = 0;
  updating_timestamp = false;
  clicking_on_tracker = false;
  track_ref: HTMLDivElement;
  shuffling = false;
  repeating = false;
  current_time = "00:00";

  hydrate() {
    document.addEventListener("mousemove", (event) => {
      if (!this.clicking_on_tracker) return;

      const { screenX } = event;
      const { clientWidth, offsetLeft } = this.track_ref;

      if (screenX - offsetLeft <= 0) return;
      if (screenX - offsetLeft > clientWidth) return;

      const position = (100 * (screenX - offsetLeft)) / clientWidth;
      const time = (this.audio_ref.duration * position) / 100;
      this.track_ref.style.setProperty("--position", `${position}%`);
      this.audio_ref.currentTime = time;
    });

    document.addEventListener("mouseup", () => {
      this.clicking_on_tracker = false;
    });
  }

  ontimeupdate() {
    if (this.updating_timestamp) return;

    const { duration, currentTime } = this.audio_ref;
    const percentage = (currentTime / duration) * 100;

    this.current_time = format_time(currentTime);
    this.track_ref.style.setProperty("--position", `${percentage}%`);
  }

  ontouchmove({ event }) {
    this.updating_timestamp = true;

    const { clientX, target } = event.touches[0];
    const { offsetLeft, offsetWidth } = target.offsetParent;
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

    const { duration } = this.audio_ref;
    this.current_time = format_time((track_position * duration) / 100);
  }

  onpointerup() {
    this.clicking_on_tracker = false;
    this.updating_timestamp = false;
    const current_position =
      this.track_ref.style.getPropertyValue("--position");
    const time =
      (this.audio_ref.duration * Number.parseFloat(current_position)) / 100;
    this.audio_ref.currentTime = time;
  }

  onpointerdown({ event }) {
    this.clicking_on_tracker = true;

    const { layerX, target } = event;
    const { clientWidth } = target;

    const position = (100 * layerX) / clientWidth;

    const time = (this.audio_ref.duration * Number.parseFloat(position)) / 100;
    this.audio_ref.currentTime = time;
  }

  renderTracker() {
    const { duration } = this.audio_ref || {};

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
          <span>{this.current_time}</span>

          <span>{format_time(duration || 0)}</span>
        </div>
      </div>
    );
  }

  renderAudioControls() {
    return (
      <div class="audio-controls">
        <button
          data-active={String(this.shuffling)}
          onclick={() => (this.shuffling = !this.shuffling)}
        >
          <Assets.Shuffle />
        </button>

        <button onclick={() => (this.audio_ref.currentTime = 0)}>
          <Assets.Previous />
        </button>

        <button
          onclick={() => {
            if (this.playing) this.audio_ref.pause();
            else this.audio_ref.play();

            this.playing = !this.playing;
          }}
        >
          {this.playing ? <Assets.Pause /> : <Assets.Play />}
        </button>

        <button
          onclick={() => (this.audio_ref.currentTime = this.audio_ref.duration)}
        >
          <Assets.Next />
        </button>

        <button
          data-active={String(this.repeating)}
          onclick={() => (this.repeating = !this.repeating)}
        >
          <Assets.Repeat />
        </button>
      </div>
    );
  }

  render({ src }: Props) {
    return (
      <div class="controls">
        <audio
          ref={this.audio_ref}
          autoplay
          loop={this.repeating}
          ontimeupdate={this.ontimeupdate}
        >
          <source src={src} type="audio/mp3" />
        </audio>

        {this.renderTracker()}

        {this.renderAudioControls()}
      </div>
    );
  }
}

const format_time = (timeInput: number) => {
  let minute = Math.floor(timeInput / 60);

  minute = minute < 10 ? "0" + minute : minute;

  let second = Math.floor(timeInput % 60);

  second = second < 10 ? "0" + second : second;

  return `${minute}:${second}`;
};
