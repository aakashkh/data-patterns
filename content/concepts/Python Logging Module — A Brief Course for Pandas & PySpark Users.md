# Python Logging Module — A Brief Course for Pandas & PySpark Users

***

## Why Logging Instead of `print()`

`print()` is fine for quick experiments but terrible for production code because it has no level, no timestamp, no module name, and no way to turn it off without deleting it. The `logging` module solves all of this — it is part of Python's standard library, meaning no install needed.[^1][^2][^3]

The key idea: every log message has a **severity level**. You set a threshold once, and only messages at or above that threshold appear. This means you can leave all your diagnostic messages in the code and simply raise/lower the threshold to control what you see.[^4][^1]

***

## Chapter 1 — The Five Log Levels

| Level | When to Use | Numeric Value |
|-------|-------------|---------------|
| `DEBUG` | Low-level detail: variable values, loop iterations | 10 |
| `INFO` | Confirm things are working as expected | 20 |
| `WARNING` | Something unexpected, but still running | 30 |
| `ERROR` | A function failed; something is broken | 40 |
| `CRITICAL` | App-wide failure, must stop or alert | 50 |

If you set level to `INFO`, you see `INFO`, `WARNING`, `ERROR`, `CRITICAL` — but NOT `DEBUG`. Think of it like a volume dial: turn it up (towards `DEBUG`) for more detail, turn it down (towards `ERROR`) for less noise.[^5][^1]

***

## Chapter 2 — The Four Building Blocks

The logging system has four components that form a pipeline:[^6][^4]

```
Your code
   ↓  logger.info("message")
Logger           ← you create one per module
   ↓
Handler          ← WHERE to send it (console, file, network)
   ↓
Formatter        ← WHAT it looks like (timestamp, level, message)
   ↓
Output (stdout / file / etc.)
```

- **Logger**: The object your code talks to directly. One per module.
- **Handler**: Sends records somewhere (console = `StreamHandler`, file = `FileHandler`).
- **Formatter**: Formats the message string.
- **Filter**: Optional fine-grained control over which messages pass.[^3][^6]

***

## Chapter 3 — Quickstart: Root Logger

The simplest possible logging — use Python's root logger directly via `basicConfig()`:[^7][^4]

```python
import logging

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(message)s"
)

logging.info("Script started.")
logging.warning("This is a warning.")
logging.error("Something went wrong.")
```

**Output:**

```
2026-04-15 10:00:01,123 | INFO    | Script started.
2026-04-15 10:00:01,124 | WARNING | This is a warning.
2026-04-15 10:00:01,125 | ERROR   | Something went wrong.
```

`basicConfig()` can only be called **once effectively** — subsequent calls are ignored if the root logger already has handlers.[^8][^4]

***

## Chapter 4 — Module Logger Pattern (Recommended)

Instead of using the root logger directly, create a logger named after your module using `__name__`. This is the correct pattern for any reusable module:[^2][^4]

```python
import logging

# This creates a logger named "my_module" when the file is my_module.py
logger = logging.getLogger(__name__)
```

**Why `__name__`?** When Python runs `my_module.py`, `__name__` is `"my_module"`. When it runs `utils/helpers.py`, `__name__` is `"utils.helpers"`. This means log messages automatically tell you which module produced them.[^9][^2]

This creates a **hierarchy**:

```
root
 └── my_module
       └── my_module.submodule
```

A child logger inherits the level and handlers of its parent unless configured otherwise.[^3][^9]

***

## Chapter 5 — Practical Pandas Example

Here is a real example: a pandas ETL function that reads, filters, and writes a CSV. Compare the `print()` version to the `logging` version.

### Without logging (before)

```python
import pandas as pd

def process_sales(input_path, output_path):
    print("Reading file...")
    df = pd.read_csv(input_path)
    print(f"Rows loaded: {len(df)}")
    
    df = df[df["Region"] == "India"]
    print(f"Rows after filter: {len(df)}")
    
    df.to_csv(output_path, index=False)
    print("File written.")
```

### With logging (after)

```python
import logging
import pandas as pd

logger = logging.getLogger(__name__)

def process_sales(input_path: str, output_path: str) -> None:
    logger.info("Reading file: %s", input_path)
    df = pd.read_csv(input_path)
    logger.info("Rows loaded: %d", len(df))
    
    df = df[df["Region"] == "India"]
    logger.info("Rows after filter: %d", len(df))
    
    if df.empty:
        logger.warning("No rows remain after filter — output file will be empty.")
    
    df.to_csv(output_path, index=False)
    logger.info("File written: %s", output_path)
```

