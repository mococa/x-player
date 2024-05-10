/* ---------- External ---------- */
import {
  ComponentResource,
  ComponentResourceOptions,
  Output,
  Resource,
  output,
} from "@pulumi/pulumi";
import {
  PulumiNullstack,
  ServerlessApp,
} from "nullstack-serverless-pulumi-aws";

/* ---------- Constants ---------- */
import { domains } from "../../../utils/constants/domains";

/* ---------- Interfaces ---------- */
export interface WebStackProps {
  app_dir: string;
  environment: string;
  certificate_arn: Output<string>;
}

/* ---------- Component Resources ---------- */
export class WebStack extends ComponentResource {
  app: PulumiNullstack;
  sls: ServerlessApp;

  public constructor(
    name: string,
    props: WebStackProps,
    opts?: ComponentResourceOptions
  ) {
    super(`${name}:index:${props.environment}`, name, {}, opts);

    const { app_dir, environment, certificate_arn } = props;

    /* ---------- Component Resources ---------- */
    this.app = new PulumiNullstack("nullstack-x-player", {
      environment,
      domain: domains.web[environment],
      env: {
        NULLSTACK_SECRETS_API_ENDPOINT: `https://${domains.api[environment]}`,
      },
      nullstack_app_path: app_dir,
    });

    this.sls = new ServerlessApp(
      "nullstack-x-player-sls",
      {
        lambda_fn: this.app.lambda_fn,
        environment,
        certificate_arn,
        hostname: output(domains.web[environment]),
      },
      { dependsOn: [this.app.lambda_fn as Resource] }
    );
  }
}
