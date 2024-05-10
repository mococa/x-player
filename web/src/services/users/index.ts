import { api } from "_services";
import { UserService } from "./@types";
import { Models } from "_@types/models";

const create_user = ({ username, wallet }: UserService.CreateUserInterface) => {
  return api.post("/users", { username, wallet });
};

const find_user = ({ wallet }: UserService.FindUserInterface) => {
  return api.get<{ user: Models.User }>("/users", {
    params: { wallet },
  });
};

export const users = { create_user, find_user };
