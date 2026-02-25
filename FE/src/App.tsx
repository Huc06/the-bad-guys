import {
  ConnectButton,
  useCurrentAccount,
  useSignAndExecuteTransaction,
} from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { useEffect, useRef, useState } from "react";
import type { MouseEvent } from "react";
import "./App.css";
import { GAME_STORE_ID, SUI_MIST_AMOUNT_TEST } from "./hook/constants";
import {
  CAT_DB,
  GEAR_DB,
  DECOR_DB,
  MINING_RATE,
  PERSONALITY_MAP,
  CARD_ICONS,
  SLOT_SYMBOLS,
  EDIT_BACKGROUND_OPTIONS,
} from "./constants/gameData";
import { readJson } from "./utils/storage";
import type {
  CatDbEntry,
  CatItem,
  DecorDef,
  GearDef,
  InventoryItem,
  PendingRewards,
  PlacedDecor,
  TeamStats,
  Uuid,
  ActiveTab,
  ShopTab,
  ArcadeGame,
  DailyLoginResult,
  DailyLoginFx,
} from "./types/game";

// Import components
import { TopBar } from "./components/TopBar";
import { EditMode } from "./components/EditMode";
import { GameCenter } from "./components/GameCenter";
import { Shop } from "./components/Shop";
import { Gacha } from "./components/Gacha";
import { House } from "./components/House";
import { Book } from "./components/Book";
import { DailyLogin } from "./components/DailyLogin";

const EditHouseIcon = ({ size = 22 }: { size?: number }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 740 800"
    width={size}
    height={size}
    style={{ opacity: 1, display: "block" }}
  >
    <path
      fill="currentColor"
      d="M714 190q11 0 18 7t5 18l-42 428q-2 10-12 10H55q-11 0-11-10L1 215q-1-10 6-18t17-7zm-20-46H45V28q0-10 7-17t16-6h185q10 0 17 6t7 17v23h393q10 0 17 6t7 17z"
    />
  </svg>
);

