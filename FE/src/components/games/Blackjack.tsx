import { useState } from "react";

interface BlackjackProps {
  localFish: number;
  setLocalFish: (fish: number) => void;
  gameCount: number;
  setGameCount: (count: number) => void;
  setGameResultMsg: (msg: string) => void;
  clickSound: () => void;
}

export const Blackjack: React.FC<BlackjackProps> = ({
  localFish,
  setLocalFish,
  gameCount,
  setGameCount,
  setGameResultMsg,
  clickSound,
}) => {
  const [betAmount, setBetAmount] = useState(10);
  const [isDealing, setIsDealing] = useState(false);
  const [dealer, setDealer] = useState(0);
  const [player, setPlayer] = useState<[number, number]>([0, 0]);

  const deal = () => {
    if (betAmount > localFish || gameCount >= 10) return;
    setIsDealing(true);
    clickSound();

    const dealerCard = Math.floor(Math.random() * 11) + 1;
    const p1 = Math.floor(Math.random() * 11) + 1;
    const p2 = Math.floor(Math.random() * 11) + 1;

    setDealer(dealerCard);
    setPlayer([p1, p2]);

    setTimeout(() => {
      setIsDealing(false);
      const playerTotal = p1 + p2;
      const dealerTotal = dealerCard + 10;

      if (playerTotal === 21) {
        setLocalFish(localFish + betAmount * 3);
        setGameResultMsg(`🃏 BLACKJACK! WIN +${betAmount * 3}🐟`);
      } else if (playerTotal > dealerTotal && playerTotal <= 21) {
        setLocalFish(localFish + betAmount * 2);
        setGameResultMsg(`🃏 WIN! +${betAmount * 2}🐟`);
      } else {
        setLocalFish(localFish - betAmount);
        setGameResultMsg(`🃏 LOSE -${betAmount}🐟`);
      }
      setGameCount(gameCount + 1);
    }, 1500);
  };

  return (
    <div className="blackjack-container">
      <div className="blackjack-table">
        <div className="dealer-hand">
          <h4>DEALER: {isDealing ? "?" : dealer + 10}</h4>
          <div className="playing-card">
            {isDealing ? "🂠" : `${dealer + 10}`}
          </div>
        </div>
        <div className="player-hand">
          <h4>YOU: {isDealing ? "?" : player[0] + player[1]}</h4>
          <div className="card-row">
            <div className="playing-card">
              {isDealing ? "🂠" : `${player[0]}`}
            </div>
            <div className="playing-card">
              {isDealing ? "🂠" : `${player[1]}`}
            </div>
          </div>
        </div>
      </div>
      {!isDealing && (
        <div className="bet-controls">
          <input
            type="number"
            min="1"
            max={localFish}
            value={betAmount}
            onChange={(e) => setBetAmount(Number(e.target.value))}
          />
          <button className="btn-spin" onClick={deal}>
            DEAL
          </button>
        </div>
      )}
    </div>
  );
};
