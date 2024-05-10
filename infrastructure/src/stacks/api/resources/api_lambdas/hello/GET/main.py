import os
from json import dumps

def http_response(response, status):
    return {
        "body": dumps(response),
        "statusCode": status,
    }

def handler(event: any, context: any):
    return http_response({"message": "hello world!"}, 200)