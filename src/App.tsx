import { useEffect, useState } from "react";
import { clearApkgObjectUrls, type Flashcard } from "./lib/apkg";
import { sfx } from "./lib/sfx";
import { UploadScreen } from "./components/game/UploadScreen";
import { BattleScreen } from "./components/game/BattleScreen";
import { ResultScreen } from "./components/game/ResultScreen";
import { useTheme } from "./hooks/useTheme";
import { useSound } from "./hooks/useSound";
import { DUNGEONS, FOLKLORES, getDungeon, getFolklore, type DungeonId, type FolkloreId } from "./lib/gameConfig";

type Stage = "upload" | "battle" | "victory" | "defeat";

export function App() {
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [stage, setStage] = useState<Stage>("upload");
  const [defeated, setDefeated] = useState(0);
  const [folkloreId, setFolkloreId] = useState<FolkloreId>(FOLKLORES[0].id);
  const [dungeonId, setDungeonId] = useState<DungeonId>(DUNGEONS[0].id);
  const { dark, toggle } = useTheme();
  const { muted, toggle: toggleSound } = useSound();

  const folklore = getFolklore(folkloreId);
  const dungeon = getDungeon(dungeonId);

  useEffect(() => {
    sfx.prime();
  }, []);

  const restart = () => {
    clearApkgObjectUrls();
    setStage("upload");
    setCards([]);
    setDefeated(0);
  };

  const replay = () => {
    setDefeated(0);
    setStage("battle");
  };

  if (stage === "upload") {
    return (
      <UploadScreen
        dark={dark}
        onToggleTheme={toggle}
        soundMuted={muted}
        onToggleSound={toggleSound}
        folkloreId={folkloreId}
        dungeonId={dungeonId}
        onSelectFolklore={setFolkloreId}
        onSelectDungeon={setDungeonId}
        onLoaded={(c) => {
          setCards(c);
          setStage("battle");
        }}
      />
    );
  }

  if (stage === "battle") {
    return (
      <BattleScreen
        cards={cards}
        dark={dark}
        onToggleTheme={toggle}
        soundMuted={muted}
        onToggleSound={toggleSound}
        folklore={folklore}
        dungeon={dungeon}
        onGameOver={(d) => {
          setDefeated(d);
          setStage("defeat");
        }}
        onVictory={() => setStage("victory")}
      />
    );
  }

  if (stage === "victory") {
    return (
      <ResultScreen
        variant="victory"
        glyph={folklore.victoryGlyph}
        title="Dungeon cleared"
        subtitle={`Every ${folklore.heroName.toLowerCase()} encounter has fallen. The knowledge is yours.`}
        detail={`${cards.length} cards · ${cards.length} hits`}
        primaryLabel="Enter again"
        onPrimary={replay}
        secondaryLabel="New deck"
        onSecondary={restart}
        dark={dark}
        onToggleTheme={toggle}
        soundMuted={muted}
        onToggleSound={toggleSound}
        accent={folklore.accent}
      />
    );
  }

  return (
    <ResultScreen
      variant="defeat"
      glyph={folklore.defeatGlyph}
      title="You gave in"
      subtitle="Leave the dungeon, study the answer, and come back sharper."
      detail={`${defeated} of ${cards.length} ${folklore.heroName.toLowerCase()} encounters defeated`}
      primaryLabel="Try again"
      onPrimary={replay}
      secondaryLabel="New deck"
      onSecondary={restart}
      dark={dark}
      onToggleTheme={toggle}
      soundMuted={muted}
      onToggleSound={toggleSound}
      accent={folklore.accent}
    />
  );
}
