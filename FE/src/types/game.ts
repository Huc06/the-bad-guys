export type CatRarity = "R" | "SR" | "SSR";

export type Personality =
  | "Gentle"
  | "Chill"
  | "Angry"
  | "Naughty"
  | "Calm"
  | "Lazy"
  | "Smart"
  | "Dominant"
  | "Affectionate"
  | "Cold";

export type Uuid = number | string;

export type MiningRateByRarity = Record<
  CatRarity,
  { fish: number; meow: number; label: string; base_drain: number }
>;

export type PersonalityStats = {
  w: number;
  c: number;
  e: number;
  desc?: string;
};

export type PersonalityMap = Record<Personality, PersonalityStats>;

export type CatDbEntry = {
  id: number;
  name: string;
  rarity: CatRarity;
  personality: Personality;
};

export type GearDef = {
  id: string;
  name: string;
  cost: number;
  boost: number;
  drain: number;
  durability: number;
  fragility: number;
  type: "gear";
  img: string;
};

export type GearItem = Omit<GearDef, "type"> & {
  uuid: Uuid;
  type: "gear_item";
  maxDurability: number;
};

export type EquippedGear = Omit<GearItem, "uuid" | "type" | "maxDurability">;

export type DecorDef = {
  id: string;
  name: string;
  cost: number;
  type: "decor";
  img: string;
  style?: { width?: string };
};

export type DecorItem = DecorDef & { uuid: Uuid; type: "decor" };

export type PlacedDecor = DecorItem & { x: number; y: number };

export type CatItem = CatDbEntry & {
  uuid: Uuid;
  type: "cat";
  isNew?: boolean;
  hunger: number;
  level: number;
  equippedGear: EquippedGear | null;
};

export type InventoryItem = CatItem | GearItem | DecorItem;

export type PendingRewards = { fish: number; meow: number };

export type TeamStats = { w: number; c: number; e: number; label: string };

export type ActiveTab = "shop" | "game" | "house" | "book" | "gacha" | null;
export type ShopTab = "item" | "decor";
export type ArcadeGame =
  | "card"
  | "coin"
  | "slot"
  | "dice"
  | "roulette"
  | "blackjack"
  | null;

export type DailyLoginResult = {
  alreadyClaimed: boolean;
  streak: number;
  fish: number;
  bonusFish: number;
};

export type DailyLoginFx = { id: number; text: string };
