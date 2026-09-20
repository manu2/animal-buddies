# Runtime and state architecture

## Module boundaries
- `content/day.js`: characters, chapters, stable node IDs, choices and clip selection. No DOM/storage.
- `engine/journey.js`: normalised per-hero bookmarks and pure event reducer. Phases: choose → help (school only) → outcome. Routine beats go choose → outcome.
- `engine/save-store.js`: single localStorage writer, schema validation/migration/backup, snapshots and dispatch. Retains the existing storage key for compatibility.
- `engine/day-controller.js`: coordinates input, rendering and cancellable effects through injected host services. It cannot directly write localStorage.
- `ui/day-view.js` + `day.css`: story/lobby markup and scene composition. Original sprites and classroom are reused.
- `school.js`: existing authored school content, scene and props, shared with the day story.
- `app.js`: browser host and compatibility adapter for original activities, parent controls, audio, animation and offline readiness. Legacy activity handlers still use their established local variables and commit them through the store. They have NOT all been rewritten as pure reducers; future work must avoid spreading this compatibility style into new story code.
- `sw.js`, `asset-list.json`, `audio-list.json`: versioned offline cache and complete authored-asset inventory.

## Saved versus temporary state
Schema version 2 preserves curriculumVersion 3 and the old fields: settings, mode, session, school, progress. New `journey` contains hero, support, per-hero bookmarks `{node, phase, counted, finished}` and per-hero/per-node completion counts. The chosen hero persists across chapters. Selecting another hero restores that hero's bookmark. Selecting a chapter deliberately starts that chapter; it never resets visit time. Completion counts are practice only.

Session stores local date, status, turn count and absolute deadline. School's old checkpoint/progress remains separate and readable. A migration adds missing journey state without deleting any old activity. Pre-schema saves are backed up once as animal-buddies-v1-backup.

Current screen, audio buffers/sources, animation handles, highlighted examples and cancellation tokens are temporary. They are not serialized. Reload reconstructs a saved prompt/outcome; narration resumes only on interaction rather than assuming browser autoplay permission.

## Event flow
UI input → controller → host synchronises legacy fields → store dispatches pure journey reducer → atomic JSON snapshot → render → optional cancellable effects.

HERO changes protagonist after settling a pending outcome. SUPPORT changes scaffolding. CHAPTER selects a stable starting node. ACT validates the currently offered choice, changes phase and records completion only on entry to outcome. NEXT settles exactly once and advances. SETTLE consumes a pending outcome on navigation/stop. Duplicate ACT at outcome and NEXT at choose do nothing. Expired/inactive visits reject play events.

An outcome is saved before animation begins so interruption cannot lose progress. Its counted receipt prevents double use after reload. NEXT saves the following node before the shared limit is checked: after the sixth turn, tomorrow can start from that next node. Effects never mutate progress.

This is a local single-device save, not cross-device sync. Concurrent independent tabs are not a supported multiplayer/session coordination model. Physical iPhone/Android storage and audio behaviour still require separate device validation.
