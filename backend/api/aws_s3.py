# Here you'll find some useful functions to work with Geocafe AWS bucket
from dotenv import load_dotenv
from botocore.config import Config
import os
import boto3
import requests
import tempfile
import io

load_dotenv()

s3 = boto3.client("s3", aws_access_key_id=os.getenv("AMAZONS3_API"), aws_secret_access_key=os.getenv("AMAZONS3_KEY"), config=Config(signature_version="s3v4", region_name=os.getenv("BUCKET_REGION")))

if not os.getenv("AMAZONS3_API") or not os.getenv("AMAZONS3_KEY"):
    raise RuntimeError("You need a connection with an AmazonSB3 IAM user API.")

def object_exist(key):
    try:
        s3.head_object(Bucket=os.getenv("BUCKET"), Key=key)
        return True
    except:
        return False


# Obtains the image URL of a user given the username. This is strictly configured to the structure: user_images/{images.png}.
def get_image(username):
    try:
        search = f"user_images/{username}.png"
        
        # Check the object existence before generating the signed URL
        if object_exist(search):
            url = s3.generate_presigned_url('get_object', Params={'Bucket': os.getenv("BUCKET"), 'Key': search}, ExpiresIn=3600)
            return (True, url)
        else:
            return get_default_image()

    except Exception as e:
        return (False, f"An error ocurred while trying to get a URL for the image: {e}")


# Obtains the default image URL for a user.
def get_default_image():
    try:
        search = f"user_images/default-profile-picture.png"
        
        # Check the object existence before generating the signed URL
        url = s3.generate_presigned_url('get_object', Params={'Bucket': os.getenv("BUCKET"), 'Key': search}, ExpiresIn=10000)
        return (True, url)
    except Exception as e:
        return (False, f"An error ocurred while trying to get a URL for the image: {e}")


# Deletes an image, this function is intended for account deletions.
def delete_image(username):
    try:
        object = f"user_images/{username}.png"
        s3.delete_object(Bucket=os.getenv("BUCKET"), Key=object)
        return (True, "The image was deleted successfully.")
    
    except Exception as e:
        return (False, f"An error ocurred while deleting the image: {e}")


# Returns the URL of an image to the client after uploading it.
def upload_image(username, imagen):
    try:
        object_key = f"user_images/{username}.png"
        s3.upload_fileobj(imagen, os.getenv("BUCKET"), object_key, ExtraArgs={"ContentType": "image/png"})

        return (True, f"The image was uploaded successfully to {object_key}")
    
    except Exception as e:
        return (False, f"An error ocurred while uploading the image: {e}")


# Obtains a list of files inside a user's folder.
def get_files(username):
    try:
        search = f"user_files/{username}/"
        
        result = s3.list_objects_v2(Bucket=os.getenv("BUCKET"), Prefix=search)
        
        files = [obj['Key'] for obj in result.get('Contents', [])]
        
        return(True, files)

    except Exception as e:
        return (False, f"An error ocurred while trying to get the files of {username}: {e}")


# returns the text content of a file
def get_file(username, filename):
    try:
        object = f"user_files/{username}/{filename}.C"
        if object_exist(object):
            url = s3.generate_presigned_url('get_object', Params={'Bucket': os.getenv("BUCKET"), 'Key': object}, ExpiresIn=30)
            return (True, requests.get(url).text)
        else:
            return (False, "The file does not exist.")
    
    except Exception as e:
        return (False, f"An error ocurred while getting the file: {e}")


# returns the text content of a file
def get_file_url(username, filename):
    try:
        object = f"user_files/{username}/{filename}.C"
        if object_exist(object):
            url = s3.generate_presigned_url('get_object', Params={'Bucket': os.getenv("BUCKET"), 'Key': object}, ExpiresIn=30)
            return (True, url)
        else:
            return (False, "The file does not exist.")
    
    except Exception as e:
        return (False, f"An error ocurred while getting the file: {e}")



# Deletes a file
def delete_file(username, filename):
    try:
        object = f"user_files/{username}/{filename}.C"
        s3.delete_object(Bucket=os.getenv("BUCKET"), Key=object)
        return (True, "The file was deleted successfully.")
    
    except Exception as e:
        return (False, f"An error ocurred while deleting the file: {e}")


# Deletes all files inside a user's folder.
def delete_files(username):
    try:
        object = f"user_files/{username}/"
        
        files = get_files(username)
        
        if files[0]:
            for file in files[1]:
                print(file)
                s3.delete_object(Bucket=os.getenv("BUCKET"), Key=file)
        
        return (True, "The files were deleted successfully.")
    
    except Exception as e:
        return (False, f"An error ocurred while deleting the files: {e}")


# Returns the URL of a file to the client after uploading it.
def upload_file(username, file_content, file_name):
    try:
        object_key = f"user_files/{username}/{file_name}.C"
        # Convert file_content to bytes if necessary
        if isinstance(file_content, str):
            file_content = file_content.encode()

        # Create a BytesIO object
        file_obj = io.BytesIO(file_content)
        
        s3.upload_fileobj(file_obj, os.getenv("BUCKET"), object_key)

        return (True, f"The file was uploaded successfully to {object_key}")
    
    except Exception as e:
        return (False, f"An error ocurred while uploading the file: {e}")