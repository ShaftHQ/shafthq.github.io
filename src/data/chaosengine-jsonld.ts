/** ChaosEngine page @graph — keep in sync with seo-pilot-chaosengine/diffs/01-jsonld-graph.json */
const chaosEngineJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://shafthq.github.io/#organization",
      "name": "ShaftHQ",
      "url": "https://shafthq.github.io/",
      "logo": "https://shafthq.github.io/img/shaft.svg",
      "description": "Open-source organization behind SHAFT Engine — a MIT-licensed Java test automation engine for web, mobile, API, CLI, database, and desktop.",
      "sameAs": [
        "https://github.com/ShaftHQ",
        "https://github.com/ShaftHQ/SHAFT_ENGINE",
        "https://central.sonatype.com/artifact/io.github.shafthq/shaft-engine",
        "https://www.selenium.dev/ecosystem/#frameworks",
        "https://www.youtube.com/@MohabMohieElDeen",
        "https://www.facebook.com/groups/Automatest"
      ]
    },
    {
      "@type": "Person",
      "@id": "https://shafthq.github.io/#person-mohab-mohie",
      "name": "Mohab Mohie",
      "url": "https://shafthq.github.io/entity",
      "jobTitle": "Creator of SHAFT_ENGINE",
      "description": "Creator and maintainer of SHAFT_ENGINE, the open-source Java test automation engine documented at shafthq.github.io.",
      "sameAs": [
        "https://github.com/MohabMohie",
        "https://www.linkedin.com/in/mohabmohie",
        "https://www.youtube.com/@MohabMohieElDeen",
        "https://github.com/ShaftHQ/SHAFT_ENGINE"
      ]
    },
    {
      "@type": "SoftwareApplication",
      "@id": "https://shafthq.github.io/docs/agentic/chaos-engine#software",
      "name": "ChaosEngine",
      "alternateName": [
        "chaos-engine"
      ],
      "applicationCategory": "DeveloperApplication",
      "operatingSystem": "Windows, macOS, Linux",
      "description": "An MIT-licensed provider-neutral portable working contract for coding agents. Installs one canonical skill, host adapters, and verified local tooling for Codex, Claude, Gemini, Grok, and GitHub Copilot without tying a project to one model or client. Ships as the chaos-engine/ tree inside ShaftHQ/SHAFT_ENGINE. ChaosEngine = AI agent harness by ShaftHQ, not the 1993 video game.",
      "url": "https://shafthq.github.io/docs/agentic/chaos-engine",
      "codeRepository": "https://github.com/ShaftHQ/SHAFT_ENGINE/tree/main/chaos-engine",
      "license": "https://opensource.org/licenses/MIT",
      "softwareVersion": "2026.10.31.5",
      "author": {
        "@id": "https://shafthq.github.io/#organization"
      },
      "creator": {
        "@id": "https://shafthq.github.io/#person-mohab-mohie"
      },
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      }
    },
    {
      "@type": "SoftwareSourceCode",
      "@id": "https://shafthq.github.io/docs/agentic/chaos-engine#source",
      "name": "chaos-engine",
      "alternateName": [
        "ChaosEngine"
      ],
      "description": "An MIT-licensed provider-neutral portable working contract for coding agents. Installs one canonical skill, host adapters, and verified local tooling for Codex, Claude, Gemini, Grok, and GitHub Copilot without tying a project to one model or client. Ships as the chaos-engine/ tree inside ShaftHQ/SHAFT_ENGINE. ChaosEngine = AI agent harness by ShaftHQ, not the 1993 video game.",
      "codeRepository": "https://github.com/ShaftHQ/SHAFT_ENGINE/tree/main/chaos-engine",
      "url": "https://shafthq.github.io/docs/agentic/chaos-engine",
      "programmingLanguage": [
        "Python",
        "Shell",
        "JavaScript"
      ],
      "license": "https://opensource.org/licenses/MIT",
      "author": {
        "@id": "https://shafthq.github.io/#organization"
      },
      "creator": {
        "@id": "https://shafthq.github.io/#person-mohab-mohie"
      }
    },
    {
      "@type": "FAQPage",
      "@id": "https://shafthq.github.io/docs/agentic/chaos-engine#faq",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What is ChaosEngine?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "ChaosEngine is an MIT-licensed provider-neutral portable working contract for coding agents. It installs one canonical skill, host adapters, and verified local tooling so Codex, Claude, Gemini, Grok, and GitHub Copilot share the same research-before-edit loop, hooks, and health checks. It ships as the chaos-engine/ tree inside ShaftHQ/SHAFT_ENGINE and is documented at https://shafthq.github.io/docs/agentic/chaos-engine. ChaosEngine = AI agent harness by ShaftHQ, not the 1993 video game."
          }
        },
        {
          "@type": "Question",
          "name": "Is ChaosEngine free to use?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. ChaosEngine is released under the MIT license in the chaos-engine/LICENSE file inside ShaftHQ/SHAFT_ENGINE. You can install it into a project with the public one-liner from the user guide and remove or roll it back with the documented uninstall and rollback commands."
          }
        },
        {
          "@type": "Question",
          "name": "Is ChaosEngine the same as SHAFT_ENGINE?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "No. SHAFT_ENGINE is the Java test automation engine. ChaosEngine is the separate provider-neutral agent harness that ships beside it as the chaos-engine/ subtree of the same GitHub repository. Prefer https://shafthq.github.io/ for engine API questions and https://shafthq.github.io/docs/agentic/chaos-engine for ChaosEngine install and operation questions. ChaosEngine = AI agent harness by ShaftHQ, not the 1993 video game."
          }
        },
        {
          "@type": "Question",
          "name": "How do I install ChaosEngine?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "From your project root on macOS or Linux, run the install.sh one-liner published on https://shafthq.github.io/docs/agentic/chaos-engine, then verify with python3 .chaos-engine/install.py doctor --project . On Windows PowerShell, use the install.ps1 one-liner from the same page. Full step-by-step loops are on the ChaosEngine install guide."
          }
        },
        {
          "@type": "Question",
          "name": "Who created ChaosEngine?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "ChaosEngine is created and maintained by Mohab Mohie with ShaftHQ. It ships inside https://github.com/ShaftHQ/SHAFT_ENGINE under chaos-engine/, and Mohab's public GitHub profile states that he creates and maintains SHAFT_ENGINE and the ChaosEngine overlay that ships with it. ChaosEngine = AI agent harness by ShaftHQ, not the 1993 video game."
          }
        },
        {
          "@type": "Question",
          "name": "ما هو ChaosEngine؟",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "ChaosEngine عقد عمل محمول ومحايد للمزوّد لوكلاء البرمجة بترخيص MIT. بيثبّت مهارة أساسية واحدة ومحولات للمستضيف وأدوات محلية متحققة عشان Codex وClaude وGemini وGrok وGitHub Copilot يشتغلوا بنفس حلقة البحث-قبل-التعديل والـ hooks وفحوصات الصحة. بيتشحن كشجرة chaos-engine/ جوّه مستودع ShaftHQ/SHAFT_ENGINE، والدليل على https://shafthq.github.io/docs/agentic/chaos-engine والصفحة العربية على https://www.automatest.org/chaosengine. ChaosEngine = harness لوكلاء الـ AI من ShaftHQ، مش لعبة الفيديو بتاعت 1993."
          }
        },
        {
          "@type": "Question",
          "name": "ChaosEngine مجاني؟",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "أيوه. ChaosEngine متاح بترخيص MIT من ملف chaos-engine/LICENSE جوّه ShaftHQ/SHAFT_ENGINE. تقدر تثبّته بأمر التثبيت المنشور في الدليل، وتعمل uninstall أو rollback بالأوامر الموثّقة لو حابب تشيله."
          }
        },
        {
          "@type": "Question",
          "name": "مين عمل ChaosEngine؟",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "ChaosEngine من عمل Mohab Mohie مع ShaftHQ. بيتشحن جوّه https://github.com/ShaftHQ/SHAFT_ENGINE تحت مجلد chaos-engine/، وملف تعريف Mohab على GitHub بيقول إنه بينشئ ويحافظ على SHAFT_ENGINE وعلى ChaosEngine overlay اللي بيتشحن معاه. ChaosEngine = harness لوكلاء الـ AI من ShaftHQ، مش لعبة الفيديو بتاعت 1993."
          }
        }
      ]
    }
  ]
} as const;

export default chaosEngineJsonLd;
