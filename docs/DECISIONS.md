# Product direction and decision record
Status: corrected three-level, animal-led day implemented and locally verified 2026-09-21. Public story/audio checks and actual side-panel handoff passed. See GAME_DESIGN.md for intended scope and CURRENT_STATE.md for what is built.
This record is the reference for future changes, not a claim of educational efficacy.

| ID | Decision | Why / acceptance evidence |
|---|---|---|
| D01 | Offline home-screen app for iPhone and Android; public GitHub Pages; no sign-in, runtime server or API key | Fresh signed-out load; airplane-mode reload; all assets and voices decode |
| D02 | Non-reader first: illustrated actions, spoken prompts, large taps; no required reading, typing, dragging or speaking | Complete every mission by pictures/taps; inspect 360px layout |
| D03 | Optional short visits (D21 supersedes mandatory default); six completed turns or selected 3/5/7 minute wall-clock limit shared by all activities when enabled | Switching activity/hero never grants more time or turns |
| D04 | English learning words/models; instructions English by default or Hindi by saved choice; Hindi meaning only on request | No automatic bilingual duplicate; 1.2s clip gaps; cancellable speech |
| D05 | Keep Kokoro neural narration: af_heart English, hf_alpha Hindi | New clips use same generation parameters; decode offline; human quality still needs review |
| D06 | All animal actions visibly move, then rest; replay and reduced-motion support | Walk/eat/sleep motions tested individually, including interruption |
| D07 | When limits are enabled: local next-day unlock; parent instant restart and day simulation retained | Offline midnight, reopen, old storage migration and same-day lock tests |
| D08 | Visible progression: 1 Meet animals, 2 Animal actions, 3 A day with my animal; freely revisit every level and older optional activities | Main chooser makes all three equally discoverable; original animated actions remain directly playable; asset existence alone is not acceptance |
| D09 | Practical communication through missions, not a chore-compliance score | Pilot targets Hello, Help me please, I want water; useful visible outcomes, gentle recovery |
| D10 | Animal-led stories: select a protagonist and replay familiar daily routines across settings; school is one chapter | Same animal wakes, gets ready, travels, meets friends and returns home; routine actions and simple language connect episodes. Core morning → school → home/bedtime delivered; additional routines remain planned |
| D11 | Completion is not mastery; parent may record needed help / comfortable / try more | Separate local mission count, checkpoint and parent observation; no speech grading |
| D12 | Preserve data and verify old cached clients on upgrades | Automatic refresh only once assets ready; active deadline/choice preserved; no loop |
| D13 | Adults and real-world conversation support learning; gestures and Hindi welcome | Quiet pauses, optional speech, parent follow-up; no forced repetition |
| D14 | Finite authored offline scenes; no live AI chat, microphone, ads, streaks, purchases or compulsory rewards | Runtime network inventory and UI audit |
| D16 | Preserve the illustrated action-game characters throughout school; outdoor classroom under a tree beside a clearly visible lake, no school building | Inspect scene without its heading; recognisable lake, picture board/books/rug, coherent characters; phone and desktop; offline artwork decode |
| D15 | Document direction, mistakes, tests, evidence and unresolved work every release | Decision/issue/check mapping in release log |
| D17 | New story development uses authored content, pure state transitions, versioned persistence, separate views and cancellable effects | Module boundaries and migrations documented in ARCHITECTURE.md; state/content/day/upgrade tests |
| D18 | Keep design, shipped state, learning guidance, development rules and authoring instructions separate; read them before work | Required-reading index docs/README.md and AGENTS.md; release evidence independent of design intent |

Earlier school pilot (preserved inside the new story): two selectable heroes (cow and rabbit), three short school episodes (greeting, ask for help opening a lunchbox, ask for water), illustration-based activity selection, Explore and Listen support, preserved earlier modes, parent observations, persistent checkpoints and shared visit limits.

Core direction now implemented: explicit three-level navigation and connected animal-led routines. Other future content: home routines, garden/picnic and lake/playground locations; puppy hero; turn-taking; two-step and retelling support. Locations are reusable settings, not compulsory level gates. Alphabet play remains optional.
Research informs design, not guarantees: ASHA 3–4 communication milestones https://www.asha.org/public/developmental-milestones/communication-milestones-3-to-4-years/ ; educational-app learning principles https://pubmed.ncbi.nlm.nih.gov/25985468/ ; AAP co-playing https://www.healthychildren.org/English/family-life/Media/Pages/watch-together.aspx ; NAEYC preschool technology https://www.naeyc.org/resources/topics/technology-and-media/preschoolers-and-kindergartners .

Direction authority: the user’s stated progression and animal-led day take precedence over the previously narrowed school pilot scope. ANIMAL_DAY_PLAN.md records the correction, supporting research, limits and acceptance criteria. Do not silently defer that core again.

Latest user clarification: the present lakeside school looks good and must be reused as a chapter of the chosen animal’s day. Preserve the existing simple action activities, original animations, voice recordings and assets. Correct the structure and continuity, not the approved scenery.

Audit clarifications (2026-09-21, no scope replacement): D02/D09 use single invitations where no useful choice exists; alternatives name the object and give contextual help. D10/D12 now preserve a bookmark for each animal and chapter. Chapter cards resume unfinished work; completed chapters replay. D11 now includes separate parent observations for each animal day. D17 retains coarse navigation position and guards asynchronous entry before visit creation. Details: AUDIT_2026_09_21.md.

D19 (2026-09-21): consistent illustrated portraits in ALL activities, direct invitation → choice → outcome flow in older modes, and humanlike routine poses with visibly held props in appropriate rooms. Preserve original natural animal action sheets and approved school. Acceptance: inspect all eight portraits in actual choice/outcome layouts, both heroes gripping brushes and seated at tables, frame changes rather than body movement alone, and room continuity. Bathing remains future authored content.

D20 (2026-09-21, user visual review): sleeping must read as tucked IN bed, not a sprite placed ON a mattress. The teacher needs visible adult/teaching cues and classmates must be present. Cow/Rabbit perform their own greeting, and school actions use attached limbs/held objects. Preserve the approved lake setting and earlier natural-action level. Acceptance requires rendered before/action/after review for both heroes and both school entry points, independently of test counts.

D21 (2026-09-21, explicit user change): disable all time/turn/session locks by default while retaining the code as an optional parent control. Existing users also default to free play; a previously completed visit must not strand them on All done. Optional limits restore the existing shared six-turn/timed/daily policy. Switching policy retains checkpoints, observations, completion counts and language. This supersedes earlier mandatory-limit language in historical records, without rewriting past release results.
