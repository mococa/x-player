import { dynamodb } from "@pulumi/aws";
import { ComponentResource, ComponentResourceOptions } from "@pulumi/pulumi";

interface Props {
  environment: string;
}

export class DynamoDBResource extends ComponentResource {
  table: dynamodb.Table;

  public constructor(
    name: string,
    props: Props,
    opts?: ComponentResourceOptions
  ) {
    super(`${name}:index:${props.environment}`, name, {}, opts);

    const { environment } = props;

    const global_secondary_indexes = [
      // {
      //   name: "datatype-index",
      //   hashKey: "datatype",
      //   projectionType: "ALL",
      // },
      // {
      //   name: "datatype-pk-index",
      //   hashKey: "datatype",
      //   rangeKey: "partition_key",
      //   projectionType: "ALL",
      // },
      // {
      //   name: "datatype-sk-index",
      //   hashKey: "datatype",
      //   rangeKey: "sort_key",
      //   projectionType: "ALL",
      // },
    ];

    this.table = new dynamodb.Table(`${name}-main-table`, {
      name: `MainTable-${environment}`,
      attributes: [
        { name: "partition_key", type: "S" },
        { name: "sort_key", type: "S" },
      ],
      billingMode: "PAY_PER_REQUEST",
      hashKey: "partition_key",
      rangeKey: "sort_key",
      streamEnabled: true,
      streamViewType: "NEW_AND_OLD_IMAGES",
      ttl: {
        attributeName: "timetolive",
        enabled: true,
      },
      // When using Pulumi, you manage the removal policy outside of the table definition,
      // e.g., through Pulumi stack references or configuration.
      // `deletionProtection` is similar in concept to AWS CDK's `RemovalPolicy.RETAIN`.
      deletionProtectionEnabled: environment === "production",
      globalSecondaryIndexes: global_secondary_indexes,
    });
  }
}
