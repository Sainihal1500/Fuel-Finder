import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { APIS } from '../data/mockData';

const RISK_COLORS = {
  high: '#ef4444',
  medium: '#f59e0b',
  low: '#10b981',
};

const getRiskLevel = (score) => {
  if (score >= 80) return 'high';
  if (score >= 60) return 'medium';
  return 'low';
};

const PIE_COLORS = ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'];

export default function DependencyDashboard({ selectedApi }) {
  const pieData = APIS.map((api) => ({
    name: api.name,
    value: api.import_pct,
  }));

  return (
    <div className="bg-gray-800 rounded-xl border border-gray-700">
      <div className="px-4 py-3 border-b border-gray-700">
        <h2 className="font-semibold text-gray-100">API Import Dependency Dashboard</h2>
        <p className="text-xs text-gray-400 mt-0.5">Import dependency % by pharmaceutical API</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
        <div className="p-4">
          <h3 className="text-sm font-medium text-gray-300 mb-3">Import Dependency Overview</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-gray-500 border-b border-gray-700">
                  <th className="text-left py-2 pr-4">API Name</th>
                  <th className="text-right py-2 pr-4">Import %</th>
                  <th className="text-right py-2 pr-4">Source</th>
                  <th className="text-right py-2">Risk</th>
                </tr>
              </thead>
              <tbody>
                {APIS.map((api) => {
                  const level = getRiskLevel(api.risk_score);
                  return (
                    <tr
                      key={api.name}
                      className={`border-b border-gray-700/50 transition-colors ${
                        selectedApi.name === api.name ? 'bg-emerald-500/5' : 'hover:bg-gray-700/30'
                      }`}
                    >
                      <td className="py-2 pr-4">
                        <span className={selectedApi.name === api.name ? 'text-emerald-400 font-medium' : 'text-gray-300'}>
                          {api.name}
                        </span>
                      </td>
                      <td className="py-2 pr-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <div className="w-16 h-1.5 bg-gray-700 rounded-full">
                            <div
                              className="h-1.5 rounded-full bg-blue-500"
                              style={{ width: `${api.import_pct}%` }}
                            />
                          </div>
                          <span className="text-gray-300 w-8 text-right">{api.import_pct}%</span>
                        </div>
                      </td>
                      <td className="py-2 pr-4 text-right text-gray-400 text-xs">{api.source}</td>
                      <td className="py-2 text-right">
                        <span
                          className={`px-2 py-0.5 rounded text-xs font-medium ${
                            level === 'high'
                              ? 'bg-red-500/20 text-red-400'
                              : level === 'medium'
                              ? 'bg-yellow-500/20 text-yellow-400'
                              : 'bg-green-500/20 text-green-400'
                          }`}
                        >
                          {level.toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="p-4 border-l border-gray-700">
          <h3 className="text-sm font-medium text-gray-300 mb-3">Import Share Distribution</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                nameKey="name"
                label={({ name, value }) => `${value}%`}
                labelLine={false}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                labelStyle={{ color: '#9ca3af' }}
                itemStyle={{ color: '#e5e7eb' }}
                formatter={(value, name) => [`${value}%`, name]}
              />
            </PieChart>
          </ResponsiveContainer>

          <div className="mt-3">
            <h3 className="text-xs font-medium text-gray-400 mb-2">Risk Heatmap</h3>
            <div className="grid grid-cols-4 gap-1">
              {APIS.map((api) => {
                const level = getRiskLevel(api.risk_score);
                return (
                  <div
                    key={api.name}
                    title={`${api.name}: ${api.risk_score}`}
                    className={`h-8 rounded flex items-center justify-center text-xs font-bold cursor-default ${
                      level === 'high'
                        ? 'bg-red-500/30 text-red-400'
                        : level === 'medium'
                        ? 'bg-yellow-500/30 text-yellow-400'
                        : 'bg-green-500/30 text-green-400'
                    }`}
                  >
                    {api.risk_score}
                  </div>
                );
              })}
            </div>
            <div className="flex gap-3 mt-2 text-xs text-gray-500">
              <span className="flex items-center gap-1"><span className="w-2 h-2 bg-red-500 rounded"></span> High ≥80</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 bg-yellow-500 rounded"></span> Med 60–79</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 bg-green-500 rounded"></span> Low &lt;60</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
