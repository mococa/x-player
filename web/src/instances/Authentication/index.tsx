import Nullstack, {
  NullstackClientContext,
  NullstackServerContext,
} from "nullstack";
import { Magic as MagicBase } from "magic-sdk";
import { parse, serialize } from "cookie";

export class AuthenticationInstance extends Nullstack {
  username: string = "mococa";
  logged_in: boolean = false;
  token: string;
  login_with_email: MagicBase["auth"]["loginWithEmailOTP"];
  wallet: string;
  magic: MagicBase;
  loading: boolean;
  should_create_account: boolean;
  email: string;

  static async getCookies(ctx: Partial<NullstackServerContext>) {
    return ctx.request.headers.cookie;
  }

  async prepare({ environment, router }: NullstackClientContext) {
    const cookies = parse(
      environment.server
        ? await AuthenticationInstance.getCookies({})
        : document.cookie
    );

    this.wallet = cookies["@x-player"];
    this.logged_in = Boolean(this.wallet);

    const routes = ["library", "threads", "profile", "cms"];

    if (
      this.logged_in &&
      !routes.some((route) => (router.path || "").includes(route))
    ) {
      router.url = "/threads";
    }
  }

  async hydrate({ services }: NullstackClientContext) {
    this.magic = new MagicBase("pk_live_E2A56EF24D9AFB85");
    if (!this.wallet) return;

    const logged_in = await this.magic.user.isLoggedIn();
    if (!logged_in || !this.logged_in) return;

    const { data } = await services.users.find_user({ wallet: this.wallet });
    const { user } = data;

    this.username = user.username;
  }

  logout({ instances }: Partial<NullstackClientContext>) {
    this.username = "";
    this.token = "";
    this.magic.user.logout();
    document.cookie = serialize("@x-player", "", {
      maxAge: 1,
      expires: new Date(0),
    });
    this.logged_in = false;
    this.wallet = "";
    this.email = "";
    instances.library.song = undefined;
    instances.library.current_time = "00:00";
    instances.library.playing = false;
  }

  async signup({
    username,
    services,
    router,
  }: Partial<NullstackClientContext<{ username: string }>>) {
    this.loading = true;

    await services.users.create_user({ username, wallet: this.wallet });

    this.username = username;
    this.logged_in = true;

    const cookie = serialize("@x-player", this.wallet, {
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    document.cookie = cookie;

    this.token = await this.magic.auth.loginWithEmailOTP({
      email: this.email,
      showUI: false,
    });

    router.url = "/threads";
    this.loading = false;
  }

  async login({
    email,
    services,
    router,
  }: Partial<NullstackClientContext<{ email: string }>>) {
    this.loading = true;

    this.email = email;
    this.token = await this.magic.auth.loginWithEmailOTP({
      email,
      showUI: true,
    });

    const { issuer: wallet } = await this.magic.user.getInfo();
    this.wallet = wallet;

    try {
      const { data } = await services.users.find_user({ wallet });
      const { user } = data;
      this.username = user.username;
      this.logged_in = true;
      const cookie = serialize("@x-player", wallet, {
        maxAge: 60 * 60 * 24 * 7, // 1 week
      });
      document.cookie = cookie;
      router.url = "/threads";
    } catch (error) {
      this.should_create_account = true;
    }

    this.loading = false;
  }
}
