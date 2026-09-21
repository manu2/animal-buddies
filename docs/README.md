# Required project reading
Read these before planning or changing this game. AGENTS.md makes this a repository rule.

| Document | Authority and purpose |
|---|---|
| [GAME_DESIGN.md](GAME_DESIGN.md) | Intended complete experience; what the user wants |
| [CURRENT_STATE.md](CURRENT_STATE.md) | What actually ships, missing work and limitations |
| [LEARNING_GUIDANCE.md](LEARNING_GUIDANCE.md) | Educational sources, age/language context and limits of evidence |
| [DEVELOPMENT_RULES.md](DEVELOPMENT_RULES.md) | Researched engineering principles and mandatory development rules |
| [ARCHITECTURE.md](ARCHITECTURE.md) | Module boundaries, saved state, events and migration strategy |
| [STORY_AUTHORING.md](STORY_AUTHORING.md) | How to extend a storyline without rewriting the engine |
| [DECISIONS.md](DECISIONS.md) | User decisions and why they were made |
| [ISSUES.md](ISSUES.md) | Earlier mistakes, fixes and unresolved issues |
| [VERIFICATION.md](VERIFICATION.md) | Independent product-direction and technical release gates |
| [RELEASES.md](RELEASES.md) | Dated actual evidence; not a substitute for the design |

SELF_REVIEW_2026_09_21.md records the latest pre-child playability review; read it for flow, input and responsive-layout changes. AUDIT_2026_09_21.md records the latest concrete usability/reliability findings and their checks; read it for related changes. ANIMAL_DAY_PLAN.md records the correction history. ARTWORK.md, ARTWORK_ROUTINES.md and ARTWORK_SCENES.md record generation prompts and provenance. The source of truth for authored runtime nodes is content/day.js; for recorded speech it is voice-recordings.json. A documented future feature is not a shipped feature.

When changing scope, reconcile design/current state/decisions first. After implementation, update the current state, authoring docs if needed, issue record and release evidence. Do not erase resolved issues or rewrite historical failures as successes.
