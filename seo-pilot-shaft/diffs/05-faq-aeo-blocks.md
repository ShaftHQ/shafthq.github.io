# AEO — Homepage FAQ (full answers, byte-identical)

**Apply to:** `src/data/homepage-faqs.ts` (see `05-homepage-faqs.ts`) and `src/pages/index.tsx` FAQ section.

## Rule (Coach / pilot1)

- Visible FAQ answer text **===** `FAQPage` `Answer.text` **byte-for-byte**.
- Do **not** append extra sentences in JSX that are absent from `answerText`.
- Links may wrap substrings of `answerText` (e.g. “MIT license”, “Upgrade a project”) without changing characters.
- Preferred render: `{homepageFaqs[i].answerText}` inside `<p>` (optionally with linkification helper that does not mutate text).

## Proposed questions (sources)

| Q | Source |
|---|---|
| What is SHAFT Engine? | Live home lead + GitHub description 2026-10-31 |
| Is SHAFT free to use? | Live FAQ + MIT LICENSE |
| Do I have to rewrite my Selenium tests? | Live FAQ + `/docs/journeys/upgrade-a-project` (link text now **inside** answerText) |
| Which Java version do I need? | Live FAQ; Java 25 from project-signals / installation |
| What Maven coordinate do I use? | Install / quick-start / Maven Central |
| Who created SHAFT_ENGINE? | `/blog/welcome` author title; Maven developers |

## Visible block sketch

```tsx
<div className={styles.faq}>
  <Heading as="h3">Common questions</Heading>
  {homepageFaqs.map((faq) => (
    <details key={faq.question}>
      <summary>{faq.question}</summary>
      <p>{faq.answerText}</p>
    </details>
  ))}
</div>
```

Optional: replace known phrases with `<Link>` **without** changing the concatenated text content (test with `textContent === answerText`).

## Explicitly not included

- HowTo schema
- Automatest trainee / pricing Q&As (belong on automatest.org)
- Client names
