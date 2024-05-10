import {
  ComponentResource,
  ComponentResourceOptions,
  Input,
  asset,
} from "@pulumi/pulumi";
import { iam, lambda } from "@pulumi/aws";
import { resolve } from "path";

interface Props {
  environment: string;
  env: Record<string, Input<string>>;
  role: iam.Role;
}

export class UserLambdaFunctions extends ComponentResource {
  functions: {
    fn: lambda.Function;
    method: "GET" | "POST" | "DELETE" | "PUT" | "PATCH";
  }[];

  public constructor(
    name: string,
    props: Props,
    opts?: ComponentResourceOptions
  ) {
    super(`${name}:index:${props.environment}`, name, {}, opts);

    const { role, env } = props;

    const lambda_name = "x-player-user-lambda";

    this.functions = [
      {
        fn: new lambda.Function(`${lambda_name}-function-GET`, {
          role: role.arn,
          code: new asset.FileArchive(resolve(__dirname, "GET")),
          handler: "main.handler",
          runtime: "python3.9",
          environment: { variables: env },
        }),
        method: "GET",
      },
      {
        fn: new lambda.Function(`${lambda_name}-function-POST`, {
          role: role.arn,
          code: new asset.FileArchive(resolve(__dirname, "POST")),
          handler: "main.handler",
          runtime: "python3.9",
          environment: { variables: env },
        }),
        method: "POST",
      },
    ];
  }
}
