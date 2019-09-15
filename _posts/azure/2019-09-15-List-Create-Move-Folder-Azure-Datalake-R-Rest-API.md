---
layout : post
title : "List, Create and Move Folder within Azure Datalake Store Gen1 using R and Rest API"
categories : [azure, r]
tags: [azure, r, REST API, Azure authentication, Authenticate, Data Lake, ADLS, List, Move, Create, Folder, Directorys]  
---

---
The following code snippets are on creating a connection to Azure Data Lake Storage Gen1 using R with Service-to-Service authentication with client secret and client id using REST API to list, create and move any folder in a azure data lake store gen1.  

* [LISTSTATUS](/azure/r/2019/09/15/List-Create-Movel-Folder-Azure-Datalake-R-Rest-API.html#list-folder)  - To list everything in a folder
* [MKDIRS](/azure/r/2019/09/15/List-Create-Movel-Folder-Azure-Datalake-R-Rest-API.html#create-folder) - To create new folder
* [RENAME](/azure/r/2019/09/15/List-Create-Movel-Folder-Azure-Datalake-R-Rest-API.html#move-folder) - To move a folder to new location

<!--break-->

---
```javascript
library(tidyverse)
library(httr)
library(curl)
library(jsonlite)

authentication_token <- function(tenant, client_id, client_secret){
  h <- new_handle()
  handle_setform(h,
                 "grant_type"="client_credentials",
                 "resource"="https://management.core.windows.net/",
                 "client_id" = client_id,
                 "client_secret" = client_secret
  )
  path = stringr::str_interp("https://login.windows.net/${tenant}/oauth2/token")
  req <- curl_fetch_memory(path, handle = h)
  res <- fromJSON(rawToChar(req$content))
  return(paste("Bearer",res$access_token))
}

// Generate token using above created function
token <- authentication_token(tenant = "TENANT",
                              client_id = "CLIENT ID",
                              client_secret = "CLIENT SECRET")
```


### List Folder
```javascript
folders <- httr::GET("https://${DATALAKE-STORE-NAME}.azuredatalakestore.net/webhdfs/v1/${FOLDER-PATH}?op=LISTSTATUS",
               add_headers(Authorization = token))

content(folders)
```
### Create Folder

```javascript
mkdir_operation <- stringr::str_interp("https://${DATALAKE-STORE-NAME}.azuredatalakestore.net/webhdfs/v1${FOLDER-PATH}?op=MKDIRS")

httr::PUT(mkdir_operation, add_headers(Authorization = token))
```

### Move Folder

```javascript
move_operation <- stringr::str_interp("https://${DATALAKE-STORE-NAME}.azuredatalakestore.net/webhdfs/v1${SOURCE-FOLDER-PATH}?op=RENAME&destination=${DESTINATION-FOLDER-PATH}")

httr::PUT(move_operation, add_headers(Authorization = token))

```
---


























