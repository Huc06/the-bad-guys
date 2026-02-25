import { useState } from "react";
import { SlotMachine } from "./games/SlotMachine";
import { CoinFlip } from "./games/CoinFlip";
import { MemoryGame } from "./games/MemoryGame";
import { DiceGame } from "./games/DiceGame";
import { Roulette } from "./games/Roulette";
import { Blackjack } from "./games/Blackjack";

type GameType =
  | "card"
  | "coin"
  | "slot"
  | "dice"
  | "roulette"
  | "blackjack"
  | null;

interface GameCenterProps {
  onClose: () => void;
  localFish: number;
  setLocalFish: (fish: number) => void;
  gameCount: number;
  setGameCount: (count: number) => void;
  clickSound: () => void;
}

export const GameCenter: React.FC<GameCenterProps> = ({
  onClose,
  localFish,
  setLocalFish,
  gameCount,
  setGameCount,
  clickSound,
}) => {
  const [selectedGame, setSelectedGame] = useState<GameType>(null);
  const [gameResultMsg, setGameResultMsg] = useState("");

  const handleBack = () => {
    clickSound();
    setSelectedGame(null);
    setGameResultMsg("");
  };

  return (
    <div className="minigame-overlay">
      <div className="pixel-panel arcade-panel">
        <button className="btn-close" onClick={onClose}>
          X
        </button>
        {!selectedGame ? (
          <>
            <h2
              style={{ textShadow: "3px 4px 2px #5c69ff", marginTop: "30px" }}
            >
              GAME CENTER
            </h2>
            <div
              style={{
                fontSize: "16px",
                color: "#4caf50",
                marginBottom: "10px",
              }}
            >
              🎮 Win to earn more!
            </div>
            <div className="arcade-menu">
              <button
                className="game-card-btn"
                onClick={() => setSelectedGame("card")}
              >
                <div className="game-icon memory-icon"></div>
                <span>MEMORY</span>
              </button>
              <button
                className="game-card-btn"
                onClick={() => {
                  clickSound();
                  setSelectedGame("coin");
                }}
              >
                <div className="game-icon coin-icon"></div>
                <span>COIN FLIP</span>
              </button>
              <button
                className="game-card-btn"
                onClick={() => {
                  clickSound();
                  setSelectedGame("slot");
                }}
              >
                <div className="game-icon slot-icon"></div>
                <span>SLOTS</span>
              </button>
              <button
                className="game-card-btn"
                onClick={() => {
                  clickSound();
                  setSelectedGame("dice");
                }}
              >
                <div className="game-icon dice-icon"></div>
                <span>DICE ROLL</span>
              </button>
              <button
                className="game-card-btn"
                onClick={() => {
                  clickSound();
                  setSelectedGame("roulette");
                }}
              >
                <div className="game-icon roulette-icon"></div>
                <span>ROULETTE</span>
              </button>
              <button
                className="game-card-btn"
                onClick={() => {
                  clickSound();
                  setSelectedGame("blackjack");
                }}
              >
                <div className="game-icon blackjack-icon"></div>
                <span>BLACKJACK</span>
              </button>
            </div>
          </>
        ) : (
          <div className="game-stage">
            <button
              className="btn-menu"
              style={{ marginBottom: "10px" }}
              onClick={handleBack}
            >
              ⬅ BACK
            </button>

            {selectedGame === "slot" && (
              <SlotMachine
                localFish={localFish}
                setLocalFish={setLocalFish}
                gameCount={gameCount}
                setGameCount={setGameCount}
                setGameResultMsg={setGameResultMsg}
                clickSound={clickSound}
              />
            )}

            {selectedGame === "coin" && (
              <CoinFlip
                localFish={localFish}
                setLocalFish={setLocalFish}
                gameCount={gameCount}
                setGameCount={setGameCount}
                setGameResultMsg={setGameResultMsg}
                clickSound={clickSound}
              />
            )}

            {selectedGame === "dice" && (
              <DiceGame
                localFish={localFish}
                setLocalFish={setLocalFish}
                gameCount={gameCount}
                setGameCount={setGameCount}
                setGameResultMsg={setGameResultMsg}
                clickSound={clickSound}
              />
            )}

            {selectedGame === "roulette" && (
              <Roulette
                localFish={localFish}
                setLocalFish={setLocalFish}
                gameCount={gameCount}
                setGameCount={setGameCount}
                setGameResultMsg={setGameResultMsg}
                clickSound={clickSound}
              />
            )}

            {selectedGame === "blackjack" && (
              <Blackjack
                localFish={localFish}
                setLocalFish={setLocalFish}
                gameCount={gameCount}
                setGameCount={setGameCount}
                setGameResultMsg={setGameResultMsg}
                clickSound={clickSound}
              />
            )}

            {selectedGame === "card" && (
              <MemoryGame
                localFish={localFish}
                setLocalFish={setLocalFish}
                gameCount={gameCount}
                setGameCount={setGameCount}
                setGameResultMsg={setGameResultMsg}
              />
            )}

            <div className="game-msg" style={{ fontSize: "16px" }}>
              {gameResultMsg}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
