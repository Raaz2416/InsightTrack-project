import { useState, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import Header from "@/components/layout/header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Upload as UploadIcon, File, AlertCircle } from "lucide-react";

export default function Upload() {
  const [, setLocation] = useLocation();
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      
      const response = await fetch("/api/datasets/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Upload failed");
      }

      return response.json();
    },
    onSuccess: (dataset) => {
      toast({
        title: "Success",
        description: "Dataset uploaded successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/datasets"] });
      setLocation("/");
    },
    onError: (error: Error) => {
      toast({
        title: "Upload Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files?.[0]) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileSelect = (file: File) => {
    if (file.type !== "text/csv" && !file.name.endsWith(".csv")) {
      toast({
        title: "Invalid File Type",
        description: "Please select a CSV file.",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "File size must be less than 10MB.",
        variant: "destructive",
      });
      return;
    }

    setSelectedFile(file);
  };

  const handleUpload = () => {
    if (selectedFile) {
      uploadMutation.mutate(selectedFile);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div>
      <Header 
        title="Upload Dataset" 
        subtitle="Upload and analyze your CSV data files"
      />
      
      <main className="p-6">
        <div className="max-w-2xl mx-auto">
          <div className="chart-container rounded-2xl">
            <div className="p-8">
              <div
                className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 cursor-pointer ${
                  dragActive
                    ? "border-primary bg-primary/10 scale-[1.02]"
                    : "border-border hover:border-primary/50 hover:bg-secondary/30"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="w-16 h-16 gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <UploadIcon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Upload your dataset
                </h3>
                <p className="text-muted-foreground mb-4">
                  Drag and drop your CSV file here, or
                </p>
                <Button variant="link" className="text-primary font-medium hover:text-primary/80">
                  browse to upload
                </Button>
                <p className="text-sm text-muted-foreground mt-6">
                  Supports CSV files up to 10MB
                </p>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileSelect(file);
                  }}
                />
              </div>

              {selectedFile && (
                <div className="mt-8 p-6 bg-secondary/50 rounded-2xl border border-border">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 gradient-secondary rounded-xl flex items-center justify-center">
                      <File className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-foreground">
                        {selectedFile.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {formatFileSize(selectedFile.size)}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedFile(null)}
                      className="rounded-lg border-border hover:bg-secondary/70"
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              )}

              <div className="mt-8 flex justify-end space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setLocation("/")}
                  className="rounded-lg border-border hover:bg-secondary/70"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleUpload}
                  disabled={!selectedFile || uploadMutation.isPending}
                  className="min-w-[140px] gradient-primary text-white rounded-lg hover:opacity-90"
                >
                  {uploadMutation.isPending ? "Uploading..." : "Upload Dataset"}
                </Button>
              </div>

              {uploadMutation.error && (
                <div className="mt-6 p-4 bg-destructive/10 border border-destructive/20 rounded-xl flex items-start space-x-3">
                  <AlertCircle className="h-5 w-5 text-destructive mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-destructive">
                      Upload Failed
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {uploadMutation.error.message}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
