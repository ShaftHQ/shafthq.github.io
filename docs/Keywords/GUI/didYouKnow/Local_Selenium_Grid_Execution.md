---
id: Local_Selenium_Grid_Execution
title: Local Selenium Grid Execution
sidebar_label: Local Selenium Grid
---

This guide explains how to set up and run a local Selenium Grid for distributed test execution with SHAFT. Running a local Grid is useful for:

- Testing in a distributed environment without cloud services
- Running tests on different OS/browser combinations locally
- Debugging remote execution issues before deploying to cloud
- Cost-effective parallel execution across multiple machines on your network

## What is Selenium Grid?

Selenium Grid is a server that allows you to run your tests on different machines and browsers in parallel. It consists of:

- **Hub**: The central point that receives test requests and distributes them to available nodes
- **Nodes**: Machines that run the actual browser instances and execute the tests

## Prerequisites

Before setting up Selenium Grid, ensure you have:

- Java 11 or higher installed
- Network connectivity between Hub and Node machines (if using separate machines)
- Sufficient disk space and memory for browser instances

## Setup Options

There are two main approaches to set up a local Selenium Grid:

### Option 1: Docker-based Grid (Recommended)

Using Docker is the easiest and most reliable way to run Selenium Grid locally. It handles all dependencies and provides consistent environments.

#### Prerequisites for Docker Setup

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running
- Docker configured to use Linux containers

#### Quick Start with Docker Compose

1. **Create a `docker-compose.yml` file** in your project root:

```yaml title="docker-compose.yml"
version: '3'
services:
  selenium-hub:
    image: selenium/hub:latest
    container_name: selenium-hub
    ports:
      - "4444:4444"
      - "4442:4442"
      - "4443:4443"
    environment:
      - SE_SESSION_REQUEST_TIMEOUT=300
      - SE_SESSION_RETRY_INTERVAL=5
      - SE_HEALTHCHECK_INTERVAL=5

  chrome:
    image: selenium/node-chrome:latest
    shm_size: 2gb
    depends_on:
      - selenium-hub
    environment:
      - SE_EVENT_BUS_HOST=selenium-hub
      - SE_EVENT_BUS_PUBLISH_PORT=4442
      - SE_EVENT_BUS_SUBSCRIBE_PORT=4443
      - SE_NODE_MAX_SESSIONS=3
      - SE_NODE_SESSION_TIMEOUT=300

  firefox:
    image: selenium/node-firefox:latest
    shm_size: 2gb
    depends_on:
      - selenium-hub
    environment:
      - SE_EVENT_BUS_HOST=selenium-hub
      - SE_EVENT_BUS_PUBLISH_PORT=4442
      - SE_EVENT_BUS_SUBSCRIBE_PORT=4443
      - SE_NODE_MAX_SESSIONS=3
      - SE_NODE_SESSION_TIMEOUT=300

  edge:
    image: selenium/node-edge:latest
    shm_size: 2gb
    depends_on:
      - selenium-hub
    environment:
      - SE_EVENT_BUS_HOST=selenium-hub
      - SE_EVENT_BUS_PUBLISH_PORT=4442
      - SE_EVENT_BUS_SUBSCRIBE_PORT=4443
      - SE_NODE_MAX_SESSIONS=3
      - SE_NODE_SESSION_TIMEOUT=300
```

2. **Start the Grid**:

```bash
docker-compose up -d
```

3. **Verify the Grid is running**:

