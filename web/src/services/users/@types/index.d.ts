export namespace UserService {
  export interface CreateUserInterface {
    username: string;
    wallet: string;
  }

  export interface FindUserInterface {
    wallet: string;
  }
}
