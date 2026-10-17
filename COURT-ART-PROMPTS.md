# Course Art — Prompt Sheet (30 images across 10 courses)

Work one course at a time. For each entry: paste the prompt into Gemini
image generation, then save the download into the folder shown, using the
filename shown.

When a course folder has all three images, run:

```
npm run art:process
```

That walks `public/courses/`, trims any black letterbox bars, and converts
every PNG to WebP in place. Skip any course you don't want and it simply
renders without art.

## Rules that matter

- **Ratio:** heroes are **16:9**, figures are **4:3**. Set it in the generator.
- **Resolution:** 1K is enough. These display at most ~1000px wide.
- **Reject anything containing invented words.** The models cannot render
  text. The prompts ask for abstract grey placeholder bars instead, and all
  real labels are drawn in the page component afterwards.
- **Ask for full-bleed.** If black bars appear anyway, `art:process` trims them.
- **Save as `.png`.** The processor converts to `.webp` and removes the PNG.

---

## Phishing

**Folder:** `public/courses/phishing/`

### 01 — `public/courses/phishing/hero.png` (16:9)

```
A luminous fishing hook made of glowing cyan wire descends through deep navy darkness toward a bright rectangular phone screen lying flat, its screen blooming cyan. Fine magenta and cyan circuit traces radiate outward from the phone across the floor into the darkness. Subject placed centre-right, entire left half empty dark space.
```

### 02 — `public/courses/phishing/figure-1.png` (4:3)

```
A modern smartphone shown straight-on from the front, centred, displaying a single notification bubble filled with plain grey placeholder bars. Two thin amber arrows point at the sender line and at the message body. A small amber circle highlights a generic link button shape. Empty dark space either side.
```

### 03 — `public/courses/phishing/figure-2.png` (4:3)

```
A generic web browser window shown flat and centred with a visible address bar at the top containing only a grey placeholder bar. One part of the address is circled by a thin amber ring, with an amber arrow pointing at the circled segment. A second smaller browser window overlaps behind it with a slightly different placeholder address, also circled. No other interface detail.
```

---

## Social Engineering

**Folder:** `public/courses/social-engineering/`

### 04 — `public/courses/social-engineering/hero.png` (16:9)

```
A stylised human silhouette rendered as glowing cyan wireframe stands at centre-right, one hand raised as if mid-gesture. Around it, concentric rings of faint magenta light pulse outward like pressure waves. An empty speech-bubble outline floats nearby, deliberately blank. Left half of the frame is empty dark space.
```

### 05 — `public/courses/social-engineering/figure-1.png` (4:3)

```
Two human silhouettes facing each other in profile, rendered as flat cyan wireframe outlines on a dark navy background. Between them a vertical stack of blank rounded speech-bubble outlines of decreasing size, the top one highlighted with a thin amber ring. An amber arrow points at the highlighted bubble. Abstract and anonymous, no facial detail.
```

### 06 — `public/courses/social-engineering/figure-2.png` (4:3)

```
A single cyan wireframe silhouette at centre-right with four thin amber arrows converging on it from the corners of the frame. At each arrow's tail sits a plain dark rounded label tag containing only flat grey placeholder bars. The figure is emphasised by a soft cyan halo. Left side left empty.
```

---

## Malware

**Folder:** `public/courses/malware/`

### 07 — `public/courses/malware/hero.png` (16:9)

```
A dense crystalline mass of dark metallic shards hovers at centre-right, shot through with glowing magenta veins, each shard catching a cold cyan rim light. It casts a corrupted glow onto the dark floor below, where fragmented geometric shapes scatter outward. Volumetric haze. Left half of the frame empty dark space.
```

### 08 — `public/courses/malware/figure-1.png` (4:3)

```
A generic desktop monitor shown straight-on from the front, centred, its screen filled with an abstract cluster of small overlapping geometric shapes in cyan and magenta suggesting disorder. Two amber arrows point at the screen and at a row of simple abstract square icons beneath it. No readable text.
```

