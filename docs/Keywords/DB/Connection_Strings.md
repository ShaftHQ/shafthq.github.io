---
id: Connection_Strings
title: Database Connection Strings
sidebar_label: Connection Strings
---

## JDBC Connection Strings

SHAFT uses JDBC (Java Database Connectivity) to connect to various databases. Each database type requires a specific connection string format.

## Standard Connection String Patterns

### MySQL
MySQL is a popular open-source relational database.

#### Basic Connection
```java
SHAFT.DB db = new SHAFT.DB(
    "jdbc:mysql://localhost:3306/database_name",
    "username",
    "password"
);
```

#### With SSL
```java
SHAFT.DB db = new SHAFT.DB(
    "jdbc:mysql://localhost:3306/database_name?useSSL=true&requireSSL=true",
    "username",
    "password"
);
```

#### With Additional Parameters
```java
SHAFT.DB db = new SHAFT.DB(
    "jdbc:mysql://localhost:3306/database_name?useUnicode=true&characterEncoding=UTF-8&serverTimezone=UTC",
    "username",
    "password"
);
```

**Connection String Pattern:**
```
jdbc:mysql://[host]:[port]/[database]?[parameters]
```

**Default Port:** 3306

---

### PostgreSQL
PostgreSQL is a powerful open-source object-relational database.

#### Basic Connection
```java
SHAFT.DB db = new SHAFT.DB(
    "jdbc:postgresql://localhost:5432/database_name",
    "username",
    "password"
);
```

#### With SSL
```java
SHAFT.DB db = new SHAFT.DB(
    "jdbc:postgresql://localhost:5432/database_name?ssl=true&sslmode=require",
    "username",
    "password"
);
```

#### With Schema
```java
SHAFT.DB db = new SHAFT.DB(
    "jdbc:postgresql://localhost:5432/database_name?currentSchema=myschema",
    "username",
    "password"
);
```

**Connection String Pattern:**
```
jdbc:postgresql://[host]:[port]/[database]?[parameters]
```

**Default Port:** 5432

---

### Oracle
Oracle Database is a multi-model database management system.

#### Basic Connection (SID)
```java
SHAFT.DB db = new SHAFT.DB(
    "jdbc:oracle:thin:@localhost:1521:ORCL",
    "username",
    "password"
);
```

#### Service Name
```java
SHAFT.DB db = new SHAFT.DB(
    "jdbc:oracle:thin:@//localhost:1521/service_name",
    "username",
    "password"
);
```

#### TNS Names
```java
SHAFT.DB db = new SHAFT.DB(
    "jdbc:oracle:thin:@(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST=localhost)(PORT=1521))(CONNECT_DATA=(SERVICE_NAME=ORCL)))",
    "username",
    "password"
);
```

**Connection String Patterns:**
- **SID:** `jdbc:oracle:thin:@[host]:[port]:[SID]`
- **Service Name:** `jdbc:oracle:thin:@//[host]:[port]/[service_name]`

**Default Port:** 1521

**Note:** Oracle JDBC driver requires additional setup. See [Oracle JDBC Setup](Oracle_JDBC_Setup.md) for detailed instructions.

---

### Microsoft SQL Server
Microsoft SQL Server is a relational database management system.

#### Basic Connection
```java
SHAFT.DB db = new SHAFT.DB(
    "jdbc:sqlserver://localhost:1433;databaseName=database_name",
    "username",
    "password"
);
```

#### Windows Authentication
```java
SHAFT.DB db = new SHAFT.DB(
    "jdbc:sqlserver://localhost:1433;databaseName=database_name;integratedSecurity=true",
    "",
    ""
);
```

#### With Encryption
```java
SHAFT.DB db = new SHAFT.DB(
    "jdbc:sqlserver://localhost:1433;databaseName=database_name;encrypt=true;trustServerCertificate=false",
    "username",
    "password"
);
```

**Connection String Pattern:**
```
jdbc:sqlserver://[host]:[port];databaseName=[database];[parameters]
```

**Default Port:** 1433

---

### MariaDB
MariaDB is a community-developed fork of MySQL.

#### Basic Connection
```java
SHAFT.DB db = new SHAFT.DB(
    "jdbc:mariadb://localhost:3306/database_name",
    "username",
    "password"
);
```

**Connection String Pattern:**
```
jdbc:mariadb://[host]:[port]/[database]?[parameters]
```

**Default Port:** 3306

---

### SQLite
SQLite is a lightweight, file-based database.

#### Basic Connection
```java
SHAFT.DB db = new SHAFT.DB(
    "jdbc:sqlite:/path/to/database.db",
    "",
    ""
);
```

