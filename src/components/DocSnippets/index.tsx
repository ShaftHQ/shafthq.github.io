import React from 'react';
import CodeBlock from '@theme/CodeBlock';
import releases from '@site/src/data/releases.json';
import snippets from '@site/src/data/snippets.json';
export {McpApplications} from './McpApplications';

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

export function HealCommand(): JSX.Element {
  return <CodeBlock language="bash">{snippets.heal}</CodeBlock>;
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
