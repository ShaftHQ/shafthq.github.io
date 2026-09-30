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
  const docId = metadata.id;
  const background = docId.startsWith('features/')
    || docId.endsWith('flakiness')
    || docId.endsWith('how-it-works')
    || docId === 'agentic/overview';

  return (
    <>
      <nav className="doc-orientation" aria-label="Page orientation" data-testid="doc-orientation">
        {background ? (
          <p>
            This page explains behavior. It is not a setup path.{' '}
            <Link to="/docs/journeys">Choose a path</Link> when you want the steps.
          </p>
        ) : null}
        <p>
          <strong>{metadata.title}.</strong> {metadata.description}
        </p>
        <p>
          For engineers and coding agents using SHAFT.{' '}
          {next ? (
            <Link to={next.permalink}>Next: {next.title}</Link>
          ) : (
            <Link to="/docs/journeys">Back to Choose a path</Link>
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
