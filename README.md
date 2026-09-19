# Spendzy

A minimal, fast personal finance tracker built with React 19, Tailwind CSS v4, and Firebase.

## Features

- **Unboxed Analytics**: Live cash flow, income vs. expense tracking, and savings rate.
- **Smart Budgets**: Category limits, status filters, and dynamic daily safe-to-spend allowance.
- **Command Center (`Ctrl + K` / `Cmd + K`)**: Instant keyboard transaction logging.
- **Ledger & CSV**: Sort, search, filter, and import/export transactions.
- **Dark & Light Mode**: Clean, ambient theme support with zero clutter.
- **Live Sync**: Firebase Auth & Firestore with Vercel Analytics integration.

## Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS v4, Framer Motion
- **Data & Auth**: Firebase 11 (Auth & Firestore)
- **Charts & Tables**: Recharts, TanStack Table
- **Analytics & Hosting**: Vercel Analytics

## Quick Start

```bash
# 1. Clone & install
git clone https://github.com/AshwinD40/Spendzy.git
cd Spendzy
npm install

# 2. Environment setup (.env)
VITE_FIREBASE_API_KEY=your_firebase_api_key

# 3. Run development server
npm run dev
```

Build for production:
```bash
npm run build
```

## Author

**Ashwin Chaudhary**  
GitHub: [@AshwinD40](https://github.com/AshwinD40) · LinkedIn: [Ashwin Chaudhary](https://www.linkedin.com/in/ashwin40/)

## License

MIT
