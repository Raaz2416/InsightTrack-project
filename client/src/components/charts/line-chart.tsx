import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Dataset } from "@shared/schema";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface LineChartProps {
  dataset: Dataset;
}

export default function LineChart({ dataset }: LineChartProps) {
  const [valueColumn, setValueColumn] = useState("");

  const numberColumns = dataset.columns.filter(col => col.name && col.name.trim() !== "" && col.type === "number");

  useEffect(() => {
    if (numberColumns.length > 0 && !valueColumn) {
      setValueColumn(numberColumns[0].name);
    }
  }, [dataset, numberColumns, valueColumn]);

  const generateChartData = () => {
    if (!valueColumn) return { labels: [], datasets: [] };

    const data = dataset.data.slice(0, 20).map((row, index) => parseFloat(row[valueColumn]) || 0);
    const labels = Array.from({ length: data.length }, (_, i) => `Point ${i + 1}`);

    return {
      labels,
      datasets: [
        {
          label: valueColumn,
          data,
          borderColor: "hsl(217, 91%, 60%)",
          backgroundColor: "hsla(217, 91%, 60%, 0.1)",
          tension: 0.4,
          fill: true,
          pointBackgroundColor: "hsl(217, 91%, 60%)",
          pointBorderColor: "#fff",
          pointHoverBackgroundColor: "#fff",
          pointHoverBorderColor: "hsl(217, 91%, 60%)",
        },
      ],
    };
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value: any) {
            return typeof value === "number" ? value.toLocaleString() : value;
          },
        },
      },
    },
    interaction: {
      intersect: false,
      mode: "index" as const,
    },
  };

  return (
    <div className="chart-container rounded-2xl">
      <div className="flex items-center justify-between p-6 border-b border-border">
        <h3 className="text-lg font-semibold text-foreground">Trend Analysis</h3>
        <div className="flex items-center space-x-2">
          <Select value={valueColumn} onValueChange={setValueColumn}>
            <SelectTrigger className="w-40 bg-secondary border-border rounded-lg">
              <SelectValue placeholder="Select metric" />
            </SelectTrigger>
            <SelectContent>
              {numberColumns.map((column) => (
                <SelectItem key={column.name} value={column.name}>
                  {column.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="p-6">
        <div className="h-80">
          <Line data={generateChartData()} options={options} />
        </div>
      </div>
    </div>
  );
}
