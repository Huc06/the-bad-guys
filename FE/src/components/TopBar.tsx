import { ConnectButton } from "@mysten/dapp-kit";

interface TopBarProps {
  localFish: number;
  dailyLoginFx: { id: number; text: string } | null;
  onOpenTab: (tab: "gacha" | "shop" | "game" | "house" | "book") => void;
  onDailyLogin: () => void;
  onOpenSettings: () => void;
  clickSound: () => void;
}

const CalendarIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const SettingsIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M9 18V5l12-2v13" />
    <circle cx="6" cy="18" r="3" />
    <circle cx="18" cy="16" r="3" />
  </svg>
);

export const TopBar: React.FC<TopBarProps> = ({
  localFish,
  dailyLoginFx,
  onOpenTab,
  onDailyLogin,
  onOpenSettings,
  clickSound,
}) => {
  return (
    <div className="top-bar">
      <div className="group-btn">
        <button
          className="btn-menu"
          style={{ background: "#ff6f00" }}
          onClick={() => {
            clickSound();
            onOpenTab("gacha");
          }}
        >
          GACHA
        </button>
        <button
          className="btn-menu"
          style={{ background: "#d84315" }}
          onClick={() => {
            clickSound();
            onOpenTab("shop");
          }}
        >
          SHOP
        </button>
        <button
          className="btn-menu"
          style={{ background: "#6a1b9a" }}
          onClick={() => {
            clickSound();
            onOpenTab("game");
          }}
        >
          GAME
        </button>
        <button
          className="btn-menu"
          style={{ background: "#fbc02d", color: "black" }}
          onClick={() => {
            clickSound();
            onOpenTab("house");
          }}
        >
          HOUSE
        </button>
        <button
          className="btn-menu"
          style={{ background: "#1565c0" }}
          onClick={() => {
            clickSound();
            onOpenTab("book");
          }}
        >
          BOOK
        </button>
      </div>
      <div className="group-btn">
        <button
          className="btn-menu setting-btn daily-btn"
          onClick={() => {
            clickSound();
            onDailyLogin();
          }}
        >
          <CalendarIcon />
          <span>DAILY</span>
        </button>
        <button
          className="btn-menu setting-btn"
          onClick={() => {
            clickSound();
            onOpenSettings();
          }}
        >
          <SettingsIcon />
          <span>MUSIC</span>
        </button>
        <div className="stat-box fish-token">
          🐟 {Math.floor(localFish)}
          {dailyLoginFx && (
            <div key={dailyLoginFx.id} className="daily-login-fx">
              {dailyLoginFx.text}
            </div>
          )}
        </div>
        <div style={{ opacity: 0.8, transform: "scale(0.8)" }}>
          <ConnectButton />
        </div>
      </div>
    </div>
  );
};
