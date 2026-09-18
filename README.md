# Animal Buddies

A calm English/Hindi animal learning game with offline audio and picture choices.

Play: https://manu2.github.io/animal-buddies/

No sign-in is required. Add the game to the phone home screen, open the new icon online, and wait for Ready for offline play. After that it works offline, including the recordings.

This repository contains only the public static game files. Animal artwork: OpenMoji, CC BY-SA 4.0; see credits.txt.


## Animal stories
Default activity: two animated picture choices, cow/dog/rabbit walking, eating or sleeping. Both choices are valid. Recorded English sentences and optional Hindi support work offline. No microphone or speech recognition. Each animation stops after a short demonstration. Parent models language without requiring repetition. Six turns or the selected time limit; previous session deadlines survive updates. Artwork prompts: ARTWORK.md.


Spoken instructions default to English; parents can select Hindi even during a visit. English learning words and model sentences remain English. The अर्थ button plays only the Hindi meaning. Audio clips have 1.2-second gaps; story questions follow the model after a 1.8-second pause. Navigation says “Tap the yellow button”; Hindi uses a natural equivalent. Speech retains pauses between prompts.


## Motion and voice update
Walking alternates poses with travel and a stepping bounce (3.6 seconds); eating alternates dipping poses (3.6 seconds); sleeping combines two resting poses with a breathing motion (4.2 seconds). Motion stops, is cancellable, can be replayed, and is skipped when reduced motion is requested.

Narration is pre-rendered with Kokoro-82M (English af_heart, Hindi hf_alpha, speed 0.9), replacing the macOS voices. The phone downloads AAC recordings only; no model, API key or inference server is needed. Model and voice documentation: https://huggingface.co/hexgrad/Kokoro-82M and https://huggingface.co/hexgrad/Kokoro-82M/blob/main/VOICES.md. These are synthetic voices, not a human narrator.
