---
id: DB_Actions
title: Database Actions
sidebar_label: Database Actions
description: "Execute SQL queries and interact with databases using SHAFT Engine's database automation support."
keywords: [SHAFT, database, SQL, database testing, JDBC, query execution, automation]
tags: [database, sql, actions]
---

## Connecting to a Database

SHAFT provides two constructors and matching factory methods for creating a database connection.

### Using the DatabaseType Enum (Recommended)

Use `DatabaseActions.DatabaseType` for built-in databases — SHAFT builds the JDBC URL automatically:

```java title="TypedConnection.java"
import com.shaft.driver.SHAFT;
import com.shaft.db.DatabaseActions;

// MySQL
SHAFT.DB db = new SHAFT.DB(
    DatabaseActions.DatabaseType.MY_SQL,
    "localhost", "3306", "mydb", "dbuser", "dbpass"
);

// PostgreSQL
SHAFT.DB db = new SHAFT.DB(
    DatabaseActions.DatabaseType.POSTGRES_SQL,
    "localhost", "5432", "testdb", "admin", "admin123"
);

// SQL Server
SHAFT.DB db = new SHAFT.DB(
    DatabaseActions.DatabaseType.SQL_SERVER,
    "localhost", "1433", "testdb", "sa", "MyP@ssw0rd"
);

// Oracle (SID)
SHAFT.DB db = new SHAFT.DB(
    DatabaseActions.DatabaseType.ORACLE,
    "localhost", "1521", "ORCL", "system", "oracle"
);

// Oracle (Service Name)
SHAFT.DB db = new SHAFT.DB(
    DatabaseActions.DatabaseType.ORACLE_SERVICE_NAME,
    "localhost", "1521", "myservice.example.com", "system", "oracle"
);

// IBM DB2
SHAFT.DB db = new SHAFT.DB(
    DatabaseActions.DatabaseType.IBM_DB2,
    "localhost", "50000", "TESTDB", "db2inst1", "password"
);
```

Supported `DatabaseType` values:

| Value | Database |
|-------|----------|
| `MY_SQL` | MySQL / MariaDB |
| `POSTGRES_SQL` | PostgreSQL |
| `SQL_SERVER` | Microsoft SQL Server |
| `ORACLE` | Oracle (SID) |
| `ORACLE_SERVICE_NAME` | Oracle (Service Name) |
| `IBM_DB2` | IBM DB2 |

### Using a Custom JDBC Connection String

For databases not in the enum, or for advanced connection parameters:

```java title="CustomJdbcConnection.java"
// Custom JDBC URL (e.g., MySQL with extra options)
SHAFT.DB db = new SHAFT.DB("jdbc:mysql://localhost:3306/mydb?useSSL=false&serverTimezone=UTC");

// PostgreSQL with schema
SHAFT.DB db = new SHAFT.DB("jdbc:postgresql://localhost:5432/testdb?currentSchema=myschema");
```

### Factory Methods

Both constructors have corresponding factory methods for cases where you want a fluent, static creation style:

```java title="FactoryMethods.java"
// Via factory — DatabaseType
SHAFT.DB db = SHAFT.DB.getInstance(
    DatabaseActions.DatabaseType.MY_SQL,
    "localhost", "3306", "mydb", "user", "pass"
);

// Via factory — custom JDBC URL
SHAFT.DB db = SHAFT.DB.getInstance("jdbc:postgresql://localhost:5432/testdb");
```

---

## Executing Queries

### SELECT — executeSelectQuery()

Returns a `ResultSet` for you to iterate:

```java title="SelectQuery.java"
import java.sql.ResultSet;

SHAFT.DB db = new SHAFT.DB(
    DatabaseActions.DatabaseType.POSTGRES_SQL,
    "localhost", "5432", "shopdb", "admin", "admin123"
);

ResultSet rs = db.executeSelectQuery("SELECT id, name, email FROM customers WHERE active = true");

while (rs.next()) {
    String name  = rs.getString("name");
    String email = rs.getString("email");
    SHAFT.Report.log("Customer: " + name + " <" + email + ">");
}
```

### Get a Single Cell Value — getResult()

Extracts the first column of the first row as a string — ideal for scalar queries:

```java title="GetSingleResult.java"
SHAFT.DB db = new SHAFT.DB(
    DatabaseActions.DatabaseType.MY_SQL,
    "localhost", "3306", "shopdb", "user", "pass"
);

String total = db.getResult("SELECT COUNT(*) FROM orders WHERE status = 'pending'");
SHAFT.Validations.assertThat()
     .number(Integer.parseInt(total))
     .isGreaterThan(0)
     .withCustomReportMessage("There should be at least one pending order")
     .perform();
```

You can also use the static overload with an existing `ResultSet`:

```java title="StaticGetResult.java"
ResultSet rs  = db.executeSelectQuery("SELECT MAX(price) FROM products");
String maxPrice = SHAFT.DB.getResult(rs);
```

### Get a Column by Name — getColumn()

Extracts all values from a named column across all rows:

