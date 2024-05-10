from boto3 import client
from os import environ
from json import dumps, loads
from datetime import datetime
from uuid import uuid4

dynamo = client('dynamodb')

def http_response(response, status):
    return {
        "body": dumps(response),
        "statusCode": status,
    }

def handler(event: any, context: any):
    TABLE_NAME = environ["TABLE_NAME"]

    body = loads(event['body'])

    now = datetime.now().isoformat()

    dynamo.put_item(
        TableName=TABLE_NAME,
        Item={
            'partition_key': {'S': 'thread'},
            'sort_key': {'S': f"thread#{uuid4()}"},
            # 'likes': {'SS': []},
            'content': {'S': body["content"]},
            'author': {'S': body["username"]},

            'created_at': {'S': now},
            'updated_at': {'S': now},
            'datatype': {'S': 'thread'},
        }
    )

    return http_response({ "message": "item created successfully." }, 200)

if __name__ == "__main__":
    environ["TABLE_NAME"] = "MainTable-development"
    print(handler({}, None))