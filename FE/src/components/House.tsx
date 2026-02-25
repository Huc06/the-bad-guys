import { useState } from "react";
import type { CatItem, TeamStats } from "../types/game";

interface HouseProps {
  onClose: () => void;
  inventory: CatItem[];
  equippedIds: string[];
  teamStats: TeamStats;
  onInspectCat: (cat: CatItem) => void;
  clickSound: () => void;
}

export const House: React.FC<HouseProps> = ({
  onClose,
  inventory,
  equippedIds,
  teamStats,
  onInspectCat,
  clickSound,
}) => {
  const [filterRarity, setFilterRarity] = useState<"ALL" | "R" | "SR" | "SSR">(
    "ALL",
  );

  const filteredCats = inventory.filter(
    (cat) => filterRarity === "ALL" || cat.rarity === filterRarity,
  );

  return (
    <div className="minigame-overlay">
      <div
        className="pixel-panel"
        style={{ width: "800px", position: "relative" }}
      >
        <button
          className="btn-close"
          onClick={() => {
            clickSound();
            onClose();
          }}
        >
          X
        </button>
        <h2 style={{ color: "gold", textShadow: "2px 2px 0 #000" }}>
          MY HOUSE
        </h2>

        <div className="rpg-stats-container">
          <div className="rpg-stat-bars">
            <div className="rpg-stat-row">
              <span className="stat-icon">🔥</span>
              <span className="stat-label" style={{ color: "#ff9800" }}>
                WARMTH
              </span>
              <div className="pixel-bar-bg">
                <div
                  className="pixel-bar-fill bar-w"
                  style={{
                    width: `${Math.min(100, Math.max(5, (teamStats.w + 10) * 3))}%`,
                  }}
                />
              </div>
              <span className="stat-number">{teamStats.w}</span>
            </div>
            <div className="rpg-stat-row">
              <span className="stat-icon">⚡</span>
              <span className="stat-label" style={{ color: "#f44336" }}>
                CHAOS
              </span>
              <div className="pixel-bar-bg">
                <div
                  className="pixel-bar-fill bar-c"
                  style={{
                    width: `${Math.min(100, Math.max(5, (teamStats.c + 10) * 3))}%`,
                  }}
                />
              </div>
              <span className="stat-number">{teamStats.c}</span>
            </div>
            <div className="rpg-stat-row">
              <span className="stat-icon">🔋</span>
              <span className="stat-label" style={{ color: "#29b6f6" }}>
                ENERGY
              </span>
              <div className="pixel-bar-bg">
                <div
                  className="pixel-bar-fill bar-e"
                  style={{
                    width: `${Math.min(100, Math.max(5, (teamStats.e + 10) * 3))}%`,
                  }}
                />
              </div>
              <span className="stat-number">{teamStats.e}</span>
            </div>
          </div>
          <div className="rpg-synergy-badge">
            <div
              style={{ fontSize: "8px", color: "#aaa", marginBottom: "5px" }}
            >
              ACTIVE EFFECT
            </div>
            <div
              style={{
                color: "gold",
                fontWeight: "bold",
                fontSize: "12px",
                lineHeight: "1.5",
              }}
            >
              {teamStats.label}
            </div>
          </div>
        </div>

        <div className="filter-bar">
          {(["ALL", "R", "SR", "SSR"] as const).map((r) => (
            <button
              key={r}
              className={filterRarity === r ? "active" : ""}
              onClick={() => {
                clickSound();
                setFilterRarity(r);
              }}
            >
              {r}
            </button>
          ))}
        </div>

        <div className="house-grid">
          {filteredCats.map((cat) => (
            <div
              key={String(cat.uuid)}
              className={`house-slot ${equippedIds.includes(String(cat.uuid)) ? "active" : ""}`}
              onClick={() => {
                clickSound();
                onInspectCat(cat);
              }}
            >
              <div className="level-badge">{cat.level || 1}</div>
              <div
                className="pixel-icon"
                style={{
                  backgroundImage: `url(/assets/cat_${cat.id}.png)`,
                }}
              />
              <div className="hunger-bar">
                <div
                  style={{
                    width: `${cat.hunger}%`,
                    background: cat.hunger < 20 ? "red" : "#00e676",
                  }}
                />
              </div>
              <span style={{ fontSize: "7px", color: "#aaa" }}>
                {cat.personality}
              </span>
              {cat.equippedGear && (
                <div
                  style={{
                    position: "absolute",
                    bottom: 2,
                    right: 2,
                    fontSize: "10px",
                  }}
                >
                  {cat.equippedGear.img}
                </div>
              )}
              {equippedIds.includes(String(cat.uuid)) && (
                <div className="equipped-badge">E</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
