import { APIS } from '../data/mockData';

export default function Sidebar({ selectedApi, onSelectApi, activeLayers, onToggleLayer }) {
  return (
    <aside className="w-64 bg-gray-800 border-r border-gray-700 flex flex-col">
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center gap-2">
          <span className="text-2xl">💊</span>
          <span className="font-bold text-emerald-400 text-lg">GeoPharma</span>
        </div>
        <p className="text-xs text-gray-500 mt-1">AI Intelligence Platform</p>
      </div>

      <div className="p-4 border-b border-gray-700">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
          Select API
        </h3>
        <div className="space-y-1">
          {APIS.map((api) => (
            <button
              key={api.name}
              onClick={() => onSelectApi(api)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                selectedApi.name === api.name
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'text-gray-300 hover:bg-gray-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span>{api.name}</span>
                <span
                  className={`text-xs px-1.5 py-0.5 rounded ${
                    api.risk_score >= 80
                      ? 'bg-red-500/20 text-red-400'
                      : api.risk_score >= 60
                      ? 'bg-yellow-500/20 text-yellow-400'
                      : 'bg-green-500/20 text-green-400'
                  }`}
                >
                  {api.risk_score}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 border-b border-gray-700">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
          Map Layers
        </h3>
        <div className="space-y-2">
          {[
            { key: 'pharmaHubs', label: 'Pharma Hubs', color: 'bg-emerald-500' },
            { key: 'industrialZones', label: 'Industrial Zones', color: 'bg-blue-500' },
            { key: 'ports', label: 'Port Connectivity', color: 'bg-purple-500' },
          ].map(({ key, label, color }) => (
            <label key={key} className="flex items-center gap-2 cursor-pointer group">
              <div
                onClick={() => onToggleLayer(key)}
                className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer ${
                  activeLayers[key] ? 'bg-emerald-600' : 'bg-gray-600'
                }`}
              >
                <span
                  className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                    activeLayers[key] ? 'translate-x-4' : 'translate-x-0.5'
                  }`}
                />
              </div>
              <div className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${color}`}></span>
                <span className="text-sm text-gray-300">{label}</span>
              </div>
            </label>
          ))}
        </div>
      </div>

      <div className="p-4 mt-auto">
        <div className="bg-gray-700/50 rounded-lg p-3">
          <p className="text-xs text-gray-400 mb-1">Selected API Risk</p>
          <div className="flex items-center gap-2">
            <div
              className={`text-2xl font-bold ${
                selectedApi.risk_score >= 80
                  ? 'text-red-400'
                  : selectedApi.risk_score >= 60
                  ? 'text-yellow-400'
                  : 'text-green-400'
              }`}
            >
              {selectedApi.risk_score}
            </div>
            <div className="flex-1">
              <div className="h-2 bg-gray-600 rounded-full">
                <div
                  className={`h-2 rounded-full ${
                    selectedApi.risk_score >= 80
                      ? 'bg-red-500'
                      : selectedApi.risk_score >= 60
                      ? 'bg-yellow-500'
                      : 'bg-green-500'
                  }`}
                  style={{ width: `${selectedApi.risk_score}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-0.5">Risk Score</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
