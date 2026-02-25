import { useState } from "react";

interface DailyLoginProps {
  onClose: () => void;
  onClaim: () => void;
  loginStreak: number;
  clickSound: () => void;
}

export const DailyLogin: React.FC<DailyLoginProps> = ({
  onClose,
  onClaim,
  loginStreak,
  clickSound,
}) => {
  const [claimed, setClaimed] = useState(false);

  const handleClaim = () => {
    setClaimed(true);
    onClaim();
    setTimeout(() => {
      onClose();
    }, 1500);
  };

  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const rewards = [10, 20, 30, 50, 75, 100, 200];

  return (
    <div className="minigame-overlay">
      <div className="pixel-panel" style={{ maxWidth: "700px" }}>
        <button className="btn-close" onClick={onClose}>
          X
        </button>
        <h2 style={{ color: "gold", marginTop: "10px", fontSize: "24px" }}>
          DAILY LOGIN REWARD
        </h2>
        <p style={{ fontSize: "14px", marginBottom: "15px", color: "#bdbdbd" }}>
          Current Streak:{" "}
          <span style={{ color: "#00e676", fontSize: "16px" }}>
            {loginStreak}
          </span>{" "}
          {loginStreak === 1 ? "day" : "days"}
        </p>
        <div className="week-progress">
          {weekDays.map((day, i) => {
            const dayNum = i + 1;
            const isClaimed = loginStreak > dayNum;
            const isCurrent = loginStreak === dayNum;
            return (
              <div
                key={i}
                className={`day-box ${isClaimed ? "claimed" : ""} ${isCurrent ? "current" : ""}`}
              >
                <div className="day-label">{day}</div>
                <div className="reward-amount">{rewards[i]} 🐟</div>
              </div>
            );
          })}
        </div>
        {!claimed ? (
          <button
            className="btn-claim"
            onClick={() => {
              clickSound();
              handleClaim();
            }}
          >
            CLAIM TODAY'S REWARD
          </button>
        ) : (
          <div
            style={{ color: "#4caf50", fontSize: "18px", marginTop: "20px" }}
          >
            ✓ Claimed! +{rewards[loginStreak - 1]} 🐟
          </div>
        )}
      </div>
    </div>
  );
};
