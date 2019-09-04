---
layout : post
title : "Access Azure Active Directory Groups using R"
categories : [azure, r]
tags: [azure, r, REST API, CURL, GET, POST, Azure Active Directory, Azure AD, AD authentication, Authenticate]  
---

----
### Import Prerequisite
```javascript
library(httr)
library(jsonlite)
library(curl)
```
--- 

### Authenticate
```javascript
h <- new_handle()
handle_setform(h,
               "grant_type"="client_credentials",
               "scope" = "https://graph.microsoft.com/.default",
               "client_id"= "ENTER CLIENT ID HERE",
               "client_secret"="ENTER CLIENT SECRET HERE",
               "tenant_id"= "ENTER TENANT ID HERE"
)
authentication_url <- "https://login.microsoftonline.com/{ENTER-TENANT-ID-HERE}/oauth2/v2.0/token"
authentication_response <- fromJSON(rawToChar(curl_fetch_memory(authentication_url, handle = h)$content))
authentication_token <- paste(authentication_response$token_type, authentication_response$access_token)
// token_type is "Bearer" in this case and hence authentication token starts with "Bearer "

// Function to return response using above authentication token and a request link
get_response <- function(request_link, auth_token){
  request <- GET(request_link, add_headers(Authorization = auth_token))
  response <- fromJSON(content((request),"text"))
  return(response)
}

```
<!--break-->
--- 

### Groups
```javascript
link <- "https://graph.microsoft.com/v1.0/groups"
groups <- get_response(link, authentication_token)

// dataframe which contains all group details is stored in value variable
groups$value

// The first hit will return only 100 results. To get more, use the 
// @odata.nextLink property value as the next link value, and loop through it
groups[["@odata.nextLink"]]
```
Each group created above will have an unique group id associated with it. This id value can be used to get each group members and owners details as well, as shown below :  

* ### Group Owners

```javascript
owners_requests_url = "https://graph.microsoft.com/v1.0/groups/{ENTER-GROUP-ID-HERE}/owners"
group_owners <- get_response(owners_requests_url, authentication_token)  
```

* ### Group Members

```javascript
members_requests_url = "https://graph.microsoft.com/v1.0/groups/{ENTER-GROUP-ID-HERE}/members"
group_members <- get_response(members_requests_url, authentication_token)
```

---
