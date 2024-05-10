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
    thread_id = body["thread_id"]
    user_id = body["user_id"]
    type = body["type"]
    
    now = datetime.now().isoformat()

    if type == "like":
        update_expression = 'ADD likes :user_id SET updated_at = :updated_at'
    elif type == "unlike":
        update_expression = 'DELETE likes :user_id SET updated_at = :updated_at'
    else:
        return http_response({"message": "Invalid action type. It should be 'like' or 'unlike'."}, 400)

    dynamo.update_item(
        TableName=TABLE_NAME,
        Key={
            'partition_key': {'S': 'thread'},
            'sort_key': {'S': thread_id}
        },
        UpdateExpression=update_expression,
        ExpressionAttributeValues={
            ':user_id': {'SS': [user_id]},
            ':updated_at': {'S': now}
        },
        ConditionExpression='attribute_exists(partition_key) AND attribute_exists(sort_key)'
    )

    return http_response({ "message": "item updated successfully." }, 200)

if __name__ == "__main__":
    environ["TABLE_NAME"] = "MainTable-development"
    print(handler({}, None))