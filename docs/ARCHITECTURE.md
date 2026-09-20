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
Schema version 3 preserves curriculumVersion 3 and the old fields: settings, mode, session, school, progress. New `journey` contains hero, support, per-hero bookmarks `{node, phase, counted, finished}` and per-hero/per-node completion counts. The chosen hero persists across chapters. Selecting another hero restores that hero's bookmark. Each hero also has a chapters map of saved bookmarks. Selecting a chapter resumes unfinished work; completed chapters start again. Crossing a chapter boundary marks its archived bookmark finished and resumes unfinished saved work in the next chapter when present. Explicit internal CHAPTER without resume remains a replay/reset event; the child chapter cards pass resume:true. No selection resets visit time. Completion counts are practice only.

Session stores local date, status, turn count and absolute deadline. School's old checkpoint/progress remains separate and readable. A migration adds missing journey state without deleting any old activity. Earlier schemas are backed up as animal-buddies-v1-backup and version-specific backup-vN keys. Failed backup writes retain the valid loaded state. Malformed raw input is saved in invalid-backup before recovery writes; if that preservation fails, disk writes are disabled. Schema 2 bookmarks seed their current chapter automatically.

The coarse session.view (levels/day-lobby/school-lobby/game) is saved so reload respects navigation. Audio buffers/sources, animation handles, highlighted examples and cancellation tokens are temporary. They are not serialized. Reload reconstructs a saved prompt/outcome; narration resumes only on interaction rather than assuming browser autoplay permission.

## Event flow
UI input → controller → host synchronises legacy fields → store dispatches pure journey reducer → atomic JSON snapshot → render → optional cancellable effects.

HERO changes protagonist after settling a pending outcome. SUPPORT changes scaffolding. CHAPTER selects a stable starting node or resumes its archived chapter checkpoint. ACT validates the currently offered choice, changes phase and records completion only on entry to outcome. NEXT settles exactly once and advances. SETTLE consumes a pending outcome on navigation/stop. Duplicate ACT at outcome and NEXT at choose do nothing. Expired/inactive visits reject play events.

An outcome is saved before animation begins so interruption cannot lose progress. Its counted receipt prevents double use after reload. NEXT saves the following node before the shared limit is checked: after the sixth turn, tomorrow can start from that next node. Effects never mutate progress.

This is a local single-device save, not cross-device sync. Concurrent independent tabs are not a supported multiplayer/session coordination model. Physical iPhone/Android storage and audio behaviour still require separate device validation.
