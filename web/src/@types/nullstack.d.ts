/* eslint-disable @typescript-eslint/no-empty-interface */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
//
import { AppInstances } from "_instances/@types";
import { services } from "_services";
import * as nullstack from "nullstack";

declare module "nullstack" {
  export interface NullstackInstances extends AppInstances { }

  export interface BaseNullstackClientContext {
    services: typeof services;
  }
}
