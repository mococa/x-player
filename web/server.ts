import Nullstack, { NullstackServerContext } from "nullstack";

import Application from "./src/Application";

const context = Nullstack.start(Application) as NullstackServerContext;

const { settings, project, secrets } = context;

context.start = async function start() {
  // https://nullstack.app/pt-br/inicializacao-da-aplicacao

  settings.api_url = secrets.apiEndpoint;

  project.shortName = "X Player";
  project.name = "X Player - Listen to music";
  // project.domain = `${settings.url}`.split('https://')[1];
  // project.cdn = `${settings.url}`;
  project.icons = {
    96: "favicon-96x96.jpg",
    128: "/icons/icon-128x128.jpg",
    144: "/icons/icon-144x144.jpg",
    152: "/icons/icon-152x152.jpg",
    192: "/icons/icon-192x192.jpg",
    384: "/icons/icon-384x384.jpg",
    512: "/icons/icon-512x512.jpg",
  };

  project.backgroundColor = "#18191c";
  project.color = "#ffffff";
  project.favicon = "/favicon-96x96.jpg";
};

export default context;
