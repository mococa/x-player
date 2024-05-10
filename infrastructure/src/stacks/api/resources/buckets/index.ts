import {
  ComponentResource,
  ComponentResourceOptions,
  interpolate,
} from "@pulumi/pulumi";
import { s3 } from "@pulumi/aws";

interface Props {
  environment: string;
}

export class BucketsResource extends ComponentResource {
  main_bucket: s3.BucketV2;

  public constructor(
    name: string,
    props: Props,
    opts?: ComponentResourceOptions
  ) {
    super(`${name}:index:${props.environment}`, name, {}, opts);

    const { environment } = props;
    const main_bucket_name = `x-player-main-bucket-${environment}`;

    const main_bucket = new s3.BucketV2(`${main_bucket_name}`, {
      bucket: `${main_bucket_name}`,
      corsRules: [
        {
          allowedMethods: ["GET", "PUT"],
          allowedOrigins: ["*"],
          allowedHeaders: ["*"],
          exposeHeaders: [],
        },
      ],
    });

    const access_block = new s3.BucketPublicAccessBlock(
      `${main_bucket_name}-main-bucket-public-access-block`,
      {
        bucket: main_bucket.id,
        blockPublicAcls: false,
        blockPublicPolicy: false,
        ignorePublicAcls: false,
        restrictPublicBuckets: false,
      },
      { dependsOn: [main_bucket] }
    );

    new s3.BucketPolicy(
      `${main_bucket_name}-main-bucket-policy`,
      {
        bucket: main_bucket.id,
        policy: {
          Version: "2012-10-17",
          Statement: [
            {
              Sid: "X-Player-Bucket-Policy",
              Effect: "Allow",
              Principal: "*",
              Action: ["s3:*"],
              Resource: [main_bucket.arn, interpolate`${main_bucket.arn}/*`],
            },
          ],
        },
      },
      { dependsOn: access_block }
    );

    const ownership = new s3.BucketOwnershipControls(
      `${main_bucket_name}-main-bucket-ownership`,
      {
        rule: { objectOwnership: "BucketOwnerPreferred" },
        bucket: main_bucket.id,
      },
      { dependsOn: access_block }
    );

    new s3.BucketAclV2(
      `${main_bucket_name}-main-bucket-acl`,
      {
        bucket: main_bucket.id,
        acl: s3.CannedAcl.Private,
      },
      { dependsOn: [main_bucket, ownership] }
    );

    this.main_bucket = main_bucket;
  }
}
