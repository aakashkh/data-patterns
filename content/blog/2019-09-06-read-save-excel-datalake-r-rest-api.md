---
title: "Read and Write Excel from Azure Datalake Store using R and Rest API"
date: 2019-09-06T00:00:00+00:00
lastmod: 2019-09-06T00:00:00+00:00
draft: false
images: []
categories: ["azure"]
tags: ['azure', 'r', 'REST API', 'CURL', 'GET', 'POST', 'Azure authentication', 'Authenticate', 'Data Lake', 'ADLS', 'Excel', 'Read', 'write', 'Store']
weight: 100
toc: true
---

---
The following code snippets are on creating a connection to Azure Data Lake Storage Gen1 using R with Service-to-Service authentication with client secret and client id using REST API and read and write an excel file.

----
### Import Prerequisite 
```javascript
library(httr)
library(curl)  
library(stringr)
library(readxl) 
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

--- 

### Read Binary
```javascript
datalake_store_name = 'Enter-DataLake-Store-Name'
initial_path <- stringr::str_interp("https://${datalake_store_name}.azuredatalakestore.net/webhdfs/v1/")
query_string <- "?op=OPEN&read=true"
path <- 'Enter-Excel-File-Datalake-Path'
file_path <- paste0(initial_path, path, query_string)
// Request the file using GET and authentication token
file_request <- httr::GET(file_path, add_headers(Authorization = token))
// Read the file content
excel_data <- content(file_request)
```
---

### Write Binary
```javascript
// Open a local file in write mode with .xlsx extension, choose .xls if the orignal file is of .xls extension
local_file_path <- 'Enter-Local-File-Path.xlsx'
write_excel_data <- file(local_file_path, 'wb')
// write the file content to local file
writeBin(excel_data, write_excel_data)
// close the local file
close(write_excel_data)
```
---

### Read Excel
```javascript
// read the locally create excel file using readxl library
// enter sheet name value to open the required sheet
excel_data <- readxl::read_xlsx(local_file_path, sheet='Sheet-Name')
```
---