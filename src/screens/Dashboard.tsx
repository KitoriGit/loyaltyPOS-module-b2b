import { useState } from 'react';
import { DashboardPuntos } from './DashboardPuntos';
import { DashboardSellos } from './DashboardSellos';

export function Dashboard() {
  const [model, setModel] = useState<'puntos' | 'sellos'>('puntos');

  return (
    <div className="flex flex-col gap-space-md">
      {/* Temporary Switcher */}
      <div className="bg-surface-container-lowest p-space-sm rounded-xl shadow-sm flex items-center gap-space-sm w-fit">
        <button
          className={`px-4 py-2 rounded-lg font-sans text-sm font-semibold transition-colors ${
            model === 'puntos' ? 'bg-primary text-on-primary' : 'text-on-surface-variant hover:bg-surface-container'
          }`}
          onClick={() => setModel('puntos')}
        >
          Ver Modelo de Puntos
        </button>
        <button
          className={`px-4 py-2 rounded-lg font-sans text-sm font-semibold transition-colors ${
            model === 'sellos' ? 'bg-primary text-on-primary' : 'text-on-surface-variant hover:bg-surface-container'
          }`}
          onClick={() => setModel('sellos')}
        >
          Ver Modelo de Sellos
        </button>
      </div>

      {model === 'puntos' ? <DashboardPuntos /> : <DashboardSellos />}
    </div>
  );
}
