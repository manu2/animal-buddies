# Adding a chapter or story beat
Read the required docs first. Start from a child-recognisable need or action and a small English model, not from a new setting.

1. Reuse a hero and scene from content/day.js. Give the beat a stable ID and chapter; connect `next` to another ID or null. Renaming/removing IDs needs an explicit bookmark migration.
2. For `kind: routine`, provide title, prompt, model, action, icon, choice, label, bridge. The renderer selects the action's meaningful outcome. For `kind: school`, reference an existing hello/help/water mission; its scene, props and recordings are reused.
3. Supported actions are wake, brush, eat, walk, sleep. A new action needs a renderer/effect implementation and visual review; do not invent an action string and assume it works. New scenes are assets, not new state machines.
4. Author short English and Hindi prompts/models. Record using existing Kokoro af_heart/hf_alpha parameters at build time. English models are the default outcome; instructions use only the selected language; Hindi meaning is explicit. Register clips in audio-list.json and voice-recordings.json.
5. Add assets/modules/clips to asset-list.json and bump the worker cache. Validate offline decoding, not just requests returning 200.
6. Run content validation and reducer tests. Add a meaningful behavioural case for a new transition or effect. Review full episodes at phone size and with reduced motion. Recheck the original levels.
7. Update GAME_DESIGN.md only for a real agreed design change. Update CURRENT_STATE.md for delivered content; record verification results and limits.

Example existing beat: breakfast is in morning; it offers eating, uses the original per-animal eating sprite animation and proceeds to walk-school. The same node supports Cow or Rabbit with the same language model. The changing sprite provides the animal variation. Brushing moves a visible toothbrush at the animal's mouth; it does not count motion frames as progress.

All chapters remain accessible. Don't make an incorrect guess a punishment or require perfect speech to advance. Do not introduce arbitrary goals or new rewards to justify a new chapter.


Build helpers (no runtime server): `node scripts/sync-assets.mjs` refreshes the cache/recording inventory while preserving older assets. Then `npm test` validates it. Bump sw.js when publishing runtime changes.

`python scripts/generate_audio.py content/day-audio-source.json OUTPUT --model-cache MODEL_CACHE` generates offline recordings and a resumable report with the same af_heart/hf_alpha voices and speed 0.9. It needs the existing Kokoro/PyTorch/soundfile/espeak Python environment and macOS afconvert; dependency/model installation is not bundled with the game. It defaults to cached/offline models. Review clips, copy chosen m4a files into audio/, merge report entries into voice-recordings.json, and refresh the inventory. Never ship credentials or the model as game assets. The initial local setup lives in the sibling animal-buddies/.voice-env and .voice-models directories on the development machine.

Audit rules: a routine may offer a single invitation; if it offers an alternative, give it relevant picture content and contextual retryFor text/recording in both languages. Bed scenes use morning/night companions; original home/classroom remain shared assets. Chapter selection resumes a bookmark; finishing and replaying a chapter must preserve other chapters and the shared budget. Add browser checks for source/destination and pre-/post-action props.

## Rooms and physical routines
Choose a room from `content/rooms.js` for every routine node; set `from` for travel. Content validation rejects unknown rooms. Preserve stable node IDs when changing staging. Brushing uses the bathroom and a held-brush pose; breakfast uses dining and a seated table pose. New actions need their own authored node, meaningful tap outcome, recorded prompts and verification; an illustrated tub does not constitute a bathing mission. Keep original natural animal action sheets intact. Add poses to a separate routine atlas and inspect BOTH rows in the rendered scene. Every atlas portrait must clip its own cell inside wide and square layouts.
