import type {
  CatDbEntry,
  DecorDef,
  GearDef,
  PersonalityMap,
  MiningRateByRarity,
} from "../types/game";

export const MINING_RATE: MiningRateByRarity = {
  R: { fish: 0.1, meow: 0.0001, label: "Standard", base_drain: 0.5 },
  SR: { fish: 0.3, meow: 0.001, label: "High", base_drain: 0.3 },
  SSR: { fish: 1.5, meow: 0.03, label: "Divine", base_drain: 0.1 },
};

export const PERSONALITY_MAP: PersonalityMap = {
  Gentle: { w: 3, c: 0, e: 1, desc: "A peaceful soul." },
  Chill: { w: 2, c: -1, e: 0, desc: "Just vibes." },
  Angry: { w: -2, c: 3, e: 2, desc: "Fueled by rage." },
  Naughty: { w: -1, c: 2, e: 3, desc: "Zoomies all day." },
  Calm: { w: 3, c: -2, e: -1, desc: "Unshakable rock." },
  Lazy: { w: 1, c: -1, e: -3, desc: "Conservation of energy." },
  Smart: { w: 1, c: 1, e: 2, desc: "Calculated efficiency." },
  Dominant: { w: -2, c: 2, e: 2, desc: "The Boss." },
  Affectionate: { w: 4, c: 0, e: 1, desc: "Love engine." },
  Cold: { w: -3, c: 1, e: 0, desc: "Winter is here." },
};

export const CAT_DB: CatDbEntry[] = [
  { id: 0, name: "Gray", rarity: "R", personality: "Lazy" },
  { id: 1, name: "DarkPurple", rarity: "R", personality: "Cold" },
  { id: 2, name: "White", rarity: "R", personality: "Gentle" },
  { id: 3, name: "Orange", rarity: "R", personality: "Naughty" },
  { id: 4, name: "Light", rarity: "R", personality: "Affectionate" },
  { id: 5, name: "Black", rarity: "SR", personality: "Calm" },
  { id: 6, name: "Tuxedo", rarity: "SR", personality: "Smart" },
  { id: 7, name: "ThreeTones", rarity: "SR", personality: "Chill" },
  { id: 8, name: "Golden", rarity: "SSR", personality: "Dominant" },
  { id: 9, name: "Pink", rarity: "SR", personality: "Affectionate" },
  { id: 10, name: "Rainbow", rarity: "SSR", personality: "Smart" },
  { id: 11, name: "Alien", rarity: "SSR", personality: "Angry" },
  { id: 12, name: "Purple", rarity: "R", personality: "Chill" },
];

export const GEAR_DB: GearDef[] = [
  {
    id: "g1",
    name: "Red Bow",
    cost: 200,
    boost: 0.1,
    drain: 0.05,
    durability: 500,
    fragility: 1,
    type: "gear",
    img: "🎀",
  },
  {
    id: "g2",
    name: "Gold Bell",
    cost: 1000,
    boost: 0.3,
    drain: 0.1,
    durability: 1200,
    fragility: 0.8,
    type: "gear",
    img: "🔔",
  },
  {
    id: "g3",
    name: "Rocket Pack",
    cost: 5000,
    boost: 1.0,
    drain: 0.5,
    durability: 3000,
    fragility: 0.5,
    type: "gear",
    img: "🚀",
  },
];

export const DECOR_DB: DecorDef[] = [
  {
    id: "d1",
    name: "Taiga Plant",
    cost: 500,
    type: "decor",
    img: "/assets/plant.png",
    style: { width: "40px" },
  },
  {
    id: "d2",
    name: "Scratch Post",
    cost: 800,
    type: "decor",
    img: "/assets/catpost.png",
    style: { width: "60px" },
  },
  {
    id: "d3",
    name: "Fish Painting",
    cost: 1500,
    type: "decor",
    img: "/assets/fish_painting.png",
    style: { width: "80px" },
  },
];

export const CARD_ICONS = ["🐟", "🦴", "🐭", "🦀", "🧶", "🐱"] as const;

export const SLOT_SYMBOLS = [
  { id: 0, img: "/assets/slot-symbol1.png", val: 7 },
  { id: 1, img: "/assets/slot-symbol2.png", val: 3 },
  { id: 2, img: "/assets/slot-symbol3.png", val: 2 },
  { id: 3, img: "/assets/slot-symbol4.png", val: 1 },
] as const;

export const EDIT_BACKGROUND_OPTIONS = [
  { id: "home", label: "Home", url: "/assets/bg_home.png" },
  { id: "sea", label: "Sea", url: "/assets/bg_sea.png" },
  { id: "minecraft", label: "Minecraft", url: "/assets/bg_minecraft.png" },
] as const;

export const BACKGROUNDS = [
  {
    id: "home",
    name: "Home",
    img: "/assets/bg_home.png",
    url: "/assets/bg_home.png",
  },
  {
    id: "sea",
    name: "Sea",
    img: "/assets/bg_sea.png",
    url: "/assets/bg_sea.png",
  },
  {
    id: "minecraft",
    name: "Minecraft",
    img: "/assets/bg_minecraft.png",
    url: "/assets/bg_minecraft.png",
  },
] as const;
