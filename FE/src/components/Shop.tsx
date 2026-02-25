import { useState } from "react";
import { GEAR_DB, DECOR_DB } from "../constants/gameData";
import type { GearDef, DecorDef } from "../types/game";

type ShopTab = "item" | "decor";

interface ShopProps {
  onClose: () => void;
  onBuyItem: (item: GearDef | DecorDef) => void;
  clickSound: () => void;
}

export const Shop: React.FC<ShopProps> = ({
  onClose,
  onBuyItem,
  clickSound,
}) => {
  const [activeTab, setActiveTab] = useState<ShopTab>("item");

  return (
    <div className="minigame-overlay">
      <div className="pixel-panel">
        <button className="btn-close" onClick={onClose}>
          X
        </button>
        <div className="gacha-panel">
          <div className="shop-tabs">
            <button
              className={`tab-btn ${activeTab === "item" ? "active" : ""}`}
              onClick={() => {
                clickSound();
                setActiveTab("item");
              }}
            >
              ITEM
            </button>
            <button
              className={`tab-btn ${activeTab === "decor" ? "active" : ""}`}
              onClick={() => {
                clickSound();
                setActiveTab("decor");
              }}
            >
              DECOR
            </button>
          </div>

          {activeTab === "item" && (
            <div className="shop-grid">
              {GEAR_DB.map((g) => (
                <div key={g.id} className="shop-item">
                  <div className="gear-icon-placeholder" data-item-type={g.id}>
                    <div className="item-icon-visual">
                      {g.id === "g1" && (
                        <div className="icon-bow">
                          <div className="bow-ribbon"></div>
                          <div className="bow-knot"></div>
                        </div>
                      )}
                      {g.id === "g2" && (
                        <div className="icon-bell">
                          <div className="bell-body"></div>
                          <div className="bell-clapper"></div>
                        </div>
                      )}
                      {g.id === "g3" && (
                        <div className="icon-rocket">
                          <div className="rocket-body"></div>
                          <div className="rocket-flame"></div>
                        </div>
                      )}
                    </div>
                  </div>
                  <h4>{g.name}</h4>
                  <div className="shop-price">{g.cost} 🐟</div>
                  <button onClick={() => onBuyItem(g)}>BUY</button>
                </div>
              ))}
            </div>
          )}

          {activeTab === "decor" && (
            <div className="shop-grid">
              {DECOR_DB.map((d) => (
                <div key={d.id} className="shop-item">
                  <img src={d.img} alt="d" />
                  <h4>{d.name}</h4>
                  <div
                    style={{
                      fontSize: "8px",
                      color: "purple",
                      fontStyle: "italic",
                    }}
                  >
                    Flex Item
                  </div>
                  <div className="shop-price">{d.cost} 🐟</div>
                  <button onClick={() => onBuyItem(d)}>BUY</button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
