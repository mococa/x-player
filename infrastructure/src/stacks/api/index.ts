/* ---------- External ---------- */
import { Config } from "@pulumi/pulumi";

/* ---------- Resources ---------- */
import { BackendStack } from "./resources";
import { domains } from "../../utils/constants/domains";

/* ---------- Constants ---------- */
const config = new Config();
const environment = config.require("environment");
const certificate_arn = config.requireSecret("certificate_arn");

/* ---------- Component Resources ---------- */
const { buckets, dynamodb, domain_name } = new BackendStack(`x-player-api`, {
  environment,
  certificate_arn,
});

/* ---------- Output ---------- */
export const main_bucket_name = buckets.main_bucket.bucket;
export const main_table = dynamodb.table.name;
export const endpoint_url = `https://${domains.api[environment]}`;
export const cname = domain_name.domainNameConfiguration?.targetDomainName;
