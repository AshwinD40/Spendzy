# 💰 Spendzy – Next-Generation Personal Finance Tracker

Spendzy is a premium, high-performance personal finance manager designed with a stunning glassmorphic UI, responsive layouts, and seamless transitions. It empowers users to monitor income, define custom monthly budgets, and analyze spending patterns using interactive visualizations, instant quick-log shortcuts, and robust CSV sheet handling.

---

## ✨ Features

- ⚡ **Magic Command Center (`Ctrl + K` / `Cmd + K`)**  
  Quickly log transactions using a shorthand parsing engine. Typing `"Sushi 450"` or `"Salary 80000"` instantly categorizes, maps transaction types, and records the entry.
- 📊 **Dynamic Data Visualizations**  
  Real-time area charts and category breakdowns using **Recharts** to visualize cash flow trends, comparison ratios, and spending allocations.
- 🎯 **Smart Budget Management**  
  Set monthly spending caps for individual categories (Food, Travel, Bills, etc.). Features visual progress indicators, warning thresholds, and instant over-limit notifications.
- 📂 **Advanced Transaction Ledger**  
  Paginated transaction sheets powered by **TanStack Table** with full-text search, type filtering, sorting by date/amount, and instant CSV imports/exports via **PapaParse**.
- 🌓 **Ambient Dark/Light Mode**  
  A polished, system-aware dark mode theme featuring glassmorphism, glowing gradient backgrounds, and premium micro-animations powered by **Framer Motion**.
- 🔒 **Secure Firebase Integration**  
  Secure authentication protocols and real-time Firestore database sync for persistent client settings, custom currencies, budgets, and transactions.

---

## 🛠️ Tech Stack

- **Framework:** React 19 (Functional Components, Hooks)
- **Styling:** Tailwind CSS v4 (with `@tailwindcss/vite`)
- **Routing:** React Router v7
- **Database & Auth:** Firebase v11 (Firestore & Authentication)
- **Tables & Grid:** TanStack Table v8
- **Charts:** Recharts v3
- **Animations:** Framer Motion v12
- **CSV Engine:** PapaParse v5
- **Icons & Alerts:** React Icons, React Hot Toast

---

## ⚙️ Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/AshwinD40/Spendzy.git
cd Spendzy
```

### 2. Install Dependencies
Ensure you have Node.js installed (v18+ recommended):
```bash
npm install
```

### 3. Setup Environment Variables
Create a `.env` file in the root directory and add your Firebase API configuration details:
```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
```
*(The App also automatically infers project details, storage, and database paths based on this config).*

### 4. Run the Development Server
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:5173`.

### 5. Production Build
To create an optimized, minified production build:
```bash
npm run build
```

---

## 🙋‍♂️ Author

**Ashwin Chaudhary**
- GitHub: [@AshwinD40](https://github.com/AshwinD40)
- LinkedIn: [Ashwin Chaudhary](https://www.linkedin.com/in/ashwin40/)

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
