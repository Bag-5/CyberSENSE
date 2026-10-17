# Course Art — Prompt Sheet (30 images)

Paste each prompt into Gemini image generation, one at a time. Save the
download to the `inbox/` folder in this repo (any filename), then run:

```
node scripts/import-art.mjs
```

The importer matches files to these prompts by order and filename, moves them
into `public/courses/`, trims letterbox bars, and converts to WebP.

## Notes for the generator

- **Aspect ratio:** heroes are 16:9, figures are 4:3. Ask Gemini for the ratio explicitly.
- **Resolution:** 1K is plenty. These display at most ~1000px wide.
- **No lettering:** the models cannot render text reliably. The prompts below
  demand abstract placeholder bars instead, and all real labels are drawn in
  the page component afterwards. Reject any image containing invented words.
- **Letterbox bars:** ask for full-bleed. If black bands appear, the importer
  trims them automatically.
- Blank output is fine to skip — just leave that file out of `inbox/`.

---

## 01. `course-phishing-hero`

- **Save as:** `hero.webp`
- **Ratio:** 16:9
- **Where:** `public/courses/phishing/hero.webp`

```
A luminous fishing hook made of glowing cyan wire descends through deep navy darkness toward a bright rectangular phone screen lying flat, its screen blooming cyan. Fine magenta and cyan circuit traces radiate outward from the phone across the floor into the darkness. Subject placed centre-right, entire left half empty dark space.
```

---

## 02. `course-phishing-figure-1`

- **Save as:** `figure-1.webp`
- **Ratio:** 4:3
- **Where:** `public/courses/phishing/figure-1.webp`

```
A modern smartphone shown straight-on from the front, centred, displaying a single notification bubble filled with plain grey placeholder bars. Two thin amber arrows point at the sender line and at the message body. A small amber circle highlights a generic link button shape. Empty dark space either side.
```

---

## 03. `course-phishing-figure-2`

- **Save as:** `figure-2.webp`
- **Ratio:** 4:3
- **Where:** `public/courses/phishing/figure-2.webp`

```
A generic web browser window shown flat and centred with a visible address bar at the top containing only a grey placeholder bar. One part of the address is circled by a thin amber ring, with an amber arrow pointing at the circled segment. A second smaller browser window overlaps behind it with a slightly different placeholder address, also circled. No other interface detail.
```

---

## 04. `course-social-engineering-hero`

- **Save as:** `hero.webp`
- **Ratio:** 16:9
- **Where:** `public/courses/social-engineering/hero.webp`

```
A stylised human silhouette rendered as glowing cyan wireframe stands at centre-right, one hand raised as if mid-gesture. Around it, concentric rings of faint magenta light pulse outward like pressure waves. An empty speech-bubble outline floats nearby, deliberately blank. Left half of the frame is empty dark space.
```

---

## 05. `course-social-engineering-figure-1`

- **Save as:** `figure-1.webp`
- **Ratio:** 4:3
- **Where:** `public/courses/social-engineering/figure-1.webp`

```
Two human silhouettes facing each other in profile, rendered as flat cyan wireframe outlines on a dark navy background. Between them a vertical stack of blank rounded speech-bubble outlines of decreasing size, the top one highlighted with a thin amber ring. An amber arrow points at the highlighted bubble. Abstract and anonymous, no facial detail.
```

---

## 06. `course-social-engineering-figure-2`

- **Save as:** `figure-2.webp`
- **Ratio:** 4:3
- **Where:** `public/courses/social-engineering/figure-2.webp`

```
A single cyan wireframe silhouette at centre-right with four thin amber arrows converging on it from the corners of the frame. At each arrow's tail sits a plain dark rounded label tag containing only flat grey placeholder bars. The figure is emphasised by a soft cyan halo. Left side left empty.
```

---

## 07. `course-malware-hero`

- **Save as:** `hero.webp`
- **Ratio:** 16:9
- **Where:** `public/courses/malware/hero.webp`

```
A dense crystalline mass of dark metallic shards hovers at centre-right, shot through with glowing magenta veins, each shard catching a cold cyan rim light. It casts a corrupted glow onto the dark floor below, where fragmented geometric shapes scatter outward. Volumetric haze. Left half of the frame empty dark space.
```

---

## 08. `course-malware-figure-1`

- **Save as:** `figure-1.webp`
- **Ratio:** 4:3
- **Where:** `public/courses/malware/figure-1.webp`

```
A generic desktop monitor shown straight-on from the front, centred, its screen filled with an abstract cluster of small overlapping geometric shapes in cyan and magenta suggesting disorder. Two amber arrows point at the screen and at a row of simple abstract square icons beneath it. No readable text.
```

---

## 09. `course-malware-figure-2`

- **Save as:** `figure-2.webp`
- **Ratio:** 4:3
- **Where:** `public/courses/malware/figure-2.webp`

