---
id: parallelExecution
title: Parallel Execution Configuration
sidebar_label: Parallel Execution
---

SHAFT supports multiple types of parallel execution to help you run tests faster and more efficiently. This guide covers all the different parallel execution options available and how to configure them.

## Overview

SHAFT provides three main types of parallel execution:

1. **TestNG Parallel Execution** - Run multiple test methods, classes, or suites in parallel
2. **Cross-Browser Parallel Execution** - Run the same tests across multiple browsers simultaneously
3. **ThreadLocal Driver Pattern** - Safely manage WebDriver instances in multi-threaded environments

---

## 1. TestNG Parallel Execution

TestNG provides built-in support for running tests in parallel. SHAFT makes it easy to configure this through properties.

### Configuration

You can configure TestNG parallel execution in your `testng.properties` file or programmatically.

#### File-based Configuration

```properties title="src/main/resources/properties/testng.properties"
# Set the parallel mode: METHODS, CLASSES, TESTS, or INSTANCES
setParallel=METHODS

# Set the parallelization mode: STATIC or DYNAMIC
setParallelMode=DYNAMIC

# Number of threads to use
# In STATIC mode: Used as-is
# In DYNAMIC mode: Total threads = CPU cores × setThreadCount
setThreadCount=2

# Control test execution order
setPreserveOrder=false

# Group test instances together
setGroupByInstances=false

# Number of threads for data providers
setDataProviderThreadCount=1

# Test suite timeout in minutes
testSuiteTimeout=1440
```

### Parallel Modes Explained

| Mode | Description | Use Case |
|------|-------------|----------|
| `METHODS` | Runs test methods in parallel | Best for independent test methods |
| `CLASSES` | Runs test classes in parallel | Good when each class has setup/teardown |
| `TESTS` | Runs test tags/suites in parallel | Useful for running different test suites |
| `INSTANCES` | Runs test instances in parallel | For tests with multiple instances |
| `NONE` | No parallelization (default) | Sequential execution |

### Thread Count Calculation

- **STATIC Mode**: Uses the exact `setThreadCount` value
- **DYNAMIC Mode**: Calculates total threads as:
  ```
  Total Threads = Number of CPU Cores × setThreadCount
  ```

### Example Configuration Scenarios

#### Run test methods in parallel with 4 threads

```properties
setParallel=METHODS
setParallelMode=STATIC
setThreadCount=4
```

#### Run test classes in parallel (dynamic based on CPU cores)

```properties
setParallel=CLASSES
setParallelMode=DYNAMIC
setThreadCount=2
```

#### Run tests sequentially (no parallelization)

```properties
setParallel=NONE
setThreadCount=1
```

---

## 2. Cross-Browser Parallel Execution

SHAFT can automatically run your tests across Chrome, Firefox, and Safari either sequentially or in parallel.

### Prerequisites

- **Docker Desktop** must be installed and configured to use Linux images
- Docker must be running before test execution

### Configuration

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs groupId="configMethod">
  <TabItem value="file" label="File-based">

```properties title="src/main/resources/properties/custom.properties"
# Run tests on Chrome, Firefox, and Safari in parallel
SHAFT.CrossBrowserMode=parallelized

# Or run them sequentially
# SHAFT.CrossBrowserMode=sequential

# Or disable cross-browser mode (default)
# SHAFT.CrossBrowserMode=off
```

  </TabItem>
  <TabItem value="cli" label="CLI-based">

```bash
# Parallel execution across browsers
mvn test -DSHAFT.CrossBrowserMode=parallelized

# Sequential execution across browsers
mvn test -DSHAFT.CrossBrowserMode=sequential
```

  </TabItem>
  <TabItem value="code" label="Code-based">

```java
import com.shaft.driver.SHAFT;

@BeforeClass
public void beforeClass() {
    // Enable parallel cross-browser execution
    SHAFT.Properties.platform.set().crossBrowserMode("parallelized");
    
    // Or sequential
    // SHAFT.Properties.platform.set().crossBrowserMode("sequential");
}
```

  </TabItem>
</Tabs>

### Cross-Browser Modes

| Mode | Description |
|------|-------------|
| `off` | Normal execution with your configured browser (default) |
| `sequential` | Tests run on Chrome, Firefox, and Safari one after another |
| `parallelized` | Tests run on all three browsers at the same time |

