import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Dataset } from "@shared/schema";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface BarChartProps {
  dataset: Dataset;
}

export default function BarChart({ dataset }: BarChartProps) {
  const [xColumn, setXColumn] = useState("");
  const [yColumn, setYColumn] = useState("");

  const textColumns = dataset.columns.filter(col => col.name && col.name.trim() !== "" && col.type === "text");
  const numberColumns = dataset.columns.filter(col => col.name && col.name.trim() !== "" && col.type === "number");

  useEffect(() => {
    if (textColumns.length > 0 && !xColumn) {
      setXColumn(textColumns[0].name);
    }
    if (numberColumns.length > 0 && !yColumn) {
      setYColumn(numberColumns[0].name);
    }
  }, [dataset, textColumns, numberColumns, xColumn, yColumn]);

  const generateChartData = () => {
    if (!xColumn || !yColumn) return { labels: [], datasets: [] };

    // Group data by x-column and sum y-column values
    const grouped: Record<string, number> = {};
    
    dataset.data.forEach((row) => {
      const xValue = String(row[xColumn] || "Unknown");
      const yValue = parseFloat(row[yColumn]) || 0;
      
      if (grouped[xValue]) {
        grouped[xValue] += yValue;
      } else {
        grouped[xValue] = yValue;
      }
    });

    const labels = Object.keys(grouped).slice(0, 10); // Limit to 10 categories
    const data = labels.map(label => grouped[label]);

    return {
      labels,
      datasets: [
        {
          label: yColumn,
          data,
          backgroundColor: [
            "hsl(217, 91%, 60%)",
            "hsl(142, 69%, 58%)",
            "hsl(38, 92%, 50%)",
            "hsl(0, 84%, 60%)",
            "hsl(270, 95%, 75%)",
            "hsl(217, 91%, 70%)",
            "hsl(142, 69%, 68%)",
            "hsl(38, 92%, 60%)",
            "hsl(0, 84%, 70%)",
            "hsl(270, 95%, 85%)",
          ],
          borderRadius: 4,
          borderSkipped: false,
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
      x: {
        ticks: {
          maxRotation: 45,
          minRotation: 0,
        },
      },
    },
  };

  return (
    <div className="chart-container rounded-2xl">
      <div className="flex items-center justify-between p-6 border-b border-border">
        <h3 className="text-lg font-semibold text-foreground">Bar Chart</h3>
        <div className="flex items-center space-x-2">
          <Select value={xColumn} onValueChange={setXColumn}>
            <SelectTrigger className="w-36 bg-secondary border-border rounded-lg">
              <SelectValue placeholder="Categories" />
            </SelectTrigger>
            <SelectContent>
              {textColumns.map((column) => (
                <SelectItem key={column.name} value={column.name}>
                  {column.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={yColumn} onValueChange={setYColumn}>
            <SelectTrigger className="w-36 bg-secondary border-border rounded-lg">
              <SelectValue placeholder="Values" />
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
          <Bar data={generateChartData()} options={options} />
        </div>
      </div>
    </div>
  );
}
