#!/usr/bin/env node
/**
 * Builds scripts/image-manifest.json from a compact scene table.
 *
 * Keeping prompts here (rather than hand-maintaining a 70-entry JSON) means the
 * shared art direction lives in exactly one place and every image inherits it.
 * After running this, use generate-images.mjs to produce the files.
 */

import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();

const RESOLUTION = "1K";

/* --------------------------- shared art direction ------------------------ */

const STYLE_STORY = [
  "Cinematic painterly digital illustration, warm realistic rendering with visible soft brush texture.",
  "Natural light, rich but restrained colour, deep shadows, shallow depth of field.",
  "Contemporary West African setting, authentic everyday clothing and interiors, dignified natural expressions.",
  "Photographic composition, 35mm lens feel, high production value, no text, no lettering, no watermarks, no brand logos.",
].join(" ");

const STYLE_FIGURE = [
  "Clean instructional diagram illustration on a very dark navy background.",
  "Flat vector shapes meeting soft realistic rendering, restrained cyan glow, generous dark margins.",
  "Any screen content is rendered only as plain abstract grey rounded bars with no letterforms whatsoever.",
  "Tutorial diagram clarity, educational poster quality, absolutely no readable words, no letters, no numbers anywhere.",
].join(" ");

/* ------------------------------ scene table ------------------------------ */

/**
 * slug -> { protagonist, setting, cover, beats: [3 scene descriptions] }
 * Scene descriptions describe only what is visible. The style prefix handles
 * medium, lighting conventions and palette.
 */
