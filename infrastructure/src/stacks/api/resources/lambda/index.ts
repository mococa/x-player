import { apigateway, apigatewayv2, lambda } from "@pulumi/aws";
import {
  ComponentResource,
  ComponentResourceOptions,
  interpolate,
} from "@pulumi/pulumi";

interface LambdaResourceProps {
  api: apigatewayv2.Api;
  functions: {
    fn: lambda.Function;
    method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  }[];
  url_path: string;
  environment: string;
}

export class LambdaResource extends ComponentResource {
  method_integrations: {
    function_integration: apigatewayv2.Integration;
    function_permission: lambda.Permission;
    function_route: apigatewayv2.Route;
  }[] = [];

  constructor(
    name: string,
    props: LambdaResourceProps,
    opts?: ComponentResourceOptions
  ) {
    super(`${name}:index:${props.environment}`, name, {}, opts);

    const { api, functions, url_path } = props;

    for (const { fn, method } of functions) {
      // Integration
      const integration = new apigatewayv2.Integration(
        `${name}-integration-${method}`,
        {
          apiId: api.id,
          integrationType: "AWS_PROXY",
          integrationUri: fn.arn,
          payloadFormatVersion: "2.0",
        }
      );

      // Route
      const route = new apigatewayv2.Route(`${name}-route-${method}`, {
        apiId: api.id,
        routeKey: `${method} ${url_path}`,
        target: interpolate`integrations/${integration.id}`,
      });

      // Permission
      const permission = new lambda.Permission(`${name}-permission-${method}`, {
        action: "lambda:InvokeFunction",
        function: fn.name,
        principal: "apigateway.amazonaws.com",
        sourceArn: interpolate`${api.executionArn}/*/*`,
      });

      this.method_integrations.push({
        function_integration: integration,
        function_route: route,
        function_permission: permission,
      });
    }

    this.registerOutputs({});
  }
}

interface CorsProps {
  rest_api: apigateway.RestApi;
  environment: string;
  resource: apigateway.Resource;
}

class Cors extends ComponentResource {
  constructor(name: string, props: CorsProps, opts?: ComponentResourceOptions) {
    super("custom:apigateway:Cors", name, {}, opts);

    const { rest_api, resource } = props;

    const optionsMethod = new apigateway.Method(
      `${name}-options-method`,
      {
        restApi: rest_api,
        resourceId: resource.id!,
        httpMethod: "OPTIONS",
        authorization: "NONE",
      },
      { parent: this }
    );

    const optionsIntegration = new apigateway.Integration(
      `${name}-options-integration`,
      {
        restApi: rest_api,
        resourceId: resource.id!,
        httpMethod: optionsMethod.httpMethod!,
        type: "MOCK",
        requestTemplates: {
          "application/json": '{"statusCode": 200}',
        },
      },
      { parent: this }
    );

    const optionsIntegrationResponse = new apigateway.IntegrationResponse(
      `${name}-integration-response`,
      {
        restApi: rest_api,
        resourceId: resource.id!,
        httpMethod: optionsIntegration.httpMethod!,
        statusCode: "200",
        responseTemplates: {
          "application/json": "",
        },
        responseParameters: {
          "integration.response.header.Access-Control-Allow-Methods":
            "'GET,OPTIONS,PUT,POST,DELETE'",
          "integration.response.header.Access-Control-Allow-Headers":
            "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'",
          "integration.response.header.Access-Control-Allow-Origin": "'*'",
        },
      },
      { parent: this }
    );

    const optionsMethodResponse = new apigateway.MethodResponse(
      `${name}-method-response`,
      {
        restApi: rest_api,
        resourceId: resource.id!,
        httpMethod: optionsMethod.httpMethod!,
        statusCode: "200",
        responseModels: {
          "application/json": "Empty",
        },
        responseParameters: {
          "method.response.header.Access-Control-Allow-Methods": true,
          "method.response.header.Access-Control-Allow-Headers": true,
          "method.response.header.Access-Control-Allow-Origin": true,
        },
      },
      { parent: this }
    );

    this.registerOutputs({});
  }
}
