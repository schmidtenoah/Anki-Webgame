export type FolkloreId = "japanese" | "norse" | "celtic";
export type DungeonId = "dungeon-0" | "dungeon-1" | "dungeon-2" | "dungeon-3" | "final-dungeon";

export interface LoreEnemy {
  glyph: string;
  name: string;
  description: string;
}

export interface FolkloreTheme {
  id: FolkloreId;
  label: string;
  heroName: string;
  shortDescription: string;
  accent: string;
  sealGlyph: string;
  decorativeGlyphs: string[];
  victoryGlyph: string;
  defeatGlyph: string;
  enemies: LoreEnemy[];
}

export interface DungeonConfig {
  id: DungeonId;
  label: string;
  shortLabel: string;
  description: string;
  lives: number | null;
}

export const DUNGEONS: DungeonConfig[] = [
  {
    id: "dungeon-0",
    label: "Dungeon 0",
    shortLabel: "Practice",
    description: "Start of learning: infinite lives, low pressure.",
    lives: null,
  },
  {
    id: "dungeon-1",
    label: "Dungeon 1",
    shortLabel: "Warm-up",
    description: "Early exam prep with 5 lives.",
    lives: 5,
  },
  {
    id: "dungeon-2",
    label: "Dungeon 2",
    shortLabel: "Focus",
    description: "Closer to the exam with 3 lives.",
    lives: 3,
  },
  {
    id: "dungeon-3",
    label: "Dungeon 3",
    shortLabel: "Pressure",
    description: "Mock-exam pressure with 2 lives.",
    lives: 2,
  },
  {
    id: "final-dungeon",
    label: "Final Dungeon",
    shortLabel: "Final",
    description: "Exam mode: one mistake ends the run.",
    lives: 1,
  },
];

export const FOLKLORES: FolkloreTheme[] = [
  {
    id: "japanese",
    label: "Japanese",
    heroName: "Yokai",
    shortDescription: "Ink, seals, and haunted mountain spirits.",
    accent: "#8b1a10",
    sealGlyph: "鬼",
    decorativeGlyphs: ["天狗", "河童"],
    victoryGlyph: "天狗",
    defeatGlyph: "鬼",
    enemies: [
      { glyph: "鬼", name: "Oni", description: "Iron-club demons born from corrupt souls, tasked with staffing the underworld's torture chambers." },
      { glyph: "天狗", name: "Tengu", description: "Winged mountain spirits and master swordsmen said to have trained legendary warriors." },
      { glyph: "河童", name: "Kappa", description: "River creatures with a water-filled dish on their heads, dangerous to swimmers and bound by strict honor." },
      { glyph: "雪女", name: "Yuki-onna", description: "A pale woman who materialises in blizzards and breathes lethal cold." },
      { glyph: "木霊", name: "Kodama", description: "Tree spirits dwelling in ancient forests, their presence said to explain mountain echoes." },
      { glyph: "狐", name: "Kitsune", description: "Fox spirits that grow wiser and more powerful with age, sometimes gaining up to nine tails." },
      { glyph: "狸", name: "Tanuki", description: "Magical shapeshifters known as playful tricksters and symbols of good fortune." },
      { glyph: "絡新婦", name: "Jorogumo", description: "A spider spirit that lures victims with beauty and music before binding them in silk." },
      { glyph: "塗壁", name: "Nurikabe", description: "An invisible wall that blocks travellers on lonely roads at night." },
      { glyph: "海坊主", name: "Umibozu", description: "A vast dark shape that rises from calm seas to capsize ships." },
    ],
  },
  {
    id: "norse",
    label: "Nordic",
    heroName: "Rune",
    shortDescription: "Younger Futhark marks and northern folklore.",
    accent: "#316b6f",
    sealGlyph: "ᚬ",
    decorativeGlyphs: ["ᚠ", "ᛦ"],
    victoryGlyph: "ᛏ",
    defeatGlyph: "ᚦ",
    enemies: [
      { glyph: "ᚠ", name: "Fafnir", description: "A dragon of greed whose hoard turns every challenger into a test of resolve." },
      { glyph: "ᚦ", name: "Draugr", description: "A restless barrow-walker guarding memory, wealth, and unfinished oaths." },
      { glyph: "ᚱ", name: "Troll", description: "A mountain-haunting brute from old northern tales, strongest before the sun finds it." },
      { glyph: "ᚴ", name: "Mara", description: "A night spirit from Scandinavian folklore that presses on sleepers and gives nightmares." },
      { glyph: "ᚼ", name: "Nidhogg", description: "A dragon or serpent below Yggdrasil, gnawing at the roots of the world tree." },
      { glyph: "ᛏ", name: "Valkyrie", description: "A chooser of the slain who serves Odin and selects warriors bound for Valhalla." },
      { glyph: "ᛒ", name: "Huldra", description: "A forest figure from Scandinavian folklore whose beauty hides a wild, testing nature." },
      { glyph: "ᛁ", name: "Jotunn", description: "A giant force of frost, stone, and pressure beyond the safe halls." },
    ],
  },
  {
    id: "celtic",
    label: "Celtic",
    heroName: "Ogham",
    shortDescription: "Ogham marks, green hills, and fae bargains.",
    accent: "#4f6f3f",
    sealGlyph: "ᚁ",
    decorativeGlyphs: ["ᚂ", "ᚄ"],
    victoryGlyph: "ᚆ",
    defeatGlyph: "ᚇ",
    enemies: [
      { glyph: "ᚁ", name: "Banshee", description: "A keening omen whose cry warns that time is running short." },
      { glyph: "ᚂ", name: "Kelpie", description: "A Scottish water-horse spirit that lures riders before dragging them beneath the water." },
      { glyph: "ᚃ", name: "Puca", description: "A shapeshifting trickster that tests whether you can keep your balance." },
      { glyph: "ᚄ", name: "Dullahan", description: "A headless rider whose arrival marks a point of no return." },
      { glyph: "ᚅ", name: "Selkie", description: "A seal folk figure from Scottish and Irish tradition, human on land and seal in the sea." },
      { glyph: "ᚆ", name: "Aos Si", description: "A hidden folk of mounds and old promises, precise about respect and debt." },
      { glyph: "ᚇ", name: "Dearg Due", description: "A revenant from tragic legend, returning when grief hardens into hunger." },
      { glyph: "ᚈ", name: "Fomorian", description: "A hostile supernatural race in Irish myth, defeated by the Tuatha Dé Danann." },
    ],
  },
];

export function hasInfiniteLives(dungeon: DungeonConfig): boolean {
  return dungeon.lives === null;
}

export function getDungeonLives(dungeon: DungeonConfig): number | null {
  return dungeon.lives;
}

export function getNextLivesAfterMiss(dungeon: DungeonConfig, currentLives: number | null): number | null {
  if (hasInfiniteLives(dungeon)) return null;
  return Math.max((currentLives ?? dungeon.lives ?? 0) - 1, 0);
}

export function getFolklore(id: FolkloreId): FolkloreTheme {
  return FOLKLORES.find((lore) => lore.id === id) ?? FOLKLORES[0];
}

export function getDungeon(id: DungeonId): DungeonConfig {
  return DUNGEONS.find((dungeon) => dungeon.id === id) ?? DUNGEONS[0];
}
