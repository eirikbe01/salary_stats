import {
  BarChart,
  Legend,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Bar,
  ResponsiveContainer,
} from 'recharts';
import type { ValueType, NameType } from 'recharts/types/component/DefaultTooltipContent';
import { median } from './LineCharts.tsx';
import { workerStats } from '../types.ts';

type Row = {
  workPlace: string;
  jobType: string;
  salary: number;
};

function toSector(jobType: string): 'public' | 'private' | 'consultancy' | null {
  const s = jobType.toLowerCase();

  // adjust these to match your dataset values
  if (s.includes('offentlig')) return 'public';
  if (s.includes('konsulent')) return 'consultancy';
  if (s.includes('privat')) return 'private';

  return null; // unknown / ignore
}

export function toGroupedBarData(rows: Row[]) {
  // workplace -> sector -> salaries[]
  const map = new Map<string, Record<'public' | 'private' | 'consultancy', number[]>>();

  for (const r of rows) {
    const sector = toSector(r.jobType);
    if (!sector) continue;

    const workplace = r.workPlace?.trim() || 'Ukjent';

    if (!map.has(workplace)) {
      map.set(workplace, { public: [], private: [], consultancy: [] });
    }
    map.get(workplace)![sector].push(r.salary);
  }

  // Convert to recharts shape
  return Array.from(map.entries()).map(([workPlace, sectors]) => ({
    workPlace,
    public: median(sectors.public),
    private: median(sectors.private),
    consultancy: median(sectors.consultancy),
    // optional sample sizes for tooltip/debug:
    publicN: sectors.public.length,
    privateN: sectors.private.length,
    consultancyN: sectors.consultancy.length,
  }));
}

export const PublicVsInhouseVsConsultancy = ({ isAnimationActive = true }) => {

  const data = workerStats
    .map(({ workPlace, jobType, salary }) => ({
      workPlace,
      jobType,
      salary,
    }));

  const chartData = toGroupedBarData(data);
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />

        <XAxis 
          dataKey="workPlace" 
          interval={0}
          angle={-25}
          textAnchor="end"
          height={70}
        />
        <YAxis 
          width="auto" 
          tickFormatter={(v) => `${Math.round(v / 1000)}k`}
          label={{ value: 'Salary (NOK)', angle: -90, position: 'insideLeft' }}
        />
        <Tooltip
          formatter={(value: ValueType | undefined, name: NameType | undefined) => {
            if (typeof value !== 'number') return ['–', name];
            return [`${Math.round(value).toLocaleString('nb-NO')} kr`, name];
          }}
        />
        <Legend />
        <Bar
          dataKey="public"
          name="Offentlig"
          fill="#8884d8"
          isAnimationActive={isAnimationActive}
        />
        <Bar
          dataKey="private"
          name="Privat in-house"
          fill="#82ca9d"
          isAnimationActive={isAnimationActive}
        />
        <Bar
          dataKey="consultancy"
          name="Konsulent"
          fill="#ffc658"
          isAnimationActive={isAnimationActive}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};
