---
title: "Azure Data Factory: Orchestrating Data Pipelines"
date: 2025-11-27T11:00:00+05:30
description: "Introduction to Azure Data Factory (ADF) for building and orchestrating ETL/ELT data pipelines at scale."
categories: ["Azure", "Cloud", "Data Engineering"]
tags: ["azure", "adf", "etl", "pipelines", "orchestration"]
toc: true
draft: false
series: "azure"
weight: 2
---

# Azure Data Factory: Orchestrating Data Pipelines

Azure Data Factory (ADF) is a cloud-based data integration service that allows you to create data-driven workflows for orchestrating and automating data movement and data transformation.

## Key Components of ADF

1.  **Pipelines**: A logical grouping of activities that perform a unit of work.
2.  **Activities**: A processing step in a pipeline (e.g., Copy Data, Databricks Notebook).
3.  **Datasets**: Represents data structures within the data stores.
4.  **Linked Services**: Defines the connection information to external resources (like connection strings).
5.  **Integration Runtimes**: The compute infrastructure used by ADF.

## Creating a Simple Copy Pipeline

A common use case is copying data from an on-premises SQL Server to Azure Blob Storage.

### Step 1: Create Linked Services

You'll need a Linked Service for your source (SQL Server) and your sink (Blob Storage).

### Step 2: Create Datasets

Define datasets that reference the Linked Services. For example, a table in SQL Server and a folder in Blob Storage.

### Step 3: Create the Pipeline

Add a "Copy Data" activity to the pipeline. Configure the source and sink datasets.

```json
{
    "name": "CopyFromSQLToBlob",
    "properties": {
        "activities": [
            {
                "name": "CopyData",
                "type": "Copy",
                "inputs": [ { "referenceName": "SourceSQLDataset", "type": "DatasetReference" } ],
                "outputs": [ { "referenceName": "SinkBlobDataset", "type": "DatasetReference" } ]
            }
        ]
    }
}
```

## Triggers

Pipelines can be scheduled using triggers:
*   **Schedule Trigger**: Runs on a wall-clock schedule.
*   **Tumbling Window Trigger**: Operates on time slices.
*   **Event-based Trigger**: Responds to events like a file landing in Blob Storage.

ADF serves as the backbone for many modern data engineering platforms on Azure.
