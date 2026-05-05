import { getSelfRelianceScore } from '../data/mockData';

export default function SelfRelianceScore({ selectedApi }) {
  const score = getSelfRelianceScore(selectedApi);
  const level = score >= 50 ? (score >= 75 ? 'high' : 'medium') : 'low';

  const colorMap = {
    high: { text: 'text-emerald-400', bg: 'bg-emerald-500', ring: 'stroke-emerald-500', badge: 'bg-emerald-500/20 text-emerald-400' },
    medium: { text: 'text-yellow-400', bg: 'bg-yellow-500', ring: 'stroke-yellow-500', badge: 'bg-yellow-500/20 text-yellow-400' },
    low: { text: 'text-red-400', bg: 'bg-red-500', ring: 'stroke-red-500', badge: 'bg-red-500/20 text-red-400' },
  };
  const colors = colorMap[level];

  const circumference = 2 * Math.PI * 40;
  const dashOffset = circumference - (score / 100) * circumference;

  return (
    <div className="bg-gray-800 rounded-xl border border-gray-700 h-full">
      <div className="px-4 py-3 border-b border-gray-700">
        <h2 className="font-semibold text-gray-100">Self-Reliance Index</h2>
        <p className="text-xs text-gray-400 mt-0.5">{selectedApi.name}</p>
      </div>
      <div className="p-6 flex flex-col items-center">
        <svg width="120" height="120" className="mb-4" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="40" fill="none" stroke="#374151" strokeWidth="10" />
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            className={colors.ring}
            strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            strokeLinecap="round"
            transform="rotate(-90 50 50)"
            style={{ transition: 'stroke-dashoffset 0.6s ease' }}
          />
          <text x="50" y="54" textAnchor="middle" className={`${colors.text} fill-current`} fontSize="20" fontWeight="bold">
            {score}%
          </text>
        </svg>

        <span className={`px-3 py-1 rounded-full text-sm font-medium ${colors.badge} mb-4`}>
          {level === 'high' ? '✅ Self-Sufficient' : level === 'medium' ? '⚠️ Moderate' : '🔴 High Risk'}
        </span>

        <div className="w-full space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Domestic Capacity</span>
            <span className="text-gray-200 font-medium">{selectedApi.domestic_capacity.toLocaleString()} MT</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Annual Demand</span>
            <span className="text-gray-200 font-medium">{selectedApi.demand_mt.toLocaleString()} MT</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Import Dependency</span>
            <span className={`font-medium ${colors.text}`}>{selectedApi.import_pct}%</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Primary Source</span>
            <span className="text-gray-200 font-medium">{selectedApi.source}</span>
          </div>
        </div>

        <div className="w-full mt-4 p-3 bg-gray-700/40 rounded-lg border border-gray-600/50">
          <p className="text-xs text-gray-400 text-center">
            {level === 'low'
              ? `⚠️ India imports ${selectedApi.import_pct}% of ${selectedApi.name}. Urgent capacity expansion needed.`
              : level === 'medium'
              ? `India covers ~${score}% of ${selectedApi.name} needs. Moderate expansion recommended.`
              : `India meets ${score}% of ${selectedApi.name} demand domestically. Strong position.`}
          </p>
        </div>
      </div>
    </div>
  );
}
