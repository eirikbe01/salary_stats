import { workerStats } from '../types.ts';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

export const ScatterOverview = ({ isAnimationActive = true }) => {
  console.log(workerStats);
  const data = workerStats
    .filter((worker) => worker.education === 3 || worker.education == 5)
    .map(({ experience, salary, education }) => ({
      experience,
      salary,
      education,
    }));

  const bachelorData = data.filter((d) => d.education === 3);
  const masterData = data.filter((d) => d.education === 5);

  console.log(data);
  return (
    <ResponsiveContainer width="100%" height={400}>
      <ScatterChart
        responsive
        margin={{
          top: 20,
          right: 30,
          left: 10,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          type="number"
          dataKey="experience"
          name="Experience (years)"
          label={{
            value: 'Years of experience',
            position: 'insideBottom',
            offset: -5,
          }}
          domain={[0, 'dataMax + 1']}
        />
        <YAxis
          type="number"
          dataKey="salary"
          name="Salary"
          width="auto"
          tickFormatter={(v) => `${Math.round(v / 1000)}k`}
          label={{ value: 'Salary (NOK)', angle: -90, position: 'insideLeft' }}
        />
        <Tooltip
          formatter={(value: number | undefined) =>
            value !== undefined ? `${value.toLocaleString('nb-NO')} kr` : ''
          }
        />
        <Scatter
          name="Bachelor"
          data={bachelorData}
          opacity={0.5}
          fill="#8884d8"
          isAnimationActive={isAnimationActive}
        />
        <Scatter
          name="Master"
          data={masterData}
          opacity={0.5}
          fill="#82ca9d"
          isAnimationActive={isAnimationActive}
        />

        <Legend
          layout="horizontal"
          align="center"
          verticalAlign="bottom"
          wrapperStyle={{ paddingTop: 20 }}
        />
      </ScatterChart>
    </ResponsiveContainer>
  );
};
