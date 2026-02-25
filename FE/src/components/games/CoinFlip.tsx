import { useState } from "react";

interface CoinFlipProps {
  localFish: number;
  setLocalFish: (fish: number) => void;
  gameCount: number;
  setGameCount: (count: number) => void;
  setGameResultMsg: (msg: string) => void;
  clickSound: () => void;
}

export const CoinFlip: React.FC<CoinFlipProps> = ({
  localFish,
  setLocalFish,
  gameCount,
  setGameCount,
  setGameResultMsg,
  clickSound,
}) => {
  const [betAmount, setBetAmount] = useState(10);
  const [isFlipping, setIsFlipping] = useState(false);
  const [coinSide, setCoinSide] = useState<"heads" | "tails">("heads");

  const playCoinFlip = (choice: "heads" | "tails") => {
    if (betAmount > localFish || gameCount >= 10) return;
    setIsFlipping(true);
    clickSound();

    setTimeout(() => {
      const result = Math.random() < 0.5 ? "heads" : "tails";
      setCoinSide(result);
      setIsFlipping(false);

      if (result === choice) {
        setLocalFish(localFish + betAmount * 2);
        setGameResultMsg(`🪙 ${result.toUpperCase()}! WIN +${betAmount * 2}🐟`);
      } else {
        setLocalFish(localFish - betAmount);
        setGameResultMsg(`🪙 ${result.toUpperCase()}. LOSE -${betAmount}🐟`);
      }
      setGameCount(gameCount + 1);
    }, 1000);
  };

  return (
    <div className="coin-flip-container">
      <div className={`coin ${isFlipping ? "flipping" : ""} ${coinSide}`}>
        <div className="side heads">HEADS</div>
        <div className="side tails">TAILS</div>
      </div>
      {!isFlipping && (
        <div className="bet-controls">
          <input
            type="number"
            min="1"
            max={localFish}
            value={betAmount}
            onChange={(e) => setBetAmount(Number(e.target.value))}
          />
          <button
            className="btn-heads"
            style={{ width: "80px" }}
            onClick={() => playCoinFlip("heads")}
          >
            HEADS
          </button>
          <button
            className="btn-tails"
            style={{ width: "80px" }}
            onClick={() => playCoinFlip("tails")}
          >
            TAILS
          </button>
        </div>
      )}
    </div>
  );
};
