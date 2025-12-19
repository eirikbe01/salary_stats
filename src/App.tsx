import './App.css';
import { SalaryOverTime } from './visualizations/LineCharts.tsx';
import { ScatterOverview } from './visualizations/ScatterPlots.tsx';
import { PublicVsInhouseVsConsultancy } from './visualizations/BarCharts.tsx';

function App() {
  return (
    <div className="flex-col m-12">
      <h1 className="text-2xl">Salary statistics within Tech 2024</h1>
      <span>Provided by </span>
      <a href="https://www.kode24.no/" target="_blank">
        Kode24
      </a>
      <div className="grid gap-12">
        <SalaryOverTime />
        <ScatterOverview />
        <PublicVsInhouseVsConsultancy />
      </div>

      <span>Charts made using </span>
      <a href="https://recharts.github.io/" target="_blank">
        Recharts
      </a>
    </div>
  );
}

export default App;
