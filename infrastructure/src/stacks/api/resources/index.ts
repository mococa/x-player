import { apigatewayv2 } from "@pulumi/aws";
import {
  ComponentResource,
  ComponentResourceOptions,
  Output,
} from "@pulumi/pulumi";
import { domains } from "../../../utils/constants/domains";
import { ApiLambdas } from "./api_lambdas";
import { BucketsResource } from "./buckets";
import { DynamoDBResource } from "./dynamo";

interface Props {
  environment: string;
  certificate_arn: Output<string>;
}

export class BackendStack extends ComponentResource {
  api: apigatewayv2.Api;
  domain_name: apigatewayv2.DomainName;
  api_lambdas: ApiLambdas;
  buckets: BucketsResource;
  dynamodb: DynamoDBResource;

  public constructor(
    name: string,
    props: Props,
    opts?: ComponentResourceOptions
  ) {
    super(`${name}:index:${props.environment}`, name, {}, opts);

    const { environment, certificate_arn } = props;

    this.dynamodb = new DynamoDBResource(`${name}-dynamo`, {
      environment,
    });

    this.buckets = new BucketsResource(`${name}-buckets-${environment}`, {
      environment,
    });

    this.api = new apigatewayv2.Api(`${name}-gateway-${environment}`, {
      protocolType: "HTTP",
      corsConfiguration: {
        allowOrigins: ["*"],
        allowMethods: ["OPTIONS", "GET", "POST", "PUT", "DELETE"],
        allowHeaders: [
          "Content-Type",
          "X-Amz-Date",
          "Authorization",
          "X-Api-Key",
        ],
        exposeHeaders: ["Content-Type"],
        maxAge: 300,
      },
    });

    this.domain_name = new apigatewayv2.DomainName(
      `${name}-gateway-domain-${environment}`,
      {
        domainName: domains.api[environment],
        domainNameConfiguration: {
          certificateArn: certificate_arn,
          endpointType: "REGIONAL",
          securityPolicy: "TLS_1_2",
        },
      },
      { parent: this }
    );

    this.api_lambdas = new ApiLambdas(
      `${name}-lambdas-${environment}`,
      {
        environment,
        api: this.api,
        dynamodb: this.dynamodb,
        s3buckets: this.buckets,
      },
      { dependsOn: [this.api] }
    );

    const stage = new apigatewayv2.Stage(
      `${name}-gateway-stage-${environment}`,
      {
        apiId: this.api.id,
        autoDeploy: true,
        name: "$default",
      },
      {
        dependsOn: [
          this.api_lambdas.threads,
          this.api_lambdas.songs,
          this.api_lambdas.users,
        ].flatMap(({ method_integrations }) =>
          method_integrations.flatMap(
            ({ function_integration, function_route, function_permission }) => [
              function_integration,
              function_route,
              function_permission,
            ]
          )
        ),
      }
    );

    new apigatewayv2.ApiMapping(
      `${name}-gateway-domain-mapping-${environment}`,
      {
        apiId: this.api.id,
        stage: stage.id,
        domainName: this.domain_name.id,
      },
      { dependsOn: [this.domain_name, stage] }
    );
  }
}