const STORY_SCENES = {
  "momo-message": {
    protagonist:
      "a young Ghanaian woman in her early twenties, natural coiled hair tied back, plain t-shirt, no accessories",
    cover:
      "She stands behind the counter of a small provisions shop, holding her phone up at chest height, brows drawn together, lips slightly parted, caught mid-reaction. Wooden shelves behind her stacked with tins and sachets. Warm amber afternoon light falls through an open doorway behind her left shoulder.",
    beats: [
      "Tight close-up of her two hands holding a smartphone, a cold blue glow spilling from the screen across her fingers and thumb. The shop counter and shelving fall away into soft warm blur behind.",
      "She leans over the counter reading the screen carefully, head tilted, eyes narrowed, morning light raking across her face. A second phone lies face-down on the counter beside a paper receipt book.",
      "A small group of young people stand close together outdoors in a neighbourhood yard, all looking down at one phone held between them, serious and intent expressions. Low warm late-afternoon sun, simple buildings behind.",
    ],
  },
  "helpful-stranger": {
    protagonist:
      "a young Ghanaian woman, university student, headwrap over braids, denim jacket, small stud earrings",
    cover:
      "She sits at a communal desktop computer in a crowded internet cafe, leaning slightly toward the screen, while a young man in a clean polo shirt leans in beside her holding his own phone, both focused on the screen. Busy cafe interior, warm overhead light, other patrons blurred behind.",
    beats: [
      "The young man holds his phone up toward her, angled so she can see it, gesturing with his other hand. She looks at it with cautious interest. Warm cafe light, blurred queue of people behind.",
      "She has drawn her hand back from her phone and is looking up at the man beside her with a guarded, doubtful expression, shoulders tense. Shallow focus, the cafe reduced to soft warm shapes.",
      "She stands and speaks to the older owner of the cafe, who listens with arms folded; other patrons turn to look. Evening light enters through a doorway behind them.",
    ],
  },
  "job-form": {
    protagonist: "a young Ghanaian man, short hair, plain t-shirt, seated at a small desk",
    cover:
      "He sits at a small desk late at night, phone in one hand and a laptop open in front of him, face lit from below by the laptop screen, eyes narrowed at the phone. Modest bedroom, a single warm desk lamp, deep surrounding darkness.",
    beats: [
      "He reads a message on his phone at the desk, brow slightly furrowed, the open laptop beside him casting cool light. Late-night desk lamp warmth in the background, dark room beyond.",
      "He stares down at his phone with a confused, unsettled expression, holding it close. The laptop screen glows beside him in the dim room, its content an indistinct blur.",
      "He sits with a friend at a desk, both leaning toward a laptop screen together, calmer expressions, daylight filling the room through a window.",
    ],
  },
  "one-password-many-doors": {
    protagonist: "a young Ghanaian man, short dreadlocks, plain white t-shirt, relaxed posture",
    cover:
      "He sits on a wooden bench outside a shared house with a laptop balanced on his knees, focused on the screen, forearms resting on the laptop edge. Warm late-afternoon daylight, simple plaster building and doorway behind.",
    beats: [
      "He types on the laptop on his lap, both hands on the keyboard, shoulders slightly hunched with concentration. Warm late-afternoon light, plain building wall behind.",
      "He has leaned forward on the bench, tense and alarmed, staring at the laptop screen. The screen content is an indistinct blur of stacked pale rectangles with no legible content.",
      "He sits back calmly on the same bench with the laptop closed beside him and a phone in his hand, relaxed posture, faint relieved expression. Warm afternoon light, leafy shadow at the edge of frame.",
    ],
  },
  "free-wifi": {
    protagonist:
      "a young Ghanaian woman in smart-casual conference clothing, lanyard and badge, shoulder bag",
    cover:
      "She sits at a long conference table with an open laptop and a phone beside her, looking up from the screen toward the room with a slightly uncertain expression. Busy hall, warm stage lighting in the background, other attendees blurred.",
    beats: [
      "A wide view of a crowded conference hall, many seated attendees with laptops, warm stage lighting spilling across the room, people talking in small groups. Faces indistinct, atmosphere of a busy event.",
      "Close-up of a hand holding a smartphone in a blurred conference hall, the screen showing only plain abstract grey rounded bars arranged like a settings list, no readable text of any kind.",
      "She smiles slightly while turning on a hotspot on her phone for a colleague leaning in beside her, both at the conference table. Warm hall light, relaxed mood.",
    ],
  },
  "locked-shop": {
    protagonist:
      "a Ghanaian woman in her late thirties, practical blouse and wrapper, a business owner, confident posture",
    cover:
      "She stands in her small printing shop, looking at a laptop screen with a serious, worried expression, one hand resting on the counter. Daylight through the storefront behind her, stacks of paper and printed materials on the counter.",
    beats: [
      "She opens an email attachment on the laptop at her shop counter, one hand on the trackpad, focused. Stacks of printed paper and a receipt book on the counter beside her, daylight from the storefront.",
      "She stares at the laptop screen with both hands raised slightly in distress, mouth open. The screen content is an indistinct blur of generic file icons with no readable labels.",
      "She calmly connects a small external hard drive to the shop laptop with a relieved expression. Bright daylight fills the shop, printed materials stacked neatly nearby.",
    ],
  },
  "premium-apk": {
    protagonist: "a young Ghanaian woman, long braided hair, patterned top",
    cover:
      "She stands outdoors in bright daylight holding her phone up at eye level, looking at it with a doubtful, narrowed expression, head slightly tilted. Simple residential buildings and greenery softly blurred behind.",
    beats: [
      "Close-up of a hand holding a smartphone outdoors, the screen showing an abstract chat thread of plain green and grey message bubbles containing only flat grey bars, no readable text of any kind.",
      "She looks down at her phone with wide, worried eyes, brows raised, held close to her face. Blurred outdoor greenery and daylight behind.",
      "A small group of young people stand outdoors looking together at one phone, relaxed and smiling, warm daylight, simple buildings behind.",
    ],
  },
  "giveaway-video": {
    protagonist: "a young Ghanaian man, short hair, hoodie, seated on a bed",
    cover:
      "He sits cross-legged on a bed in a dim dormitory room late at night, watching his phone with an intent, narrowed expression, the screen lighting his face from below. Dark room, a desk lamp glow in the far background.",
    beats: [
      "He watches a video on his phone in a dark dormitory room, the screen glow lighting his face from below, everything around him in deep shadow. Expression intent and slightly suspicious.",
      "He leans forward studying the phone screen closely with a frown, the screen light sharp on his face, the dark room reduced to blackness around him.",
      "He shows the phone to a friend sitting beside him on the bed, both looking serious, pale morning daylight entering through a window behind them.",
    ],
  },
  "brothers-voice": {
    protagonist:
      "a young Ghanaian woman, headscarf and long-sleeved top, standing in a home kitchen",
    cover:
      "She stands at a kitchen table with a phone playing on speaker in front of her, one hand raised slightly, expression concerned and uncertain. Warm evening interior light, simple kitchen cupboards and a bowl on the table.",
    beats: [
      "She stands at the kitchen table listening to her phone with one hand pressed to her forehead, brows furrowed. Warm evening kitchen light, cupboards behind.",
      "She holds her phone to her ear with one hand over her mouth, eyes closed, expression a mixture of relief and shock. Warm kitchen interior, shallow focus.",
      "She sits at the kitchen table on a phone call, smiling with relief, shoulders relaxed. Warm evening light across the table, calm domestic scene.",
    ],
  },
  "the-rumour": {
    protagonist:
      "a Ghanaian woman in her mid thirties, office attire, seated at an office desk",
    cover:
      "She sits at an office desk looking at her phone with a worried frown, brow furrowed, one hand resting on the desk. Bright office interior with daylight through windows, monitors and paperwork around her.",
    beats: [
      "She holds her phone up at an office desk, looking at the screen with concern, expression tightening. Bright office interior, daylight through windows, monitors behind.",
      "She sits at her desk using a laptop, one hand on the mouse, calm and focused, comparing something on screen. Bright office daylight, papers and a notebook on the desk.",
      "She stands and addresses a small group of colleagues in an office, clear and emphatic, one hand raised. Bright office interior, colleagues listening.",
    ],
  },
};

