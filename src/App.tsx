import { useState } from "react";
import { clearApkgObjectUrls, type Flashcard } from "./lib/apkg";
import { UploadScreen } from "./components/game/UploadScreen";
import { BattleScreen } from "./components/game/BattleScreen";
import { ResultScreen } from "./components/game/ResultScreen";
import { useTheme } from "./hooks/useTheme";

type Stage = "upload" | "battle" | "victory" | "defeat";

export function App() {
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [stage, setStage] = useState<Stage>("upload");
  const [defeated, setDefeated] = useState(0);
  const { dark, toggle } = useTheme();

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
        kanji="天狗"
        title="Dungeon cleared"
        subtitle="Every yokai has fallen. The knowledge is yours."
        detail={`${cards.length} cards · ${cards.length} hits`}
        primaryLabel="Enter again"
        onPrimary={replay}
        secondaryLabel="New deck"
        onSecondary={restart}
        dark={dark}
        onToggleTheme={toggle}
      />
    );
  }

  return (
    <ResultScreen
      variant="defeat"
      kanji="鬼"
      title="You gave in"
      subtitle="Leave the dungeon, study the answer, and come back sharper."
      detail={`${defeated} of ${cards.length} yokai defeated`}
      primaryLabel="Try again"
      onPrimary={replay}
      secondaryLabel="New deck"
      onSecondary={restart}
      dark={dark}
      onToggleTheme={toggle}
    />
  );
}
