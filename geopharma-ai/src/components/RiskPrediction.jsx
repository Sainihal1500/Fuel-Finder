import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { getRiskData } from '../data/mockData';

export default function RiskPrediction({ selectedApi }) {
  const data = getRiskData(selectedApi);

  return (
    <div className="bg-gray-800 rounded-xl border border-gray-700">
      <div className="px-4 py-3 border-b border-gray-700">
        <h2 className="font-semibold text-gray-100">Risk Prediction</h2>
        <p className="text-xs text-gray-400 mt-0.5">
          Supply disruption &amp; price spike risk — {selectedApi.name}
        </p>
      </div>
      <div className="p-4 space-y-5">
        <div>
          <h3 className="text-xs font-medium text-gray-400 mb-2">Supply Disruption Probability (%)</h3>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={data} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="month" tick={{ fill: '#9ca3af', fontSize: 11 }} />
              <YAxis tick={{ fill: '#9ca3af', fontSize: 11 }} domain={[0, 100]} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                labelStyle={{ color: '#9ca3af' }}
                itemStyle={{ color: '#f87171' }}
                formatter={(v) => [`${v.toFixed(1)}%`, 'Disruption Risk']}
              />
              <Bar dataKey="disruption" fill="#ef4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div>
          <h3 className="text-xs font-medium text-gray-400 mb-2">Price Spike Risk (%)</h3>
          <ResponsiveContainer width="100%" height={140}>
            <LineChart data={data} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="month" tick={{ fill: '#9ca3af', fontSize: 11 }} />
              <YAxis tick={{ fill: '#9ca3af', fontSize: 11 }} domain={[0, 100]} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                labelStyle={{ color: '#9ca3af' }}
                itemStyle={{ color: '#f59e0b' }}
                formatter={(v) => [`${v.toFixed(1)}%`, 'Price Risk']}
              />
              <Line
                type="monotone"
                dataKey="priceRisk"
                stroke="#f59e0b"
                strokeWidth={2}
                dot={{ fill: '#f59e0b', r: 3 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-red-400">{selectedApi.risk_score}</div>
            <div className="text-xs text-gray-400 mt-1">Overall Risk Score</div>
          </div>
          <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-orange-400">{selectedApi.import_pct}%</div>
            <div className="text-xs text-gray-400 mt-1">Import Dependency</div>
          </div>
        </div>
      </div>
    </div>
  );
}
