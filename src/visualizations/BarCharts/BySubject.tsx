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
import { median } from '../../common/functions.ts';
import { workerStats } from '../../types.ts';


type SubjectRow = {
    subject: string;
    salary: number;
}


export function salaryBySubject (rows: SubjectRow[]) {
    const map = new Map<string, number[]>();

    for (const row of rows) {
        const key = row.subject.trim();
        if(!map.has(key)) {
            map.set(key, []);
        }
        else {
            map.get(key)!.push(row.salary);
        }
    }

    return Array.from(map.entries())
        .map(([subject, salaries]) => ({
        subject,
        salary: median(salaries),
        n: salaries.length,
        }))
        .sort((a, b) => (b.salary ?? 0) - (a.salary?? 0));
}

export const SubjectBarChart = ({isAnimationActive=true}) => {
    const data = workerStats.map(({ subject, salary }) => ({
        subject, 
        salary,
    }));
    const chartData = salaryBySubject(data);

    return(
        <ResponsiveContainer width="100%" height={400}>
            <BarChart data={chartData} margin={{ top: 20, right: 20, bottom: 80, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3"/>

                <XAxis
                dataKey="subject"
                interval={0}
                angle={-30}
                textAnchor="end"
                height={90}
                />

                <YAxis
                tickFormatter={(v) => `${Math.round(v / 1000)}k`}
                label={{ value: 'Salary (NOK)', angle: -90, position: 'insideLeft' }}
                />

                <Tooltip
                formatter={(value: number | undefined) =>
                    value !== undefined ? `${Math.round(value).toLocaleString('nb-NO')} kr` : ''
                }
                labelFormatter={(label) => `Subject: ${label}`}
                />

                <Bar 
                    dataKey="salary" 
                    fill="#8884d8"
                    isAnimationActive={isAnimationActive}
                />
            </BarChart>
        </ResponsiveContainer>
    );
}