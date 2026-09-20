# Lakeside classroom artwork

## Home setting added 2026-09-21

Built-in image generation; final asset `scenes/animal-home-v1.png`. Existing sprites and school backdrop remain unchanged. Exact generation prompt:

Use case: illustration-story. Asset type: offline preschool animal game background, landscape 1536x1024. Draw a warm cosy animal friend's home in the exact gentle painted cartoon storybook style of our existing lakeside classroom. Empty of characters; game layers our cow/rabbit sprites over it. A softly rounded wooden bed with a peach blanket and cream pillow sits at far left, morning sun through a large rounded window in upper middle, tiny book shelf upper right, a small child-height washstand with basin, a little toothbrush cup and towel at far right. Big uncluttered pale honey floor and a round sage woven rug in lower center covering bottom half leave plenty of open space for one large animal character. A few everyday objects, coherent friendly shapes, calm warm morning lighting, readable on a small phone. No writing, no letters, no UI, no animals, no people, no watermarks. Full bleed. Trees visible outside window. Warm teal sage peach wood palette. Background should communicate a familiar morning routine without needing text, match polished children's book illustration, not geometric placeholder art.

## Original classroom

Generated with the built-in image generation tool, 2026-09-20. Final backdrop: `scenes/lakeside-classroom-v2.png`. Original `stories/cow.png`, `stories/rabbit.png`, and `stories/dog.png` were style references and are reused directly as CSS sprite frames for the actual characters. No runtime image-generation service is required.

## Exact prompt

Use case: illustration-story. Asset type: finished background artwork for a calm toddler game, landscape 1536x1024. Create a beautiful friendly outdoor lakeside classroom, absolutely NO SCHOOL BUILDING, no buildings at all, no words, no letters, no logos, no animals or people (characters are composited by the app). STYLE REFERENCE: the attached animal sprite sheets, use only their warm hand-drawn picture-book cartoon style, soft painted color shading and rounded charcoal outlines; do not include the sheets or any of their animals. Composition: broad quiet blue-turquoise LAKE very clearly visible across the middle background, distant rolling green hills, a few large water lilies near the far right bank. Upper left a friendly spreading leafy tree shades an OPEN AIR CLASSROOM on dry pale green grass in the foreground. A small wooden easel blackboard at upper left foreground with only a simple chalk drawing of a sun and flower (no writing), a low book basket beside it, two little round empty pastel cushions arranged near the sides of a large warm peach woven oval story rug in the lower center. The rug is an open unobstructed playing area: keep the lower middle 65 percent width very clean, so large cow/rabbit at lower left and dog teacher at lower right will be readable. A small curved line of smooth stepping stones separates the dry classroom lawn from the lake, water stays entirely in middle/background. Warm morning light, inviting preschool picture book, generous simple forms readable on a small phone, polished depth and cohesive drawing, calm teal sage butter yellow peach palette. Avoid photorealism, texture noise, busy decorations, pennants, grids, UI, text, borders, buildings, animals, humans. Full bleed artwork.

## Routine staging audit — 2026-09-21
Built-in image-generation tool; companion images saved non-destructively. Existing home/classroom and all character sprites preserved. No model or generation API runs in the game.

- `scenes/animal-bedtime-v1.png`: generated from `scenes/animal-home-v1.png`, output exec-74bbdc14-4c0a-4ed2-89ba-4a3ed479b68e.png.
- `scenes/animal-morning-v1.png`: generated from the bedtime companion, output exec-a41eaff0-114a-4a18-86b4-879be84b2998.png.

Bedtime exact prompt:

Use case: precise-object-edit. Asset type: 1536x1024 background for a calm toddler animal story. Input image is the existing daytime bedroom: preserve its cozy painted children's storybook style, peach floral quilt, green wood, arched window and washstand. Create a companion BEDTIME close-up of this same room. Night outside the window with a crescent moon and a few stars, no sun/daylight; gentle warm bedside light, calm and clearly readable not dark or spooky. Reframe the existing wooden bed into the central foreground: broad horizontal mattress surface from x20% to x80%, top surface at y65%-79%; pillow at left, low wooden headboard at far left, peach floral quilt neatly spread. Enough clear empty space above the mattress in the central half of the composition for us to overlay a sleeping animal sprite. No animal or person rendered in the image. ONE bed only, no duplicate bed in background. Keep familiar window behind it and washstand on right as room continuity. No words, letters, logos, border or UI.

Morning exact prompt:

Use case: lighting-weather. Edit this bedtime bedroom into the matching GOOD MORNING view for a toddler story. Keep exactly the same room composition, large foreground bed, peach floral quilt, pillow, headboard, window, washstand, plants and painted storybook style. Change only time-of-day lighting: blue sunny morning outdoors, green leaves, warm daylight; replace crescent moon with soft morning sun, remove stars. Bedside lamp off. Leave bed empty for a separate animal sprite, no animals or people, no text or UI. Same landscape 1536x1024.

Reviewed in the rendered phone/desktop composites: sleeping animal rests on the quilt, one bed, recognisable matching window/washstand, distinct sun versus moon. These are background companions; animals remain separate original sprites.
