/**
 * Scene table for the Threat Academy course art.
 *
 * Kept separate from build-image-manifest.mjs purely for readability: heroes
 * are banner compositions that leave room for overlaid titles, figures are
 * diagram/mockup compositions. `build-image-manifest.mjs` merges both.
 *
 * Figures deliberately avoid asking for any lettering — the image models
 * cannot render text, so labels are drawn in the component instead. Every
 * prompt says so explicitly.
 */

const NO_TEXT = [
  "Absolutely no readable words, no letters, no numbers, no speech bubbles and no logos anywhere in the image.",
  "Any screen or panel content is shown only as plain abstract grey rounded bars or blocks.",
].join(" ");

const STYLE_COURSE_HERO = [
  "Abstract conceptual illustration, dark cyberpunk aesthetic, clean modern tech-brand key art.",
  "Deep navy and near-black environment, luminous electric cyan as the primary light source, restrained magenta accents.",
  "Volumetric haze, fine floating particles, crisp geometry, strong negative space.",
  "Wide cinematic banner composition with generous empty space, no text, no lettering, no watermarks, no logos.",
].join(" ");

const STYLE_COURSE_FIGURE = [
  "Clean instructional diagram illustration on a very dark navy background.",
  "Flat vector geometry meeting soft realistic rendering, restrained electric cyan glow, thin bright amber annotation arrows, generous dark margins on all sides.",
  "Educational poster quality, unambiguous and uncluttered.",
  NO_TEXT,
].join(" ");

