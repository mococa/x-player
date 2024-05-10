from boto3 import client
from os import environ
from json import dumps, loads
from datetime import datetime

dynamo = client('dynamodb')

def http_response(response, status):
    return {
        "body": dumps(response),
        "statusCode": status,
    }

def handler(event: any, context: any):
    TABLE_NAME = environ["TABLE_NAME"]

    body = loads(event['body'])
    username = body["username"]
    wallet_id = body["wallet"]
    wallet = f"user#{wallet_id}"

    now = datetime.now().isoformat()

    dynamo.put_item(
        TableName=TABLE_NAME,
        Item={
            'partition_key': {'S': "user"},
            'sort_key': {'S': wallet},
            'username': {'S': username},

            'created_at': {'S': now},
            'updated_at': {'S': now},
            'datatype': {'S': 'user'},
        }
    )

    return http_response({"message": "item created successfully."}, 200)

if __name__ == "__main__":
    environ["TABLE_NAME"] = "MainTable-development"
    print(handler({"body": "{\"username\":\"mococa\"}"}, None))