from flask import Flask, jsonify, request
from flask_cors import CORS
from data import (
    APIS, LOCATIONS, SCENARIOS,
    get_self_reliance_score, get_top_recommendations,
    get_risk_data, get_scenario_impact,
)

app = Flask(__name__)
CORS(app)


@app.route("/api/apis")
def list_apis():
    return jsonify(APIS)


@app.route("/api/recommendations")
def recommendations():
    api_name = request.args.get("api", "Paracetamol")
    api = next((a for a in APIS if a["name"].lower() == api_name.lower()), APIS[0])
    recs = get_top_recommendations(3)
    return jsonify({"api": api["name"], "recommendations": recs})


@app.route("/api/self-reliance")
def self_reliance():
    result = []
    for api in APIS:
        score = get_self_reliance_score(api)
        result.append({
            "name": api["name"],
            "score": score,
            "domestic_capacity": api["domestic_capacity"],
            "demand_mt": api["demand_mt"],
            "import_pct": api["import_pct"],
            "level": "high" if score >= 50 else ("medium" if score >= 25 else "low"),
        })
    return jsonify(result)


@app.route("/api/risk")
def risk():
    api_name = request.args.get("api", "Paracetamol")
    api = next((a for a in APIS if a["name"].lower() == api_name.lower()), APIS[0])
    return jsonify({"api": api["name"], "risk_score": api["risk_score"], "data": get_risk_data(api)})


@app.route("/api/scenario")
def scenario():
    api_name = request.args.get("api", "Paracetamol")
    scenario_id = request.args.get("scenario", "china_50")
    cut_param = request.args.get("cut")
    cut = int(cut_param) if cut_param else None
    api = next((a for a in APIS if a["name"].lower() == api_name.lower()), APIS[0])
    impact = get_scenario_impact(api, scenario_id, cut)
    return jsonify(impact)


@app.route("/api/locations")
def locations():
    return jsonify(LOCATIONS)


@app.route("/api/scenarios")
def scenarios():
    return jsonify(SCENARIOS)


if __name__ == "__main__":
    app.run(debug=False, port=5000)
