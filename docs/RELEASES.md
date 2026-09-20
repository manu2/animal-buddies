# Release evidence
Historical baseline: commit 86198f8 (2026-09-20), worker v7.
Verified in previous work: offline voices and images, all animal actions, selected instruction language and pauses, local-day reset, parent restart, old-cache automatic refresh with active state preserved.
Important limitation: browser simulation is not physical iPhone/Android testing; audio decode is not pronunciation review; no child learning outcome has been established.

## Lakeside School pilot — 2026-09-20
Decisions: D01–D15. Regression history: I01–I13; test-harness issue T01.
Delivered: living records and repository work rules; illustrated activity library; two characters; three practical communication episodes; Explore/Listen support; parent observations; persistent checkpoint and shared budget.
Technical checks: all five suites passed locally and against the public release. GitHub Pages built application commit ae133fb270ebac5276046d94c5226dc232fe9442. Public verification completed 2026-09-20 at 12:28 UTC.
Public target: https://manu2.github.io/animal-buddies/ . Pilot, daily, language and motion suites use the public target; the upgrade suite independently serves historical and candidate versions to exercise a real worker upgrade.
Evidence: docs/evidence/local-release.json, docs/evidence/public-release.json; inspected screenshot files in docs/evidence/.
Additional passing checks after the consolidated report: school English/Hindi instruction queues, Hindi-only meanings, Explore versus Listen prompting, and a live school checkpoint surviving a worker upgrade followed by offline reopen.

| Decision / issue coverage | Evidence and result |
|---|---|
| D01, D14 / I01 | 197 clips decode offline; school modules, scenes and original assets cached; no runtime speech API or microphone. Fresh public browser and offline reload passed without authentication; all 197 clips decoded. |
| D02 / I12, I13 | Inspected mobile 360x740 and desktop 1200x900 screenshots. Completion button fits phone; picture choices; help button matches dog teacher; teacher stands on grass. |
| D03, D08 / I09, I11 | Pilot suite: 12 hero/mission/support combinations, six-turn stop, shared deadline across names/letters/school; saved static reward consumes one turn. |
| D04 / I02 | Language suite: English default, saved Hindi, no automatic duplicate translations, observed 1214ms local / 1215ms public inter-clip pause; new school queue assertions also passed. |
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

## Actual side-panel recovery — 2026-09-20
User reported All done after pilot delivery. Inspected the existing public tab using browser accessibility: current Activities button and Lakeside School parent option were present, so the new UI was loaded. The completed visit remained. Used For grown-ups → Restart visit now → Visit Lakeside School. Verified the actual tab now displays cow/rabbit, Explore/Listen and all three missions, plus Ready for offline play. No mission was started. This resolves the immediate testing blockage; parent restart discoverability remains open (I14). This is desktop in-app browser evidence, not installed-phone testing. No game code or daily-limit policy changed.

## Outdoor classroom artwork revision — 2026-09-20, worker v9
Direction: D16; issues I15, I12 and I13. Reused the existing illustrated action-game cow, rabbit and dog in the school scene, hero picker and teacher choice. Generated an open-air classroom backdrop with a clear lake, tree shade, picture board, books, cushions and story rug; removed the school building. Lobby and library now preview the setting. Exact generation prompt and asset provenance: ARTWORK.md.

Visual review: inspected rendered 360x740 mission/lobby/outcome and 1200x900 outcome screenshots in docs/evidence. Lake, classroom objects and dry character placement remain visible; original illustrated animals face one another; mobile completion button fits. This is an assistant visual review, not a claim that the child recognises the setting.

Technical release gate: all five suites passed locally (docs/evidence/art-local-release.json), including real offline decode of backdrop and all three reused sprite sheets, twelve hero/mission/support combinations, saved progress, original activities and motion, 197 audio clips, single instruction language and pauses, daily restart and historical cache upgrades. Upgrade fixture now derives its synthetic cache revision independently of the current worker number. D01–D15 remain unchanged; no mission, audio, budget or learning-progression changes. Physical-phone and parent/child visual acceptance remain unverified. Public deployment verified: GitHub Pages built commit 399ac12ed846e15d07f842330d9cf35e9f77e595. Public-path pilot suite passed including offline artwork and all twelve combinations (docs/evidence/art-public-pilot.txt). Actual existing side-panel tab received its automatic update; used parent restart and inspected the illustrated school lobby screenshot with the saved Cow choice and unfinished mission preserved. Left the mission chooser open with no active visit timer.