### Enabling it in your script/notebook

```python
import logging

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(name)s | %(message)s"
)

from my_module import process_sales
process_sales("sales.csv", "output/india_sales.csv")
```

**Output:**

```
2026-04-15 10:00:01 | INFO | my_module | Reading file: sales.csv
2026-04-15 10:00:01 | INFO | my_module | Rows loaded: 5000
2026-04-15 10:00:01 | INFO | my_module | Rows after filter: 312
2026-04-15 10:00:01 | INFO | my_module | File written: output/india_sales.csv
```

Three things to notice:[^1][^2]

1. **You can see the module name** — `my_module` — without any extra work.
2. **`%d` and `%s` format patterns** — use these instead of f-strings inside logger calls; Python logging evaluates them lazily (only if the message will actually be printed), saving CPU on skipped `DEBUG` messages.
3. **`logger.warning()`** fires only when something is unexpected, keeping `INFO` stream clean.

***

## Chapter 6 — Logging to a File

To save logs to a file in addition to the console:[^8][^2]

```python
import logging
import sys

def setup_logging(level=logging.INFO, log_file="app.log"):
    root = logging.getLogger()
    if root.handlers:
        return  # already configured — don't add duplicate handlers

    formatter = logging.Formatter(
        "%(asctime)s | %(levelname)s | %(name)s | %(message)s"
    )

    # Console handler
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setLevel(level)
    console_handler.setFormatter(formatter)

    # File handler (always write DEBUG and above)
    file_handler = logging.FileHandler(log_file, mode="a", encoding="utf-8")
    file_handler.setLevel(logging.DEBUG)
    file_handler.setFormatter(formatter)

    root.setLevel(logging.DEBUG)
    root.addHandler(console_handler)
    root.addHandler(file_handler)
```

Now console shows `INFO+`, but `app.log` captures everything including `DEBUG`. This is handy for ETL jobs: clean output in the notebook, full trace in the file.[^2][^8]

***

## Chapter 7 — Logging Exceptions

Always use `logger.exception()` inside `except` blocks to capture the full traceback:[^2][^3]

```python
try:
    df = pd.read_csv("missing_file.csv")
except FileNotFoundError:
    logger.exception("Failed to read input file.")
    raise
```

`logger.exception()` is equivalent to `logger.error()` but **automatically appends the stack trace**. You get both the message and the traceback in one log entry.

***

## Chapter 8 — How Logging Was Added to `spark_utils.py`

Here is exactly what was added to the module, and why each piece is where it is.

### Step 1: Imports added at the top

```python
import logging
import sys
```

These go at the very top of `spark_utils.py` alongside other standard library imports. `sys` is needed to point the `StreamHandler` to `stdout` (Jupyter notebooks redirect `stdout`, so logs appear inline).[^10][^4]

### Step 2: Module-level logger (right after imports)

```python
logger = logging.getLogger(__name__)
```

This is a **module-level variable**, created once when the module is first imported. Because it uses `__name__`, every log message from this module will show `spark_utils` as the source. It's defined at module scope so every function inside can use it without receiving it as a parameter.[^9][^2]

### Step 3: `setup_logging()` function

```python
def setup_logging(level: int = logging.INFO) -> None:
    root_logger = logging.getLogger()
    if root_logger.handlers:
        return   # guard against duplicate handlers in Jupyter

    handler = logging.StreamHandler(sys.stdout)
    handler.setFormatter(
        logging.Formatter("%(asctime)s | %(levelname)s | %(name)s | %(message)s")
    )
    root_logger.setLevel(level)
    root_logger.addHandler(handler)
```

This is placed **before any other function** as it is setup infrastructure. The `if root_logger.handlers: return` guard is critical in Jupyter — if you re-run a cell, it prevents the same handler being added twice (which would print every message twice).[^4][^8]

The caller (notebook/script) decides when to enable logging by calling `setup_logging()`. The module itself does not call it at import time — that's intentional so importing `spark_utils` is always safe and side-effect-free.

### Step 4: `logger.info()` and `logger.debug()` inside functions

| Location | Level | Why |
|----------|-------|-----|
| `spark_initialize()` start | `INFO` | Important: tells you a session is being created |
| `spark_initialize()` reuse | `DEBUG` | Not important most of the time |
| `spark_initialize()` complete | `INFO` | Confirms session ready |
| `init_adls_for_spark()` | `INFO` | Key auth step; good to see timestamp |
| `init_adls_for_spark()` host | `INFO` | Confirms which storage account was configured |
| `read_sql_query()` | `INFO` | You want to see when DB reads start |
| `read_csv()` path | `INFO` | Shows exact ADLS path being read |
| `_kv()` key fetch | `DEBUG` | Too verbose for day-to-day; useful when debugging key mismatches |

