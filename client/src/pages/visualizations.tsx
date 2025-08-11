import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import Header from "@/components/layout/header";
import { Card, CardContent } from "@/components/ui/card";
import BarChart from "@/components/charts/bar-chart";
import LineChart from "@/components/charts/line-chart";
import PieChart from "@/components/charts/pie-chart";
import { PieChart as PieChartIcon, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import type { Dataset } from "@shared/schema";

export default function Visualizations() {
  const [match, params] = useRoute("/visualizations/:id");
  const datasetId = params?.id;

  const { data: datasets = [] } = useQuery<Dataset[]>({
    queryKey: ["/api/datasets"],
  });

  const { data: dataset, isLoading } = useQuery<Dataset>({
    queryKey: ["/api/datasets", datasetId],
    enabled: !!datasetId,
  });

  // If no ID is provided, use the first available dataset
  const currentDataset = dataset || (!datasetId ? datasets[0] : null);

  if (isLoading) {
    return (
      <div>
        <Header title="Visualizations" subtitle="Create interactive charts from your data" />
        <main className="p-6">
          <div className="animate-pulse">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="h-96 bg-gray-200 rounded-lg"></div>
              <div className="h-96 bg-gray-200 rounded-lg"></div>
              <div className="h-96 bg-gray-200 rounded-lg"></div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!currentDataset) {
    return (
      <div>
        <Header title="Visualizations" subtitle="Create interactive charts from your data" />
        <main className="p-6">
          <Card>
            <CardContent className="py-12">
              <div className="text-center">
                <PieChartIcon className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Data Available</h3>
                <p className="text-gray-500 mb-6">
                  Upload a dataset to start creating beautiful visualizations and charts.
                </p>
                <Link href="/upload">
                  <Button className="bg-primary-500 hover:bg-primary-600">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Dataset
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div>
      <Header 
        title="Visualizations" 
        subtitle={`Interactive charts for ${currentDataset.fileName}`}
      />
      
      <main className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <BarChart dataset={currentDataset} />
          <LineChart dataset={currentDataset} />
          <PieChart dataset={currentDataset} />
        </div>
      </main>
    </div>
  );
}
