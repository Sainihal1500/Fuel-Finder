APIS = [
    {"name": "Paracetamol", "import_pct": 72, "source": "China", "demand_mt": 8000, "domestic_capacity": 2240, "risk_score": 78},
    {"name": "Azithromycin", "import_pct": 85, "source": "China", "demand_mt": 1200, "domestic_capacity": 180, "risk_score": 89},
    {"name": "Metformin", "import_pct": 65, "source": "China", "demand_mt": 5000, "domestic_capacity": 1750, "risk_score": 68},
    {"name": "Amoxicillin", "import_pct": 55, "source": "China/India", "demand_mt": 3000, "domestic_capacity": 1350, "risk_score": 58},
    {"name": "Ibuprofen", "import_pct": 80, "source": "China", "demand_mt": 4000, "domestic_capacity": 800, "risk_score": 83},
    {"name": "Atorvastatin", "import_pct": 60, "source": "China/EU", "demand_mt": 2000, "domestic_capacity": 800, "risk_score": 62},
    {"name": "Omeprazole", "import_pct": 45, "source": "India", "demand_mt": 1500, "domestic_capacity": 825, "risk_score": 45},
    {"name": "Ciprofloxacin", "import_pct": 70, "source": "China", "demand_mt": 2500, "domestic_capacity": 750, "risk_score": 73},
]

LOCATIONS = [
    {"name": "Hyderabad (Genome Valley)", "state": "Telangana", "lat": 17.45, "lng": 78.38, "feasibility": 92, "cost_efficiency": 88, "resource_proximity": 90, "logistics_score": 85},
    {"name": "Ahmedabad Industrial Zone", "state": "Gujarat", "lat": 23.03, "lng": 72.58, "feasibility": 88, "cost_efficiency": 92, "resource_proximity": 82, "logistics_score": 90},
    {"name": "Pune Pharma Cluster", "state": "Maharashtra", "lat": 18.52, "lng": 73.86, "feasibility": 85, "cost_efficiency": 80, "resource_proximity": 78, "logistics_score": 88},
    {"name": "Baddi Industrial Area", "state": "Himachal Pradesh", "lat": 30.95, "lng": 76.79, "feasibility": 78, "cost_efficiency": 85, "resource_proximity": 70, "logistics_score": 72},
    {"name": "Visakhapatnam SEZ", "state": "Andhra Pradesh", "lat": 17.69, "lng": 83.22, "feasibility": 82, "cost_efficiency": 78, "resource_proximity": 85, "logistics_score": 80},
    {"name": "Chennai Pharma Hub", "state": "Tamil Nadu", "lat": 13.08, "lng": 80.27, "feasibility": 80, "cost_efficiency": 75, "resource_proximity": 72, "logistics_score": 87},
    {"name": "Navi Mumbai MIDC", "state": "Maharashtra", "lat": 19.04, "lng": 73.02, "feasibility": 76, "cost_efficiency": 70, "resource_proximity": 68, "logistics_score": 85},
    {"name": "Chandigarh Industrial Area", "state": "Punjab", "lat": 30.73, "lng": 76.78, "feasibility": 74, "cost_efficiency": 82, "resource_proximity": 65, "logistics_score": 76},
]

SCENARIOS = [
    {"id": "china_50", "label": "China supply cut 50%", "impact": 0.5},
    {"id": "china_100", "label": "China supply cut 100%", "impact": 1.0},
    {"id": "port_block", "label": "Major port blockade", "impact": 0.35},
    {"id": "price_spike", "label": "Global price spike 80%", "impact": 0.8},
    {"id": "regulation_change", "label": "New import regulation", "impact": 0.25},
]


def get_self_reliance_score(api):
    score = round((api["domestic_capacity"] / api["demand_mt"]) * 100)
    return min(score, 100)


def get_top_recommendations(count=3):
    return sorted(LOCATIONS, key=lambda x: x["feasibility"], reverse=True)[:count]


def get_risk_data(api):
    months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]
    multipliers = [0.6, 0.7, 0.65, 0.8, 0.9, 0.85]
    price_mult = [0.5, 0.6, 0.55, 0.7, 0.85, 0.8]
    return [
        {
            "month": months[i],
            "disruption": round(api["risk_score"] * multipliers[i], 1),
            "priceRisk": round(api["import_pct"] * price_mult[i], 1),
        }
        for i in range(6)
    ]


def get_scenario_impact(api, scenario_id, cut=None):
    scenario = next((s for s in SCENARIOS if s["id"] == scenario_id), SCENARIOS[0])
    impact = cut / 100 if cut is not None else scenario["impact"]
    base_shortfall = api["demand_mt"] - api["domestic_capacity"]
    affected_imports = (api["import_pct"] / 100) * api["demand_mt"] * impact
    new_shortfall = max(0, base_shortfall + affected_imports * 0.5)
    return {
        "shortfall_mt": round(new_shortfall),
        "price_increase_pct": round(api["risk_score"] * impact * 1.5),
        "recovery_months": round(6 + impact * 12),
        "affected_patients_m": round((new_shortfall / api["demand_mt"]) * 50),
        "scenario": scenario["label"],
    }