Open your browser and navigate to: [http://localhost:4444](http://localhost:4444)

You should see the Selenium Grid console showing available nodes.

4. **Stop the Grid** when finished:

```bash
docker-compose down
```

#### Scaling Nodes

To add more browser instances, you can scale specific services:

```bash
# Add 3 Chrome nodes
docker-compose up -d --scale chrome=3

# Add 2 Firefox nodes and 2 Edge nodes
docker-compose up -d --scale firefox=2 --scale edge=2
```

### Option 2: Standalone Selenium Grid (JAR-based)

This approach runs Selenium Grid using standalone JAR files without Docker.

#### Step 1: Download Selenium Server

Download the latest Selenium Server standalone JAR from the [official Selenium downloads page](https://github.com/SeleniumHQ/selenium/releases/latest):

```bash
# Example for Selenium 4.x
wget https://github.com/SeleniumHQ/selenium/releases/download/selenium-4.16.0/selenium-server-4.16.1.jar
```

#### Step 2: Start the Hub

Open a terminal and run:

```bash
java -jar selenium-server-4.16.1.jar hub
```

The Hub will start on port `4444` by default. You can verify it by visiting [http://localhost:4444](http://localhost:4444).

#### Step 3: Start Node(s)

In a new terminal (or on a different machine), start a Node:

```bash
java -jar selenium-server-4.16.1.jar node --hub http://localhost:4444
```

If running on a different machine, replace `localhost` with the Hub machine's IP address:

```bash
java -jar selenium-server-4.16.1.jar node --hub http://192.168.1.100:4444
```

#### Step 4: Configure Node Capabilities (Optional)

You can specify which browsers the Node should support:

```bash
java -jar selenium-server-4.16.1.jar node \
  --hub http://localhost:4444 \
  --max-sessions 5 \
  --detect-drivers true
```

#### Standalone Mode (Single-Machine Grid)

For quick testing on a single machine, you can run Grid in standalone mode:

```bash
java -jar selenium-server-4.16.1.jar standalone
```

This starts both Hub and Node in a single process on port `4444`.

## Configuring SHAFT for Local Grid

Once your Grid is running, configure SHAFT to use it:

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs groupId="configMethod">
  <TabItem value="file" label="File-based">

```properties title="src/main/resources/properties/custom.properties"
# Connect to local Selenium Grid
executionAddress=localhost:4444
targetOperatingSystem=Linux
targetBrowserName=chrome

# Optional: Enable headless mode for faster execution
headlessExecution=true

# Optional: Set session timeout
dockerCommandTimeout=300
```

  </TabItem>
  <TabItem value="cli" label="CLI-based">

```bash
# Run tests on local Grid with Chrome
mvn test -DexecutionAddress=localhost:4444 -DtargetOperatingSystem=Linux -DtargetBrowserName=chrome

# Run tests with Firefox
mvn test -DexecutionAddress=localhost:4444 -DtargetOperatingSystem=Linux -DtargetBrowserName=firefox
```

  </TabItem>
  <TabItem value="code" label="Code-based">

```java
import com.shaft.driver.SHAFT;
import org.openqa.selenium.Platform;
import org.openqa.selenium.remote.Browser;

@BeforeClass
public void beforeClass() {
    SHAFT.Properties.platform.set()
        .executionAddress("localhost:4444")
        .targetPlatform(Platform.LINUX.name());
        
    SHAFT.Properties.web.set()
        .targetBrowserName(Browser.CHROME.browserName())
        .headlessExecution(true);
}

@Test
public void testOnGrid() {
    var driver = new SHAFT.GUI.WebDriver();
    driver.browser().navigateToURL("https://example.com");
    // Your test code here
}
```

  </TabItem>
</Tabs>

### Using Different Grid Address

If your Grid is on a different machine in your network:

```properties
# Connect to Grid on another machine
executionAddress=192.168.1.100:4444
```

Or using the full WebDriver endpoint:

```properties
executionAddress=http://192.168.1.100:4444/wd/hub
```

## Grid Configuration Options

### Environment Variables for Docker Grid

You can customize the Docker-based Grid with these environment variables:

| Variable | Default | Description |
|----------|---------|-------------|
| `SE_NODE_MAX_SESSIONS` | 1 | Maximum concurrent sessions per node |
| `SE_NODE_SESSION_TIMEOUT` | 300 | Session timeout in seconds |
| `SE_SESSION_REQUEST_TIMEOUT` | 300 | Timeout for new session requests |
| `SE_HEALTHCHECK_INTERVAL` | 120 | Health check interval in seconds |
| `SE_VNC_NO_PASSWORD` | - | Enable VNC without password (for debugging) |
| `SE_SCREEN_WIDTH` | 1920 | Screen width for browser |
| `SE_SCREEN_HEIGHT` | 1080 | Screen height for browser |

### Example: High Capacity Node Configuration

```yaml
  chrome:
    image: selenium/node-chrome:latest
    shm_size: 4gb
    environment:
      - SE_EVENT_BUS_HOST=selenium-hub
      - SE_EVENT_BUS_PUBLISH_PORT=4442
      - SE_EVENT_BUS_SUBSCRIBE_PORT=4443
      - SE_NODE_MAX_SESSIONS=5
      - SE_NODE_SESSION_TIMEOUT=600
      - SE_SCREEN_WIDTH=1920
      - SE_SCREEN_HEIGHT=1080
    deploy:
      resources:
        limits:
          memory: 4096M
```

## Monitoring and Debugging

### Grid Console

Access the Grid console at [http://localhost:4444](http://localhost:4444) to:

- View available nodes and their status
- See active sessions
- Monitor node capacity and utilization
- View session details and screenshots

### Enable VNC for Visual Debugging

For Docker-based Grid, you can enable VNC to view browser sessions in real-time:

```yaml
  chrome:
    image: selenium/node-chrome:latest
    shm_size: 2gb
    ports:
      - "5900:5900"  # VNC port
    depends_on:
      - selenium-hub
    environment:
      - SE_EVENT_BUS_HOST=selenium-hub
      - SE_EVENT_BUS_PUBLISH_PORT=4442
      - SE_EVENT_BUS_SUBSCRIBE_PORT=4443
      - SE_VNC_NO_PASSWORD=1
      - SE_SCREEN_WIDTH=1920
      - SE_SCREEN_HEIGHT=1080
```

Then connect using a VNC client (like RealVNC or TigerVNC) to `localhost:5900`.

### Grid Logs

**Docker-based Grid:**
```bash
# View Hub logs
docker logs selenium-hub

# View Node logs
docker logs <container-name>

# Follow logs in real-time
docker logs -f selenium-hub
```

**Standalone Grid:**
Logs are displayed in the terminal where you started the Hub/Node.

## Troubleshooting

### Grid Not Accessible

**Problem**: Cannot connect to Grid at `localhost:4444`.

**Solutions**:
- Verify Grid is running: `docker ps` (for Docker) or check terminal output
- Check firewall settings are not blocking port 4444
- Ensure no other service is using port 4444
- Try accessing `http://localhost:4444/status` to verify Grid endpoint

### Nodes Not Registering with Hub

**Problem**: Nodes don't appear in the Grid console.

**Solutions**:
- Verify Hub is running before starting Nodes
- Check the Hub URL is correct in Node configuration
- Ensure Hub and Node can communicate over the network
- For Docker: Verify containers are on the same network
- Check Node logs for connection errors

### Session Creation Timeout

**Problem**: Tests timeout when creating a session.

**Solutions**:
- Increase session timeout values:
  ```properties
  dockerCommandTimeout=600
  ```
- Reduce `SE_NODE_MAX_SESSIONS` if nodes are overloaded
- Add more nodes to increase capacity
- Check node health status in Grid console

### Browser Not Found

**Problem**: Grid reports browser not available.

**Solutions**:
- Verify the requested browser is supported by your nodes
- For Docker: Use the correct node image (`node-chrome`, `node-firefox`, `node-edge`)
- For standalone: Ensure browser drivers are installed and in PATH
- Check `targetBrowserName` matches available browsers

### Out of Memory Errors

**Problem**: Nodes crash with out-of-memory errors.

**Solutions**:
- Increase Docker container memory limits:
  ```yaml
  deploy:
    resources:
      limits:
        memory: 4096M
  ```
- Increase shared memory size: `shm_size: 4gb`
- Reduce `SE_NODE_MAX_SESSIONS` to run fewer concurrent sessions
- Monitor system resources and scale accordingly

### Tests Running on Wrong Browser

**Problem**: Tests run on a different browser than configured.

**Solutions**:
- Explicitly set `targetBrowserName` in SHAFT properties
- Check Grid console to verify available browsers
- Ensure node capabilities match your requirements

## Best Practices

1. **Use Docker for Development**: Docker-based Grid is easier to set up and maintain for local development.

2. **Monitor Resource Usage**: Keep an eye on CPU and memory usage, especially when running many parallel sessions.

3. **Set Appropriate Timeouts**: Configure session and command timeouts based on your test duration:
   ```properties
   dockerCommandTimeout=300
   webDriverElementTimeout=30
   ```

4. **Scale Gradually**: Start with fewer sessions per node and increase based on performance.

5. **Health Checks**: Regularly verify Grid health via the status endpoint:
   ```bash
   curl http://localhost:4444/status
   ```

6. **Clean Sessions**: Ensure tests properly close browser sessions to prevent resource leaks.

7. **Network Configuration**: When running Grid across multiple machines, ensure:
   - All machines can reach the Hub
   - Firewall rules allow traffic on Grid ports
   - Network latency is acceptable for your tests

## Combining Grid with Parallel Execution

You can combine local Grid with SHAFT's parallel execution features for maximum efficiency:

```properties title="src/main/resources/properties/custom.properties"
# Connect to local Grid
executionAddress=localhost:4444
targetOperatingSystem=Linux
targetBrowserName=chrome
```

```properties title="src/main/resources/properties/testng.properties"
# Enable parallel test execution
setParallel=METHODS
setParallelMode=DYNAMIC
setThreadCount=3
```

This configuration will run tests in parallel, with each thread connecting to the local Grid.

## Additional Resources

- [Selenium Grid Documentation](https://www.selenium.dev/documentation/grid/)
- [Docker Selenium GitHub](https://github.com/SeleniumHQ/docker-selenium)
- [SHAFT Properties Reference](../../../Properties/PropertiesList.mdx)
- [SHAFT Common Configuration Examples](../../../Properties/CommonExamples.mdx)
- [Parallel Execution Guide](../../../Basic_Config/parallelExecution.md)

:::tip
For production environments or cloud execution, consider using managed Grid services like BrowserStack or Sauce Labs. See the [Common Examples](../../../Properties/CommonExamples.mdx#example-4-browserstack-execution) guide for cloud execution configuration.
:::
