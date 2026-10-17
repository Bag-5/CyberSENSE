export type StoryBeat = {
  /** Short beat label, e.g. "The message". */
  heading: string;
  /** Narrative prose for this beat. */
  body: string;
  /** Generated scene art for this beat. */
  image: string;
  /** Intrinsic aspect ratio of the beat image, used for layout hints. */
  imageRatio: StoryRatio;
  /** Alt text. Must describe the scene, never repeat the heading. */
  imageAlt: string;
};

export type StoryRatio = "3:2" | "4:3" | "16:9" | "1:1";

export type Story = {
  slug: string;
  title: string;
  /** One-line hook shown on the story card. */
  logline: string;
  /** The academy threat slug this story teaches. */
  threatSlug: string;
  /** Where the story happens. */
  setting: string;
  /** Who the story follows. */
  protagonist: string;
  /** Protagonist description, used for the cast note and for image consistency. */
  protagonistNote: string;
  /** Reading time estimate in minutes. */
  minutes: number;
  /** Cover art. */
  cover: string;
  coverRatio: StoryRatio;
  coverAlt: string;
  /** Number of beats, always 3 in the current set. */
  beats: StoryBeat[];
  /** The lesson, stated plainly at the end. */
  takeaway: string;
  /** One or two habit lines the reader should leave with. */
  habits: string[];
};