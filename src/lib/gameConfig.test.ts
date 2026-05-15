import { describe, expect, it } from "vitest";
import {
  DUNGEONS,
  FOLKLORES,
  getDungeonLives,
  getNextLivesAfterMiss,
  hasInfiniteLives,
} from "./gameConfig";

describe("dungeon rules", () => {
  it("starts with an infinite-life practice dungeon", () => {
    expect(DUNGEONS[0]?.id).toBe("dungeon-0");
    expect(hasInfiniteLives(DUNGEONS[0])).toBe(true);
    expect(getDungeonLives(DUNGEONS[0])).toBeNull();
    expect(getNextLivesAfterMiss(DUNGEONS[0], null)).toBeNull();
  });

  it("gets stricter as the exam dungeon rises", () => {
    const finiteLives = DUNGEONS.slice(1).map((dungeon) => getDungeonLives(dungeon));
    expect(finiteLives).toEqual([5, 3, 2, 1]);
    expect(getNextLivesAfterMiss(DUNGEONS.at(-1)!, 1)).toBe(0);
  });
});

describe("folklore sets", () => {
  it("offers Japanese, Nordic, and Celtic lore themes", () => {
    expect(FOLKLORES.map((lore) => lore.id)).toEqual(["japanese", "norse", "celtic"]);
  });

  it("has enough enemies and decorative glyphs for a run", () => {
    FOLKLORES.forEach((lore) => {
      expect(lore.enemies.length).toBeGreaterThanOrEqual(8);
      expect(lore.decorativeGlyphs.length).toBeGreaterThanOrEqual(2);
      expect(lore.heroName.length).toBeGreaterThan(0);
    });
  });
});
