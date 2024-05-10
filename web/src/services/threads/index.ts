import { Models } from "_@types/models";
import { api } from "_services";
import { ThreadsService } from "./@types";

const get_threads = () => {
  return api.get<{ threads: Models.Thread[] }>("/threads");
};

const create_thread = ({
  content,
  username,
}: ThreadsService.CreateThreadInput) => {
  return api.post("/threads", { content, username });
};

const update_thread = ({
  user_id,
  thread_id,
  type,
}: ThreadsService.UpdateThreadInput) => {
  return api.put("/threads", { user_id, thread_id, type });
};

export const threads = {
  get_threads,
  update_thread,
  create_thread,
};
