import Nullstack, { NullstackClientContext } from "nullstack";
import { formatDistanceToNow } from "date-fns";

import { Assets } from "_Assets";

import { MainTemplate } from "_common/templates/MainTemplate";

import "./styles.scss";
import { BottomSheet } from "nullstack-bottomsheet";
import { Button } from "_common/components/Button";
import { Input } from "_common/components/Input";
import { Models } from "_@types/models";

class Thread extends Nullstack {
  render({
    likes,
    author,
    content,
    created_at,
    sort_key,
    instances,
  }: NullstackClientContext<Models.Thread>) {
    const { like_unlike } = instances.threads;
    const { wallet } = instances.authentication;

    const liked = likes.includes(wallet);

    return (
      <li
        data-liked={liked ? "true" : "false"}
        ondblclick={() => like_unlike({ sort_key })}
      >
        <img src={`https://api.dicebear.com/7.x/thumbs/svg?seed=${author}`} />

        <div>
          <header>
            <b>@{author}</b>

            <span>
              {formatDistanceToNow(new Date(`${created_at}Z`), {
                addSuffix: true,
              })}
            </span>
          </header>

          <span>{content}</span>

          <footer>
            <div class="likes" onclick={() => like_unlike({ sort_key })}>
              <Assets.Heart />

              {likes.length}
            </div>
          </footer>
        </div>
      </li>
    );
  }
}

export class Threads extends Nullstack {
  creating_thread: boolean;
  new_thread_content: string = "";
  bottomsheet: BottomSheet;
  creating: boolean;

  async handleCreateThread({
    services,
    instances,
  }: Partial<NullstackClientContext>) {
    if (this.creating) return;

    this.creating = true;

    const { username } = instances.authentication;

    await services.threads.create_thread({
      content: this.new_thread_content,
      username,
    });

    await instances.threads.load_threads({});

    await this.bottomsheet.close({});
    this.new_thread_content = "";
    this.creating = false;
  }

  renderThreadBottomsheet() {
    return (
      <BottomSheet
        ref={this.bottomsheet}
        snaps={[0, 85]}
        default_snap={85}
        onclose={() => (this.creating_thread = false)}
        close_on_snap_to_zero
        snapping_time={300}
        id="new-thread"
      >
        <div class="thread-bottomsheet">
          <b>What's on your mind?</b>

          <form onsubmit={this.handleCreateThread}>
            <Input
              name="content"
              label="Describe your thoughts"
              input_type="textarea"
              bind={this.new_thread_content}
            />

            <footer>
              <Button
                secondary
                onclick={async () => {
                  await this.bottomsheet.close({});
                  this.new_thread_content = "";
                }}
                type="button"
              >
                Cancel
              </Button>

              <Button icon type="submit" loading={this.creating}>
                <Assets.Plus />
                Publish thread
              </Button>
            </footer>
          </form>
        </div>
      </BottomSheet>
    );
  }

  render({ instances }: NullstackClientContext) {
    const { threads } = instances.threads;
    return (
      <MainTemplate page_title="Threads">
        <div
          class={["threads", instances.library.song && "playing"]
            .filter(Boolean)
            .join(" ")}
        >
          <Button
            class="thread-floating-button"
            icon
            onclick={() => (this.creating_thread = true)}
          >
            <Assets.Pen />
            Write
          </Button>

          <ul class="thread-list">
            {threads.map((props) => (
              <Thread {...props} />
            ))}
          </ul>

          {this.creating_thread && this.renderThreadBottomsheet()}
        </div>
      </MainTemplate>
    );
  }
}
