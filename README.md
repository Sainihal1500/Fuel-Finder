# 🧬 GeoPharma AI – Intelligent API Manufacturing Location & Supply Chain Platform

GeoPharma AI is an AI-powered web platform that helps India reduce dependency on imported pharmaceutical raw materials (APIs, KSMs, intermediates) by recommending optimal domestic manufacturing locations using geospatial, industrial, and supply chain data.

---

## 📸 Preview
(Add your UI screenshot here)

---

## 🚀 Features

### 🗺️ Interactive India Map Dashboard
- Layered map showing pharma hubs, industrial zones, ports, and water/power infrastructure
- Color-coded markers by feasibility score (green/yellow/orange)
- Toggle layers on/off via the sidebar

### 📊 API Dependency Dashboard
- Table of pharmaceutical APIs with % import dependency and source country
- Pie chart of import vs domestic production
- Risk heatmap grid for all APIs

### 🤖 AI Location Recommendation Engine
- Select any API (Paracetamol, Azithromycin, Metformin, etc.)
- Get top 3 recommended manufacturing locations in India
- Each location shows: Feasibility Score, Cost Efficiency, Resource Proximity, Logistics Score

### 🏅 Self-Reliance Score
- Compute a "Self-Reliance Index" for each API
- Visual donut gauge with color coding: 🟢 Green (low risk) | 🟡 Yellow (moderate) | 🔴 Red (high risk)

### ⚠️ Risk Prediction Module
- Supply disruption probability and price spike risk charts
- Based on import trends, domestic capacity, and demand patterns

### 🎮 Scenario Simulation
- Simulate events: "China supply cut by 50%", "Demand surge 30%", "Full domestic production"
- View impact on drug availability and domestic production capacity

---

## 🏗️ Tech Stack

### Frontend (`geopharma-ai/`)
- **React 18** + Vite
- **Tailwind CSS v4** (dark theme)
- **Leaflet / React-Leaflet** for interactive India map
- **Recharts** for data visualization

### Backend (`backend/`)
- **Python Flask** with Flask-CORS
- REST API with 7 endpoints
- Scikit-learn compatible scoring logic

---

## ⚙️ Installation & Setup

### Frontend

```bash
cd geopharma-ai
npm install
npm run dev       # development server at http://localhost:5173
npm run build     # production build
```

### Backend

```bash
cd backend
pip install -r requirements.txt
python app.py     # API server at http://localhost:5000
```

> **Note:** The frontend works standalone with built-in mock data — no backend required for the UI.

---

## 🌐 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/apis` | List all pharmaceutical APIs with dependency data |
| GET | `/api/recommendations?api=Paracetamol` | Top 3 manufacturing location recommendations |
| GET | `/api/self-reliance` | Self-reliance index for all APIs |
| GET | `/api/risk?api=Paracetamol` | Risk prediction data |
| GET | `/api/scenario?api=Paracetamol&scenario=china_50` | Scenario simulation results |
| GET | `/api/locations` | All industrial locations with coordinates |
| GET | `/api/scenarios` | Available simulation scenarios |

---

## 🎯 Target Users

- Government policy makers
- Pharma manufacturers
- Supply chain analysts
- Investors

---

## 📁 Project Structure

```
geopharma-ai/          # React frontend
  src/
    components/
      Sidebar.jsx              # API selector + layer toggles
      MapDashboard.jsx         # Leaflet India map
      DependencyDashboard.jsx  # API dependency charts
      LocationRecommender.jsx  # Top 3 location recommendations
      SelfRelianceScore.jsx    # Self-reliance index gauge
      RiskPrediction.jsx       # Risk charts
      ScenarioSimulation.jsx   # Scenario impact simulator
    data/
      mockData.js              # All mock data (APIs, locations, scenarios)

backend/               # Python Flask API
  app.py               # Flask routes
  data.py              # Mock data + scoring logic
  requirements.txt

public/                # Original FuelFinder app (HTML)
```

---

## 🔧 Legacy FuelFinder App

The original FuelFinder petrol-pump locator is still available in the `public/` directory (open `public/index.html`).
