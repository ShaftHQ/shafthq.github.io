import React from 'react';
import CodeBlock from '@theme/CodeBlock';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import releases from '@site/src/data/releases.json';

const projectCommand = `mvn archetype:generate \\
  "-DarchetypeGroupId=io.github.shafthq" \\
  "-DarchetypeArtifactId=testng-archetype" \\
  "-DarchetypeVersion=${releases.archetypeVersion}" \\
  "-DinteractiveMode=false" \\
  "-DgroupId=com.example" \\
  "-DartifactId=shaft-demo"`;

export function ProjectCommand(): JSX.Element {
  return <CodeBlock language="bash">{projectCommand}</CodeBlock>;
}

export function EngineDependencies(): JSX.Element {
  return (
    <CodeBlock language="xml">{`<dependencyManagement>
  <dependencies>
    <dependency>
      <groupId>io.github.shafthq</groupId>
      <artifactId>shaft-bom</artifactId>
      <version>${releases.engineVersion}</version>
      <type>pom</type>
      <scope>import</scope>
    </dependency>
  </dependencies>
</dependencyManagement>

<dependencies>
  <dependency>
    <groupId>io.github.shafthq</groupId>
    <artifactId>shaft-engine</artifactId>
  </dependency>
</dependencies>`}</CodeBlock>
  );
}

export function MigrationDependencies(): JSX.Element {
  return (
    <>
      <p>Before:</p>
      <CodeBlock language="xml">{`<dependency>
  <groupId>io.github.shafthq</groupId>
  <artifactId>SHAFT_ENGINE</artifactId>
  <version>&lt;legacy-version&gt;</version>
</dependency>`}</CodeBlock>
      <p>After:</p>
      <EngineDependencies />
    </>
  );
}

export function McpClientCommands(): JSX.Element {
  return (
    <Tabs groupId="mcp-client">
      <TabItem value="codex" label="Codex" default>
        <CodeBlock language="bash">
          {'codex mcp add shaft-mcp -- docker run --rm -i ghcr.io/shafthq/shaft-engine-mcp:latest'}
        </CodeBlock>
      </TabItem>
      <TabItem value="copilot" label="GitHub Copilot / VS Code">
        <CodeBlock language="bash">
          {'code --add-mcp \'{"name":"shaft-mcp","command":"docker","args":["run","--rm","-i","ghcr.io/shafthq/shaft-engine-mcp:latest"]}\''}
        </CodeBlock>
      </TabItem>
    </Tabs>
  );
}

export function DoctorCommand(): JSX.Element {
  return (
    <Tabs groupId="shell">
      <TabItem value="posix" label="macOS / Linux" default>
        <CodeBlock language="bash">
          {'java -jar SHAFT_MCP-<version>.jar doctor analyze --input allure-results --allowed-root "$PWD" --output-dir target/shaft-doctor'}
        </CodeBlock>
      </TabItem>
      <TabItem value="powershell" label="PowerShell">
        <CodeBlock language="powershell">
          {'java -jar SHAFT_MCP-<version>.jar doctor analyze --input allure-results --allowed-root "$PWD" --output-dir target/shaft-doctor'}
        </CodeBlock>
      </TabItem>
    </Tabs>
  );
}

export function HealCommand(): JSX.Element {
  return <CodeBlock language="bash">{'mvn test \'-Dhealing.strategy=shaft-heal\''}</CodeBlock>;
}

export function ReleaseFacts(): JSX.Element {
  return (
    <ul>
      <li>SHAFT Engine: <code>{releases.engineVersion}</code></li>
      <li>Java: <code>{releases.javaVersion}</code></li>
      <li>Maven: <code>{releases.mavenVersion}+</code></li>
    </ul>
  );
}