/** slug -> { hero, figures: [2 scene descriptions] } */
export const COURSE_SCENES = {
  phishing: {
    hero:
      "A luminous fishing hook made of glowing cyan wire descends through deep navy darkness toward a bright rectangular phone screen lying flat, its screen blooming cyan. Fine magenta and cyan circuit traces radiate outward from the phone across the floor into the darkness. Subject placed centre-right, entire left half empty dark space.",
    figures: [
      "A modern smartphone shown straight-on from the front, centred, displaying a single notification bubble filled with plain grey placeholder bars. Two thin amber arrows point at the sender line and at the message body. A small amber circle highlights a generic link button shape. Empty dark space either side.",
      "A generic web browser window shown flat and centred with a visible address bar at the top containing only a grey placeholder bar. One part of the address is circled by a thin amber ring, with an amber arrow pointing at the circled segment. A second smaller browser window overlaps behind it with a slightly different placeholder address, also circled. No other interface detail.",
    ],
  },
  "social-engineering": {
    hero:
      "A stylised human silhouette rendered as glowing cyan wireframe stands at centre-right, one hand raised as if mid-gesture. Around it, concentric rings of faint magenta light pulse outward like pressure waves. An empty speech-bubble outline floats nearby, deliberately blank. Left half of the frame is empty dark space.",
    figures: [
      "Two human silhouettes facing each other in profile, rendered as flat cyan wireframe outlines on a dark navy background. Between them a vertical stack of blank rounded speech-bubble outlines of decreasing size, the top one highlighted with a thin amber ring. An amber arrow points at the highlighted bubble. Abstract and anonymous, no facial detail.",
      "A single cyan wireframe silhouette at centre-right with four thin amber arrows converging on it from the corners of the frame. At each arrow's tail sits a plain dark rounded label tag containing only flat grey placeholder bars. The figure is emphasised by a soft cyan halo. Left side left empty.",
    ],
  },
  malware: {
    hero:
      "A dense crystalline mass of dark metallic shards hovers at centre-right, shot through with glowing magenta veins, each shard catching a cold cyan rim light. It casts a corrupted glow onto the dark floor below, where fragmented geometric shapes scatter outward. Volumetric haze. Left half of the frame empty dark space.",
    figures: [
      "A generic desktop monitor shown straight-on from the front, centred, its screen filled with an abstract cluster of small overlapping geometric shapes in cyan and magenta suggesting disorder. Two amber arrows point at the screen and at a row of simple abstract square icons beneath it. No readable text.",
      "A vertical arrangement of four simple rounded panels connected by a downward arrow, representing files being locked in sequence. The top two panels are cyan and intact, the lower two are magenta with a diagonal slash across them. A single amber arrow points at the final panel. Flat vector diagram, dark navy background.",
    ],
  },
  "password-attacks": {
    hero:
      "A vast lattice of glowing cyan key shapes stretches into deep navy darkness, receding in perspective toward a vanishing point. Each key is identical. At centre-right a single key is cracked and split in two with magenta light bleeding from the fracture. Left half of the frame empty dark space.",
    figures: [
      "Four identical cyan key shapes arranged in a row on a dark navy background, connected by a thin glowing line running through all of them, implying one key opening many doors. A single amber arrow points down at the shared line from above. Flat geometric diagram, generous margins.",
      "A simple abstract padlock outline at centre drawn in glowing cyan wireframe. Around it a ring of faint magenta dots suggests automated attempts closing in. One amber arrow points at the padlock's keyhole from the upper right. Dark navy background, uncluttered.",
    ],
  },
  "public-wi-fi-attacks": {
    hero:
      "Three concentric cyan wireless signal rings radiate outward at centre-right from a small glowing node, washing over deep navy darkness. Within the rings a faint wireframe silhouette of a laptop sits unattended, and one ring extends beyond it toward the dark empty left side. Volumetric haze and drifting particles.",
    figures: [
      "Two identical rounded rectangular wifi signal icons shown side by side at centre, each emitting concentric rings. They differ only subtly, one carrying a single small extra dot beside it. A thin amber ring encircles the near-identical detail and an amber arrow points at it. Dark navy background, flat vector diagram.",
      "A single cyan wifi node emitting rings at centre-left, with a small cluster of abstract packet shapes drifting along one ring toward a simplified wireframe laptop on the right. Two amber arrows mark the drifting shapes. Deep navy background, clean and uncluttered.",
    ],
  },
  ransomware: {
    hero:
      "A heavy geometric padlock, half cyan and half magenta, hangs at centre-right from a chain of dark links. One chain link has snapped and glows magenta at the break. Files rendered as small stacked geometric slabs are locked behind it, dimmed. Deep navy darkness. Left half of the frame empty space.",
    figures: [
      "A simple grid of identical small rectangular slabs representing files, arranged in rows. The top rows are cyan and evenly spaced; the lower rows are magenta, tilted at irregular angles. A thin amber arrow sweeps from the intact rows to the broken ones. Flat vector diagram on dark navy.",
      "A simple abstract cylinder database shape at centre-left connected by a thin line to a small rounded rectangle representing a separate drive at centre-right, deliberately disconnected from any cloud shape. A thin amber ring highlights the separate drive. Dark navy background, clean diagram.",
    ],
  },
  "fake-apps-scams": {
    hero:
      "Two identical rounded-square app icons float side by side at centre-right against deep navy darkness. The left one glows clean cyan with a simple geometric glyph. The right one glows dirty magenta with a subtly distorted glyph and hairline cracks around its edge. Left half of the frame empty dark space.",
    figures: [
      "A generic smartphone shown straight-on from the front, centred, with a stack of four simple permission toggle shapes rising beside it. One toggle is highlighted magenta and ringed with amber, an arrow pointing at it. No readable labels anywhere, only abstract toggle shapes.",
      "Two identical abstract app-store badge shapes side by side at centre, one cyan and one magenta. A thin amber line connects them and a small amber warning triangle sits between them. Flat vector diagram, dark navy background, generous margins.",
    ],
  },
  deepfakes: {
    hero:
      "A large human face rendered as a luminous cyan wireframe mesh at centre-right, its surface visibly fragmenting away into scattered polygonal shards drifting into deep navy darkness. One region of the face has already dissolved into magenta particles. Left half of the frame empty dark space.",
    figures: [
      "A simplified human face outline in cyan wireframe at centre, with three thin amber arrows pointing at three specific regions: the jaw edge, the eye area, and the hairline. Small dark circular magnifier outlines sit over each targeted region. Dark navy background, clean diagram, no readable text.",
      "A generic video player interface shown flat and centred with a play triangle, and a timeline bar beneath. One frame on the timeline is ringed in magenta and enlarged into a floating panel above showing an abstract face wireframe with mismatched edges. Amber arrow connects the two. No readable text.",
    ],
  },
  "voice-cloning-scams": {
    hero:
      "A stylised head silhouette at centre-right rendered as a dense grid of glowing cyan dots, several of which detach and drift leftward into deep navy darkness as magenta particles. A jagged waveform of thin cyan lines runs behind the head, breaking apart as it travels left. Left half empty dark space.",
    figures: [
      "A horizontal jagged waveform drawn in thin cyan lines across the centre of the frame, with the left third rendered in solid magenta and the right two thirds in cyan, separated by a visible seam. Two amber arrows point inward at the seam from above and below. Dark navy background.",
      "A simple sequence of four generic rounded panels arranged left to right, connected by thin arrows, representing a call attempt. The first three are cyan; the fourth is magenta and has a small amber verification-phrase symbol beside it. Flat vector diagram, dark navy background.",
    ],
  },
  "ai-misinformation": {
    hero:
      "A dense swarm of small glowing cyan geometric fragments streams through deep navy darkness at centre-right, assembling and disassembling endlessly into shapes that almost resolve into a face before dissolving again. A few fragments glow magenta. Left half of the frame empty dark space. Volumetric haze.",
    figures: [
      "A simple abstract document panel at centre-left containing rows of grey placeholder bars, with several magenta placeholder bars amongst them, some visibly inconsistent in length and alignment. Two amber arrows point at the irregular bars. A faint magenta ring pulses around the whole panel. Dark navy background.",
      "A simple abstract branching diagram: one cyan node on the left splitting into three paths, two leading to cyan nodes and one to a magenta node. The magenta node has a thin amber ring and an arrow pointing at it. Dark navy background, clean flat vector, no readable labels.",
    ],
  },
};

export { STYLE_COURSE_FIGURE, STYLE_COURSE_HERO, NO_TEXT };