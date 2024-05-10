import { Assets } from "_Assets";
import Nullstack, { NullstackClientContext } from "nullstack";
import "./styles.scss";

export class BottomNavigator extends Nullstack {
  render({ router, instances }: NullstackClientContext) {
    if (!instances.authentication.logged_in) return null;

    return (
      <footer class="bottom-navigator">
        <a
          href="/library"
          data-active={router.path === "/library" ? "true" : "false"}
        >
          <Assets.MusicNote />
          <span>Library</span>
        </a>

        <a
          href="/threads"
          data-active={router.path === "/threads" ? "true" : "false"}
        >
          <Assets.Newspaper />
          <span>Threads</span>
        </a>

        <a
          href="/profile"
          data-active={router.path === "/profile" ? "true" : "false"}
        >
          <Assets.Person />
          <span>Profile</span>
        </a>
      </footer>
    );
  }
}
