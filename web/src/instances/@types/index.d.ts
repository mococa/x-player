import { AuthenticationInstance } from "_instances/Authentication";
import { LibraryInstance } from "_instances/Library";
import { ThreadsInstance } from "_instances/Threads";

export interface AppInstances {
  library: LibraryInstance;
  authentication: AuthenticationInstance;
  threads: ThreadsInstance;
}