:::note Docker Requirement
Cross-browser mode requires Docker Desktop to be installed and running. SHAFT will use Docker to spin up browser containers for parallel execution.
:::

### Example: Cross-Browser + TestNG Parallel

You can combine cross-browser execution with TestNG parallelization for maximum speed:

```properties title="src/main/resources/properties/custom.properties"
SHAFT.CrossBrowserMode=parallelized
```

```properties title="src/main/resources/properties/testng.properties"
setParallel=CLASSES
setThreadCount=3
```

This will run each test class on all three browsers in parallel.

---

## 3. ThreadLocal Driver Pattern

When running tests in parallel, each thread needs its own WebDriver instance to avoid conflicts. SHAFT recommends using ThreadLocal to manage driver instances safely.

### Why ThreadLocal?

- **Thread Safety**: Each thread gets its own WebDriver instance
- **No Conflicts**: Prevents race conditions when tests run in parallel
- **Clean Isolation**: Each test has complete isolation from others

### Implementation

Here's a complete example of using ThreadLocal with SHAFT:

```java title="ParallelThreadLocalTest.java"
import com.shaft.driver.SHAFT;
import org.testng.annotations.*;

public class ParallelThreadLocalTest {
    // ThreadLocal variable to store driver per thread
    private ThreadLocal<SHAFT.GUI.WebDriver> driver = new ThreadLocal<>();
    private SHAFT.TestData.JSON testData;

    @Test
    public void loginTest() {
        new LoginPage(driver.get())
                .login(testData.getTestData("email"), 
                       testData.getTestData("password"))
                .verifyUserIsLoggedIn(testData.getTestData("welcomeText"));
    }

    @Test
    public void searchTest() {
        new HomePage(driver.get())
                .search(testData.getTestData("searchQuery"))
                .verifySearchResults(testData.getTestData("expectedResults"));
    }

    @BeforeClass
    public void beforeClassSetup() {
        // Load test data once per class
        testData = new SHAFT.TestData.JSON("TestData.json");
    }

    @BeforeMethod
    public void beforeMethodSetUp() {
        // Create a new driver instance for each test method
        driver.set(new SHAFT.GUI.WebDriver());
        driver.get().browser().navigateToURL("https://example.com");
    }

    @AfterMethod
    public void afterMethodTearDown() {
        // Quit the driver after each test method
        driver.get().quit();
    }
}
```

### Key Points for ThreadLocal Pattern

1. **Declare ThreadLocal**: Create a `ThreadLocal<SHAFT.GUI.WebDriver>` field
2. **Set in @BeforeMethod**: Initialize driver with `driver.set(new SHAFT.GUI.WebDriver())`
3. **Access with .get()**: Use `driver.get()` to access the driver instance
4. **Clean up in @AfterMethod**: Always quit the driver with `driver.get().quit()`

### Configure TestNG for Parallel Execution

```properties title="src/main/resources/properties/testng.properties"
setParallel=METHODS
setThreadCount=3
```

### Example Repository