### 09 — `public/courses/malware/figure-2.png` (4:3)

```
A vertical arrangement of four simple rounded panels connected by a downward arrow, representing files being locked in sequence. The top two panels are cyan and intact, the lower two are magenta with a diagonal slash across them. A single amber arrow points at the final panel. Flat vector diagram, dark navy background.
```

---

## Password Attacks

**Folder:** `public/courses/password-attacks/`

### 10 — `public/courses/password-attacks/hero.png` (16:9)

```
A vast lattice of glowing cyan key shapes stretches into deep navy darkness, receding in perspective toward a vanishing point. Each key is identical. At centre-right a single key is cracked and split in two with magenta light bleeding from the fracture. Left half of the frame empty dark space.
```

### 11 — `public/courses/password-attacks/figure-1.png` (4:3)

```
Four identical cyan key shapes arranged in a row on a dark navy background, connected by a thin glowing line running through all of them, implying one key opening many doors. A single amber arrow points down at the shared line from above. Flat geometric diagram, generous margins.
```

### 12 — `public/courses/password-attacks/figure-2.png` (4:3)

```
A simple abstract padlock outline at centre drawn in glowing cyan wireframe. Around it a ring of faint magenta dots suggests automated attempts closing in. One amber arrow points at the padlock's keyhole from the upper right. Dark navy background, uncluttered.
```

---

## Public Wi-Fi Attacks

**Folder:** `public/courses/public-wi-fi-attacks/`

### 13 — `public/courses/public-wi-fi-attacks/hero.png` (16:9)

```
Three concentric cyan wireless signal rings radiate outward at centre-right from a small glowing node, washing over deep navy darkness. Within the rings a faint wireframe silhouette of a laptop sits unattended, and one ring extends beyond it toward the dark empty left side. Volumetric haze and drifting particles.
```

### 14 — `public/courses/public-wi-fi-attacks/figure-1.png` (4:3)

```
Two identical rounded rectangular wifi signal icons shown side by side at centre, each emitting concentric rings. They differ only subtly, one carrying a single small extra dot beside it. A thin amber ring encircles the near-identical detail and an amber arrow points at it. Dark navy background, flat vector diagram.
```

### 15 — `public/courses/public-wi-fi-attacks/figure-2.png` (4:3)

```
A single cyan wifi node emitting rings at centre-left, with a small cluster of abstract packet shapes drifting along one ring toward a simplified wireframe laptop on the right. Two amber arrows mark the drifting shapes. Deep navy background, clean and uncluttered.
```

---

## Ransomware

**Folder:** `public/courses/ransomware/`

### 16 — `public/courses/ransomware/hero.png` (16:9)

```
A heavy geometric padlock, half cyan and half magenta, hangs at centre-right from a chain of dark links. One chain link has snapped and glows magenta at the break. Files rendered as small stacked geometric slabs are locked behind it, dimmed. Deep navy darkness. Left half of the frame empty space.
```

### 17 — `public/courses/ransomware/figure-1.png` (4:3)

```
A simple grid of identical small rectangular slabs representing files, arranged in rows. The top rows are cyan and evenly spaced; the lower rows are magenta, tilted at irregular angles. A thin amber arrow sweeps from the intact rows to the broken ones. Flat vector diagram on dark navy.
```

### 18 — `public/courses/ransomware/figure-2.png` (4:3)

```
A simple abstract cylinder database shape at centre-left connected by a thin line to a small rounded rectangle representing a separate drive at centre-right, deliberately disconnected from any cloud shape. A thin amber ring highlights the separate drive. Dark navy background, clean diagram.
```

---

## Fake Apps & Scams

**Folder:** `public/courses/fake-apps-scams/`

### 19 — `public/courses/fake-apps-scams/hero.png` (16:9)

```
Two identical rounded-square app icons float side by side at centre-right against deep navy darkness. The left one glows clean cyan with a simple geometric glyph. The right one glows dirty magenta with a subtly distorted glyph and hairline cracks around its edge. Left half of the frame empty dark space.
```

