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

## Product-direction review failure — 2026-09-20
User review identified I16: the school-centred experience did not implement the intended level progression or an animal protagonist replaying the child’s daily routines. Previous technical passes remain valid within their test scope; they did not establish product-direction success. Confirmed source still contains original names/actions/sentences/letters and illustrated action animations. Corrected decision record, verification gate and ANIMAL_DAY_PLAN.md; researched ASHA/NAEYC/AAP guidance and limitations of transfer from animal fiction. App unchanged in this review turn. Implementation and child-learning outcomes remain unverified.

## Three levels and an animal-led day — 2026-09-21, worker v10
Product-direction gate: PASS for the core correction (I16, D08/D10/D16). Technical gate: PASS locally. GitHub Pages built app commit 551306192db3cee8e29b6fedaba433b635ffd8b9; public verification passed. Intended final scope and current implementation are now separate documents, indexed by docs/README.md and required by AGENTS.md.

Delivered: equally visible names/actions/day level cards; preserved sentence/letter extras; original cow/dog/rabbit action animations; Rabbit and Cow day stories (wake/greet, brush, breakfast, walk to school, greet teacher, help with lunchbox, request water, walk home, sleep). The same selected animal continues between settings. Existing approved lake art and sprite sheets have no changes. School practice remains revisitable. Parent testing restart is now explicit on the end screen.

Architecture (D17/D18): authored content graph, pure journey reducer, versioned central save store with legacy backup, injected controller effects, separate view module, build-time asset/audio helpers. Original mode handlers remain a documented compatibility adapter; no claim of a complete rewrite. Stable per-hero bookmarks, completion receipts, checkpoint migration and shared deadline survive reload/day reset/update. Completions remain separate from mastery.

Evidence: docs/evidence/day-local-release.json (all eight suites); day-language.txt (supplemental actual day queues, 227 decoded clips, 1216ms gap); day-supplement.txt (names-to-actions sprite compatibility). State tests cover old settings/school/progress preservation, future-schema write protection, unavailable storage, duplicate events, expiry and sixth-turn continuation. Upgrade suite covers actual old cached ended/active visits plus current school/day checkpoints across another worker update and offline reopen. Day suite plays the complete Rabbit route, independent Cow checkpoint, retries, reset and timeout.

Direction evidence reviewed separately: day-levels.png shows all three levels together; day-chooser.png shows hero selection plus morning/school/home chapters; day-wake/brush/breakfast/school/cow-brush/desktop.png show routine-specific actions, original food/sprites and unchanged lake classroom. Actual toothbrushing movement, cancellation and reduced motion were checked in the browser. Re-captured after fixing the CSS-image decode race in the screenshot harness (T03). This is assistant visual review, not child recognition evidence.

Not delivered: making bed, washing/dressing, packing, turn-taking, toy tidying or additional heroes. These remain explicit roadmap items. No physical installed-phone pass, human pronunciation approval or learning/habit-transfer claim. New home backdrop provenance and exact prompt in ARTWORK.md; educational sources in LEARNING_GUIDANCE.md; engineering research and rules in DEVELOPMENT_RULES.md.

Public evidence for v10: docs/evidence/day-public.txt (offline connected story, all levels, shared limits, checkpoints, original actions), day-public-language.txt (227 clips offline, 1213ms pause, selected instructions and English models/Hindi meanings, including new day controller). Inspected the actual existing side-panel update: new end-screen parent restart appeared; restarted through the gate and left the three-level chooser visible with Ready for offline play and no active visit. Prior school practice counts remained visible in parent settings. No code changed after the public checks; final follow-up contains documentation/evidence only.

## Usability and reliability audit — 2026-09-21, worker v11 / schema 3
Product-direction review: PASS for preservation and this audit's concrete corrections, not a claim that all possible usability flaws are gone. Technical/public status recorded below after checks. Findings: AUDIT_2026_09_21.md; issues I18–I24 and T04.

D02/D09: wake/travel now single invitations; relevant alternatives and six contextual English/Hindi feedback clips replace generic rest/retry in routines. D06/D10: same hero, bedroom companions for morning/night, sleep on mattress, brush at mouth only after selection, actual source→destination travel; finite original animations preserved. D08/D16: all three main levels remain together, old sprite sheets and approved lake image unchanged. D04/D05: same neural voices, selected-language feedback, English models, explicit Hindi meaning and pauses; 233 clips.

D03/D07/D12/D17: per-animal/per-chapter bookmarks retain unfinished work on direct switching and story-order chapter crossing. Coarse navigation survives reload. Stale taps and canceled audio startup cannot create/reopen an abandoned visit (including original modes). Quota failures while making backups preserve valid loaded state; schema-specific backups and malformed-input recovery added. Animal-group targets reconcile in both directions without resetting the visit. D11/D13: parent guide covers all three levels; story practice and per-animal parent observations are separate. D15/D18: audit, issues, rules, architecture and actual shipped-state documents updated.

First release run failed only its old exact-session comparison because navigation now intentionally adds view=game. All original fields were unchanged. Evidence preserved in docs/evidence/audit-first-run.json. Updated that assertion without relaxing deadline/turn/settings checks, then added an actual v10/schema-2→v11/schema-3 worker upgrade. No deployment was performed with that failure.

Visual review: inspected both heroes brushing and morning chooser plus wake, bedtime choice/outcome and desktop bedtime. Evidence docs/evidence/audit-*.png. Sleeping sprite rests on the bed; morning and night window/lighting distinguish chapters; brush overlaps the mouth rather than floating below it. Source lake appears before going home; destination home appears after travel. These are assistant visual checks, not child recognition evidence. Existing child-friendly sprites/classroom preserved byte-for-byte. Exact companion image prompts/provenance in ARTWORK.md; no runtime generation.

Not delivered/verified: full roadmap routines, in-scene family greeting character, physical iPhone/Android installation, human pronunciation approval or measured child learning/transfer. The co-playing adult remains the morning greeting partner.

Final local technical gate: PASS, all nine suites (state/content/day/audit/pilot/daily/language/motion/upgrade), docs/evidence/audit-local-release.json. Supplemental chosen-language feedback check: audit-language.txt. All 233 recordings decoded offline; final measured gap 1218ms. Delayed entry cancellation exercised for both new story and original modes. Historical v4 and actual v10/schema-2 upgrades preserve settings, turn receipts and deadlines.

Public gate: PASS. GitHub Pages reports built application commit 680f2974f505c92080957df7db5c018d9297c9cf. Public-path audit, full day and language suites passed, including offline use and all 233 clips; measured gap 1215ms. Evidence: docs/evidence/audit-public.txt, audit-public-day.txt and audit-public-language.txt. These are three public suites, not a claim that all nine ran on Pages.

Actual in-app browser handoff: opened public game, observed old completed visit and automatic update, then inspected new parent panel. Existing Cow morning/school practice and saved water checkpoint were still present, along with earlier school-practice counts. Used parent Restart visit now (retains progress/settings), verified three equal level cards, offline-ready message and no visit started. Left that public tab open. The previous public tab was no longer available in the browser inventory, so a new public tab was opened; this was not an inspection of a vanished tab. No runtime code changed after public verification.
