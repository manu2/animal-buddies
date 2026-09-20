# Current implementation status
Updated 2026-09-21. Published worker v14 / schema 4, app commit 64c0425183eb0c62a32deec5129225f27d6de93f at https://manu2.github.io/animal-buddies/ . All twelve local suites and public free-play/daily/language checks passed; evidence in RELEASES.md.

Latest policy: free play by default, including existing users. Parent Time and turn limits can restore the original six-turn/timed/daily policy. Finish returns to Levels when limits are off; activities repeat past six turns and old completed visits unlock without losing story progress.

Implemented: three equally visible levels (names/actions/day), preserved sentence/letter extras, original illustrated grass/carrot eating/walking/sleeping, per-animal day stories (wake, brush, breakfast, travel, school hello/help/water, home, sleep), and revisitable school practice. Existing approved characters/classroom and original home image remain.

Latest audit changes: distinct matching morning/night bed views, prior sleep staging (superseded below), brush appears at mouth after selection, source→destination travel; relevant picture choices/contextual recorded help; one invitation for wake/travel; clear Start/Continue labels; per-animal AND per-chapter checkpoints, including continuation across chapter boundaries; chooser reload; cancellation before asynchronous visit entry in all modes; three-level parent guide, day practice/observations, bidirectional animal-group compatibility and resilient backup handling. Audio total 233; same Kokoro voices, English/Hindi instruction choice and explicit Hindi meanings.

Latest refinement: all eight animals share illustrated portraits in older activities; direct invitation/choice/quiet outcome and stable choice positions. Cow/Rabbit hold brushes in the bathroom and eat seated at tables in the dining room; original natural action sheets remain. Reusable room definitions support later routines.

Scene correction: Cow/Rabbit are tucked into bed under the quilt, with head on pillow and matching morning greeting frames. School has a recognisable adult dog teacher and Cat/Duck classmates; hero and teacher wave with their own limbs, and the hero holds a cup to drink. Shared across day and standalone practice. The lake background and original natural eat/walk/sleep sheets remain unchanged.

Planned, not implemented: bathing, making the bed, washing/dressing, packing a bag, turn-taking, tidying toys, additional animal heroes/settings and richer story branches. The current character animation is deliberately simple, based on the original two poses per action. No claim of a finished animation system or full routine curriculum.

Limitations: original modes still use established mutable handlers behind a persistence adapter; new stories use authored content and pure transitions. Local saves do not sync phones or coordinate independent simultaneous tabs. Physical installed-phone behavior, human pronunciation review, child comprehension, comfortable stopping and habit/language transfer need real observation. No browser test proves learning or usability for this child.

Audit findings and fixes: AUDIT_2026_09_21.md. Intended destination: GAME_DESIGN.md. Release evidence and remaining validation: RELEASES.md.
