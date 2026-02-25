import { useState } from "react";
import {
  CAT_DB,
  GEAR_DB,
  DECOR_DB,
  PERSONALITY_MAP,
} from "../constants/gameData";
import type { CatDbEntry, InventoryItem } from "../types/game";

interface BookProps {
  onClose: () => void;
  inventory: InventoryItem[];
  clickSound: () => void;
}

export const Book: React.FC<BookProps> = ({
  onClose,
  inventory,
  clickSound,
}) => {
  const [detailCat, setDetailCat] = useState<CatDbEntry | null>(null);

  if (detailCat) {
    return (
      <div className="minigame-overlay">
        <div className="book-container detail-view">
          <img
            src="/assets/book-ui.png"
            alt="book background"
            className="book-bg-image"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
          <button
            className="btn-close"
            style={{ top: "15px", right: "15px" }}
            onClick={() => {
              clickSound();
              setDetailCat(null);
            }}
          >
            X
          </button>
          <div className="book-page left-page">
            <h3
              style={{
                color: detailCat.rarity === "SSR" ? "gold" : "#333",
                fontSize: "20px",
              }}
            >
              {detailCat.name}
            </h3>
            <div
              className="cat-portrait"
              style={{
                backgroundImage: `url(/assets/cat_${detailCat.id}.png)`,
              }}
            />
            <div
              className="rarity-badge"
              style={{
                color: detailCat.rarity === "SSR" ? "gold" : "#333",
              }}
            >
              {detailCat.rarity} TIER
            </div>
          </div>
          <div className="book-page right-page">
            <h3>STATS</h3>
            <div className="stat-row">
              <span>PERSONALITY:</span> <span>{detailCat.personality}</span>
            </div>
            <div className="stat-desc">
              "{PERSONALITY_MAP[detailCat.personality]?.desc}"
            </div>
            <div
              style={{
                marginTop: "20px",
                border: "1px dashed #000",
                padding: "5px",
              }}
            >
              <div>W: {PERSONALITY_MAP[detailCat.personality].w}</div>
              <div>C: {PERSONALITY_MAP[detailCat.personality].c}</div>
              <div>E: {PERSONALITY_MAP[detailCat.personality].e}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="minigame-overlay">
      <div className="book-container">
        <img
          src="/assets/book-ui.png"
          alt="book background"
          className="book-bg-image"
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
        <button className="btn-close" onClick={onClose}>
          X
        </button>
        <div className="book-page">
          <h3>CATS</h3>
          <div className="book-grid">
            {CAT_DB.map((c) => {
              const isOwned = inventory.some((i) => (i as any).id === c.id);
              return (
                <div
                  key={c.id}
                  className={`book-item ${!isOwned ? "locked" : ""}`}
                  onClick={() => {
                    if (isOwned) {
                      clickSound();
                      setDetailCat(c);
                    }
                  }}
                >
                  {isOwned ? (
                    <div
                      className="pixel-icon"
                      style={{
                        backgroundImage: `url(/assets/cat_${c.id}.png)`,
                      }}
                    />
                  ) : (
                    "?"
                  )}
                </div>
              );
            })}
          </div>
        </div>
        <div className="book-page">
          <h3>ITEMS</h3>
          <div className="book-grid book-items-grid">
            {[...GEAR_DB, ...DECOR_DB].map((item) => (
              <div key={item.id} className="book-item book-item-text">
                <span
                  style={{
                    fontSize: "9px",
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  {item.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