#### In-Memory Database
```java
SHAFT.DB db = new SHAFT.DB(
    "jdbc:sqlite::memory:",
    "",
    ""
);
```

**Connection String Pattern:**
```
jdbc:sqlite:[path_to_database_file]
```

**Note:** SQLite doesn't require username and password.

---

### IBM DB2
IBM DB2 is a family of data management products.

#### Basic Connection
```java
SHAFT.DB db = new SHAFT.DB(
    "jdbc:db2://localhost:50000/database_name",
    "username",
    "password"
);
```

**Connection String Pattern:**
```
jdbc:db2://[host]:[port]/[database]
```

**Default Port:** 50000

---

## Custom Connection String Patterns

### Using Properties File
You can externalize connection strings using SHAFT properties:

```properties
# shaft.properties
db.url=jdbc:mysql://localhost:3306/mydb
db.username=testuser
db.password=testpass
```

```java
String dbUrl = System.getProperty("db.url");
String dbUser = System.getProperty("db.username");
String dbPass = System.getProperty("db.password");

SHAFT.DB db = new SHAFT.DB(dbUrl, dbUser, dbPass);
```

### Environment Variables
Using environment variables for sensitive data:

```java
String dbUrl = System.getenv("DB_URL");
String dbUser = System.getenv("DB_USERNAME");
String dbPass = System.getenv("DB_PASSWORD");

SHAFT.DB db = new SHAFT.DB(dbUrl, dbUser, dbPass);
```

### Connection String Builder
Create a helper method for building connection strings:

```java
public class DBHelper {
    public static String buildConnectionString(
        String dbType,
        String host,
        int port,
        String database
    ) {
        switch (dbType.toLowerCase()) {
            case "mysql":
                return String.format("jdbc:mysql://%s:%d/%s", host, port, database);
            case "postgresql":
                return String.format("jdbc:postgresql://%s:%d/%s", host, port, database);
            case "oracle":
                return String.format("jdbc:oracle:thin:@//%s:%d/%s", host, port, database);
            case "sqlserver":
                return String.format("jdbc:sqlserver://%s:%d;databaseName=%s", host, port, database);
            default:
                throw new IllegalArgumentException("Unsupported database type: " + dbType);
        }
    }
}

// Usage
String connectionString = DBHelper.buildConnectionString("mysql", "localhost", 3306, "mydb");
SHAFT.DB db = new SHAFT.DB(connectionString, "user", "pass");
```

### Multiple Database Connections
Managing multiple database connections in your tests:

```java
// Source database
SHAFT.DB sourceDb = new SHAFT.DB(
    "jdbc:mysql://source-host:3306/source_db",
    "source_user",
    "source_pass"
);

// Target database
SHAFT.DB targetDb = new SHAFT.DB(
    "jdbc:postgresql://target-host:5432/target_db",
    "target_user",
    "target_pass"
);

// Perform operations
ResultSet sourceData = sourceDb.executeSelectQuery("SELECT * FROM products");
// ... process and insert into target ...

sourceDb.closeConnection();
targetDb.closeConnection();
```

## Connection Parameters Reference

### Common JDBC Parameters

| Parameter | Description | Example |
|-----------|-------------|---------|
| `useSSL` | Enable SSL connection | `?useSSL=true` |
| `serverTimezone` | Set server timezone | `?serverTimezone=UTC` |
| `characterEncoding` | Character encoding | `?characterEncoding=UTF-8` |
| `autoReconnect` | Auto reconnect on connection loss | `?autoReconnect=true` |
| `maxReconnects` | Maximum reconnection attempts | `?maxReconnects=3` |
| `connectTimeout` | Connection timeout in milliseconds | `?connectTimeout=30000` |

### Combining Multiple Parameters
Multiple parameters are separated by `&`:

```java
SHAFT.DB db = new SHAFT.DB(
    "jdbc:mysql://localhost:3306/mydb?useSSL=true&serverTimezone=UTC&characterEncoding=UTF-8",
    "username",
    "password"
);
```

## Best Practices

### Security
- **Never hardcode credentials** in your test code
- Use environment variables or secure vaults for sensitive data
- Use SSL/TLS connections when available
- Implement least privilege access for test database users

### Connection Management
- Always close connections after use
- Use try-with-resources for automatic connection management
- Consider connection pooling for performance-intensive tests
- Set appropriate timeout values

### Configuration
- Externalize connection strings using properties files
- Use different configurations for different environments (dev, test, prod)
- Document required JDBC drivers and their versions
- Keep JDBC drivers up to date for security and bug fixes
