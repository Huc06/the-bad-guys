# The Bad Guys

A blockchain-based cat collection and management game built on Sui Network.

## Features

- 🐱 Collect and manage cats with different rarities (R, SR, SSR)
- 🎮 Play mini-games to earn FISH tokens
- 🏠 Customize your house with decorations
- 🎰 Gacha system with pity counter
- 💎 Equip gear to boost cat mining power
- 📅 Daily login rewards
- 🔗 Sui blockchain integration

## Tech Stack

- React 19 + TypeScript
- Vite
- Sui dApp Kit
- TanStack Query

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## Project Structure

```
FE/
├── src/
│   ├── components/      # React components
│   │   ├── games/      # Mini-game components
│   │   ├── Book.tsx
│   │   ├── EditMode.tsx
│   │   ├── Gacha.tsx
│   │   ├── GameCenter.tsx
│   │   ├── House.tsx
│   │   ├── Shop.tsx
│   │   └── TopBar.tsx
│   ├── constants/      # Game data and constants
│   ├── hook/          # Sui blockchain hooks
│   ├── types/         # TypeScript type definitions
│   ├── utils/         # Utility functions
│   ├── App.tsx        # Main app component
│   └── main.tsx       # Entry point
└── public/
    └── assets/        # Game assets (images, sounds)
```

## License

MIT
