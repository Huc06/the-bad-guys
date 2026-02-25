import { useState, useEffect } from "react";

interface MemoryGameProps {
  localFish: number;
  setLocalFish: (fish: number) => void;
  gameCount: number;
  setGameCount: (count: number) => void;
  setGameResultMsg: (msg: string) => void;
}

const CARD_ICONS = ["🐱", "🐟", "🎮", "🎲", "🎰", "🎯"];

export const MemoryGame: React.FC<MemoryGameProps> = ({
  localFish,
  setLocalFish,
  gameCount,
  setGameCount,
  setGameResultMsg,
}) => {
  const [cards, setCards] = useState<{ icon: string }[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matchedCards, setMatchedCards] = useState<number[]>([]);
  const [timer, setTimer] = useState(60);
  const [gameState, setGameState] = useState<"playing" | "won" | "lost">(
    "playing",
  );

  useEffect(() => {
    startMemoryGame();
  }, []);

  useEffect(() => {
    if (gameState !== "playing") return;
    if (timer <= 0) {
      setGameState("lost");
      setLocalFish(localFish - 10);
      setGameResultMsg("⏰ TIME'S UP! LOSE -10🐟");
      setGameCount(gameCount + 1);
      return;
    }
    const interval = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timer, gameState]);

  useEffect(() => {
    if (matchedCards.length === 12 && gameState === "playing") {
      setGameState("won");
      setLocalFish(localFish + 10);
      setGameResultMsg("🎉 MEMORY WIN! +10🐟");
      setGameCount(gameCount + 1);
    }
  }, [matchedCards]);

  const startMemoryGame = () => {
    const doubled = [...CARD_ICONS, ...CARD_ICONS];
    const shuffled = doubled.sort(() => Math.random() - 0.5);
    setCards(shuffled.map((icon) => ({ icon })));
    setFlippedCards([]);
    setMatchedCards([]);
    setTimer(60);
    setGameState("playing");
  };

  const handleCardClick = (index: number) => {
    if (
      flippedCards.length === 2 ||
      flippedCards.includes(index) ||
      matchedCards.includes(index)
    )
      return;

    const newFlipped = [...flippedCards, index];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      const [i1, i2] = newFlipped;
      if (cards[i1].icon === cards[i2].icon) {
        setMatchedCards([...matchedCards, i1, i2]);
        setFlippedCards([]);
      } else {
        setTimeout(() => setFlippedCards([]), 800);
      }
    }
  };

  return (
    <>
      <div style={{ marginBottom: 10, fontSize: "16px" }}>
        ⏳ {timer}s | {matchedCards.length / 2}/6
      </div>
      {gameState === "won" ? (
        <h3 style={{ color: "green", fontSize: "20px" }}>WIN +10🐟</h3>
      ) : (
        <div className="card-grid">
          {cards.map((c, i) => (
            <div
              key={i}
              className={`card ${flippedCards.includes(i) || matchedCards.includes(i) ? "flipped" : ""}`}
              onClick={() => handleCardClick(i)}
            >
              <div className="card-inner">
                <div className="card-front">?</div>
                <div className="card-back">{c.icon}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};
