# Pre-child playability self-review — 21 September 2026

Scope: review the current game before a parent-supported child trial. Preserve all three levels, the approved animals/classroom, original action animations, Kokoro recordings, chosen instruction language, free-play default and saved story. No new activities or learning claims. This is an assistant visual/code/browser review, not a child usability study.

Local result: all fourteen release suites passed, including the 180-state usability walkthrough and actual v15 cache upgrade. Public verification is recorded in RELEASES.md after publication. Assistant verdict: ready for a parent-supported trial following the actual-phone checks below; no child-comprehension claim.

## Findings and corrections

| Finding | Evidence before correction | Correction and check |
|---|---|---|
| I36 — new activity could start halfway down its page | At 320x568, opening standalone school from its lower menu retained 272px scroll; entering a mission retained 151px | Shared main-screen renderer resets scroll. Reproduction now 0/0; every inspected prompt/outcome starts at its heading |
| I37 — old input could affect the new screen | Two invocations of the same replaced school button skipped the help step; a detached action choice reopened the activity after leaving | Reject detached, hidden-document and behind-dialog choice/progression events; validate school options and action screen. Old event does nothing, school remains at help, saved state unchanged. These are simulated duplicate/delayed events, not a physical touchscreen claim |
| I38 — controls below the visible screen | Small-phone action Next and long school/breakfast feedback displaced Listen; desktop action Next extended below 900px | Short-screen spacing and bounded scenes, compact desktop action Next. Targeted check passed 180 prompt/retry/outcome states at 320x568, 360x640 and 1200x900, with all gameplay controls visible and at least 44px in each dimension |
| I39 — original actions lacked the explicit back control of other levels | Only Finish was in the activity's local navigation | Added Levels back button, using existing exactly-once turn settlement and shared visit policy |

Evidence: `evidence/review-reproductions.txt`, `review-fixed-reproductions.txt`, `review-usability-final.txt`, `review-layout.json`, and `review-*.png`. First three targeted failures are retained in `review-usability-first/second/third.txt`; they exposed empty feedback spacing, long retry text, and desktop button sizing. No release is approved by the existence of this document; final local/public results are in RELEASES.md.

## Product-direction review

| Direction | Review |
|---|---|
| D01 / D14 — offline, no account/server/AI/microphone/ads | No new runtime service or permissions. Same assets and recordings; complete offline regressions and inventory check are part of release gate |
| D02 / D13 — non-reader, parent-supported, optional speech | All activity choices remain pictures; no required reading, recording or spoken answer. Review small-screen controls and calm parent bridges. Choosers/support settings still benefit from parent help; this is not an independent-use claim |
| D03 / D07 / D21 — optional limits, free play default | Policy implementation unchanged; explicit free-play and opted-in time/turn/day-reset regressions remain mandatory |
| D04 / D05 — instruction language and approved narration | Audio files unchanged. Selected-language queues, explicit Hindi meaning, cancellation, offline decoding and actual clip gaps tested by audio suite. Decode/queue checks do not establish pronunciation quality |
| D06 / D19 / D20 — visible actions and physical coherence | Reviewed before/outcome screenshots for brushing, table meals, attached greeting gestures, teacher/classmates, drinking and tucked-in sleep; original natural eat/walk/sleep retained. Existing motion suite checks pose changes, rest, replay, cancellation and reduced motion |
| D08 / D10 / D16 — levels and animal-led day | Three equally accessible levels. Both Rabbit and Cow follow waking → brushing → breakfast → school travel → hello/help/water → home → sleep. Approved outdoor classroom is still a chapter setting. Old names/actions/sentences/letters remain playable |
| D09 / D11 — useful communication, no tap-based mastery | School tasks retain hello/help/water models; wrong choices allow another try without punishment. Completion counts and parent observations remain separate |
| D12 / D17 — stable saves and explicit story state | No schema/content-ID migration. Shared view/input helpers added, pure story reducer retained. Actual v15 pending school-step upgrade added alongside older cache cases; old callbacks must not change saved progress |
| D15 / D18 — records and independent verification | Findings, failed checks, fixes, code boundaries and release evidence recorded. Product review is separate from technical results |
| D22 — optional installation | Installation UI and deferred-prompt/fallback tests retained; no install dialog interrupts an activity |

## What was actually inspected

- Rendered 360x640 walkthrough of all old activity types plus the complete Rabbit day before changes; measured new-page scroll and all gameplay controls.
- Final 320x568 outcomes for both animals, including the bathroom, table meal, school, drinking and bed. Animals/held objects remain visible after responsive sizing; visual meaning is judged by this assistant, not established for the child.
- Automated 180-state walkthrough through all old modes and both complete days at three viewport sizes, including wrong-choice feedback, exact-once school completion, detached Next/action events, offline brush-outcome reload and complete-day replay.
- Existing full gate checks all eight animal portraits/groups, both support modes, school missions, both instruction languages, motion/reduced motion, free play beyond former limits, enabled limits, storage migration/backup failures and historical workers. Final execution status is in RELEASES.md.

## Remaining limitations before/while trying it with the child

1. **Physical phone check remains open.** Browser viewport emulation is not iPhone Safari/Android home-screen installation, touch, interruption, speaker volume or OS storage testing. A grown-up should first open the installed game, check sound, and try airplane-mode reopen on that phone.
2. **Pronunciation review remains open.** The approved recordings are unchanged; technical decoding and timing cannot prove every English/Hindi pronunciation sounds right to a listener.
3. **Child comprehension remains open.** We cannot infer that he understands the pictures, which option he will choose, how much help he needs, or whether a phrase transfers to his day. A parent-supported trial is the next learning step, not an assessment.
4. **School pacing needs observation.** The hello/help/water tasks use a choose → supported phrase/action → outcome rhythm. Watch whether the extra school tap is useful or repetitive before changing all three; no forced repetition is required.
5. **Animation remains simple.** Two-pose gestures and whole-scene bedtime transitions are deliberate current limits. The lunchbox opens visibly, but the teacher does not perform a fully articulated handoff/opening motion. Morning greeting is to the co-playing parent, who is not drawn in-scene.
6. **Portrait phone use is the reviewed child layout.** Very short landscape windows may require scrolling. Parent panels and installation help are intentionally scrollable; the no-scroll target applies to the reviewed gameplay viewports, not every possible zoom/window combination.
7. **Future routines remain unbuilt.** Bathing, making the bed, dressing, packing and tidying are not silently counted as delivered. This release adds no activities.

Trial notes can be only three observations: where he hesitates, what picture/action needs explaining, and what he chooses to replay. Record these as observations, separate from completion totals. Stop or change activities whenever you choose; optional limits remain off by default.
