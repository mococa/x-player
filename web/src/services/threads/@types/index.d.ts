export namespace ThreadsService {
  export interface CreateThreadInput {
    content: string;
    username: string;
  }

  export interface UpdateThreadInput {
    user_id: string;
    thread_id: string;
    type: "like" | "unlike";
  }
}
