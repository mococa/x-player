/* ---------- External ---------- */
import { Config } from "@pulumi/pulumi";
import { join } from "path/posix";
import { compressSSRNullstackApps } from "nullstack-serverless-pulumi-aws";

/* ---------- Resources ---------- */
import { WebStack } from "./resources";

/* ---------- Utils ---------- */
import { walk_back_until } from "../../utils/helpers/walk_back_until";

/* ---------- Constants ---------- */
const config = new Config();
const environment = config.require("environment");
const certificate_arn = config.requireSecret("certificate_arn");

const src = walk_back_until(__dirname, "src");
const app_dir = join(src, "..", "..", "web");

compressSSRNullstackApps([app_dir]);

/* ---------- Component Resources ---------- */
const { app, sls } = new WebStack("x-player-web-stack", {
  app_dir,
  environment,
  certificate_arn,
});

const [{ lambda_fn_url }, { apigateway_domain_name: domain }] = [app, sls];

/* ---------- Output ---------- */
export const web_lambda_url = lambda_fn_url?.functionUrl;
export const web_cname = domain?.domainNameConfiguration.targetDomainName;
