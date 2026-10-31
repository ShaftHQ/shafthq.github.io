# AEO — ChaosEngine FAQ (full answers, byte-identical; EN + AR)

**Apply to:** `docs/agentic/chaos-engine.mdx` (visible `<details>`) **and** page JSON-LD FAQPage in `01-jsonld-graph.json`.  
**Single source:** `diffs/05-faqs.json` / `diffs/05-chaosengine-faqs.ts`.

## Rule (Coach / pilot1 / pilot2)

- Visible FAQ answer text **===** `FAQPage` `Answer.text` **byte-for-byte**.
- Do **not** append extra sentences in MDX/JSX that are absent from `answerText`.
- Links may wrap substrings of `answerText` without changing characters.
- Arabic entries: `<details dir="rtl" lang="ar">`.
- **No HowTo** JSON-LD in this pack (install steps already have dedicated pages — link them; do not invent meta-HowTo).

## Proposed questions

| id | Lang | Question | Source |
|---|---|---|---|
| en-what | EN | What is ChaosEngine? | Guide lead + README + LICENSE |
| en-free | EN | Is ChaosEngine free to use? | chaos-engine/LICENSE (MIT) + guide uninstall/rollback |
| en-shaft | EN | Is ChaosEngine the same as SHAFT_ENGINE? | Guide framing + repo layout |
| en-install | EN | How do I install ChaosEngine? | Live install section (answer points to guide; not a HowTo schema) |
| en-who | EN | Who created ChaosEngine? | GitHub MohabMohie profile + ShaftHQ/SHAFT_ENGINE tree |
| ar-what | AR | ما هو ChaosEngine؟ | Same facts; AR Automatest `/chaosengine` framing |
| ar-free | AR | ChaosEngine مجاني؟ | MIT |
| ar-who | AR | مين عمل ChaosEngine؟ | Creator — closes BASELINE Arabic creator gap (game Wikipedia currently wins) |

## Visible block sketch (MDX)

```mdx
## Common questions

{chaosEngineFaqs.map((faq) => (
  <details key={faq.id} {...(faq.rtl ? {dir: 'rtl', lang: 'ar'} : {})}>
    <summary>{faq.question}</summary>
    <p>{faq.answerText}</p>
  </details>
))}
```

Or hard-code the eight `<details>` blocks with the exact `answerText` strings from `05-faqs.json`.

## Explicitly not included

- HowTo schema
- Unsourced “best / أول وأكبر / أفضل” claims (LinkedIn marketing — do not copy)
- Trainee counts, client names, prices, weekly-user claims from bios
- Automatest curriculum / pricing Q&As (those stay on automatest.org pilot)
