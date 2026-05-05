import { useState } from 'react';
import { APIS } from './data/mockData';
import Sidebar from './components/Sidebar';
import MapDashboard from './components/MapDashboard';
import DependencyDashboard from './components/DependencyDashboard';
import LocationRecommender from './components/LocationRecommender';
import SelfRelianceScore from './components/SelfRelianceScore';
import RiskPrediction from './components/RiskPrediction';
import ScenarioSimulation from './components/ScenarioSimulation';

export default function App() {
  const [selectedApi, setSelectedApi] = useState(APIS[0]);
  const [activeLayers, setActiveLayers] = useState({
    pharmaHubs: true,
    industrialZones: true,
    ports: true,
  });

  const toggleLayer = (layer) => {
    setActiveLayers(prev => ({ ...prev, [layer]: !prev[layer] }));
  };

  return (
    <div className="flex h-screen bg-gray-900 text-gray-100 overflow-hidden">
      <Sidebar
        selectedApi={selectedApi}
        onSelectApi={setSelectedApi}
        activeLayers={activeLayers}
        onToggleLayer={toggleLayer}
      />
      <main className="flex-1 overflow-y-auto">
        <div className="p-6 space-y-6">
          <header className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-emerald-400">GeoPharma AI</h1>
              <p className="text-gray-400 text-sm mt-1">
                India Pharmaceutical API Self-Reliance Intelligence Platform
              </p>
            </div>
            <div className="flex items-center gap-2 bg-gray-800 px-4 py-2 rounded-lg border border-gray-700">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-sm text-gray-300">Live Analysis</span>
            </div>
          </header>

          <MapDashboard activeLayers={activeLayers} selectedApi={selectedApi} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <DependencyDashboard selectedApi={selectedApi} />
            </div>
            <div>
              <SelfRelianceScore selectedApi={selectedApi} />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <LocationRecommender selectedApi={selectedApi} />
            <RiskPrediction selectedApi={selectedApi} />
          </div>

          <ScenarioSimulation selectedApi={selectedApi} />
        </div>
      </main>
    </div>
  );
}
