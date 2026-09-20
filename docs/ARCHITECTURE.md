# Runtime and state architecture

## Module boundaries
- `content/day.js`: characters, chapters, stable node IDs, choices and clip selection. No DOM/storage.
- `engine/journey.js`: normalised per-hero bookmarks and pure event reducer. Phases: choose → help (school only) → outcome. Routine beats go choose → outcome.
- `engine/save-store.js`: single localStorage writer, schema validation/migration/backup, snapshots and dispatch. Retains the existing storage key for compatibility.
- `engine/day-controller.js`: coordinates input, rendering and cancellable effects through injected host services. It cannot directly write localStorage.
- `ui/day-view.js` + `day.css`: story/lobby markup and scene composition. Original sprites and classroom are reused.
- `ui/parent-view.js`: day practice and independent parent observation markup.
- `school.js`: existing authored school content, scene and props, shared with the day story.
- `app.js`: browser host and compatibility adapter for original activities, parent controls, audio, animation and offline readiness. Legacy activity handlers still use their established local variables and commit them through the store. They have NOT all been rewritten as pure reducers; future work must avoid spreading this compatibility style into new story code.
- `sw.js`, `asset-list.json`, `audio-list.json`: versioned offline cache and complete authored-asset inventory.

## Saved versus temporary state
Schema version 4 preserves curriculumVersion 3 and the old fields: settings, mode, session, school, progress. New `journey` contains hero, support, per-hero bookmarks `{node, phase, counted, finished}` and per-hero/per-node completion counts. The chosen hero persists across chapters. Selecting another hero restores that hero's bookmark. Each hero also has a chapters map of saved bookmarks. Selecting a chapter resumes unfinished work; completed chapters start again. Crossing a chapter boundary marks its archived bookmark finished and resumes unfinished saved work in the next chapter when present. Explicit internal CHAPTER without resume remains a replay/reset event; the child chapter cards pass resume:true. No selection resets visit time. Completion counts are practice only.

Session stores local date, status, turn count and absolute deadline. School's old checkpoint/progress remains separate and readable. A migration adds missing journey state without deleting any old activity. Earlier schemas are backed up as animal-buddies-v1-backup and version-specific backup-vN keys. Failed backup writes retain the valid loaded state. Malformed raw input is saved in invalid-backup before recovery writes; if that preservation fails, disk writes are disabled. Schema 2 bookmarks seed their current chapter automatically.

The coarse session.view (levels/day-lobby/school-lobby/game) is saved so reload respects navigation. Audio buffers/sources, animation handles, highlighted examples and cancellation tokens are temporary. They are not serialized. Reload reconstructs a saved prompt/outcome; narration resumes only on interaction rather than assuming browser autoplay permission.

## Event flow
UI input → controller → host synchronises legacy fields → store dispatches pure journey reducer → atomic JSON snapshot → render → optional cancellable effects.

HERO changes protagonist after settling a pending outcome. SUPPORT changes scaffolding. CHAPTER selects a stable starting node or resumes its archived chapter checkpoint. ACT validates the currently offered choice, changes phase and records completion only on entry to outcome. NEXT settles exactly once and advances. SETTLE consumes a pending outcome on navigation/stop. Duplicate ACT at outcome and NEXT at choose do nothing. Expired/inactive visits reject play events.

An outcome is saved before animation begins so interruption cannot lose progress. Its counted receipt prevents double use after reload. NEXT saves the following node before the shared limit is checked: after the sixth turn, tomorrow can start from that next node. Effects never mutate progress.

This is a local single-device save, not cross-device sync. Concurrent independent tabs are not a supported multiplayer/session coordination model. Physical iPhone/Android storage and audio behaviour still require separate device validation.

## Shared portraits and room-based staging (worker v12)
`ui/animal-view.js` owns illustrated atlas viewports and routine sprite markup. Each portrait has an inner SVG clipping viewport so letterboxing cannot reveal neighbouring animals. `ui/familiar-view.js` renders older name/sentence/letter prompt/outcome states; established handlers retain their persistence adapter. Optional `session.pictureChoice={key,values}` preserves choice locations across reload; validation rejects mismatched/invalid choices. Existing pending-turn receipts and schema 3 remain unchanged. `content/rooms.js` defines reusable backgrounds; authored routine nodes reference `room`, travel also references `from`. Story IDs/checkpoints do not depend on rooms, so art changes do not migrate progress. Separate routine atlases preserve the original natural-action sheets. Sprite animation uses per-keyframe step easing; overall linear timing is essential to visit intermediate poses. Effects remain finite and cancellable.

## Physical scene presentation (worker v13)
`bedroomScene` in ui/day-view.js renders two authored full-scene frames: awake→tucked asleep at night, asleep→own-paw greeting in morning. Pillow/quilt/animal overlap is part of the artwork, not guessed CSS offsets. The outcome frame is the persisted phase's default; the finite crossfade is only a cancellable effect. No new saved state/schema or node IDs. `classroomSprite` and `drinkingSprite` in ui/animal-view.js render role/held-prop atlases; `schoolIcon` and `schoolScene` share that identity between day and standalone practice. `animateSchoolScene` is used by both hosts, so wave/sip effects cannot drift between modes. Props no longer impersonate actors. Scene attributes use `data-scene-*`, `data-actor-hero`, `data-drink-hero`; interaction selectors belong to buttons.

## Optional visit policy (worker v14 / schema 4)
settings.limitsEnabled defaults to false and accepts only true as explicit opt-in. visitExpired takes settings so UI and journey reducer share enforcement. Free-play round counters can exceed six; legacy targets/story choices use round modulo six, and the save validator permits nonnegative safe integers. Time/six-turn budget displays are hidden, Finish returns to Levels, and wall-clock/day rollover does not interrupt free play. A migrated ended visit is cleared at startup only when limits are off; journey/school/progress/settings remain. Active saves retain their original deadline and receipts; that deadline is simply unenforced in free play. Policy changes settle outcomes using existing receipts, clear only the active visit, persist the preference and show Levels. Enabling therefore starts a fresh limit at next play. Schema-3 raw saves receive a versioned backup. Existing future-schema protection remains.