/* -------------------------------- builder -------------------------------- */

function buildStoryImages() {
  const images = [];
  let seed = 2000;

  for (const [slug, scene] of Object.entries(STORY_SCENES)) {
    const who = scene.protagonist;

    images.push({
      id: `story-${slug}-cover`,
      label: `${slug} — cover`,
      out: `public/stories/${slug}/cover.webp`,
      style: STYLE_STORY,
      prompt: `${who}. ${scene.cover}`,
      aspectRatio: "3:2",
      resolution: RESOLUTION,
      seed: seed++,
    });

    scene.beats.forEach((description, i) => {
      images.push({
        id: `story-${slug}-beat-${i + 1}`,
        label: `${slug} — beat ${i + 1}`,
        out: `public/stories/${slug}/beat-${i + 1}.webp`,
        style: STYLE_STORY,
        prompt: `${who}. ${description}`,
        aspectRatio: "3:2",
        resolution: RESOLUTION,
        seed: seed++,
      });
    });
  }

  return images;
}

/* ------------------------------ validation ------------------------------- */

async function validateAgainstStories(images) {
  const source = await readFile(path.join(ROOT, "src", "data", "stories.ts"), "utf8");
  const problems = [];

  for (const img of images) {
    // public/stories/<slug>/<name>.webp  ->  "/stories/<slug>/<name>.webp"
    const publicPath = img.out.replace(/^public/, "");
    if (!source.includes(publicPath)) {
      problems.push(`${img.id}: no matching path "${publicPath}" in src/data/stories.ts`);
    }
  }

  return problems;
}

/* --------------------------------- main ---------------------------------- */

const images = buildStoryImages();
const problems = await validateAgainstStories(images);

const manifest = {
  note:
    "GENERATED by scripts/build-image-manifest.mjs — do not hand-edit. " +
    "Edit the scene table in that file instead. Then run generate-images.mjs.",
  defaultModel: "google/gemini-2.5-flash-image",
  styles: { story: STYLE_STORY, figure: STYLE_FIGURE },
  images,
};

await writeFile(
  path.join(ROOT, "scripts", "image-manifest.json"),
  `${JSON.stringify(manifest, null, 2)}\n`,
  "utf8",
);

process.stdout.write(`Wrote scripts/image-manifest.json with ${images.length} story images.\n`);
if (problems.length) {
  process.stdout.write(`\n${problems.length} mismatch(es) against src/data/stories.ts:\n`);
  for (const p of problems) process.stdout.write(`  ! ${p}\n`);
  process.exitCode = 1;
} else {
  process.stdout.write("All image paths cross-check against src/data/stories.ts.\n");
}