---
layout : post
title : Connect to azure storage (blob) using python
categories : [azure, python]
tags: [azure, python, blob, azure storage, connect, pandas, blob service, upload, download]
---
<hr>

The following code snippets are on creating a connection to Azure Blob Storage using Python with account access key.  
For more details on Azure Blob Storage and generating the access key, visit :  
[https://docs.microsoft.com/en-us/azure/storage/blobs/storage-quickstart-blobs-python](https://docs.microsoft.com/en-us/azure/storage/blobs/storage-quickstart-blobs-python)
<hr>

### Blob Service Object
```python
# Import the required modules
from azure.storage.blob import BlockBlobService

# Create the BlockBlobService object, which points to the Blob service in your storage account
block_blob_service = BlockBlobService(account_name = 'Storage-Account-Name',
				      account_key = 'Storage-Account-Key')
'''
Please visit here to check the list of operations can be performed on the blob service object :   
(https://azure-storage.readthedocs.io/)
'''
```
<!--break-->
<hr>

### List the blobs in a container
```python
# Connect to the container (similar to filder)
generator = block_blob_service.list_blobs('Container-Name')

# Print Blob Name
for blob in generator:
    print(blob.name)
```
<hr>
### Read and Write
```python
# get_blob_to_text
block_blob_service.get_blob_to_bytes('container-name','blob-name')

# create-blob-from-text
block_blob_service.create_blob_from_text('container-name',
					'local-file-name',
					'content-to-be-added-to-file')
```
<hr>
