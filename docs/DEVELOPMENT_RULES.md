# Development rules
Read with GAME_DESIGN.md, CURRENT_STATE.md, ARCHITECTURE.md, STORY_AUTHORING.md, DECISIONS.md, ISSUES.md and VERIFICATION.md before every change. This document is enforced by AGENTS.md and review, not an automated claim that all developers comply.

## Researched principles
- [Game Programming Patterns: State](https://gameprogrammingpatterns.com/state.html) describes explicit states and transitions as an alternative to accumulating interacting flags. Apply a small finite state model to each story beat; do not build a large game framework merely to name the pattern.
- [Ink: runtime integration and saving](https://github.com/inkle/ink/blob/master/Documentation/RunningYourInk.md) separates authored story content from runtime presentation and exposes explicit choice/save APIs. We use that separation with simple authored JavaScript data; we are not adding the Ink engine or claiming format compatibility.
- [MDN: Page Visibility](https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API) explains hidden-page events and background timer throttling. Cancel speech/motion when hidden; enforce visit limits using a saved wall-clock deadline, not frame counts or elapsed callback counts.

## Mandatory rules
1. Content describes what happens. Reducers decide permitted changes. Views render state. Effects play audio/animation. Keep those responsibilities separate for all new stories.
2. One storage owner, versioned saves and stable content IDs. Back up pre-migration data; preserve existing settings, legacy missions, story checkpoints and deadlines. Never clear saves to make an update work.
3. New story state changes use named events. Reducers are pure and receive time explicitly. No DOM, random choice, audio, storage or timers inside reducers. Ignore invalid and duplicate transitions.
4. Keep transient effects out of saves. Cancel outstanding narration/animation on navigation, parent settings, visibility loss and a new narration. Async continuation must verify its generation/token and current screen.
5. Exactly one shared visit budget. A completed outcome consumes one turn exactly once when left/advanced. Replaying audio, changing hero/level, reload and updates must not reset or duplicate it.
6. Reuse approved assets and working interactions. The original action animations and current lakeside art are protected by direction checks, not just by file-existence tests.
7. Use simple event-driven DOM rendering and the Web Animations API here. No continuous game loop is needed for this slow tap game. Add a dependency only for a demonstrated capability the current design lacks.
8. Authored content must validate its IDs, transitions, choice kinds, audio and cache inventory. New actions need meaningful visual outcomes, not a generic bounce.
9. Test reducers/migrations with bad input, reload and duplicate-event cases. Test the complete visible child/parent route separately. Exercise real historical service-worker upgrades as well as fresh installs.
10. Product-direction PASS and technical PASS are separate release requirements. Compare the user's intent with actual starting navigation and a whole story episode. Do not silently defer a central requirement to claim a pass.
11. Record failures and fixes in ISSUES.md; append evidence to RELEASES.md. Keep CURRENT_STATE.md honest about shipped versus planned features and physical-device/child-learning limits.
12. No new sign-in, runtime server, API key, external speech call or microphone to add content. Pre-render audio at build time and ship it in the offline inventory.

Audit additions: navigation must preserve unfinished chapter work; distinguish resume from replay. Loading valid state must not depend on a backup write succeeding. Async entry must recheck cancellation before creating a visit, not only before rendering. Inspect prompt AND outcome: a prop must appear when used, the depicted destination must match the action, and day/night choices must differ without requiring text. Read the latest dated audit alongside issue history when checking related behavior.

Additional regression rules from I25–I29: inspect every existing activity affected by shared art/flow changes, not only the newest level. Verify actual sprite background-frame changes; element translation alone does not prove pose animation. Clip atlas cells independently of the outer layout aspect ratio. Preserve choice order on reload and settled/pending turn receipts when simplifying old flows. Add rooms as authored setting data rather than hardcoded story checkpoints.
