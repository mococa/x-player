from boto3 import client, resource
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
            'partition_key': {'S': 'song'},
            'sort_key': {'S': f"song#{uuid4()}"},
            'song_details': {'S': body['song_details']},  # Decode song_details from bytes to string
            'url': {'S': body['url']},
            'created_at': {'S': now},
            'updated_at': {'S': now},
            'datatype': {'S': 'song'},
        }
    )

    return http_response({ "message": "item created successfully" }, 200)

