from json import dumps
from  boto3 import resource
import os

dynamodb = resource('dynamodb')

def http_response(response, status):
    return {
        "body": dumps(response),
        "statusCode": status,
    }

def handler(event: any, context: any):
    TABLE_NAME = os.environ["TABLE_NAME"]

    table = dynamodb.Table(TABLE_NAME)

    wallet_id = event['queryStringParameters']['wallet']
    if not wallet_id:
        return http_response({"message": "missing \"user-id\" query parameter"}, 400)
    
    wallet = f"user#{wallet_id}"

    response = table.query(
        KeyConditionExpression='partition_key = :partition_key AND sort_key = :sort_key',
        ExpressionAttributeValues={
            ':partition_key': 'user',
            ':sort_key': wallet,
        }
    )

    if not response.get("Items"):
        return http_response({ "message": "failed to find user" }, 404)
    
    user = response["Items"][0]
    if not user:
        return http_response({ "message": "failed to find user" }, 404)


    return http_response({"user": user}, 200)

if __name__ == "__main__":
    os.environ["TABLE_NAME"] = "MainTable-development"
    print(handler({}, None))