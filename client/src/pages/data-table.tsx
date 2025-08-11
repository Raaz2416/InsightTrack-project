import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import Header from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DataTableComponent from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { Database, Calendar, FileText, Layers } from "lucide-react";
import type { Dataset } from "@shared/schema";

export default function DataTable() {
  const [match, params] = useRoute("/data/:id");
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

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <div>
        <Header title="Data Table" subtitle="View and analyze your dataset" />
        <main className="p-6">
          <div className="animate-pulse">
            <div className="h-32 bg-secondary rounded-2xl mb-6"></div>
            <div className="h-96 bg-secondary rounded-2xl"></div>
          </div>
        </main>
      </div>
    );
  }

  if (!currentDataset) {
    return (
      <div>
        <Header title="Data Table" subtitle="View and analyze your dataset" />
        <main className="p-6">
          <div className="chart-container rounded-2xl">
            <div className="py-20">
              <div className="text-center">
                <div className="w-20 h-20 gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Database className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">No Dataset Found</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  The requested dataset could not be found or no datasets have been uploaded yet.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div>
      <Header 
        title="Data Table" 
        subtitle={`Viewing ${currentDataset.fileName}`}
      />
      
      <main className="p-6">
        {/* Dataset Info */}
        <div className="chart-container rounded-2xl mb-6">
          <div className="p-6 border-b border-border">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-foreground">{currentDataset.name}</h3>
                <p className="text-muted-foreground">Dataset Overview</p>
              </div>
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 gradient-primary rounded-2xl flex items-center justify-center">
                  <Database className="w-7 h-7 text-white" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Rows</p>
                  <p className="text-2xl font-bold text-foreground">{currentDataset.rowCount.toLocaleString()}</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 gradient-secondary rounded-2xl flex items-center justify-center">
                  <Layers className="w-7 h-7 text-white" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Columns</p>
                  <p className="text-2xl font-bold text-foreground">{currentDataset.columnCount}</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 gradient-tertiary rounded-2xl flex items-center justify-center">
                  <FileText className="w-7 h-7 text-white" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">File Size</p>
                  <p className="text-2xl font-bold text-foreground">{formatFileSize(currentDataset.fileSize)}</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
                  <Calendar className="w-7 h-7 text-white" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Uploaded</p>
                  <p className="text-sm font-semibold text-foreground">{formatDate(currentDataset.uploadedAt)}</p>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <p className="text-sm font-medium text-foreground mb-4">Column Structure</p>
              <div className="flex flex-wrap gap-2">
                {currentDataset.columns.map((column, index) => (
                  <Badge key={index} variant="secondary" className="text-xs bg-secondary/70 hover:bg-secondary rounded-lg px-3 py-1">
                    <span className="font-medium">{column.name}</span>
                    <span className="mx-1 text-muted-foreground">•</span>
                    <span className="capitalize text-primary">{column.type}</span>
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="chart-container rounded-2xl">
          <div className="p-6 border-b border-border">
            <h3 className="text-lg font-semibold text-foreground">Dataset Contents</h3>
          </div>
          <div className="p-0">
            <DataTableComponent 
              data={currentDataset.data} 
              columns={currentDataset.columns}
              showPagination={true}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
