import Nullstack, { NullstackClientContext } from "nullstack";
import { AuthenticationInstance } from "./Authentication";
import { LibraryInstance } from "./Library";
import { ThreadsInstance } from "./Threads";

export class Instances extends Nullstack {
  render() {
    return (
      <ns-instances>
        <LibraryInstance key="library" />
        <ThreadsInstance key="threads" />
        <AuthenticationInstance key="authentication" />
      </ns-instances>
    );
  }
}
