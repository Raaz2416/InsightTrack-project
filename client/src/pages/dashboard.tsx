import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import Header from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import BarChart from "@/components/charts/bar-chart";
import LineChart from "@/components/charts/line-chart";
import DataTableComponent from "@/components/ui/data-table";
import { 
  Database, 
  Table, 
  BarChart3, 
  HardDrive,
  Upload,
  PieChart,
  Bookmark,
  Download,
  Eye,
  FileText,
  TrendingUp,
  Filter,
  Share2
} from "lucide-react";
import type { Dataset } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export default function Dashboard() {
  const { toast } = useToast();
  
  const { data: datasets = [], isLoading } = useQuery<Dataset[]>({
    queryKey: ["/api/datasets"],
  });

  const totalDatasets = datasets.length;
  const totalRecords = datasets.reduce((sum, dataset) => sum + dataset.rowCount, 0);
  const totalColumns = datasets.reduce((sum, dataset) => sum + dataset.columnCount, 0);
  const totalSize = datasets.reduce((sum, dataset) => sum + dataset.fileSize, 0);
  const maxSize = 10 * 1024 * 1024 * 1024; // 10GB limit
  const storagePercentage = Math.round((totalSize / maxSize) * 100);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const recentDatasets = datasets.slice(0, 3);
  const currentDataset = datasets[0];

  const handleShareReport = () => {
    navigator.clipboard.writeText(window.location.origin);
    toast({
      title: "Link Copied",
      description: "Dashboard link has been copied to clipboard",
    });
  };

  if (isLoading) {
    return (
      <div>
        <Header 
          title="Dashboard Overview" 
          subtitle="Welcome back! Here's what's happening with your data today."
        />
        <main className="p-6">
          <div className="animate-pulse">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div>
      <Header 
        title="Dashboard Overview" 
        subtitle="Welcome back! Here's what's happening with your data today."
      />
      
      <main className="p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="metric-card rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Total Datasets</p>
                <p className="text-3xl font-bold text-foreground">{totalDatasets}</p>
              </div>
              <div className="w-14 h-14 gradient-primary rounded-2xl flex items-center justify-center">
                <Database className="text-white w-7 h-7" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <div className="flex items-center space-x-1">
                <TrendingUp className="w-4 h-4 text-primary" />
                <span className="text-primary font-semibold">
                  {totalDatasets > 0 ? "+100%" : "0%"}
                </span>
              </div>
              <span className="text-muted-foreground ml-2">vs last month</span>
            </div>
          </div>

          <div className="metric-card rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Total Records</p>
                <p className="text-3xl font-bold text-foreground">{totalRecords.toLocaleString()}</p>
              </div>
              <div className="w-14 h-14 gradient-secondary rounded-2xl flex items-center justify-center">
                <Table className="text-white w-7 h-7" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <div className="flex items-center space-x-1">
                <TrendingUp className="w-4 h-4 text-primary" />
                <span className="text-primary font-semibold">
                  {totalRecords > 0 ? "+100%" : "0%"}
                </span>
              </div>
              <span className="text-muted-foreground ml-2">vs last week</span>
            </div>
          </div>

          <div className="metric-card rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Data Columns</p>
                <p className="text-3xl font-bold text-foreground">{totalColumns}</p>
              </div>
              <div className="w-14 h-14 gradient-tertiary rounded-2xl flex items-center justify-center">
                <BarChart3 className="text-white w-7 h-7" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <div className="flex items-center space-x-1">
                <TrendingUp className="w-4 h-4 text-primary" />
                <span className="text-primary font-semibold">
                  {totalColumns > 0 ? "+100%" : "0%"}
                </span>
              </div>
              <span className="text-muted-foreground ml-2">vs yesterday</span>
            </div>
          </div>

          <div className="metric-card rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Storage Used</p>
                <p className="text-3xl font-bold text-foreground">{formatFileSize(totalSize)}</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
                <HardDrive className="text-white w-7 h-7" />
              </div>
            </div>
            <div className="mt-4 space-y-2">
              <div className="w-full bg-secondary rounded-full h-2.5 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-primary to-green-400 h-full rounded-full transition-all duration-500 ease-out" 
                  style={{ width: `${Math.min(storagePercentage, 100)}%` }}
                ></div>
              </div>
              <p className="text-xs text-muted-foreground">
                {storagePercentage}% of 10 GB capacity
              </p>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mb-8">
          {/* Recent Datasets */}
          <div className="chart-container rounded-2xl">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h3 className="text-lg font-semibold text-foreground">Recent Datasets</h3>
              <Link href="/data">
                <Button variant="link" size="sm" className="text-primary hover:text-primary/80">
                  View all →
                </Button>
              </Link>
            </div>
            <div className="p-6">
              {recentDatasets.length > 0 ? (
                <div className="space-y-4">
                  {recentDatasets.map((dataset, index) => (
                    <div
                      key={dataset.id}
                      className="group flex items-center justify-between p-4 bg-secondary/50 rounded-xl hover:bg-secondary/70 transition-all duration-200 border border-transparent hover:border-primary/20"
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          index === 0 ? "gradient-primary" :
                          index === 1 ? "gradient-secondary" : "gradient-tertiary"
                        }`}>
                          <FileText className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h4 className="font-medium text-foreground group-hover:text-primary transition-colors">
                            {dataset.fileName}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {dataset.rowCount.toLocaleString()} rows • {dataset.columnCount} columns • 
                            {formatDate(dataset.uploadedAt)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link href={`/data/${dataset.id}`}>
                          <Button variant="ghost" size="sm" className="hover:bg-primary/10">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Link href={`/visualizations/${dataset.id}`}>
                          <Button variant="ghost" size="sm" className="hover:bg-primary/10">
                            <BarChart3 className="w-4 h-4" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="text-foreground font-medium mb-2">No datasets yet</h4>
                  <p className="text-muted-foreground mb-6">Upload your first dataset to get started</p>
                  <Link href="/upload">
                    <Button className="gradient-primary text-white hover:opacity-90">
                      Upload Dataset
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {currentDataset && (
          <>
            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <BarChart dataset={currentDataset} />
              <LineChart dataset={currentDataset} />
            </div>

            {/* Data Table Preview */}
            <div className="chart-container rounded-2xl">
              <div className="flex items-center justify-between p-6 border-b border-border">
                <h3 className="text-lg font-semibold text-foreground">Data Preview</h3>
                <div className="flex items-center space-x-2">
                  <Link href={`/data/${currentDataset.id}`}>
                    <Button variant="outline" size="sm" className="rounded-lg border-border hover:bg-secondary/70">
                      <Filter className="w-4 h-4 mr-2" />
                      Filter
                    </Button>
                  </Link>
                  <Link href={`/data/${currentDataset.id}`}>
                    <Button size="sm" className="gradient-primary text-white rounded-lg hover:opacity-90">
                      View All Data
                    </Button>
                  </Link>
                  <Button variant="outline" size="sm" onClick={handleShareReport} className="rounded-lg border-border hover:bg-secondary/70">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                </div>
              </div>
              <div className="p-0">
                <DataTableComponent 
                  data={currentDataset.data.slice(0, 5)} 
                  columns={currentDataset.columns}
                  showPagination={false}
                />
                <div className="px-6 py-4 border-t border-border bg-secondary/30">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                      Showing <span className="font-medium text-foreground">1</span> to{" "}
                      <span className="font-medium text-foreground">
                        {Math.min(5, currentDataset.rowCount)}
                      </span> of{" "}
                      <span className="font-medium text-foreground">{currentDataset.rowCount.toLocaleString()}</span> results
                    </p>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm" disabled className="rounded-lg">
                        Previous
                      </Button>
                      <Link href={`/data/${currentDataset.id}`}>
                        <Button size="sm" className="gradient-primary text-white rounded-lg hover:opacity-90">
                          Next
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {!currentDataset && (
          <Card>
            <CardContent className="py-12">
              <div className="text-center">
                <Upload className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Data Available</h3>
                <p className="text-gray-500 mb-6">
                  Get started by uploading your first CSV dataset to see analytics and visualizations.
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
        )}
      </main>
    </div>
  );
}
