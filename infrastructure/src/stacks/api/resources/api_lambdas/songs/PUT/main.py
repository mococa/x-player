from json import dumps
from os import environ
from boto3 import client
from uuid import uuid4

s3 = client('s3')

def http_response(response, status):
    return {
        "body": dumps(response),
        "statusCode": status,
    }
    
def handler(event: any, context: any):
    S3_BUCKET_NAME = environ["BUCKET_NAME"]
    
    # Retrieve parameters from the event
    queryparams = event['queryStringParameters']
    if not queryparams:
        return http_response({"message": "missing query params"}, 400)

    file_name = queryparams['file_name']
    if not file_name:
        return http_response({"message": "missing 'file_name' query param"}, 400)
    
    file_type = queryparams['file_type']
    if not file_type:
        return http_response({"message": "missing 'file_type' query param"}, 400)

    key = f"songs/upload-{uuid4()}/{file_name}"

    # Generate a pre-signed URL for uploading to S3
    presigned_url = s3.generate_presigned_url(
        'put_object',
        Params={'Bucket': S3_BUCKET_NAME, 'Key': key, 'ContentType': file_type, 'ACL': 'public-read'},
        ExpiresIn=60  # URL expires in 1 min
    )

    # Return the pre-signed URL in the response
    return http_response({"presigned_url": presigned_url, "key": key}, 200)