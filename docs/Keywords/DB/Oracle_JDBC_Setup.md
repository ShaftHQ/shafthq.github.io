---
id: Oracle_JDBC_Setup
title: Oracle JDBC Setup
sidebar_label: Oracle JDBC Setup
---

## Oracle JDBC Driver Setup

Oracle JDBC drivers are not available in Maven Central Repository due to Oracle's licensing terms. This guide walks you through the process of downloading and configuring the Oracle JDBC driver for use with SHAFT.

## Prerequisites

- Java Development Kit (JDK) installed
- Maven or Gradle build tool
- Oracle Database access (for testing)

## Step 1: Download Oracle JDBC Driver

### Option A: Download from Oracle Website

1. Navigate to the [Oracle JDBC Downloads page](https://www.oracle.com/database/technologies/appdev/jdbc-downloads.html)

2. Select the appropriate JDBC driver version based on your:
   - **Oracle Database version** (e.g., 19c, 21c, 23c)
   - **Java version** (e.g., Java 8, 11, 17, 21)

3. Common driver files:
   - `ojdbc8.jar` - For Java 8
   - `ojdbc10.jar` - For Java 10 and 11
   - `ojdbc11.jar` - For Java 11 and higher

4. Accept the Oracle Technology Network License Agreement

5. Download the JAR file to your local machine

### Option B: Download via SQL Developer or Oracle Instant Client

If you have Oracle SQL Developer or Oracle Instant Client installed, the JDBC driver is already included in their installation directories.

## Step 2: Add Driver to Your Project

### Maven Setup

#### Method 1: Install to Local Maven Repository (Recommended)

Install the downloaded JAR file to your local Maven repository:

```bash
mvn install:install-file \
  -Dfile=/path/to/ojdbc11.jar \
  -DgroupId=com.oracle.database.jdbc \
  -DartifactId=ojdbc11 \
  -Dversion=23.3.0.23.09 \
  -Dpackaging=jar
```

**Parameters Explanation:**
- `-Dfile`: Path to your downloaded Oracle JDBC JAR file
- `-DgroupId`: Oracle's group ID (use `com.oracle.database.jdbc`)
- `-DartifactId`: Artifact ID matching your JAR name (`ojdbc8`, `ojdbc10`, or `ojdbc11`)
- `-Dversion`: Version number (check the JAR file name or Oracle documentation)
- `-Dpackaging`: Always `jar`

Then add the dependency to your `pom.xml`:

```xml
<dependencies>
    <!-- Other dependencies -->
    
    <!-- Oracle JDBC Driver -->
    <dependency>
        <groupId>com.oracle.database.jdbc</groupId>
        <artifactId>ojdbc11</artifactId>
        <version>23.3.0.23.09</version>
    </dependency>
</dependencies>
```

#### Method 2: System Scope Dependency

Place the Oracle JDBC JAR file in your project directory (e.g., `lib/ojdbc11.jar`) and reference it using system scope:

```xml
<dependencies>
    <!-- Oracle JDBC Driver using system scope -->
    <dependency>
        <groupId>com.oracle.database.jdbc</groupId>
        <artifactId>ojdbc11</artifactId>
        <version>23.3.0.23.09</version>
        <scope>system</scope>
        <systemPath>${project.basedir}/lib/ojdbc11.jar</systemPath>
    </dependency>
</dependencies>
```

**Note:** This method is not recommended for production as it's not portable across different environments.

#### Method 3: Using Oracle Maven Repository

Oracle provides its own Maven repository. Add it to your `pom.xml`:

```xml
<repositories>
    <repository>
        <id>maven.oracle.com</id>
        <name>Oracle Maven Repository</name>
        <url>https://maven.oracle.com</url>
        <layout>default</layout>
        <releases>
            <enabled>true</enabled>
        </releases>
    </repository>
</repositories>

<dependencies>
    <dependency>
        <groupId>com.oracle.database.jdbc</groupId>
        <artifactId>ojdbc11</artifactId>
        <version>23.3.0.23.09</version>
    </dependency>
</dependencies>
```

**Note:** You may need to accept Oracle's terms and configure authentication for this repository.

### Gradle Setup

#### Method 1: Add to Local Repository

First, install to local Maven repository as shown above, then add to `build.gradle`:

```groovy
dependencies {
    implementation 'com.oracle.database.jdbc:ojdbc11:23.3.0.23.09'
}
```

#### Method 2: File Dependency

Place the JAR in your project's `libs` directory and add:

```groovy
dependencies {
    implementation files('libs/ojdbc11.jar')
}
```

#### Method 3: Using Oracle Maven Repository

```groovy
repositories {
    mavenCentral()
    maven {
        url "https://maven.oracle.com"
    }
}

dependencies {
    implementation 'com.oracle.database.jdbc:ojdbc11:23.3.0.23.09'
}
```

## Step 3: Verify Installation

Create a simple test to verify the driver is correctly installed:

```java
import com.shaft.driver.SHAFT;
import org.testng.annotations.Test;

public class OracleDBTest {
    
    @Test
    public void testOracleConnection() {
        // Replace with your Oracle database connection details
        String jdbcUrl = "jdbc:oracle:thin:@localhost:1521:ORCL";
        String username = "your_username";
        String password = "your_password";
        
        try {
            SHAFT.DB db = new SHAFT.DB(jdbcUrl, username, password);
            
            // Execute a simple query to verify connection
            String query = "SELECT 'Connection Successful' AS message FROM dual";
            String result = db.getResult(query);
            
            SHAFT.Validations.assertThat()
                .object(result)
                .isEqualTo("Connection Successful")
                .perform();
            
            db.closeConnection();
            
        } catch (Exception e) {
            SHAFT.Report.fail("Failed to connect to Oracle database", e);
        }
    }
}
```

Run the test to verify the Oracle JDBC driver is working correctly.

## Step 4: Common Connection Examples

### Basic Oracle Connection

```java
SHAFT.DB db = new SHAFT.DB(
    "jdbc:oracle:thin:@localhost:1521:ORCL",
    "username",
    "password"
);
```

### Oracle with Service Name

```java
SHAFT.DB db = new SHAFT.DB(
    "jdbc:oracle:thin:@//localhost:1521/ORCLPDB",
    "username",
    "password"
);
```

### Oracle with TNS Name

```java
SHAFT.DB db = new SHAFT.DB(
    "jdbc:oracle:thin:@(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST=oracle-host)(PORT=1521))(CONNECT_DATA=(SERVICE_NAME=ORCL)))",
    "username",
    "password"
);
```

### Oracle RAC (Real Application Clusters)

```java
SHAFT.DB db = new SHAFT.DB(
    "jdbc:oracle:thin:@(DESCRIPTION=(ADDRESS_LIST=(ADDRESS=(PROTOCOL=TCP)(HOST=rac-node1)(PORT=1521))(ADDRESS=(PROTOCOL=TCP)(HOST=rac-node2)(PORT=1521)))(CONNECT_DATA=(SERVICE_NAME=ORCL)))",
    "username",
    "password"
);
```

## Version Compatibility

### Oracle JDBC Driver Versions

| JDBC Driver | Java Version | Oracle DB Support |
|-------------|--------------|-------------------|
| ojdbc8.jar | Java 8, 11 | 12.2.0.1+ |
| ojdbc10.jar | Java 10, 11 | 19c, 21c |
| ojdbc11.jar | Java 11+ | 19c, 21c, 23c |

### Choosing the Right Version

- Use the latest driver version compatible with your Java version
- The driver is backward compatible with older Oracle Database versions
- Check [Oracle JDBC Compatibility](https://www.oracle.com/database/technologies/jdbc-drivers-12c-downloads.html) for specific version support

## Troubleshooting

### ClassNotFoundException: oracle.jdbc.driver.OracleDriver

**Problem:** Oracle JDBC driver is not in the classpath.

**Solution:**
- Verify the JAR file is correctly added to your project dependencies
- Clean and rebuild your project (`mvn clean install` or `gradle clean build`)
- Check that the JAR file path is correct

### SQLException: Listener refused the connection

**Problem:** Oracle listener is not running or connection details are incorrect.

**Solution:**
- Verify Oracle Database is running
- Check hostname, port, and SID/service name
- Test connection using SQL*Plus or SQL Developer first
- Ensure firewall allows connections on Oracle port (default 1521)

### SQLException: ORA-12505, TNS:listener does not currently know of SID

**Problem:** SID or service name is incorrect.

**Solution:**
- Verify the SID or service name with your DBA
- Try using service name format instead of SID format or vice versa
- Check `tnsnames.ora` file for correct service names

### Network Adapter Error

**Problem:** Network connectivity issues.

**Solution:**
- Verify network connectivity to Oracle server
- Check if Oracle listener is running: `lsnrctl status`
- Ensure correct hostname/IP address
- Test with `tnsping` command

## Additional Dependencies

For advanced Oracle features, you may need additional JAR files:

### Oracle Internationalization (orai18n.jar)
Required for character set support beyond US7ASCII and WE8ISO8859P1:

```xml
<dependency>
    <groupId>com.oracle.database.nls</groupId>
    <artifactId>orai18n</artifactId>
    <version>23.3.0.23.09</version>
</dependency>
```

### Oracle UCP (Universal Connection Pool)
For connection pooling:

```xml
<dependency>
    <groupId>com.oracle.database.jdbc</groupId>
    <artifactId>ucp</artifactId>
    <version>23.3.0.23.09</version>
</dependency>
```

## Best Practices

### Security
- Store Oracle credentials securely (environment variables, vault, etc.)
- Never commit credentials to version control
- Use Oracle Wallet for credential management in production

### Performance
- Use connection pooling for multiple database operations
- Close connections properly to avoid resource leaks
- Use batch operations for bulk data operations

### Testing
- Use a dedicated test database/schema
- Never run tests against production databases
- Reset test data between test runs
- Use transactions and rollbacks for data integrity

## Resources

- [Oracle JDBC Downloads](https://www.oracle.com/database/technologies/appdev/jdbc-downloads.html)
- [Oracle JDBC Developer's Guide](https://docs.oracle.com/en/database/oracle/oracle-database/21/jjdbc/)
- [Oracle JDBC FAQ](https://www.oracle.com/database/technologies/faq-jdbc.html)
- [SHAFT Database Connection Strings](Connection_Strings.md)
- [SHAFT Database Actions](DB_Actions.md)
