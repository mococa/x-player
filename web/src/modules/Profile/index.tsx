import { Button } from "_common/components/Button";
import { MainTemplate } from "_common/templates/MainTemplate";
import Nullstack, { NullstackClientContext } from "nullstack";
import "./styles.scss";

export class Profile extends Nullstack {
  render({ instances }: NullstackClientContext) {
    const { username, logout } = instances.authentication;
    return (
      <MainTemplate page_title="Profile">
        <div class="profile">
          <span>@{username}</span>

          <Button onclick={logout}>Sign out</Button>
        </div>
      </MainTemplate>
    );
  }
}
