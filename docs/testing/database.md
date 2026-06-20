---
id: database
title: Database testing
description: Connect, query, and validate databases through SHAFT.
slug: /testing/database
sidebar_position: 5
tags: [database, jdbc]
---

# Database testing

Use SHAFT database actions to open a JDBC connection, execute statements, and
attach query evidence to the test report.

```mermaid
flowchart LR
    Test --> Config["Connection string"]
    Config --> JDBC["SHAFT database action"]
    JDBC --> Query["Query / update"]
    Query --> Result["Result validation + report"]
```

See [database actions](/docs/reference/actions/DB/DB_Actions),
[connection strings](/docs/reference/actions/DB/Connection_Strings), and the
[Oracle setup](/docs/reference/actions/DB/Oracle_JDBC_Setup).

```java
SHAFT.DB database = new SHAFT.DB("jdbc:h2:mem:test");
ResultSet rows = database.executeSelectQuery("SELECT 1");

SHAFT.Validations.assertThat().object(rows).isNotNull();
```

## Related

- [DB Actions](/docs/reference/actions/DB/DB_Actions)
- [Connection Strings](/docs/reference/actions/DB/Connection_Strings)
- [Oracle Jdbc Setup](/docs/reference/actions/DB/Oracle_JDBC_Setup)
