import React, {type ReactNode} from 'react';
import Link from '@docusaurus/Link';
import {useDoc} from '@docusaurus/plugin-content-docs/client';
import Content from '@theme-original/DocItem/Content';

function markdownHref(permalink: string): string {
  const withoutDocs = permalink.replace(/\/docs(?=\/|$)/u, '');
  const trimmed = withoutDocs.endsWith('/') ? withoutDocs.slice(0, -1) : withoutDocs;
  return `/md${trimmed}.md`;
}

export default function DocItemContent(props: {children: ReactNode}): ReactNode {
  const {metadata} = useDoc();
  const mdHref = markdownHref(metadata.permalink);
  const next = metadata.next;

  return (
    <>
      <nav className="doc-orientation" aria-label="Page orientation" data-testid="doc-orientation">
        <p>
          <strong>{metadata.title}.</strong> {metadata.description}
        </p>
        <p>
          For engineers and coding agents using SHAFT.{' '}
          {next ? (
            <Link to={next.permalink}>Next: {next.title}</Link>
          ) : (
            <Link to="/docs/start/overview">Back to SHAFT at a glance</Link>
          )}
        </p>
        <p className="doc-agent-pointer">
          Agents: fetch <a href="/llms.txt">/llms.txt</a> or this page as Markdown at <a href={mdHref}>{mdHref}</a>.
          Each heading on this page stands alone; cite its anchor.
        </p>
      </nav>
      <Content {...props} />
    </>
  );
}
