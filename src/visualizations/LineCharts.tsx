import { workerStats } from '../types.ts';
import {
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Line,
  ResponsiveContainer,
} from 'recharts';

type Row = { experience: number; salary: number; education: number };

const BACHELOR_CODE = 3;
const MASTER_CODE = 5;

function median(nums: number[]) {
  if (nums.length === 0) return null;
  const sorted = [...nums].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? (sorted[mid - 1] + sorted[mid]) / 2
    : sorted[mid];
}

export function toLineChartData(rows: Row[]) {
  const buckets = new Map<number, { bachelor: number[]; master: number[] }>();

  for (const row of rows) {
    if (!buckets.has(row.experience)) {
      buckets.set(row.experience, { bachelor: [], master: [] });
    }
    const b = buckets.get(row.experience)!;

    if (row.education === BACHELOR_CODE) b.bachelor.push(row.salary);
    else if (row.education === MASTER_CODE) b.master.push(row.salary);
  }

  const data = Array.from(buckets.entries())
    .sort(([a], [b]) => a - b)
    .map(([experience, vals]) => ({
      experience,
      bachelor: median(vals.bachelor),
      master: median(vals.master),
      // optional: counts for tooltip/debug
      bachelorN: vals.bachelor.length,
      masterN: vals.master.length,
    }));

  return data;
}

export const SalaryOverTime = ({ isAnimationActive = true }) => {
  const data = workerStats
    .filter((worker) => worker.education === 3 || worker.education == 5)
    .map(({ experience, salary, education }) => ({
      experience,
      salary,
      education,
    }))
    .sort((a, b) => a.experience - b.experience);

  const chartData = toLineChartData(data);

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart
        responsive
        data={chartData}
        margin={{
          top: 20,
          right: 30,
          left: 10,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="experience"
          label={{
            value: 'Years of experience',
            position: 'insideBottom',
            offset: -10,
          }}
        />
        <YAxis
          width="auto"
          tickFormatter={(v) => `${Math.round(v / 1000)}k`}
          label={{ value: 'Salary (NOK)', angle: -90, position: 'insideLeft' }}
        />

        <Tooltip
          formatter={(value: number | undefined) =>
            value !== undefined ? `${value.toLocaleString('nb-NO')} kr` : ''
          }
        />
        <Legend
          layout="horizontal"
          align="center"
          verticalAlign="bottom"
          wrapperStyle={{ paddingTop: 20 }}
        />

        <Line
          type="monotone"
          dataKey="bachelor"
          name="Bachelor"
          stroke="#8884d8"
          isAnimationActive={isAnimationActive}
        />
        <Line
          type="monotone"
          dataKey="master"
          name="Master"
          stroke="#82ca9d"
          isAnimationActive={isAnimationActive}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};
