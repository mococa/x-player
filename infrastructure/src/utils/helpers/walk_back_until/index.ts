/* ---------- External ---------- */
import { readdirSync } from "fs";
import { join } from "path/posix";

export const walk_back_until = (
  current_folder: string,
  folder_name: string
) => {
  const maximum_attempts = 10;

  let attempt = 0;
  let curr = current_folder;

  while (attempt < maximum_attempts) {
    const folder = readdirSync(curr, { encoding: "utf-8" });
    if (folder.includes(folder_name)) return join(curr, folder_name);

    curr = join(curr, "..");

    attempt++;
  }

  return curr;
};