### 20 — `public/courses/fake-apps-scams/figure-1.png` (4:3)

```
A generic smartphone shown straight-on from the front, centred, with a stack of four simple permission toggle shapes rising beside it. One toggle is highlighted magenta and ringed with amber, an arrow pointing at it. No readable labels anywhere, only abstract toggle shapes.
```

### 21 — `public/courses/fake-apps-scams/figure-2.png` (4:3)

```
Two identical abstract app-store badge shapes side by side at centre, one cyan and one magenta. A thin amber line connects them and a small amber warning triangle sits between them. Flat vector diagram, dark navy background, generous margins.
```

---

## Deepfakes

**Folder:** `public/courses/deepfakes/`

### 22 — `public/courses/deepfakes/hero.png` (16:9)

```
A large human face rendered as a luminous cyan wireframe mesh at centre-right, its surface visibly fragmenting away into scattered polygonal shards drifting into deep navy darkness. One region of the face has already dissolved into magenta particles. Left half of the frame empty dark space.
```

### 23 — `public/courses/deepfakes/figure-1.png` (4:3)

```
A simplified human face outline in cyan wireframe at centre, with three thin amber arrows pointing at three specific regions: the jaw edge, the eye area, and the hairline. Small dark circular magnifier outlines sit over each targeted region. Dark navy background, clean diagram, no readable text.
```

### 24 — `public/courses/deepfakes/figure-2.png` (4:3)

```
A generic video player interface shown flat and centred with a play triangle, and a timeline bar beneath. One frame on the timeline is ringed in magenta and enlarged into a floating panel above showing an abstract face wireframe with mismatched edges. Amber arrow connects the two. No readable text.
```

---

## Voice Cloning Scams

**Folder:** `public/courses/voice-cloning-scams/`

### 25 — `public/courses/voice-cloning-scams/hero.png` (16:9)

```
A stylised head silhouette at centre-right rendered as a dense grid of glowing cyan dots, several of which detach and drift leftward into deep navy darkness as magenta particles. A jagged waveform of thin cyan lines runs behind the head, breaking apart as it travels left. Left half empty dark space.
```

### 26 — `public/courses/voice-cloning-scams/figure-1.png` (4:3)

```
A horizontal jagged waveform drawn in thin cyan lines across the centre of the frame, with the left third rendered in solid magenta and the right two thirds in cyan, separated by a visible seam. Two amber arrows point inward at the seam from above and below. Dark navy background.
```

### 27 — `public/courses/voice-cloning-scams/figure-2.png` (4:3)

```
A simple sequence of four generic rounded panels arranged left to right, connected by thin arrows, representing a call attempt. The first three are cyan; the fourth is magenta and has a small amber verification-phrase symbol beside it. Flat vector diagram, dark navy background.
```

---

## AI Misinformation

**Folder:** `public/courses/ai-misinformation/`

### 28 — `public/courses/ai-misinformation/hero.png` (16:9)

```
A dense swarm of small glowing cyan geometric fragments streams through deep navy darkness at centre-right, assembling and disassembling endlessly into shapes that almost resolve into a face before dissolving again. A few fragments glow magenta. Left half of the frame empty dark space. Volumetric haze.
```

### 29 — `public/courses/ai-misinformation/figure-1.png` (4:3)

```
A simple abstract document panel at centre-left containing rows of grey placeholder bars, with several magenta placeholder bars amongst them, some visibly inconsistent in length and alignment. Two amber arrows point at the irregular bars. A faint magenta ring pulses around the whole panel. Dark navy background.
```

### 30 — `public/courses/ai-misinformation/figure-2.png` (4:3)

```
A simple abstract branching diagram: one cyan node on the left splitting into three paths, two leading to cyan nodes and one to a magenta node. The magenta node has a thin amber ring and an arrow pointing at it. Dark navy background, clean flat vector, no readable labels.
```

---