:::info Demo Project
For a complete working example, visit this repository:
**[SHAFT Engine - Parallel Execution with ThreadLocal Demo](https://github.com/MustafaAgamy/ShaftEngine-ParellelWithThreadLocal.git)**
:::

---

## Best Practices and Tips

### 1. Start Small
- Begin with `setThreadCount=2` and gradually increase
- Monitor system resources (CPU, memory) during execution
- Find the optimal thread count for your machine and tests

### 2. Ensure Test Independence
- Each test should be completely independent
- Don't rely on test execution order
- Clean up all test data in `@AfterMethod` or `@AfterClass`

### 3. Use ThreadLocal Consistently
- Always use `driver.get()` to access the driver
- Never share driver instances between threads
- Initialize driver in `@BeforeMethod`, quit in `@AfterMethod`

### 4. Handle Shared Resources Carefully
- Use synchronization for shared test data
- Consider using separate test data for each thread
- Be cautious with database connections and file I/O

### 5. Configure Appropriate Timeouts
```properties
defaultElementIdentificationTimeout=30
browserNavigationTimeout=60
pageLoadTimeout=60
```

### 6. Consider Headless Execution
Running in headless mode is faster and uses fewer resources:

```properties
headlessExecution=true
```

### 7. Enable Maximum Performance Mode
For even faster execution, consider enabling maximum performance mode:

```properties
maximumPerformanceMode=2
```

This provides up to 400% performance boost by disabling complementary features.

---

## Troubleshooting

### Tests Failing Only in Parallel Mode

**Problem**: Tests pass when running individually but fail in parallel.

**Solutions**:
- Check for shared state between tests
- Ensure each test cleans up after itself
- Verify ThreadLocal driver is used correctly
- Look for race conditions in your page objects

### Out of Memory Errors

**Problem**: `OutOfMemoryError` when running many tests in parallel.

**Solutions**:
- Reduce `setThreadCount`
- Increase JVM heap size: `mvn test -Xmx2g`
- Enable headless execution
- Ensure drivers are properly quit after each test

### Docker Not Found for Cross-Browser

**Problem**: Cross-browser mode fails with Docker errors.

**Solutions**:
- Install Docker Desktop
- Start Docker before running tests
- Verify Docker is configured for Linux containers
- Check Docker has sufficient resources allocated

### WebDriver Exceptions

**Problem**: `NoSuchSessionException` or `WebDriverException` in parallel tests.

**Solutions**:
- Verify ThreadLocal pattern is implemented correctly
- Check that `driver.set()` is called in `@BeforeMethod`
- Ensure `driver.get().quit()` is in `@AfterMethod`
- Don't reuse driver instances across methods

---

## Performance Comparison

Here's an example of performance gains with parallel execution:

| Configuration | Execution Time | Improvement |
|---------------|----------------|-------------|
| Sequential (1 thread) | 60 minutes | Baseline |
| Parallel (2 threads) | 35 minutes | 42% faster |
| Parallel (4 threads) | 20 minutes | 67% faster |
| Parallel (4 threads) + Headless | 15 minutes | 75% faster |
| Parallel (4 threads) + Max Performance | 12 minutes | 80% faster |

:::note
Actual results vary based on test suite, system resources, and test complexity.
:::

---

## Complete Configuration Example

Here's a complete configuration for maximum parallel execution performance:

```properties title="src/main/resources/properties/custom.properties"
# Target browser
targetBrowserName=chrome

# Enable headless execution for better performance
headlessExecution=true

# Enable maximum performance mode
maximumPerformanceMode=2

# Cross-browser parallel execution
SHAFT.CrossBrowserMode=parallelized

# Optimize timeouts
defaultElementIdentificationTimeout=30
browserNavigationTimeout=60
pageLoadTimeout=60
```

```properties title="src/main/resources/properties/testng.properties"
# Run test methods in parallel
setParallel=METHODS

# Dynamic thread calculation based on CPU cores
setParallelMode=DYNAMIC

# 2 threads per CPU core
setThreadCount=2

# Don't preserve test order for maximum speed
setPreserveOrder=false
```

```java title="Test Class with ThreadLocal"
public class MyParallelTest {
    private ThreadLocal<SHAFT.GUI.WebDriver> driver = new ThreadLocal<>();
    
    @Test
    public void testOne() {
        driver.get().browser().navigateToURL("https://example.com");
        // Your test code here
    }
    
    @BeforeMethod
    public void setup() {
        driver.set(new SHAFT.GUI.WebDriver());
    }
    
    @AfterMethod
    public void teardown() {
        driver.get().quit();
    }
}
```

---

## Related Documentation

For more information, check out these related topics:

- [Properties List](../Properties/PropertiesList.mdx) - Complete reference of all SHAFT properties
- [Property Types](../Properties/PropertyTypes.md) - Learn about different ways to configure properties
- [Common Examples](../Properties/CommonExamples.mdx) - See practical configuration examples
- [Web GUI Demo](../Demos/web.md) - Working examples of parallel execution

---

## Summary

SHAFT provides powerful parallel execution capabilities:

1. **TestNG Parallel Execution**: Configure through `testng.properties` with multiple modes (METHODS, CLASSES, TESTS, INSTANCES)
2. **Cross-Browser Execution**: Run tests across Chrome, Firefox, and Safari sequentially or in parallel
3. **ThreadLocal Pattern**: Safely manage WebDriver instances in multi-threaded environments

By combining these features and following best practices, you can significantly reduce test execution time while maintaining test reliability and stability.
