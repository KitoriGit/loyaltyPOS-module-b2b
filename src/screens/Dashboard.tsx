import { DashboardPuntos } from './DashboardPuntos';
import { DashboardSellos } from './DashboardSellos';
import { useLoyaltyStore } from '../store/useLoyaltyStore';

export function Dashboard() {
  const programType = useLoyaltyStore((state) => state.config.type);

  return (
    <div className="flex flex-col gap-space-md h-full">
      {programType === 'puntos' ? <DashboardPuntos /> : <DashboardSellos />}
    </div>
  );
}
