---
layout : post
title : "Connect to azure datalake store using python"
date:   2018-12-20
categories : [azure, python]
tags: [azure, python, datalake, data lake store, connect, pandas]  
---
#### Connection to ADLS and file read/write operations using Python  
The following code snippets are on creating a connection to Azure Data Lake Storage Gen1 using Python with with Service-to-Service authentication with client secret and client id.

For more details on different ways to connect to Azure Data Lake Storage Gen1, visit -
[https://docs.microsoft.com/en-in/azure/data-lake-store/data-lake-store-service-to-service-authenticate-python](https://docs.microsoft.com/en-in/azure/data-lake-store/data-lake-store-service-to-service-authenticate-python)

### Authenticate
<hr>


```python
# Import the required modules
from azure.datalake.store import core, lib

# Define the parameters needed to authenticate using client secret
token = lib.auth(tenant_id = 'TENANT',
                 client_secret = 'SECRET',
                 client_id = 'ID')

# Create a filesystem client object for the Azure Data Lake Store name (ADLS)
adl = core.AzureDLFileSystem(token, store_name='ADLS Account Name')
```

Once the filesystem client is created, we can read the data from ADLS and store it as pandas data-frame.
Please visit here to check the list of operations ADLS filesystem client can perform -
[https://azure-datalake-store.readthedocs.io/en/latest/api.html#azure.datalake.store.core.AzureDLFileSystem](https://azure-datalake-store.readthedocs.io/en/latest/api.html#azure.datalake.store.core.AzureDLFileSystem)

### Read
<hr>

```python
# Import the required modules
import pandas as pd

# Read a file stored in csv format as input_file
with adl.open('Path-to-Data-Lake-Store-File-stored-in-csv-format', 'rb') as f:
    input_file = pd.read_csv(f)
```
Once the data is fetched, we can apply numerous level of data transformations techniques. After doing the same, we can save the transformed file "output_file" to the same/different location on the Azure Data Lake Store by using following steps -

### Write
<hr>

```python
# convert the output_file dataframe to csv format
output_str = output_file.to_csv(mode = 'w', index=False)

# save the converted object to a particular location with the file name with which to be saved
with adl.open('Path-to-Data-Lake-Store-File-as-to-save', 'wb') as o:
    o.write(str.encode(output_str))
    o.close()
```



<hr>
***NOTE:***
The both path, input path and output path to data lake store starts with the root folder and access to the same depends on the level of access provided to Azure AD Web App from which client secret is generated
