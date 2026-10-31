# AEO — Homepage FAQ (full answers, byte-identical; EN + AR)

**Apply to:** `src/data/homepage-faqs.ts` (see `05-homepage-faqs.ts`) and `src/pages/index.tsx` FAQ section.

## Rule (Coach / pilot1)

- Visible FAQ answer text **===** `FAQPage` `Answer.text` **byte-for-byte**.
- Do **not** append extra sentences in JSX that are absent from `answerText`.
- Links may wrap substrings of `answerText` without changing characters.
- Preferred render: `{homepageFaqs[i].answerText}` inside `<p>`.
- **Arabic entries:** `<details dir="rtl" lang="ar">` (and keep answerText RTL-correct Arabic as stored).

## Proposed questions

### English (sources: live home, install/upgrade, Maven Central, welcome blog)

| Q | Source |
|---|---|
| What is SHAFT Engine? | Live home lead + GitHub description |
| Is SHAFT free to use? | Live FAQ + MIT LICENSE |
| Do I have to rewrite my Selenium tests? | Live FAQ + upgrade journey (phrase inside answerText) |
| Which Java version do I need? | Live FAQ; Java 25 |
| What Maven coordinate do I use? | Install / Maven Central / relocation |
| Who created SHAFT_ENGINE? | `/blog/welcome` |

### Arabic (targets BASELINE AR “best framework” gap; factual — **no unsourced superlatives**)

| Q | Intent |
|---|---|
| إيه إطار Java ينفع لاختبارات Selenium وAppium والـ API والـ desktop؟ | Answer “what works for Selenium+Appium+API+desktop” without claiming “الأفضل” |
| SHAFT مجاني؟ | MIT free |
| مين عمل SHAFT_ENGINE؟ | Creator Mohab Mohie |

## Visible block sketch

```tsx
<div className={styles.faq}>
  <Heading as="h3">Common questions</Heading>
  {homepageFaqs.map((faq) => (
    <details key={faq.question} {...(faq.rtl ? {dir: 'rtl', lang: 'ar'} : {})}>
      <summary>{faq.question}</summary>
      <p>{faq.answerText}</p>
    </details>
  ))}
</div>
```

## Explicitly not included

- HowTo schema
- Unsourced “best/أفضل” marketing claims
- Automatest trainee / pricing Q&As
- Client names