### Step 5: Suppress Spark JVM noise

```python
_spark.sparkContext.setLogLevel("WARN")
```

This silences the Java-side Spark logs (things like Hadoop filesystem probes, task executor messages) and lets your Python `INFO` logs stand out clearly.[^11][^12]

### How to use in a notebook

```python
from spark_utils import setup_logging, spark_initialize, init_adls_for_spark, read_csv
import logging

setup_logging(logging.INFO)    # enable once at top of notebook

spark = spark_initialize()
init_adls_for_spark()

df = read_csv("3ds/budget/processed/capsule_revapp.csv", "finance")
```

**Sample output:**

```
2026-04-15 10:00:01 | INFO | spark_utils | Initializing SparkSession.
2026-04-15 10:00:08 | INFO | spark_utils | SparkSession initialized successfully.
2026-04-15 10:00:08 | INFO | spark_utils | Applying ADLS OAuth Spark configuration.
2026-04-15 10:00:09 | INFO | spark_utils | ADLS OAuth Spark configuration applied for host nagarrodatalake.dfs.core.windows.net.
2026-04-15 10:00:09 | INFO | spark_utils | Reading CSV from abfss://finance@nagarrodatalake.dfs.core.windows.net/3ds/budget/...
2026-04-15 10:00:11 | INFO | spark_utils | CSV read completed.
```

***

## Quick Reference

```python
# One-liner setup (for scripts or notebooks)
import logging
logging.basicConfig(level=logging.INFO,
                    format="%(asctime)s | %(levelname)s | %(name)s | %(message)s")

# In any module
import logging
logger = logging.getLogger(__name__)

# Log calls
logger.debug("Variable value: %s", var)        # dev detail
logger.info("Step completed: %s", step_name)   # normal progress
logger.warning("Unexpected state: %s", msg)    # non-fatal issue
logger.error("Operation failed: %s", msg)      # something is broken
logger.exception("Exception caught:")          # inside except blocks — adds traceback
```

---

## References

1. [Logging in Python](https://www.geeksforgeeks.org/python/logging-in-python/) - Steps on Logging · Import the logging module: Python has a built-in module called logging for this. ...

2. [Logging in Python](https://realpython.com/python-logging/) - With Python logging, you can create and configure loggers, set log levels, and format log messages w...

3. [Mastering the Art of Logging in Python: A Complete Guide](https://earthly.dev/blog/logging-in-python/) - In this section, you will learn the basics of logging using Python's logging module. These basics in...

4. [Logging HOWTO](https://docs.python.org/3/howto/logging.html) - You can access logging functionality by creating a logger via logger = logging.getLogger(__name__) ,...

5. [Python logging Module](https://www.w3schools.com/python/ref_module_logging.asp) - The logging module provides a flexible framework for emitting log messages from Python programs. Use...

6. [Python Logging Module: A Complete Guide](https://www.dash0.com/guides/logging-in-python) - This guide is a practical walkthrough for building a robust logging system in Python. You'll move be...

7. [Python Logging: Syntax, Usage, and Examples](https://mimo.org/glossary/python/logging) - Python logging is a built-in module that allows you to track events in your application. It helps yo...

8. [Python logging.basicConfig set different level for handlers](https://stackoverflow.com/questions/52644217/python-logging-basicconfig-set-different-level-for-handlers) - I would like to set a different level for my 2 handlers. But I realy want to keep it simple, I want ...

9. [python - Using logging in multiple modules](https://stackoverflow.com/questions/15727420/using-logging-in-multiple-modules) - Best practice is, in each module, to have a logger defined like this: Copy. import logging logger = ...

10. [logging — Logging facility for Python](https://docs.python.org/3/library/logging.html) - This module defines functions and classes which implement a flexible event logging system for applic...

11. [pyspark.SparkContext.setLogLevel - Apache Spark](https://spark.apache.org/docs/latest/api/python/reference/api/pyspark.SparkContext.setLogLevel.html) - Control our logLevel. This overrides any user-defined log settings. Valid log levels include: ALL, D...

12. [How to set logLevel in a pyspark job - Stack Overflow](https://stackoverflow.com/questions/49523377/how-to-set-loglevel-in-a-pyspark-job) - The SparkSession object has an attribute to get the SparkContext object, and calling setLogLevel on ...