```
A vertical arrangement of four simple rounded panels connected by a downward arrow, representing files being locked in sequence. The top two panels are cyan and intact, the lower two are magenta with a diagonal slash across them. A single amber arrow points at the final panel. Flat vector diagram, dark navy background.
```

---

## 10. `course-password-attacks-hero`

- **Save as:** `hero.webp`
- **Ratio:** 16:9
- **Where:** `public/courses/password-attacks/hero.webp`

```
A vast lattice of glowing cyan key shapes stretches into deep navy darkness, receding in perspective toward a vanishing point. Each key is identical. At centre-right a single key is cracked and split in two with magenta light bleeding from the fracture. Left half of the frame empty dark space.
```

---

## 11. `course-password-attacks-figure-1`

- **Save as:** `figure-1.webp`
- **Ratio:** 4:3
- **Where:** `public/courses/password-attacks/figure-1.webp`

```
Four identical cyan key shapes arranged in a row on a dark navy background, connected by a thin glowing line running through all of them, implying one key opening many doors. A single amber arrow points down at the shared line from above. Flat geometric diagram, generous margins.
```

---

## 12. `course-password-attacks-figure-2`

- **Save as:** `figure-2.webp`
- **Ratio:** 4:3
- **Where:** `public/courses/password-attacks/figure-2.webp`

```
A simple abstract padlock outline at centre drawn in glowing cyan wireframe. Around it a ring of faint magenta dots suggests automated attempts closing in. One amber arrow points at the padlock's keyhole from the upper right. Dark navy background, uncluttered.
```

---

## 13. `course-public-wi-fi-attacks-hero`

- **Save as:** `hero.webp`
- **Ratio:** 16:9
- **Where:** `public/courses/public-wi-fi-attacks/hero.webp`

```
Three concentric cyan wireless signal rings radiate outward at centre-right from a small glowing node, washing over deep navy darkness. Within the rings a faint wireframe silhouette of a laptop sits unattended, and one ring extends beyond it toward the dark empty left side. Volumetric haze and drifting particles.
```

---

## 14. `course-public-wi-fi-attacks-figure-1`

- **Save as:** `figure-1.webp`
- **Ratio:** 4:3
- **Where:** `public/courses/public-wi-fi-attacks/figure-1.webp`

```
Two identical rounded rectangular wifi signal icons shown side by side at centre, each emitting concentric rings. They differ only subtly, one carrying a single small extra dot beside it. A thin amber ring encircles the near-identical detail and an amber arrow points at it. Dark navy background, flat vector diagram.
```

---

## 15. `course-public-wi-fi-attacks-figure-2`

- **Save as:** `figure-2.webp`
- **Ratio:** 4:3
- **Where:** `public/courses/public-wi-fi-attacks/figure-2.webp`

```
A single cyan wifi node emitting rings at centre-left, with a small cluster of abstract packet shapes drifting along one ring toward a simplified wireframe laptop on the right. Two amber arrows mark the drifting shapes. Deep navy background, clean and uncluttered.
```

---

## 16. `course-ransomware-hero`

- **Save as:** `hero.webp`
- **Ratio:** 16:9
- **Where:** `public/courses/ransomware/hero.webp`

```
A heavy geometric padlock, half cyan and half magenta, hangs at centre-right from a chain of dark links. One chain link has snapped and glows magenta at the break. Files rendered as small stacked geometric slabs are locked behind it, dimmed. Deep navy darkness. Left half of the frame empty space.
```

---

## 17. `course-ransomware-figure-1`

- **Save as:** `figure-1.webp`
- **Ratio:** 4:3
- **Where:** `public/courses/ransomware/figure-1.webp`

```
A simple grid of identical small rectangular slabs representing files, arranged in rows. The top rows are cyan and evenly spaced; the lower rows are magenta, tilted at irregular angles. A thin amber arrow sweeps from the intact rows to the broken ones. Flat vector diagram on dark navy.
```

---

## 18. `course-ransomware-figure-2`

- **Save as:** `figure-2.webp`
- **Ratio:** 4:3
- **Where:** `public/courses/ransomware/figure-2.webp`

```
A simple abstract cylinder database shape at centre-left connected by a thin line to a small rounded rectangle representing a separate drive at centre-right, deliberately disconnected from any cloud shape. A thin amber ring highlights the separate drive. Dark navy background, clean diagram.
```

---

## 19. `course-fake-apps-scams-hero`

- **Save as:** `hero.webp`
- **Ratio:** 16:9
- **Where:** `public/courses/fake-apps-scams/hero.webp`

```
Two identical rounded-square app icons float side by side at centre-right against deep navy darkness. The left one glows clean cyan with a simple geometric glyph. The right one glows dirty magenta with a subtly distorted glyph and hairline cracks around its edge. Left half of the frame empty dark space.
```

---

## 20. `course-fake-apps-scams-figure-1`

