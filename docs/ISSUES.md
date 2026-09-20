# Issue and regression history
Keep resolved issues here; removal loses the reason for the regression.

| ID | Observed problem | Cause / fix | Required regression |
|---|---|---|---|
| I01 | Original host required OpenAI authentication | Moved to public GitHub Pages | Signed-out public URL; no auth redirects |
| I02 | English/Hindi played rapidly back-to-back | Mixed automatic queues; now selected instruction language, separate meaning button, pauses | Both languages, every mode, retry/reward/goodbye, cancellation |
| I03 | System narration sounded mechanical | Replaced macOS voices with recorded Kokoro voices | Same voices for new content; offline decode; human listening recorded separately |
| I04 | Actions looked static | Added bounded pose and body motion for all three actions | Walk/eat/sleep visible movement, stop/replay/reduced-motion |
| I05 | Finished visits never unlocked the next day | Added local-day session renewal and legacy date recovery | Midnight/reopen/old state; same-day stays locked |
| I06 | Testing required repeated parent steps/waiting | Added instant restart and simulate-next-day buttons | Both buttons in parent gate, no phone-clock change |
| I07 | Open tab stayed on obsolete All done screen after releases | New worker cached assets but old page kept executing; activation now refreshes entry clients | Upgrade a real older SW cache, not only fresh browser |
| I08 | First upgrade fix stalled navigation | Awaiting client.navigate inside activation blocked new page; initiate navigation without awaiting it | Upgrade completes once; no reload loop; active state preserved |
| I09 | Expansion risk: earlier activities disappear or switching bypasses timer | Release invariant: permanent illustrated activity access; one visit budget | Switch repeatedly, reload, expire, complete six across modes |
| I10 | Task completion could be mistaken for language mastery | Store completion separately from optional parent observation | No tap-based mastery label or forced graduation |
| I11 | Completed static choice could be forgotten on reload before Next | Persist pendingTurn; restore reward screen; consume on switch exactly once | Pilot mixed-mode reload and turn-count test |
| I12 | Initial pilot help button used a human icon while teacher was a dog | Replace it with the same dog illustration as the scene | Visual correspondence audit |
| T01 | First pilot run stopped at parent arithmetic helper | Test regex lost an escape during file creation; fixed to explicit digits | Rerun full pilot; this was a test-harness failure, not a game failure |
| I13 | Desktop scene placed the teacher visually in the lake | Moved the decorative water behind the grass foreground | Re-rendered scene: teacher and hero remain on land |
| I14 | After the pilot update, the user still saw All done in the actual side-panel tab | Current UI was loaded; a completed visit was retained. Used existing parent Restart visit now, then opened Lakeside School. Immediate blockage resolved; restart discoverability remains a UX follow-up. | Release handoff must inspect the user-visible starting screen; distinguish preserved same-day limit from stale code, and leave parent-requested testing at the lobby without starting its timer. |
| I15 | User found school animals less friendly than the previous version and could not recognise the lakeside school | Reuse original illustrated cow/rabbit/dog instead of icon animals; replace building with illustrated open-air lakeside classroom, show setting in lobby and library too | Human visual review at phone size without relying on title; scene/choices share same characters; new artwork decodes offline |
| I16 | User found earlier levels displaced and school-centric missions unrelated to the child’s day | Corrected locally: equal visible levels, preserved actions, and per-character morning/school/home storyline. Direction review now separate from technical checks; further roadmap routines are explicitly listed in CURRENT_STATE.md | Independently verify visible three-level progression, actual original action replay, persistent animal protagonist, connected familiar routines and real-world parent bridge; technical pass cannot close this issue |
| I17 | Switching from a names group containing Fish to action play could select an animal with no action sprite | Preserve deadline/round but use supported cow/dog/rabbit targets when entering action play | Names-to-actions browser test checks valid sprite targets and unchanged deadline |
| T02 | Local narration encoding reported AAC unavailable in sandbox | Same afconvert command works with normal host codec access; regenerated all 30 clips with original Kokoro voices | 227 clips decode offline; no runtime voice substitution |
| T03 | Initial screenshot captured school before the dog CSS sprite had decoded | Visual capture now decodes all visible image/background assets before capture | Inspect final phone and desktop composites with both hero and teacher present |