export default function App() {
  const account = useCurrentAccount();
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();

  // State management
  const [localFish, setLocalFish] = useState<number>(() =>
    parseFloat(localStorage.getItem("fish") || "500"),
  );
  const [localMeow, setLocalMeow] = useState<number>(() =>
    parseFloat(localStorage.getItem("meow") || "0"),
  );

  const [inventory, setInventory] = useState<InventoryItem[]>(() => {
    const saved = readJson<InventoryItem[]>("inventory", []);
    if (saved.length === 0) {
      const starter: CatItem = {
        ...CAT_DB[0],
        uuid: Date.now(),
        type: "cat",
        isNew: true,
        hunger: 100,
        level: 1,
        equippedGear: null,
      };
      return [starter];
    }
    return saved;
  });

  const [equippedIds, setEquippedIds] = useState<Uuid[]>(() => {
    const saved = readJson<Uuid[]>("equipped", []);
    if (saved.length === 0 && inventory.length > 0) return [inventory[0].uuid];
    return saved;
  });

  const [activeShopTab, setActiveShopTab] = useState<ShopTab>("item");
  const [placedDecor, setPlacedDecor] = useState<PlacedDecor[]>(() =>
    readJson<PlacedDecor[]>("placedDecor", []),
  );
  const [isEditMode, setIsEditMode] = useState(false);
  const [draggedDecorId, setDraggedDecorId] = useState<Uuid | null>(null);
  const [editBackgroundId, setEditBackgroundId] = useState<
    (typeof EDIT_BACKGROUND_OPTIONS)[number]["id"]
  >(() => {
    const saved = localStorage.getItem("editBackgroundId");
    const found = EDIT_BACKGROUND_OPTIONS.find((o) => o.id === saved);
    return found?.id ?? "home";
  });
  const [mainBackgroundId, setMainBackgroundId] = useState<
    (typeof EDIT_BACKGROUND_OPTIONS)[number]["id"]
  >(() => {
    const saved = localStorage.getItem("mainBackgroundId");
    const found = EDIT_BACKGROUND_OPTIONS.find((o) => o.id === saved);
    return found?.id ?? "home";
  });

  const [pityCounter, setPityCounter] = useState<number>(() =>
    parseInt(localStorage.getItem("pity") || "0", 10),
  );
  const [pendingRewards, setPendingRewards] = useState<PendingRewards>({
    fish: 0,
    meow: 0,
  });
  const [teamStats, setTeamStats] = useState<TeamStats>({
    w: 0,
    c: 0,
    e: 0,
    label: "Neutral",
  });

  const [activeTab, setActiveTab] = useState<ActiveTab>(null);
  const [gachaResults, setGachaResults] = useState<CatItem[] | null>(null);
  const [isRolling, setIsRolling] = useState(false);
  const [bookDetailCat, setBookDetailCat] = useState<CatDbEntry | null>(null);
  const [filterRarity, setFilterRarity] = useState<"ALL" | "R" | "SR" | "SSR">(
    "ALL",
  );
  const [inspectCat, setInspectCat] = useState<CatItem | null>(null);
  const [showGearSelect, setShowGearSelect] = useState(false);

  const [catPos, setCatPos] = useState<Record<string, number>>({});
  const [catDir, setCatDir] = useState<Record<string, "right" | "left">>({});
  const [movingCats, setMovingCats] = useState<Record<string, boolean>>({});
  const [interactingCatId, setInteractingCatId] = useState<Uuid | null>(null);

  const bgmRef = useRef<HTMLAudioElement>(
    new Audio("/assets/sounds/bgm_main.mp3"),
  );
  const sfxRef = useRef<Record<string, HTMLAudioElement>>({});
  const [musicVol, setMusicVol] = useState(1);
  const [sfxVol, setSfxVol] = useState(1);
  const [showSettings, setShowSettings] = useState(false);
  const [showDailyLogin, setShowDailyLogin] = useState(false);
  const [dailyLoginFx, setDailyLoginFx] = useState<DailyLoginFx | null>(null);

  const [gameCount, setGameCount] = useState<number>(() =>
    parseInt(localStorage.getItem("gameCount") || "0", 10),
  );
  const [lastLoginDate, setLastLoginDate] = useState<string>(
    () => localStorage.getItem("lastLoginDate") || "",
  );
  const [loginStreak, setLoginStreak] = useState<number>(() =>
    parseInt(localStorage.getItem("loginStreak") || "0", 10),
  );
  const [selectedGame, setSelectedGame] = useState<ArcadeGame>(null);
  const [betAmount, setBetAmount] = useState(10);
  const [gameResultMsg, setGameResultMsg] = useState("");
  const [cards, setCards] = useState<
    Array<{ id: number; icon: (typeof CARD_ICONS)[number] }>
  >([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matchedCards, setMatchedCards] = useState<number[]>([]);
  const [timer, setTimer] = useState(60);
  const [gameState, setGameState] = useState<"idle" | "playing" | "won">(
    "idle",
  );
  const [isFlipping, setIsFlipping] = useState(false);
  const [coinSide, setCoinSide] = useState<"heads" | "tails">("heads");
  const [slotReels, setSlotReels] = useState<number[]>([0, 1, 2]);
  const [isSpinning, setIsSpinning] = useState(false);

  // useEffect hooks for localStorage
  useEffect(() => {
    localStorage.setItem("meow", String(localMeow));
  }, [localMeow]);
  useEffect(() => {
    localStorage.setItem("fish", String(localFish));
  }, [localFish]);
  useEffect(() => {
    localStorage.setItem("inventory", JSON.stringify(inventory));
  }, [inventory]);
  useEffect(() => {
    localStorage.setItem("equipped", JSON.stringify(equippedIds));
  }, [equippedIds]);
  useEffect(() => {
    localStorage.setItem("pity", String(pityCounter));
  }, [pityCounter]);
  useEffect(() => {
    localStorage.setItem("placedDecor", JSON.stringify(placedDecor));
  }, [placedDecor]);
  useEffect(() => {
    localStorage.setItem("editBackgroundId", editBackgroundId);
  }, [editBackgroundId]);
  useEffect(() => {
    localStorage.setItem("mainBackgroundId", mainBackgroundId);
  }, [mainBackgroundId]);
  useEffect(() => {
    localStorage.setItem("gameCount", String(gameCount));
    localStorage.setItem("lastPlayedDate", new Date().toDateString());
  }, [gameCount]);
  useEffect(() => {
    localStorage.setItem("lastLoginDate", lastLoginDate);
  }, [lastLoginDate]);
  useEffect(() => {
    localStorage.setItem("loginStreak", String(loginStreak));
  }, [loginStreak]);
  useEffect(() => {
    if (!dailyLoginFx) return;
    const t = window.setTimeout(() => setDailyLoginFx(null), 1100);
    return () => window.clearTimeout(t);
  }, [dailyLoginFx]);

  // Audio setup
  useEffect(() => {
    bgmRef.current.loop = true;
    bgmRef.current.volume = musicVol;
    bgmRef.current.play().catch(() => {});
    [
      "ui_click.mp3",
      "ui_open.mp3",
      "game_win.wav",
      "slot_spin.wav",
      "cat_meow.mp3",
      "cat_eat.mp3",
    ].forEach((n) => {
      sfxRef.current[n] = new Audio(`/assets/sounds/${n}`);
    });
  }, []);

  useEffect(() => {
    bgmRef.current.volume = musicVol;
  }, [musicVol]);

  const playSfx = (name: string) => {
    if (sfxVol <= 0) return;
    const audio = sfxRef.current[name];
    if (audio) {
      audio.currentTime = 0;
      audio.volume = sfxVol;
      audio.play().catch(() => {});
    }
  };

  const clickSound = () => playSfx("ui_click.mp3");

  // Team stats calculation
  useEffect(() => {
    const activeCats = inventory.filter(
      (c): c is CatItem => c.type === "cat" && equippedIds.includes(c.uuid),
    );
    let totalW = 0;
    let totalC = 0;
    let totalE = 0;
    activeCats.forEach((cat) => {
      const stats = PERSONALITY_MAP[cat.personality] || { w: 0, c: 0, e: 0 };
      totalW += stats.w;
      totalC += stats.c;
      totalE += stats.e;
    });
    let label = "Balanced";
    if (totalC > 5) label = "Chaotic (+Crit)";
    else if (totalW > 5) label = "Harmonious (+Stable)";
    else if (totalE > 5) label = "Energetic (+Speed)";
    setTeamStats({ w: totalW, c: totalC, e: totalE, label });
  }, [equippedIds, inventory]);

  // Mining tick
  useEffect(() => {
    const miningTick = setInterval(() => {
      setInventory((prevInv) => {
        let earnedFish = 0;
        let earnedMeow = 0;
        let anyGearBroke = false;
        const nextInv = prevInv.map((cat) => {
          if (cat.type !== "cat") return cat;
          if (!equippedIds.includes(cat.uuid)) return cat;
          if (cat.hunger <= 0) return cat;

          const rates = MINING_RATE[cat.rarity];
          const levelMult = 1 + cat.level * 0.1;
          const energyBonus = 1 + teamStats.e * 0.02;

          let gearMult = 0;
          let hungerDrain = rates.base_drain;
          let nextGear = cat.equippedGear;

          if (nextGear) {
            gearMult = nextGear.boost;
            hungerDrain += nextGear.drain;

            const updatedGear = {
              ...nextGear,
              durability: nextGear.durability - nextGear.fragility,
            };
            if (updatedGear.durability <= 0) {
              nextGear = null;
              anyGearBroke = true;
            } else {
              nextGear = updatedGear;
            }
          }

          let tickFish = rates.fish * levelMult * energyBonus * (1 + gearMult);
          if (Math.random() < teamStats.c * 0.05) tickFish *= 2;

          earnedFish += tickFish;
          if (Math.random() < rates.meow) earnedMeow += 1;

          return {
            ...cat,
            hunger: Math.max(0, cat.hunger - hungerDrain),
            equippedGear: nextGear,
          };
        });

        if (anyGearBroke) playSfx("ui_open.mp3");
        if (earnedFish > 0 || earnedMeow > 0)
          setPendingRewards((prev) => ({
            fish: prev.fish + earnedFish,
            meow: prev.meow + earnedMeow,
          }));
        return nextInv;
      });
    }, 3000);
    return () => clearInterval(miningTick);
  }, [equippedIds, teamStats]);

  // Cat movement
  useEffect(() => {
    const interval = setInterval(() => {
      setCatPos((prev) => {
        const next = { ...prev };
        const nextDir = { ...catDir };
        equippedIds.forEach((id, idx) => {
          const key = String(id);
          if (!next[key]) next[key] = 10 + idx * 15;
          if (movingCats[key]) {
            let x = next[key];
            let dir = nextDir[key] || "right";
            if (dir === "right") {
              x += 0.5;
              if (x > 90) dir = "left";
            } else {
              x -= 0.5;
              if (x < 5) dir = "right";
            }
            next[key] = x;
            nextDir[key] = dir;
          }
        });
        setCatDir(nextDir);
        return next;
      });
    }, 50);
    return () => clearInterval(interval);
  }, [equippedIds, movingCats, catDir]);

  // Decor drag handlers
  const handleDragStart = (
    e: MouseEvent<HTMLElement>,
    uuid: Uuid,
    fromInventory = false,
  ) => {
    if (!isEditMode) return;
    e.preventDefault();
    e.stopPropagation();
    if (fromInventory) {
      const baseItem = inventory.find((i) => i.uuid === uuid);
      if (
        baseItem &&
        baseItem.type === "decor" &&
        !placedDecor.some((p) => p.uuid === uuid)
      ) {
        const newItem: PlacedDecor = {
          ...baseItem,
          x: e.clientX,
          y: e.clientY,
        };
        setPlacedDecor((prev) => [...prev, newItem]);
      }
    }
    setDraggedDecorId(uuid);
  };

  const handleMouseMove = (e: MouseEvent<HTMLElement>) => {
    if (!isEditMode || !draggedDecorId) return;
    e.preventDefault();
    setPlacedDecor((prev) =>
      prev.map((item) => {
        if (item.uuid === draggedDecorId) {
          return { ...item, x: e.clientX, y: e.clientY };
        }
        return item;
      }),
    );
  };

  const handleMouseUp = () => {
    setDraggedDecorId(null);
  };

  const deleteDecor = (uuid: Uuid) => {
    setInventory((prev) =>
      prev.filter((i) => !(i.type === "decor" && i.uuid === uuid)),
    );
    setPlacedDecor((prev) => prev.filter((p) => p.uuid !== uuid));
    setDraggedDecorId((prev) => (prev === uuid ? null : prev));
  };

  const handleDecorDoubleClick = (e: MouseEvent<HTMLElement>, uuid: Uuid) => {
    if (!isEditMode) return;
    e.stopPropagation();
    playSfx("ui_open.mp3");
    setPlacedDecor((prev) => prev.filter((p) => p.uuid !== uuid));
  };

  // Buy fish with SUI
  const buyFish = () => {
    clickSound();
    if (!account) return alert("Connect Wallet!");
    const tx = new Transaction();
    const [paymentCoin] = tx.splitCoins(tx.gas, [
      tx.pure.u64(SUI_MIST_AMOUNT_TEST),
    ]);
    tx.transferObjects([paymentCoin], tx.pure.address(GAME_STORE_ID));
    (
      signAndExecute as unknown as (
        args: unknown,
        opts: { onSuccess: () => void; onError: (err: unknown) => void },
      ) => void
    )(
      { transaction: tx },
      {
        onSuccess: () => {
          setLocalFish((p) => p + 10000);
          playSfx("game_win.wav");
          alert(
            "Payment Success! Received +1000 FISH (Simulated 1 SUI top-up)",
          );
        },
        onError: (err) => {
          console.error("SUI Transaction Failed:", err);
          alert(
            "Transaction Failed. Ensure your connected wallet has SUI funds to cover the transaction fee. Error details in console.",
          );
        },
      },
    );
  };

  // Buy item from shop
  const buyItem = (item: GearDef | DecorDef) => {
    clickSound();
    if (localFish < item.cost) return alert("Not enough FISH!");
    setLocalFish((p) => p - item.cost);
    if (item.type === "decor") {
      const newDecor: InventoryItem = {
        ...item,
        uuid: Date.now(),
        type: "decor",
      };
      setInventory((prev) => [...prev, newDecor]);
      playSfx("ui_click.mp3");
      alert("Decor purchased! Open 'EDIT HOUSE' to place it.");
    } else if (item.type === "gear") {
      const { type: _type, ...rest } = item;
      const newItem: InventoryItem = {
        ...rest,
        uuid: Date.now(),
        type: "gear_item",
        maxDurability: item.durability,
      };
      setInventory((prev) => [...prev, newItem]);
      playSfx("ui_click.mp3");
      alert("Gear purchased! Inspect a cat to equip.");
    }
  };

  // Level up cat
  const levelUpCat = (cat: CatItem) => {
    const currentLevel = cat.level || 1;
    let cost = currentLevel * 200;
    if (currentLevel % 10 === 0) cost *= 3;
    if (localFish < cost) return alert(`Need ${cost} FISH!`);
    clickSound();
    setLocalFish((p) => p - cost);
    playSfx("ui_open.mp3");
    setInventory((prev) =>
      prev.map((c) =>
        c.type === "cat" && c.uuid === cat.uuid
          ? { ...c, level: currentLevel + 1 }
          : c,
      ),
    );
    setInspectCat((prev) =>
      prev ? { ...prev, level: currentLevel + 1 } : prev,
    );
  };

  // Equip gear to cat
  const equipGearToCat = (
    cat: CatItem,
    gearItem: Extract<InventoryItem, { type: "gear_item" }>,
  ) => {
    clickSound();
    setInventory((prev) => {
      const targetCat = prev.find(
        (c): c is CatItem => c.type === "cat" && c.uuid === cat.uuid,
      );
      const itemsToAdd: InventoryItem[] = [];
      if (targetCat?.equippedGear) {
        itemsToAdd.push({
          ...targetCat.equippedGear,
          type: "gear_item",
          uuid: `${Date.now()}old`,
          maxDurability: targetCat.equippedGear.durability,
        });
      }
      const newInv = prev.filter((i) => i.uuid !== gearItem.uuid);
      return [...newInv, ...itemsToAdd].map((c) => {
        if (c.type === "cat" && c.uuid === cat.uuid) {
          const {
            uuid: _uuid,
            type: _type,
            maxDurability: _maxDurability,
            ...equippedGear
          } = gearItem;
          return { ...c, equippedGear };
        }
        return c;
      });
    });
    setShowGearSelect(false);
    setInspectCat(null);
  };

  // Unequip gear
  const unequipGear = (cat: CatItem) => {
    const gear = cat.equippedGear;
    if (!gear) return;
    clickSound();
    setInventory((prev) => {
      const returnedGear: Extract<InventoryItem, { type: "gear_item" }> = {
        ...gear,
        uuid: Date.now(),
        type: "gear_item",
        maxDurability: gear.durability,
      };
      return [...prev, returnedGear].map((c) => {
        if (c.type === "cat" && c.uuid === cat.uuid)
          return { ...c, equippedGear: null };
        return c;
      });
    });
    setInspectCat(null);
  };

  // Open blind box (gacha)
  const openBlindBox = (times: number) => {
    const cost = times * 160;
    if (localFish < cost) return alert("Not enough FISH!");
    setLocalFish((p) => p - cost);
    setIsRolling(true);
    playSfx("slot_spin.wav");
    setTimeout(() => {
      const newItems: CatItem[] = [];
      let currentPity = pityCounter;
      for (let i = 0; i < times; i++) {
        currentPity++;
        let rarity: "R" | "SR" | "SSR" = "R";
        const roll = Math.random() * 100;
        if (currentPity >= 60) {
          rarity = "SSR";
          currentPity = 0;
        } else {
          if (roll < 1) {
            rarity = "SSR";
            currentPity = 0;
          } else if (roll < 6) rarity = "SR";
        }
        const candidates = CAT_DB.filter((x) => x.rarity === rarity);
        const item = candidates[Math.floor(Math.random() * candidates.length)];
        newItems.push({
          ...item,
          uuid: Date.now() + Math.random(),
          type: "cat",
          isNew: true,
          hunger: 100,
          level: 1,
          equippedGear: null,
        });
      }
      setPityCounter(currentPity);
      setInventory((prev) => [...prev, ...newItems]);
      setGachaResults(newItems);
      setIsRolling(false);
      const hasRare = newItems.some(
        (i) => i.rarity === "SSR" || i.rarity === "SR",
      );
      playSfx(hasRare ? "game_win.wav" : "ui_click.mp3");
    }, 2500);
  };

  // Daily login
  const handleDailyLogin = () => {
    clickSound();
    setShowDailyLogin(true);
  };

  const handleDailyLoginClaim = () => {
    const now = new Date();
    const todayStr = now.toDateString();
    const todayStart = new Date(todayStr).getTime();
    let lastClaimMs = parseInt(
      localStorage.getItem("dailyLoginLastClaimMs") || "0",
      10,
    );
    if (!lastClaimMs && lastLoginDate) {
      lastClaimMs = new Date(lastLoginDate).getTime();
    }
    if (lastClaimMs === todayStart) {
      return; // Already claimed
    }
    const diffDays = lastClaimMs
      ? Math.floor((todayStart - lastClaimMs) / 86_400_000)
      : 999;
    const nextStreak = lastClaimMs
      ? diffDays === 1
        ? Math.max(1, loginStreak) + 1
        : 1
      : 1;
    const baseFish = 100;
    const streakBonusFish = Math.min(nextStreak - 1, 6) * 20;
    const bonusFish = nextStreak % 7 === 0 ? 200 : 0;
    const fish = baseFish + streakBonusFish + bonusFish;
    setLocalFish((f) => f + fish);
    setLastLoginDate(todayStr);
    setLoginStreak(nextStreak);
    localStorage.setItem("dailyLoginLastClaimMs", String(todayStart));
    playSfx("game_win.wav");
    setDailyLoginFx({ id: Date.now(), text: `+${fish} 🐟` });
  };

  // Claim rewards
  const claimRewards = () => {
    if (pendingRewards.fish <= 0) return;
    clickSound();
    playSfx("game_win.wav");
    setLocalFish((f) => f + Math.floor(pendingRewards.fish));
    setLocalMeow((m) => m + pendingRewards.meow);
    setPendingRewards({ fish: 0, meow: 0 });
  };

  // Cat interactions
  const interact = (type: "feed" | "pet" | "wander", uuid: Uuid) => {
    if (type === "wander") {
      clickSound();
      setMovingCats((p) => ({ ...p, [String(uuid)]: !p[String(uuid)] }));
      setInteractingCatId(null);
      return;
    }
    if (type === "feed") {
      if (localFish < 5) return alert("Need 5 FISH");
      setLocalFish((p) => p - 5);
      setInventory((prev) =>
        prev.map((c) =>
          c.type === "cat" && c.uuid === uuid
            ? { ...c, hunger: Math.min(100, c.hunger + 50) }
            : c,
        ),
      );
      playSfx("cat_eat.mp3");
      setInteractingCatId(null);
      return;
    }
    if (type === "pet") {
      if (localFish < 1) return alert("Need 1 FISH");
      setLocalFish((p) => p - 1);
      playSfx("cat_meow.mp3");
      setInteractingCatId(null);
    }
  };

  // Toggle equip cat
  const toggleEquip = (uuid: Uuid) => {
    if (equippedIds.includes(uuid))
      setEquippedIds((p) => p.filter((id) => id !== uuid));
    else {
      if (equippedIds.length >= 6) return alert("Max 6 cats");
      setEquippedIds((p) => [...p, uuid]);
    }
    setInspectCat(null);
  };

  // Render inspect modal (kept inline because it's complex)
  const renderInspectModal = () => {
    if (!inspectCat) return null;
    const currentLevel = inspectCat.level || 1;
    const nextLevel = currentLevel + 1;
    const upgradeCost = currentLevel * 200;
    const basePow = MINING_RATE[inspectCat.rarity].fish;
    const currentSpeed = (basePow * (1 + currentLevel * 0.1)).toFixed(2);
    const nextSpeed = (basePow * (1 + nextLevel * 0.1)).toFixed(2);
    const availableGear = inventory.filter(
      (i): i is Extract<InventoryItem, { type: "gear_item" }> =>
        i.type === "gear_item",
    );

    return (
      <div className="inspect-overlay">
        <div className="cat-inspect-card" style={{ width: "500px" }}>
          <button
            className="btn-close"
            onClick={() => {
              setInspectCat(null);
              setShowGearSelect(false);
            }}
          >
            X
          </button>
          <div
            className="inspect-header"
            style={{
              borderBottom: "2px solid #555",
              paddingBottom: "10px",
              marginBottom: "15px",
            }}
          >
            <h2 style={{ margin: 0, color: "gold" }}>{inspectCat.name}</h2>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "5px",
              }}
            >
              <span className={`rarity-tag ${inspectCat.rarity}`}>
                {inspectCat.rarity}
              </span>
              <span style={{ color: "#aaa" }}>Level {currentLevel}</span>
            </div>
          </div>
          <div style={{ display: "flex", gap: "20px", textAlign: "left" }}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <div
                className="cat-portrait-large"
                style={{
                  backgroundImage: `url(/assets/cat_${inspectCat.id}.png)`,
                  width: "140px",
                  height: "140px",
                }}
              >
                {inspectCat.equippedGear && (
                  <div
                    style={{
                      position: "absolute",
                      bottom: 0,
                      right: 0,
                      fontSize: "30px",
                    }}
                  >
                    {inspectCat.equippedGear.img}
                  </div>
                )}
              </div>
              <div style={{ width: "100%" }}>
                <div
                  style={{
                    fontSize: "10px",
                    marginBottom: "2px",
                    color: "#aaa",
                  }}
                >
                  GEAR SLOT
                </div>
                <div className="gear-equip-section">
                  <div
                    className={`gear-slot ${inspectCat.equippedGear ? "filled" : ""}`}
                    onClick={() => {
                      if (inspectCat.equippedGear) unequipGear(inspectCat);
                      else setShowGearSelect(!showGearSelect);
                    }}
                  >
                    {inspectCat.equippedGear
                      ? inspectCat.equippedGear.img
                      : "+"}
                  </div>
                  <div style={{ fontSize: "10px", flex: 1 }}>
                    {inspectCat.equippedGear ? (
                      <>
                        <div style={{ color: "gold" }}>
                          {inspectCat.equippedGear.name}
                        </div>
                        <div style={{ color: "#00e676" }}>
                          Dur: {Math.round(inspectCat.equippedGear.durability)}
                        </div>
                      </>
                    ) : (
                      <span style={{ color: "#777" }}>No Gear Equipped</span>
                    )}
                  </div>
                </div>
                {showGearSelect && !inspectCat.equippedGear && (
                  <div className="mini-inventory">
                    {availableGear.length === 0 ? (
                      <div
                        style={{
                          fontSize: "10px",
                          color: "#aaa",
                          padding: "5px",
                        }}
                      >
                        No gear
                      </div>
                    ) : (
                      availableGear.map((g) => (
                        <button
                          key={String(g.uuid)}
                          className="pixel-btn"
                          style={{
                            width: "40px",
                            height: "40px",
                            fontSize: "20px",
                          }}
                          onClick={() => equipGearToCat(inspectCat, g)}
                        >
                          {g.img}
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>
            <div className="stats-block" style={{ flex: 1 }}>
              <h4
                style={{
                  margin: "0 0 10px 0",
                  borderBottom: "1px dashed #777",
                }}
              >
                STATS
              </h4>
              <div className="ascend-stat-row">
                <span>Power:</span>
                <span>
                  {currentSpeed} <span style={{ color: "#aaa" }}>➔</span>{" "}
                  <span className="stat-upgrade">{nextSpeed}</span>
                </span>
              </div>
              <div className="ascend-stat-row">
                <span>Eff:</span>
                <span>
                  {currentLevel * 10}% <span style={{ color: "#aaa" }}>➔</span>{" "}
                  <span className="stat-upgrade">{nextLevel * 10}%</span>
                </span>
              </div>
              <div
                style={{
                  margin: "15px 0",
                  background: "#263238",
                  padding: "10px",
                  borderRadius: "5px",
                }}
              >
                <div
                  style={{
                    fontSize: "10px",
                    color: "gold",
                    marginBottom: "5px",
                  }}
                >
                  ASCENSION COST
                </div>
                <div style={{ fontSize: "18px", fontWeight: "bold" }}>
                  {upgradeCost} 🐟
                </div>
              </div>
              <button
                className="btn-action upgrade-btn"
                onClick={() => levelUpCat(inspectCat)}
              >
                ASCEND Lv.{nextLevel}
              </button>
              {equippedIds.includes(inspectCat.uuid) ? (
                <button
                  className="btn-action btn-unequip"
                  style={{ marginTop: "10px" }}
                  onClick={() => {
                    toggleEquip(inspectCat.uuid);
                    setInspectCat(null);
                  }}
                >
                  UNEQUIP CAT
                </button>
              ) : (
                <button
                  className="btn-action"
                  style={{ marginTop: "10px", background: "#2196f3" }}
                  onClick={() => {
                    toggleEquip(inspectCat.uuid);
                    setInspectCat(null);
                  }}
                >
                  EQUIP CAT
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Main render - using components
  return (
    <div
      className={`game-container ${isEditMode ? "is-edit-mode" : ""}`}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      style={{
        cursor: isEditMode && draggedDecorId ? "grabbing" : "default",
        background: `url("${EDIT_BACKGROUND_OPTIONS.find((o) => o.id === (isEditMode ? editBackgroundId : mainBackgroundId))?.url ?? "/assets/bg_minecraft.png"}") no-repeat center bottom/cover`,
        backgroundPositionY: "-260px",
      }}
    >
      <button
        className={`btn-edit-mode ${isEditMode ? "active" : ""}`}
        aria-label={isEditMode ? "Save layout" : "Edit house"}
        onClick={() => {
          clickSound();
          setIsEditMode(!isEditMode);
        }}
      >
        <EditHouseIcon />
        <span>{isEditMode ? "SAVE" : "EDIT"}</span>
      </button>

      <div className={`decor-layer ${isEditMode ? "is-editing" : ""}`}>
        {placedDecor.map((item) => (
          <img
            key={String(item.uuid)}
            src={item.img}
            className={`decor-placed ${draggedDecorId === item.uuid ? "dragging" : ""}`}
            style={{
              left: item.x,
              top: item.y,
              width: item.style?.width || "64px",
              transform: "translate(-50%, -50%)",
            }}
            alt="d"
            onMouseDown={(e) => handleDragStart(e, item.uuid, false)}
            onDoubleClick={(e) => handleDecorDoubleClick(e, item.uuid)}
          />
        ))}
      </div>

      {isEditMode && (
        <EditMode
          editBackgroundId={editBackgroundId}
          mainBackgroundId={mainBackgroundId}
          inventory={inventory}
          placedDecor={placedDecor}
          onSetEditBackground={(id) =>
            setEditBackgroundId(id as typeof editBackgroundId)
          }
          onSetMainBackground={(id) =>
            setMainBackgroundId(id as typeof mainBackgroundId)
          }
          onDragStart={handleDragStart}
          onDeleteDecor={deleteDecor}
          clickSound={clickSound}
        />
      )}

      <TopBar
        localFish={localFish}
        dailyLoginFx={dailyLoginFx}
        onOpenTab={setActiveTab}
        onDailyLogin={handleDailyLogin}
        onOpenSettings={() => setShowSettings(true)}
        clickSound={clickSound}
      />

      {isRolling && (
        <div className="minigame-overlay" style={{ zIndex: 4000 }}>
          <div className="rolling-container">
            <div className="rolling-box shake-anim">?</div>
            <div className="rolling-text">OPENING...</div>
          </div>
        </div>
      )}

      {showSettings && (
        <div className="minigame-overlay">
          <div className="pixel-panel settings-panel">
            <div className="setting-row">
              <label>MUSIC</label>
              <input
                type="range"
                max="1"
                step="0.1"
                value={musicVol}
                onChange={(e) => setMusicVol(parseFloat(e.target.value))}
              />
            </div>
            <div className="setting-row">
              <label>SFX</label>
              <input
                type="range"
                max="1"
                step="0.1"
                value={sfxVol}
                onChange={(e) => setSfxVol(parseFloat(e.target.value))}
              />
            </div>
            <button
              className="btn-action"
              onClick={() => {
                clickSound();
                setShowSettings(false);
              }}
            >
              CLOSE
            </button>
          </div>
        </div>
      )}

      {showDailyLogin && (
        <DailyLogin
          onClose={() => setShowDailyLogin(false)}
          onClaim={handleDailyLoginClaim}
          loginStreak={loginStreak}
          clickSound={clickSound}
        />
      )}

      {activeTab === "gacha" && (
        <Gacha
          onClose={() => {
            clickSound();
            setActiveTab(null);
            setGachaResults(null);
          }}
          gachaResults={gachaResults}
          pityCounter={pityCounter}
          onOpenBlindBox={openBlindBox}
          onCollectResults={() => {
            clickSound();
            setGachaResults(null);
          }}
          onBuyFish={buyFish}
          clickSound={clickSound}
        />
      )}

      {activeTab === "shop" && (
        <Shop
          onClose={() => {
            clickSound();
            setActiveTab(null);
          }}
          onBuyItem={buyItem}
          clickSound={clickSound}
        />
      )}

      {activeTab === "house" && (
        <House
          onClose={() => {
            clickSound();
            setActiveTab(null);
            setInspectCat(null);
          }}
          inventory={inventory.filter((i): i is CatItem => i.type === "cat")}
          equippedIds={equippedIds.map(String)}
          teamStats={teamStats}
          onInspectCat={setInspectCat}
          clickSound={clickSound}
        />
      )}

      {inspectCat && renderInspectModal()}

      {activeTab === "game" && (
        <GameCenter
          onClose={() => {
            clickSound();
            setActiveTab(null);
          }}
          localFish={localFish}
          setLocalFish={setLocalFish}
          gameCount={gameCount}
          setGameCount={setGameCount}
          clickSound={clickSound}
        />
      )}

      {activeTab === "book" && (
        <Book
          onClose={() => {
            clickSound();
            setActiveTab(null);
          }}
          inventory={inventory}
          clickSound={clickSound}
        />
      )}

      {(pendingRewards.fish > 0.1 || pendingRewards.meow > 0) && (
        <div className="claim-box" onClick={claimRewards}>
          <div className="claim-title">REWARDS</div>
          <div>🐟 {pendingRewards.fish.toFixed(1)}</div>
          {pendingRewards.meow > 0 && <div>🐱 {pendingRewards.meow}</div>}
          <div className="claim-anim">CLAIM</div>
        </div>
      )}

      {inventory
        .filter(
          (item): item is CatItem =>
            item.type === "cat" && equippedIds.includes(item.uuid),
        )
        .map((cat) => {
          const key = String(cat.uuid);
          const moving = movingCats[key];
          const isHungry = cat.hunger <= 0;
          return (
            <div
              key={key}
              className="cat-wrapper"
              style={{
                left: `${catPos[key]}%`,
                bottom: "-50%",
                top: "90%",
                zIndex: 50,
              }}
            >
              {isHungry && <div className="bubble-hungry">🍖</div>}
              <div
                style={{
                  position: "absolute",
                  top: "-65px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  fontSize: "10px",
                  fontWeight: "bold",
                  color:
                    cat.rarity === "SSR"
                      ? "#ffd700"
                      : cat.rarity === "SR"
                        ? "#c084fc"
                        : "#fff",
                  textShadow: "1px 1px 2px #000",
                  whiteSpace: "nowrap",
                  pointerEvents: "none",
                }}
              >
                {cat.name}
              </div>
              {interactingCatId === cat.uuid && (
                <div className="cat-think-panel">
                  <div
                    style={{
                      fontSize: "12px",
                      textAlign: "center",
                      color: "black",
                      marginBottom: "5px",
                      fontWeight: "bold",
                    }}
                  >
                    Lv.{cat.level || 1} | Hunger: {Math.round(cat.hunger)}%
                  </div>
                  <button onClick={() => interact("feed", cat.uuid)}>
                    Feed 5🐟
                  </button>
                  <button onClick={() => interact("pet", cat.uuid)}>Pet</button>
                  <button onClick={() => interact("wander", cat.uuid)}>
                    {moving ? "Stop" : "Wander"}
                  </button>
                  <button
                    style={{ background: "#c62828" }}
                    onClick={() => {
                      clickSound();
                      setInteractingCatId(null);
                    }}
                  >
                    X
                  </button>
                </div>
              )}
              <div
                className={`cat-aura ${cat.rarity === "SR" ? "cat-sr" : ""} ${cat.rarity === "SSR" ? "cat-ssr" : ""}`}
                onClick={() => {
                  clickSound();
                  setInteractingCatId(
                    interactingCatId === cat.uuid ? null : cat.uuid,
                  );
                }}
              >
                <div
                  className={`Character ${moving ? "is-moving" : "is-idle"} ${(catDir[key] || "right") === "right" ? "face-right" : "face-left"}`}
                  style={{ filter: isHungry ? "grayscale(1)" : "none" }}
                >
                  <img
                    src={`/assets/cat_${cat.id}.png`}
                    className="Character_spritesheet"
                    alt="cat"
                  />
                  {cat.equippedGear && (
                    <div
                      style={{
                        position: "absolute",
                        top: "9px",
                        left: "60%",
                        fontSize: "7.5px",
                        transform: "translateX(-63%)",
                      }}
                    >
                      {cat.equippedGear.img}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
    </div>
  );
}
