---
id: DB_Actions
title: Database Actions
sidebar_label: Actions
---

## SHAFT Database

SHAFT provides a powerful and simplified interface for database automation, supporting various database operations including queries, updates, and stored procedures.

### Object Initialization

To interact with databases, you need to create an instance of SHAFT.DB class and provide the database connection details.

#### Basic Initialization
```java
import com.shaft.driver.SHAFT;

SHAFT.DB db = new SHAFT.DB("jdbc:mysql://localhost:3306/mydb", "username", "password");
```

#### Initialization with Connection String
```java
SHAFT.DB db = new SHAFT.DB("jdbc:postgresql://localhost:5432/testdb", "admin", "admin123");
```

After creating the database object, you can perform various database operations using the available methods.

## Common Database Actions

### Execute Query
Execute a SELECT query and get the result set.

```java
SHAFT.DB db = new SHAFT.DB("jdbc:mysql://localhost:3306/mydb", "user", "pass");
String query = "SELECT * FROM users WHERE age > 18";
ResultSet resultSet = db.executeSelectQuery(query);

while (resultSet.next()) {
    String name = resultSet.getString("name");
    int age = resultSet.getInt("age");
    System.out.println("Name: " + name + ", Age: " + age);
}
```

#### With Validations
```java
SHAFT.DB db = new SHAFT.DB("jdbc:mysql://localhost:3306/mydb", "user", "pass");
ResultSet resultSet = db.executeSelectQuery("SELECT * FROM products WHERE price > 100");

// Validate result count
int count = 0;
while (resultSet.next()) {
    count++;
}
SHAFT.Validations.assertThat().number(count).isGreaterThan(0).perform();
```

### Execute Update
Execute INSERT, UPDATE, or DELETE statements.

#### Insert Data
```java
SHAFT.DB db = new SHAFT.DB("jdbc:mysql://localhost:3306/mydb", "user", "pass");
String insertQuery = "INSERT INTO users (name, email, age) VALUES ('John Doe', 'john@example.com', 30)";
int rowsAffected = db.executeUpdateQuery(insertQuery);

SHAFT.Validations.assertThat().number(rowsAffected).isEqualTo(1).perform();
```

#### Update Data
```java
SHAFT.DB db = new SHAFT.DB("jdbc:mysql://localhost:3306/mydb", "user", "pass");
String updateQuery = "UPDATE users SET age = 31 WHERE email = 'john@example.com'";
int rowsAffected = db.executeUpdateQuery(updateQuery);

SHAFT.Validations.assertThat().number(rowsAffected).isGreaterThanOrEquals(1).perform();
```

#### Delete Data
```java
SHAFT.DB db = new SHAFT.DB("jdbc:mysql://localhost:3306/mydb", "user", "pass");
String deleteQuery = "DELETE FROM users WHERE email = 'john@example.com'";
int rowsAffected = db.executeUpdateQuery(deleteQuery);
```

### Get Cell Value
Retrieve a specific cell value from a query result.

```java
SHAFT.DB db = new SHAFT.DB("jdbc:mysql://localhost:3306/mydb", "user", "pass");
String query = "SELECT name FROM users WHERE id = 1";
String userName = db.getResult(query);

SHAFT.Validations.assertThat().object(userName).isNotNull().perform();
```

### Get Multiple Values
Retrieve multiple values from a query result as a list.

```java
SHAFT.DB db = new SHAFT.DB("jdbc:mysql://localhost:3306/mydb", "user", "pass");
String query = "SELECT email FROM users WHERE age > 25";
List<String> emails = db.getResultAsList(query);

SHAFT.Validations.assertThat().number(emails.size()).isGreaterThan(0).perform();
for (String email : emails) {
    SHAFT.Validations.verifyThat().object(email).contains("@").perform();
}
```

### Execute Stored Procedure
Execute database stored procedures.

```java
SHAFT.DB db = new SHAFT.DB("jdbc:mysql://localhost:3306/mydb", "user", "pass");
String procedureCall = "{CALL getUsersByAge(?)}";
CallableStatement stmt = db.getConnection().prepareCall(procedureCall);
stmt.setInt(1, 25);
ResultSet resultSet = stmt.executeQuery();

while (resultSet.next()) {
    String name = resultSet.getString("name");
    System.out.println("User: " + name);
}
```

### Transaction Management
Execute multiple statements within a transaction.

```java
SHAFT.DB db = new SHAFT.DB("jdbc:mysql://localhost:3306/mydb", "user", "pass");

try {
    db.getConnection().setAutoCommit(false);
    
    db.executeUpdateQuery("INSERT INTO accounts (name, balance) VALUES ('Account A', 1000)");
    db.executeUpdateQuery("INSERT INTO accounts (name, balance) VALUES ('Account B', 500)");
    db.executeUpdateQuery("UPDATE accounts SET balance = balance - 100 WHERE name = 'Account A'");
    db.executeUpdateQuery("UPDATE accounts SET balance = balance + 100 WHERE name = 'Account B'");
    
    db.getConnection().commit();
} catch (Exception e) {
    db.getConnection().rollback();
    throw e;
} finally {
    db.getConnection().setAutoCommit(true);
}
```

### Close Connection
Always close the database connection when done.

```java
SHAFT.DB db = new SHAFT.DB("jdbc:mysql://localhost:3306/mydb", "user", "pass");
// ... perform database operations ...
db.closeConnection();
```

#### Using Try-With-Resources
```java
try (SHAFT.DB db = new SHAFT.DB("jdbc:mysql://localhost:3306/mydb", "user", "pass")) {
    ResultSet resultSet = db.executeSelectQuery("SELECT * FROM users");
    // ... process results ...
} // Connection is automatically closed
```

## Best Practices

### Parameterized Queries
Use parameterized queries to prevent SQL injection attacks.

```java
SHAFT.DB db = new SHAFT.DB("jdbc:mysql://localhost:3306/mydb", "user", "pass");
String query = "SELECT * FROM users WHERE email = ? AND age > ?";
PreparedStatement stmt = db.getConnection().prepareStatement(query);
stmt.setString(1, "user@example.com");
stmt.setInt(2, 18);
ResultSet resultSet = stmt.executeQuery();
```

### Connection Pooling
For better performance with multiple database operations, consider using connection pooling in your test suite setup.

### Error Handling
Always handle database exceptions appropriately.

```java
try {
    SHAFT.DB db = new SHAFT.DB("jdbc:mysql://localhost:3306/mydb", "user", "pass");
    ResultSet resultSet = db.executeSelectQuery("SELECT * FROM users");
    // ... process results ...
} catch (SQLException e) {
    SHAFT.Report.fail("Database operation failed", e);
}
```
