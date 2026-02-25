import { useState } from "react";

interface DiceGameProps {
  localFish: number;
  setLocalFish: (fish: number) => void;
  gameCount: number;
  setGameCount: (count: number) => void;
  setGameResultMsg: (msg: string) => void;
  clickSound: () => void;
}

export const DiceGame: React.FC<DiceGameProps> = ({
  localFish,
  setLocalFish,
  gameCount,
  setGameCount,
  setGameResultMsg,
  clickSound,
}) => {
  const [betAmount, setBetAmount] = useState(10);
  const [dice, setDice] = useState<[number, number]>([1, 1]);
  const [isRolling, setIsRolling] = useState(false);

  const rollDice = () => {
    if (betAmount > localFish || gameCount >= 10) return;
    setIsRolling(true);
    clickSound();

    const d1 = Math.floor(Math.random() * 6) + 1;
    const d2 = Math.floor(Math.random() * 6) + 1;
    setDice([d1, d2]);

    setTimeout(() => {
      setIsRolling(false);
      const sum = d1 + d2;
      if (sum >= 8) {
        setLocalFish(localFish + betAmount * 2);
        setGameResultMsg(`🎲 ${sum}! WIN +${betAmount * 2}🐟`);
      } else {
        setLocalFish(localFish - betAmount);
        setGameResultMsg(`🎲 ${sum}. LOSE -${betAmount}🐟`);
      }
      setGameCount(gameCount + 1);
    }, 1500);
  };

  return (
    <div className="dice-game-container">
      <div className="dice-display">
        <div className={`dice-cube ${isRolling ? "rolling" : ""}`}>
          <div className="dice-face">{isRolling ? "?" : dice[0]}</div>
        </div>
        <div className={`dice-cube ${isRolling ? "rolling" : ""}`}>
          <div className="dice-face">{isRolling ? "?" : dice[1]}</div>
        </div>
      </div>
      {!isRolling && (
        <div className="bet-controls">
          <input
            type="number"
            min="1"
            max={localFish}
            value={betAmount}
            onChange={(e) => setBetAmount(Number(e.target.value))}
          />
          <button className="btn-spin" onClick={rollDice}>
            ROLL
          </button>
        </div>
      )}
    </div>
  );
};
