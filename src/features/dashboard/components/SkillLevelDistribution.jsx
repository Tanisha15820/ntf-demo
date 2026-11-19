import EqualizerIcon from "@mui/icons-material/Equalizer";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Bar } from "react-chartjs-2";
import dashboardData from "../../../data/dashboard.json";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  ChartDataLabels
);

const { labels, required, allocation } = dashboardData.skillLevelDistribution;

const chartData = {
  labels,
  datasets: [
    {
      label: "Required",
      data: required,
      backgroundColor: "#0d9488",
      barThickness: 32,
      maxBarThickness: 32,
      borderColor: "#FFFFFF",
      borderWidth: {
        top: 0,
        bottom: 0,
        left: 4,
        right: 4,
      },
      borderRadius: {
        topLeft: 9,
        topRight: 9,
        bottomLeft: 0,
        bottomRight: 0,
      },
      borderSkipped: "bottom",
    },
    {
      label: "Allocation",
      data: allocation,
      backgroundColor: "#38bdf8",
      barThickness: 32,
      maxBarThickness: 32,
      borderColor: "#FFFFFF",
      borderWidth: {
        top: 0,
        bottom: 0,
        left: 4,
        right: 4,
      },
      borderRadius: {
        topLeft: 9,
        topRight: 9,
        bottomLeft: 0,
        bottomRight: 0,
      },
      borderSkipped: "bottom",
    },
  ],
};

const options = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    mode: "index",
    intersect: false,
  },
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      enabled: false,
      external: () => {},
    },
    datalabels: {
      display: true,
      anchor: "end",
      align: "top",
      offset: 4,
      color: "#334155",
      font: {
        size: 10,
        weight: "600",
        family: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      },
      formatter: (value) => value,
    },
  },
  scales: {
    x: {
      offset: true,
      grid: {
        display: false,
        drawBorder: false,
      },
      border: {
        display: false,
      },
      categoryPercentage: 0.5,
      ticks: {
        color: "#64748B",
        font: {
          size: 12,
          weight: "600",
        },
        padding: 5,
      },
    },
    y: {
      beginAtZero: true,
      ticks: {
        stepSize: 20,
        color: "#64748B",
        font: {
          size: 10,
        },
        padding: 8,
      },
      grid: {
        display: false,
        color: "#e8f1f5",
        drawTicks: false,
      },
      border: {
        display: false,
      },
    },
  },
};

const SkillLevelDistribution = () => {
  return (
    <div className="bg-white/85 backdrop-blur-md rounded-2xl md:rounded-3xl border border-[#e2edf2] shadow-[0_4px_24px_rgba(15,23,42,0.03)] overflow-hidden">
      <div className="px-5 pt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#e6f7f5] border border-[#0d9488]/20 flex items-center justify-center text-[#0d9488] shadow-xs">
              <EqualizerIcon sx={{ fontSize: 20 }} />
            </div>

            <div>
              <h2 className="text-sm font-bold text-[#0f172a]">
                Skill Level Distribution
              </h2>

              <p className="text-xs text-[#64748b] mt-0.5">
                Required vs allocation vs actual present by skill level
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 pb-4 pt-2 overflow-x-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent">
        <div
          className="h-[230px]"
          style={{
            minWidth: "800px",
          }}
        >
          <Bar data={chartData} options={options} />
        </div>
      </div>

      <div className="flex justify-center items-center gap-4 pb-4">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#0d9488]"></span>
          <span className="text-xs font-medium text-slate-500">Actual</span>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#38bdf8]"></span>
          <span className="text-xs font-medium text-slate-500">Present</span>
        </div>
      </div>
    </div>
  );
};

export default SkillLevelDistribution;
