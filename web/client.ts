import Nullstack, { NullstackClientContext } from "nullstack";

import Application from "./src/Application";
import { api, services } from "_services";

const context = Nullstack.start(Application) as NullstackClientContext;

api.defaults.baseURL = context.settings.api_url as string;

context.services = services;

context.start = async function start() {
  // https://nullstack.app/pt-br/inicializacao-da-aplicacao
};

export default context;
