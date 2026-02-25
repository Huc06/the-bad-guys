import { useState } from "react";

interface SlotMachineProps {
  localFish: number;
  setLocalFish: (fish: number) => void;
  gameCount: number;
  setGameCount: (count: number) => void;
  setGameResultMsg: (msg: string) => void;
  clickSound: () => void;
}

const SLOT_SYMBOLS = [
  { img: "/assets/slot-symbol1.png", mult: 2 },
  { img: "/assets/slot-symbol2.png", mult: 3 },
  { img: "/assets/slot-symbol3.png", mult: 5 },
  { img: "/assets/slot-symbol4.png", mult: 10 },
];

export const SlotMachine: React.FC<SlotMachineProps> = ({
  localFish,
  setLocalFish,
  gameCount,
  setGameCount,
  setGameResultMsg,
  clickSound,
}) => {
  const [betAmount, setBetAmount] = useState(10);
  const [slotReels, setSlotReels] = useState<number[]>([0, 0, 0]);
  const [isSpinning, setIsSpinning] = useState(false);

  const playSlotMachine = () => {
    if (betAmount > localFish || gameCount >= 10) return;
    setIsSpinning(true);
    clickSound();

    const r1 = Math.floor(Math.random() * 4);
    const r2 = Math.floor(Math.random() * 4);
    const r3 = Math.floor(Math.random() * 4);
    setSlotReels([r1, r2, r3]);

    setTimeout(() => {
      setIsSpinning(false);
      if (r1 === r2 && r2 === r3) {
        const mult = SLOT_SYMBOLS[r1 as 0 | 1 | 2 | 3].mult;
        const win = betAmount * mult;
        setLocalFish(localFish + win);
        setGameResultMsg(`🎰 JACKPOT! WIN +${win}🐟`);
      } else {
        setLocalFish(localFish - betAmount);
        setGameResultMsg(`🎰 LOSE -${betAmount}🐟`);
      }
      setGameCount(gameCount + 1);
    }, 2000);
  };

  return (
    <div className="slot-machine-wrapper">
      <div
        className={`slot-machine-bg ${isSpinning ? "spinning" : ""}`}
        style={{
          backgroundImage: isSpinning
            ? `url(/assets/slot-machine${(Math.floor(Date.now() / 100) % 5) + 1}.png)`
            : "url(/assets/slot-machine1.png)",
        }}
      >
        <div className="reels-window">
          {slotReels.map((symbolIdx, i) => (
            <div key={i} className={`reel ${isSpinning ? "blur" : ""}`}>
              <img src={SLOT_SYMBOLS[symbolIdx as 0 | 1 | 2 | 3].img} alt="s" />
            </div>
          ))}
        </div>
        <div className={`slot-handle ${isSpinning ? "pulling" : ""}`} />
      </div>
      <div className="bet-controls">
        <input
          type="number"
          min="1"
          max={localFish}
          value={betAmount}
          onChange={(e) => setBetAmount(Number(e.target.value))}
        />
        <button
          className={`btn-spin ${isSpinning ? "disabled" : ""}`}
          onClick={playSlotMachine}
        >
          {isSpinning ? "..." : "SPIN"}
        </button>
      </div>
    </div>
  );
};
