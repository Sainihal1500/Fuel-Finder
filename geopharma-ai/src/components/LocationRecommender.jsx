import { getTopRecommendations } from '../data/mockData';

export default function LocationRecommender({ selectedApi }) {
  const recommendations = getTopRecommendations(3);

  return (
    <div className="bg-gray-800 rounded-xl border border-gray-700">
      <div className="px-4 py-3 border-b border-gray-700">
        <h2 className="font-semibold text-gray-100">Top Location Recommendations</h2>
        <p className="text-xs text-gray-400 mt-0.5">
          Best sites for domestic {selectedApi.name} production
        </p>
      </div>
      <div className="p-4 space-y-4">
        {recommendations.map((loc, index) => (
          <div key={loc.name} className="bg-gray-700/40 rounded-lg p-4 border border-gray-600/50">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      index === 0
                        ? 'bg-emerald-500 text-white'
                        : index === 1
                        ? 'bg-blue-500 text-white'
                        : 'bg-purple-500 text-white'
                    }`}
                  >
                    {index + 1}
                  </span>
                  <h3 className="font-medium text-gray-100 text-sm">{loc.name}</h3>
                </div>
                <p className="text-xs text-gray-400 mt-1 ml-8">{loc.state}</p>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-emerald-400">{loc.feasibility}</div>
                <div className="text-xs text-gray-400">Feasibility</div>
              </div>
            </div>

            <div className="space-y-2">
              {[
                { label: 'Feasibility', value: loc.feasibility, color: 'bg-emerald-500' },
                { label: 'Cost Efficiency', value: loc.cost_efficiency, color: 'bg-blue-500' },
                { label: 'Resource Proximity', value: loc.resource_proximity, color: 'bg-purple-500' },
                { label: 'Logistics Score', value: loc.logistics_score, color: 'bg-orange-500' },
              ].map(({ label, value, color }) => (
                <div key={label} className="flex items-center gap-2 text-xs">
                  <span className="text-gray-400 w-32 shrink-0">{label}</span>
                  <div className="flex-1 h-1.5 bg-gray-600 rounded-full">
                    <div
                      className={`h-1.5 rounded-full ${color}`}
                      style={{ width: `${value}%` }}
                    />
                  </div>
                  <span className="text-gray-300 w-8 text-right">{value}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
