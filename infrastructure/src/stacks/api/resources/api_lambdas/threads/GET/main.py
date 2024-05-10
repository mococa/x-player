import boto3
import os
from json import dumps

dynamodb = boto3.resource('dynamodb')

def http_response(response, status):
    return {
        "body": dumps(response),
        "statusCode": status,
    }

def handler(event: any, context: any):
    TABLE_NAME = os.environ["TABLE_NAME"]

    table = dynamodb.Table(TABLE_NAME)
    
    response = table.query(
        KeyConditionExpression='partition_key = :partition_key',
        ExpressionAttributeValues={
            ':partition_key': 'thread'
        },
        ScanIndexForward=False
    )

    threads = response.get("Items")
    if not threads:
        threads = []
    
    for thread in threads:
        if not thread.get("likes"):
            thread["likes"] = []
        else:
            thread["likes"] = list(thread["likes"])

    return http_response({ "threads": sorted(threads, key=lambda d: d['created_at'], reverse=True) }, 200)

if __name__ == "__main__":
    os.environ["TABLE_NAME"] = "MainTable-development"
    print(handler({}, None))
