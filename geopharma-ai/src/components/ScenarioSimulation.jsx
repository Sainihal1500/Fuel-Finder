import { useState } from 'react';
import { SCENARIOS, getScenarioImpact } from '../data/mockData';

export default function ScenarioSimulation({ selectedApi }) {
  const [selectedScenario, setSelectedScenario] = useState(SCENARIOS[0].id);
  const impact = getScenarioImpact(selectedApi, selectedScenario);

  return (
    <div className="bg-gray-800 rounded-xl border border-gray-700">
      <div className="px-4 py-3 border-b border-gray-700">
        <h2 className="font-semibold text-gray-100">Scenario Simulation</h2>
        <p className="text-xs text-gray-400 mt-0.5">
          Model supply disruption impacts for {selectedApi.name}
        </p>
      </div>
      <div className="p-4">
        <div className="mb-4">
          <label className="text-xs text-gray-400 mb-2 block">Select Disruption Scenario</label>
          <div className="flex flex-wrap gap-2">
            {SCENARIOS.map((s) => (
              <button
                key={s.id}
                onClick={() => setSelectedScenario(s.id)}
                className={`px-3 py-1.5 rounded-lg text-sm transition-colors border ${
                  selectedScenario === s.id
                    ? 'bg-blue-500/20 text-blue-400 border-blue-500/40'
                    : 'bg-gray-700 text-gray-300 border-gray-600 hover:bg-gray-600'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-gray-900/50 rounded-xl border border-gray-700 p-4 mb-4">
          <h3 className="text-sm font-medium text-gray-300 mb-3">
            Impact Analysis: <span className="text-blue-400">{impact.scenario}</span>
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-400">{impact.shortfall_mt.toLocaleString()}</div>
              <div className="text-xs text-gray-400 mt-1">Shortfall (MT)</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-400">+{impact.price_increase_pct}%</div>
              <div className="text-xs text-gray-400 mt-1">Price Increase</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400">{impact.recovery_months}</div>
              <div className="text-xs text-gray-400 mt-1">Recovery (months)</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">{impact.affected_patients_m}M</div>
              <div className="text-xs text-gray-400 mt-1">Affected Patients</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              title: 'Immediate Actions',
              color: 'border-red-500/30 bg-red-500/5',
              icon: '🚨',
              items: [
                'Activate strategic buffer stocks',
                'Fast-track domestic producer incentives',
                'Explore alternate supply chains',
              ],
            },
            {
              title: 'Short-term (3–6 mo)',
              color: 'border-yellow-500/30 bg-yellow-500/5',
              icon: '⏱️',
              items: [
                'Scale up domestic production',
                'Negotiate alternate supplier contracts',
                'Price cap interventions',
              ],
            },
            {
              title: 'Long-term Strategy',
              color: 'border-emerald-500/30 bg-emerald-500/5',
              icon: '🌱',
              items: [
                'Build new API manufacturing clusters',
                'R&D investment in synthesis routes',
                'Policy framework for self-reliance',
              ],
            },
          ].map(({ title, color, icon, items }) => (
            <div key={title} className={`rounded-lg p-4 border ${color}`}>
              <h4 className="text-sm font-medium text-gray-200 mb-2">
                {icon} {title}
              </h4>
              <ul className="space-y-1.5">
                {items.map((item) => (
                  <li key={item} className="text-xs text-gray-400 flex items-start gap-1.5">
                    <span className="mt-0.5 shrink-0">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