- **Save as:** `figure-1.webp`
- **Ratio:** 4:3
- **Where:** `public/courses/fake-apps-scams/figure-1.webp`

```
A generic smartphone shown straight-on from the front, centred, with a stack of four simple permission toggle shapes rising beside it. One toggle is highlighted magenta and ringed with amber, an arrow pointing at it. No readable labels anywhere, only abstract toggle shapes.
```

---

## 21. `course-fake-apps-scams-figure-2`

- **Save as:** `figure-2.webp`
- **Ratio:** 4:3
- **Where:** `public/courses/fake-apps-scams/figure-2.webp`

```
Two identical abstract app-store badge shapes side by side at centre, one cyan and one magenta. A thin amber line connects them and a small amber warning triangle sits between them. Flat vector diagram, dark navy background, generous margins.
```

---

## 22. `course-deepfakes-hero`

- **Save as:** `hero.webp`
- **Ratio:** 16:9
- **Where:** `public/courses/deepfakes/hero.webp`

```
A large human face rendered as a luminous cyan wireframe mesh at centre-right, its surface visibly fragmenting away into scattered polygonal shards drifting into deep navy darkness. One region of the face has already dissolved into magenta particles. Left half of the frame empty dark space.
```

---

## 23. `course-deepfakes-figure-1`

- **Save as:** `figure-1.webp`
- **Ratio:** 4:3
- **Where:** `public/courses/deepfakes/figure-1.webp`

```
A simplified human face outline in cyan wireframe at centre, with three thin amber arrows pointing at three specific regions: the jaw edge, the eye area, and the hairline. Small dark circular magnifier outlines sit over each targeted region. Dark navy background, clean diagram, no readable text.
```

---

## 24. `course-deepfakes-figure-2`

- **Save as:** `figure-2.webp`
- **Ratio:** 4:3
- **Where:** `public/courses/deepfakes/figure-2.webp`

```
A generic video player interface shown flat and centred with a play triangle, and a timeline bar beneath. One frame on the timeline is ringed in magenta and enlarged into a floating panel above showing an abstract face wireframe with mismatched edges. Amber arrow connects the two. No readable text.
```

---

## 25. `course-voice-cloning-scams-hero`

- **Save as:** `hero.webp`
- **Ratio:** 16:9
- **Where:** `public/courses/voice-cloning-scams/hero.webp`

```
A stylised head silhouette at centre-right rendered as a dense grid of glowing cyan dots, several of which detach and drift leftward into deep navy darkness as magenta particles. A jagged waveform of thin cyan lines runs behind the head, breaking apart as it travels left. Left half empty dark space.
```

---

## 26. `course-voice-cloning-scams-figure-1`

- **Save as:** `figure-1.webp`
- **Ratio:** 4:3
- **Where:** `public/courses/voice-cloning-scams/figure-1.webp`

```
A horizontal jagged waveform drawn in thin cyan lines across the centre of the frame, with the left third rendered in solid magenta and the right two thirds in cyan, separated by a visible seam. Two amber arrows point inward at the seam from above and below. Dark navy background.
```

---

## 27. `course-voice-cloning-scams-figure-2`

- **Save as:** `figure-2.webp`
- **Ratio:** 4:3
- **Where:** `public/courses/voice-cloning-scams/figure-2.webp`

```
A simple sequence of four generic rounded panels arranged left to right, connected by thin arrows, representing a call attempt. The first three are cyan; the fourth is magenta and has a small amber verification-phrase symbol beside it. Flat vector diagram, dark navy background.
```

---

## 28. `course-ai-misinformation-hero`

- **Save as:** `hero.webp`
- **Ratio:** 16:9
- **Where:** `public/courses/ai-misinformation/hero.webp`

```
A dense swarm of small glowing cyan geometric fragments streams through deep navy darkness at centre-right, assembling and disassembling endlessly into shapes that almost resolve into a face before dissolving again. A few fragments glow magenta. Left half of the frame empty dark space. Volumetric haze.
```

---

## 29. `course-ai-misinformation-figure-1`

- **Save as:** `figure-1.webp`
- **Ratio:** 4:3
- **Where:** `public/courses/ai-misinformation/figure-1.webp`

```
A simple abstract document panel at centre-left containing rows of grey placeholder bars, with several magenta placeholder bars amongst them, some visibly inconsistent in length and alignment. Two amber arrows point at the irregular bars. A faint magenta ring pulses around the whole panel. Dark navy background.
```

---

## 30. `course-ai-misinformation-figure-2`

- **Save as:** `figure-2.webp`
- **Ratio:** 4:3
- **Where:** `public/courses/ai-misinformation/figure-2.webp`

```
A simple abstract branching diagram: one cyan node on the left splitting into three paths, two leading to cyan nodes and one to a magenta node. The magenta node has a thin amber ring and an arrow pointing at it. Dark navy background, clean flat vector, no readable labels.
```

---

