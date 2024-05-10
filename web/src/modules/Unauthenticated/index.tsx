import { Button } from "_common/components/Button";
import { Input } from "_common/components/Input";
import { MainTemplate } from "_common/templates/MainTemplate";
import Nullstack, { NullstackClientContext } from "nullstack";
import "./styles.scss";

export class Unauthenticated extends Nullstack {
  email: string = "";
  username: string = "";

  handleSignin({ instances }: NullstackClientContext) {
    instances.authentication.login({ email: this.email });
  }

  handleSignup({ instances }: NullstackClientContext) {
    instances.authentication.signup({ username: this.username });
  }

  renderEmail({ instances }: Partial<NullstackClientContext>) {
    const { loading } = instances.authentication;

    return (
      <form onsubmit={this.handleSignin}>
        <Input
          name="email"
          bind={this.email}
          label="Email"
          input_type="input"
          type="email"
        />

        <Button loading={loading}>Next</Button>
      </form>
    );
  }

  renderUsername({ instances }: Partial<NullstackClientContext>) {
    const { loading } = instances.authentication;

    return (
      <form onsubmit={this.handleSignup}>
        <Input
          name="username"
          bind={this.username}
          label="Username"
          input_type="input"
        />

        <Button loading={loading}>Sign up</Button>
      </form>
    );
  }

  render({ instances }: NullstackClientContext) {
    return (
      <MainTemplate page_title="Welcome">
        <div class="unauthenticated">
          {instances.authentication.should_create_account
            ? this.renderUsername({})
            : this.renderEmail({})}
        </div>
      </MainTemplate>
    );
  }
}
