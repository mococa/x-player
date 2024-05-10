import Nullstack, { NullstackClientContext, NullstackNode } from "nullstack";

import "./Application.css";
import { Threads } from "_modules/Threads";
import { Library } from "_modules/Library";
import { Instances } from "_instances";
import { LibrarySongController } from "_common/components/LibrarySongController";
import { Unauthenticated } from "_modules/Unauthenticated";
import { Profile } from "_modules/Profile";
import { CMS } from "_modules/CMS";

declare function Head(): NullstackNode;

class Router extends Nullstack {
  render({ instances }: NullstackClientContext) {
    if (!instances.authentication.logged_in) return <Unauthenticated />;

    return (
      <body>
        <LibrarySongController />
        <Threads route="/threads" />
        <Library route="/library" />
        <Profile route="/profile" />
        <CMS route="/cms" />
      </body>
    );
  }
}

class Application extends Nullstack {
  prepare({ page }: NullstackClientContext) {
    page.locale = "en-US";
    page.title = "X Player";
    page.description =
      "X Player - Listen to music and share your thoughts to the world";
  }

  renderHead({ project }: NullstackClientContext) {
    return (
      <head>
        <meta name="theme-color" content={project.backgroundColor} />
        <link href="https://fonts.gstatic.com" rel="preconnect" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter&display=swap"
          rel="stylesheet"
        />
      </head>
    );
  }

  render() {
    return (
      <html>
        <Head />

        <Instances persistent />

        <Router />
      </html>
    );
  }
}

export default Application;
