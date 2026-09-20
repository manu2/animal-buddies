# Release evidence
Historical baseline: commit 86198f8 (2026-09-20), worker v7.
Verified in previous work: offline voices and images, all animal actions, selected instruction language and pauses, local-day reset, parent restart, old-cache automatic refresh with active state preserved.
Important limitation: browser simulation is not physical iPhone/Android testing; audio decode is not pronunciation review; no child learning outcome has been established.

## Lakeside School pilot — 2026-09-20
Decisions: D01–D15. Regression history: I01–I10.
Planned deliverables: living records and repository work rules; illustrated activity library; two characters; three practical communication episodes; Explore/Listen support; parent observations; persistent checkpoint and shared budget.
Technical checks: passed locally. Deployment: pending public verification.
Evidence: docs/evidence/local-release.json; screenshot files in docs/evidence/.
Additional passing checks after the consolidated report: school English/Hindi instruction queues, Hindi-only meanings, Explore versus Listen prompting, and a live school checkpoint surviving a worker upgrade followed by offline reopen.

| Decision / issue coverage | Evidence and result |
|---|---|
| D01, D14 / I01 | 197 clips decode offline; school modules, scenes and original assets cached; no runtime speech API or microphone. Public check pending. |
| D02 / I12, I13 | Inspected mobile 360x740 and desktop 1200x900 screenshots. Completion button fits phone; picture choices; help button matches dog teacher; teacher stands on grass. |
| D03, D08 / I09, I11 | Pilot suite: 12 hero/mission/support combinations, six-turn stop, shared deadline across names/letters/school; saved static reward consumes one turn. |
| D04 / I02 | Language suite: English default, saved Hindi, no automatic duplicate translations, observed 1214ms inter-clip pause; new school queue assertions also passed. |
| D05 / I03 | 36 new clips generated with the existing Kokoro voices and speed, total 197 decode successfully. Human pronunciation review remains open. |
| D06 / I04 | Motion suite: walk/eat/sleep visibly change, stop, replay, cancel, respect reduced motion. |
| D07 / I05, I06 | Daily suite: offline local midnight, legacy stored visits, immediate restart, simulated day. |
| D09, D10 | Three finite school episodes; two heroes; Explore highlights a helpful example, Listen omits it; neutral recovery; physical outcome for each task. |
| D11 / I10 | Completion counts deduplicate on reload; parent observations saved independently; no locked levels or inferred mastery. |
| D12 / I07, I08 | Actual v4 cached ended/active clients refresh once to new code; active timer/settings preserved. School checkpoint/progress also tested through another upgrade. |
| D13 | Manual content review: gestures/taps sufficient, English model phrases, Hindi available, quiet parent follow-up; no demands to repeat. |
| D15 / T01 | Rules, decisions, historical issues, test gate and actual evidence committed; failed test helper recorded and corrected. |

Deferred by design: home/garden/playground worlds, puppy hero, turn-taking episode, two-step/retelling levels.
Not established by these checks: pronunciation quality, installed physical iPhone/Android behavior, child's comprehension or real-world transfer. These are explicit human follow-ups, not technical passes.
