import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Dataset } from "@shared/schema";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

interface PieChartProps {
  dataset: Dataset;
}

export default function PieChart({ dataset }: PieChartProps) {
  const [categoryColumn, setCategoryColumn] = useState("");

  const textColumns = dataset.columns.filter(col => col.name && col.name.trim() !== "" && col.type === "text");

  useEffect(() => {
    if (textColumns.length > 0 && !categoryColumn) {
      setCategoryColumn(textColumns[0].name);
    }
  }, [dataset, textColumns, categoryColumn]);

  const generateChartData = () => {
    if (!categoryColumn) return { labels: [], datasets: [] };

    // Count occurrences of each category
    const counts: Record<string, number> = {};
    
    dataset.data.forEach((row) => {
      const category = String(row[categoryColumn] || "Unknown");
      counts[category] = (counts[category] || 0) + 1;
    });

    // Sort by count and take top 8
    const sortedEntries = Object.entries(counts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 8);

    const labels = sortedEntries.map(([label]) => label);
    const data = sortedEntries.map(([, count]) => count);

    const colors = [
      "hsl(217, 91%, 60%)",
      "hsl(142, 69%, 58%)",
      "hsl(38, 92%, 50%)",
      "hsl(0, 84%, 60%)",
      "hsl(270, 95%, 75%)",
      "hsl(217, 91%, 70%)",
      "hsl(142, 69%, 68%)",
      "hsl(38, 92%, 60%)",
    ];

    return {
      labels,
      datasets: [
        {
          data,
          backgroundColor: colors.slice(0, labels.length),
          borderColor: colors.slice(0, labels.length),
          borderWidth: 2,
          hoverOffset: 4,
        },
      ],
    };
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          padding: 20,
          usePointStyle: true,
          pointStyle: "circle",
        },
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const label = context.label || "";
            const value = context.parsed || 0;
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${value} (${percentage}%)`;
          },
        },
      },
    },
  };

  return (
    <Card>
      <CardHeader className="border-b border-gray-200">
        <div className="flex items-center justify-between">
          <CardTitle>Pie Chart</CardTitle>
          <div className="flex items-center space-x-2">
            <Select value={categoryColumn} onValueChange={setCategoryColumn}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Category column" />
              </SelectTrigger>
              <SelectContent>
                {textColumns.map((column) => (
                  <SelectItem key={column.name} value={column.name}>
                    {column.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="h-80">
          <Pie data={generateChartData()} options={options} />
        </div>
      </CardContent>
    </Card>
  );
}
