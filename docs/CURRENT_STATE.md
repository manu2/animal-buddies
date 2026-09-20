# Current implementation status
Updated 2026-09-21. Local technical and direction verification passed. Publication/public-path verification pending.

Implemented: three main level cards (names/actions/day), preserved extra sentences/letters, original action modes and sprites, per-character day checkpoints, authored morning (wake/brush/breakfast), travel to school, reused school greeting/help/water, return home and bedtime. Rabbit and Cow variants share the authored graph. School practice remains accessible from the day chooser. New home art complements the existing lake art. Development/learning/design/authoring/state docs are separate.

Verified locally: all eight release suites (state, content, day, school pilot, daily reset, language, original motion and upgrade); supplemental day language/compatibility checks; phone/desktop visual review. 227 recorded clips decode offline. Thirty new clips use the same Kokoro voices. Public deployment check is the remaining release step.

Planned, not implemented: making the bed, washing/dressing, packing a bag, turn-taking, tidying toys, additional animal heroes and settings, richer story branches. The day is deliberately split across short visits; this list is not hidden behind a completion claim.

Limitations: original legacy modes retain established mutable handlers behind the persistence adapter; new story logic uses pure transitions. Local saves do not sync phones. Physical installed-phone behaviour, human pronunciation review, child comprehension and habit transfer need actual observation and are never marked passed by browser tests.
