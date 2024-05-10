import { apigateway, apigatewayv2, iam } from "@pulumi/aws";
import { ComponentResource, ComponentResourceOptions } from "@pulumi/pulumi";
import { LambdaResource } from "../lambda";
import { DynamoDBResource } from "../dynamo";
import { ThreadLambdaFunctions } from "./threads";
import { SongLambdaFunctions } from "./songs";
import { UserLambdaFunctions } from "./users";
import { BucketsResource } from "../buckets";

interface Props {
  api: apigatewayv2.Api;
  environment: string;
  dynamodb: DynamoDBResource;
  s3buckets: BucketsResource;
}

export class ApiLambdas extends ComponentResource {
  index: LambdaResource;
  threads: LambdaResource;
  users: LambdaResource;
  songs: LambdaResource;

  public constructor(
    name: string,
    props: Props,
    opts?: ComponentResourceOptions
  ) {
    super(`${name}:index:${props.environment}`, name, {}, opts);

    const { environment, api, dynamodb, s3buckets } = props;

    const role = new iam.Role(`${name}-lambda-role`, {
      assumeRolePolicy: iam.assumeRolePolicyForPrincipal({
        Service: "lambda.amazonaws.com",
      }),
      managedPolicyArns: [
        iam.ManagedPolicies.AWSLambdaBasicExecutionRole,
        iam.ManagedPolicies.AWSLambdaInvocationDynamoDB,
        iam.ManagedPolicies.AmazonDynamoDBFullAccess,
        iam.ManagedPolicies.AmazonS3FullAccess,
      ],
    });

    const thread_lambdas = new ThreadLambdaFunctions(`${name}-thread-funcs`, {
      environment,
      env: { TABLE_NAME: dynamodb.table.name },
      role,
    });

    this.threads = new LambdaResource(
      `${name}-threads`,
      {
        functions: thread_lambdas.functions,
        url_path: "/threads",
        api,
        environment,
      },
      { parent: this }
    );

    const user_lambdas = new UserLambdaFunctions(`${name}-user-funcs`, {
      environment,
      env: { TABLE_NAME: dynamodb.table.name },
      role,
    });

    this.users = new LambdaResource(`${name}-users`, {
      functions: user_lambdas.functions,
      url_path: "/users",
      api,
      environment,
    });

    const song_lambdas = new SongLambdaFunctions(`${name}-song-funcs`, {
      environment,
      env: {
        TABLE_NAME: dynamodb.table.name,
        BUCKET_NAME: s3buckets.main_bucket.bucket,
      },
      role,
    });

    this.songs = new LambdaResource(`${name}-songs`, {
      functions: song_lambdas.functions,
      url_path: "/songs",
      api,
      environment,
    });

    this.registerOutputs({});
  }
}
