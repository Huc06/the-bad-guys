import type { CatDbEntry } from "../types/game";

interface GachaProps {
  onClose: () => void;
  gachaResults: CatDbEntry[] | null;
  pityCounter: number;
  onOpenBlindBox: (count: number) => void;
  onCollectResults: () => void;
  onBuyFish: () => void;
  clickSound: () => void;
}

export const Gacha: React.FC<GachaProps> = ({
  onClose,
  gachaResults,
  pityCounter,
  onOpenBlindBox,
  onCollectResults,
  onBuyFish,
  clickSound,
}) => {
  return (
    <div className="minigame-overlay">
      <div className="pixel-panel">
        <button
          className="btn-close"
          onClick={() => {
            clickSound();
            onClose();
          }}
        >
          X
        </button>
        {gachaResults ? (
          <div className="gacha-panel">
            <h2 style={{ color: "gold", fontSize: "30px" }}>RESULTS</h2>
            <div className="result-grid">
              {gachaResults.map((item, i) => (
                <div key={i} className={`result-item ${item.rarity}`}>
                  <div
                    className="item-img"
                    style={{
                      backgroundImage: `url(/assets/cat_${item.id}.png)`,
                    }}
                  />
                  <span>{item.rarity}</span>
                </div>
              ))}
            </div>
            <button
              className="btn-action"
              onClick={() => {
                clickSound();
                onCollectResults();
              }}
            >
              COLLECT
            </button>
          </div>
        ) : (
          <div className="gacha-panel">
            <h2 style={{ color: "gold", fontSize: "24px", marginTop: "10px" }}>
              BLIND BOX
            </h2>
            <div className="gacha-banner blind-box">
              <div className="blind-box-visual">?</div>
              <div className="banner-info">
                SSR: 1% | SR: 5% | Pity: {pityCounter}/60
              </div>
            </div>
            <div className="gacha-actions">
              <div className="btn-roll" onClick={() => onOpenBlindBox(1)}>
                <span>OPEN 1</span>
                <br />
                <span>160 🐟</span>
              </div>
              <div
                className="btn-roll premium"
                onClick={() => onOpenBlindBox(10)}
              >
                <span>OPEN 10</span>
                <br />
                <span>1600 🐟</span>
              </div>
            </div>
            <div className="sui-top-up-section">
              <div>
                <div style={{ color: "white", fontSize: "10px" }}>
                  WALLET BALANCE
                </div>
                <div className="sui-rate-text">1 SUI = 1000 FISH (TEST)</div>
              </div>
              <button
                className="btn-action"
                style={{
                  width: "auto",
                  padding: "10px",
                  background: "#76ff03",
                  color: "black",
                  fontWeight: "bold",
                }}
                onClick={onBuyFish}
              >
                TOP UP 1 SUI
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
