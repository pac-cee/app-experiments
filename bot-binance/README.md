# Binance Real-Time Trading Dashboard

A modern, production-ready Binance spot market dashboard with:
- All spot pairs and coins
- Real-time prices and 24h stats
- Coins tab with live price, change, and sparklines
- Virtualized table for fast browsing
- Favorites, advanced filters, and sorting
- Binance-style dark mode

---

## 🚀 Features
- **All Binance Spot Pairs**: Instantly see all trading pairs and filter/search with ease.
- **Coins Tab**: Browse all tokens/coins, see their live price (from the most liquid pair), 24h change, and a mini sparkline chart.
- **Real-Time Data**: Prices and stats update live via Binance WebSocket.
- **Favorites**: Star your favorite pairs for quick access.
- **Advanced Filters**: Filter by quote asset (e.g. USDT), show only favorites, and sort by price/change.
- **Dark Mode**: Toggle between light and Binance-style dark mode.

---

## 🛠️ Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm (v9+ recommended)

### Installation
```bash
npm install
```

### Running Locally
```bash
npm run dev
```
Then open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 How to Test the Dashboard

1. **Browse All Pairs:**
   - Use the "Pairs" tab to see all Binance spot pairs, search/filter, and sort.
2. **Explore Coins:**
   - Switch to the "Coins" tab to see all coins/tokens, each with live price, 24h change, and a sparkline.
   - Click any coin to see all its tradable pairs and stats.
3. **Favorites:**
   - Star your favorite pairs in the pairs table. Toggle "Show Favorites" to filter.
4. **Filters and Sorting:**
   - Filter by quote asset (e.g. USDT), sort by symbol, price, or 24h change.
5. **Dark Mode:**
   - Use the toggle in the top right to switch between light and dark themes.
6. **Live Updates:**
   - All prices and stats update in real time—no need to refresh!

---

## 📦 Production Build
```bash
npm run build
npm run start
```

---

## 🐳 Docker Deployment

### Build the Docker Image
```bash
docker build -t binance-dashboard .
```

### Run the Container
```bash
docker run -d -p 3000:3000 --name binance-dashboard binance-dashboard
```

The dashboard will be available at [http://localhost:3000](http://localhost:3000)

### Docker Commands Reference
- **Stop the container:**
  ```bash
  docker stop binance-dashboard
  ```
- **Start an existing container:**
  ```bash
  docker start binance-dashboard
  ```
- **Remove the container:**
  ```bash
  docker rm binance-dashboard
  ```
- **View logs:**
