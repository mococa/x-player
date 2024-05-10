import { threads } from "_@mocks";
import { Models } from "_@types/models";
import Nullstack, { NullstackClientContext } from "nullstack";

export class ThreadsInstance extends Nullstack {
  threads: Models.Thread[] = [];

  async hydrate() {
    this.load_threads({});
  }

  async load_threads({ services }: Partial<NullstackClientContext>) {
    const { data } = await services.threads.get_threads();
    this.threads = data.threads;
  }

  async like_unlike({
    sort_key,
    services,
    instances,
  }: Partial<NullstackClientContext<{ sort_key: string }>>) {
    const thread_index = this.threads.findIndex(
      ({ sort_key: sk }) => sk === sort_key
    );
    if (thread_index === -1) return;

    const { wallet } = instances.authentication;

    const type = this.threads[thread_index].likes.includes(wallet)
      ? "unlike"
      : "like";

    if (type === "like") this.threads[thread_index].likes.push(wallet);
    else
      this.threads[thread_index].likes = this.threads[
        thread_index
      ].likes.filter((id) => id !== wallet);

    services.threads.update_thread({
      user_id: wallet,
      thread_id: sort_key,
      type,
    });
  }
}
