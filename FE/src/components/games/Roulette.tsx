import { useState } from "react";

interface RouletteProps {
  localFish: number;
  setLocalFish: (fish: number) => void;
  gameCount: number;
  setGameCount: (count: number) => void;
  setGameResultMsg: (msg: string) => void;
  clickSound: () => void;
}

export const Roulette: React.FC<RouletteProps> = ({
  localFish,
  setLocalFish,
  gameCount,
  setGameCount,
  setGameResultMsg,
  clickSound,
}) => {
  const [betAmount, setBetAmount] = useState(10);
  const [isSpinning, setIsSpinning] = useState(false);

  const playRoulette = (choice: "red" | "black") => {
    if (betAmount > localFish || gameCount >= 10) return;
    setIsSpinning(true);
    clickSound();

    setTimeout(() => {
      setIsSpinning(false);
      const result =
        Math.random() < 0.486 ? choice : choice === "red" ? "black" : "red";

      if (result === choice) {
        setLocalFish(localFish + betAmount);
        setGameResultMsg(
          `${choice === "red" ? "🔴" : "⚫"} ${choice.toUpperCase()}! WIN +${betAmount}🐟`,
        );
      } else {
        setLocalFish(localFish - betAmount);
        setGameResultMsg(
          `${result === "red" ? "🔴" : "⚫"} ${result.toUpperCase()}. LOSE -${betAmount}🐟`,
        );
      }
      setGameCount(gameCount + 1);
    }, 2000);
  };

  return (
    <div className="roulette-container">
      <div className={`roulette-wheel ${isSpinning ? "spinning" : ""}`}>
        <div className="roulette-ball"></div>
      </div>
      {!isSpinning && (
        <div className="bet-controls">
          <input
            type="number"
            min="1"
            max={localFish}
            value={betAmount}
            onChange={(e) => setBetAmount(Number(e.target.value))}
          />
          <button className="btn-heads" onClick={() => playRoulette("red")}>
            RED
          </button>
          <button className="btn-tails" onClick={() => playRoulette("black")}>
            BLACK
          </button>
        </div>
      )}
    </div>
  );
};
