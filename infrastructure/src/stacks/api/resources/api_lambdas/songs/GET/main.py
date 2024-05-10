import boto3
import os
from json import JSONDecodeError, dumps, loads

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
            ':partition_key': 'song'
        }
    )

    songs = response.get("Items")
    if not songs:
        songs = []

    for song in songs:
        try:
            song["song_details"] = loads(song["song_details"])  # Deserialize JSON string
        except JSONDecodeError:
            song["song_details"] = {}


    return http_response({"songs": response["Items"]}, 200)

if __name__ == "__main__":
    os.environ["TABLE_NAME"] = "MainTable-development"
    print(handler({}, None))