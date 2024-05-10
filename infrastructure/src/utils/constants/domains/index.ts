/* ---------- Types ---------- */
type Domain = "web" | "api";
type DomainMap = Record<Domain, { [environment: string]: string }>;

export const domains: DomainMap = {
  web: {
    development: "development-x-player.moureau.dev",
    production: "x-player.moureau.dev",
  },
  api: {
    development: "development-x-player-api.moureau.dev",
    production: "x-player-api.moureau.dev",
  },
};