```java title="GetColumn.java"
ResultSet rs = db.executeSelectQuery("SELECT email FROM users WHERE role = 'admin'");
String emails = SHAFT.DB.getColumn(rs, "email");
SHAFT.Validations.assertThat().object(emails).contains("admin@example.com").perform();
```

### INSERT / UPDATE / DELETE — executeUpdateQuery()

Returns the number of affected rows:

```java title="UpdateQuery.java"
SHAFT.DB db = new SHAFT.DB(
    DatabaseActions.DatabaseType.POSTGRES_SQL,
    "localhost", "5432", "shopdb", "admin", "admin123"
);

// Insert
int inserted = db.executeUpdateQuery(
    "INSERT INTO orders (customer_id, total, status) VALUES (42, 99.99, 'new')"
);
SHAFT.Validations.assertThat().number(inserted).isEqualTo(1).perform();

// Update
int updated = db.executeUpdateQuery(
    "UPDATE orders SET status = 'confirmed' WHERE customer_id = 42 AND status = 'new'"
);
SHAFT.Validations.assertThat().number(updated).isGreaterThanOrEquals(1).perform();

// Delete (cleanup)
db.executeUpdateQuery("DELETE FROM orders WHERE customer_id = 42");
```

---

## Advanced Usage

### Parameterized Queries (Prevent SQL Injection)

```java title="PreparedStatement.java"
SHAFT.DB db = new SHAFT.DB(
    DatabaseActions.DatabaseType.MY_SQL,
    "localhost", "3306", "shopdb", "user", "pass"
);

String email = "user@example.com";
PreparedStatement stmt = db.getConnection()
    .prepareStatement("SELECT id, name FROM users WHERE email = ? AND active = ?");
stmt.setString(1, email);
stmt.setBoolean(2, true);
ResultSet rs = stmt.executeQuery();
```

### Transaction Management

```java title="Transaction.java"
SHAFT.DB db = new SHAFT.DB(
    DatabaseActions.DatabaseType.POSTGRES_SQL,
    "localhost", "5432", "bankdb", "admin", "admin123"
);

try {
    db.getConnection().setAutoCommit(false);

    db.executeUpdateQuery("UPDATE accounts SET balance = balance - 500 WHERE id = 1");
    db.executeUpdateQuery("UPDATE accounts SET balance = balance + 500 WHERE id = 2");

    db.getConnection().commit();
    SHAFT.Report.report("Transfer committed successfully");
} catch (Exception e) {
    db.getConnection().rollback();
    SHAFT.Report.report("Transfer rolled back due to: " + e.getMessage());
    throw e;
} finally {
    db.getConnection().setAutoCommit(true);
}
```

### Stored Procedures

```java title="StoredProcedure.java"
SHAFT.DB db = new SHAFT.DB(
    DatabaseActions.DatabaseType.MY_SQL,
    "localhost", "3306", "shopdb", "user", "pass"
);

CallableStatement stmt = db.getConnection().prepareCall("{CALL get_orders_by_status(?)}");
stmt.setString(1, "pending");
ResultSet rs = stmt.executeQuery();

while (rs.next()) {
    SHAFT.Report.log("Order ID: " + rs.getInt("id"));
}
```

### Auto-Close with Try-With-Resources

`SHAFT.DB` implements `AutoCloseable` — use it in a try-with-resources block to ensure the connection is always closed:

```java title="TryWithResources.java"
try (SHAFT.DB db = new SHAFT.DB(
        DatabaseActions.DatabaseType.POSTGRES_SQL,
        "localhost", "5432", "testdb", "admin", "admin123")) {

    String userCount = db.getResult("SELECT COUNT(*) FROM users");
    SHAFT.Validations.assertThat().object(userCount).isNotNull().perform();
}
// Connection is automatically closed here
```

---

## Complete Test Example

```java title="src/test/java/tests/UserDatabaseTest.java"
import com.shaft.driver.SHAFT;
import com.shaft.db.DatabaseActions;
import org.testng.annotations.*;
import java.sql.ResultSet;

public class UserDatabaseTest {
    private SHAFT.DB db;

    @BeforeClass
    public void connect() {
        db = new SHAFT.DB(
            DatabaseActions.DatabaseType.POSTGRES_SQL,
            "localhost", "5432", "userdb", "admin", "admin123"
        );
    }

    @Test
    public void newUserIsInsertedCorrectly() throws Exception {
        // Insert
        int rows = db.executeUpdateQuery(
            "INSERT INTO users (name, email, role) VALUES ('Test User', 'test@shaft.io', 'viewer')"
        );
        SHAFT.Validations.assertThat().number(rows).isEqualTo(1).perform();

        // Verify
        String name = db.getResult("SELECT name FROM users WHERE email = 'test@shaft.io'");
        SHAFT.Validations.assertThat()
             .object(name)
             .isEqualTo("Test User")
             .withCustomReportMessage("Inserted user name should match")
             .perform();

        // Clean up
        db.executeUpdateQuery("DELETE FROM users WHERE email = 'test@shaft.io'");
    }

    @AfterClass
    public void disconnect() {
        db.closeConnection();
    }
}
```

---

## Connection Strings Reference

See [Connection Strings →](./Connection_Strings) for common JDBC URL formats for each supported database.
