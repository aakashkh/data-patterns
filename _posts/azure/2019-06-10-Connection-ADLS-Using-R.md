---
layout : post
title : "Connect to azure datalake store using R"
categories : [azure, r]
tags: [azure, r, datalake, data lake store, connect, ADLS, read, write, REST API, CURL, GET, POST]  
---
---

The following code snippets are on creating a connection to Azure Data Lake Storage Gen1 using R with Service-to-Service authentication with client secret and client id.  
Follow the link, for more details on different ways to [connect to Azure Data Lake Storage Gen1](https://docs.microsoft.com/en-in/azure/data-lake-store/data-lake-store-service-to-service-authenticate-python)

<!--break-->
---

### Import Prerequisite

```javascript
library(httr)
library(curl)  
library(stringr)  
```

---

### Authenticate

```javascript
authentication_token <- function(tenant, client_id, client_secret){
  h <- new_handle()
  handle_setform(h,
                 "grant_type"="client_credentials",
                 "resource"="https://management.core.windows.net/",
                 "client_id" = client_id,
                 "client_secret" = client_secret
  )
  path = str_interp("https://login.windows.net/${tenant}/oauth2/token")
  req <- curl_fetch_memory(path, handle = h)
  res <- fromJSON(rawToChar(req$content))
  return(paste("Bearer",res$access_token))
}

token <- authentication_token(tenant = "TENANT",
                              client_id = "CLIENT ID",
                              client_secret = "CLIENT SECRET")
```

---

### Read

```javascript
load_data <- function(datalake, path, auth_token){
  file_path = str_interp("https://${datalake}.azuredatalakestore.net/webhdfs/v1/${path}?op=OPEN&read=true")
  r <- httr::GET(file_path, add_headers(Authorization = auth_token))
  return(read.csv(textConnection(content(r, 'text', encoding="UTF-8")), check.names=FALSE))
}

datalake_name <- "NAME OF THE DATALAKE"
file_path <- "FILE PATH IN THE DATALAKE FOLDER"
authentication_token <- "TOKEN CREATED"

load_data(datalake_name, file_path, authentication_token)
```

---

### Write

```javascript
upload_data <- function(dataset, datalake, path, auth_token){
  write.csv(dataset, textConnection("filecontent","w"), row.names=F)
  file_path <- str_interp("https://${datalake}.azuredatalakestore.net/webhdfs/v1/${path}?op=CREATE&overwrite=true&write=true")
  httr::PUT(file_path,
            body = filecontent,
            add_headers(Authorization = auth_token,
                        "Transfer-Encoding" = "chunked"))
  return("The file is uploaded")
}

dataset <- "DATASET TO UPLOAD"
datalake_name <- "NAME OF THE DATALAKE"
file_path <- "FILE PATH IN THE DATALAKE FOLDER"
authentication_token <- "TOKEN CREATED"

upload_data(dataset, datalake_name, file_path, authentication_token)
```

---
