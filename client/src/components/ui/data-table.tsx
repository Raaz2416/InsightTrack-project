import { useState, useMemo } from "react";
import { 
  ChevronLeft, 
  ChevronRight, 
  Search,
  Filter,
  ArrowUpDown,
  ArrowUp,
  ArrowDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import type { DatasetColumn } from "@shared/schema";

interface DataTableProps {
  data: Record<string, any>[];
  columns: DatasetColumn[];
  showPagination?: boolean;
}

export default function DataTable({ data, columns, showPagination = true }: DataTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterColumn, setFilterColumn] = useState("all");
  const [sortColumn, setSortColumn] = useState("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const validColumns = columns.filter(col => col.name && col.name.trim() !== "");

  // Filter and search data
  const filteredData = useMemo(() => {
    let filtered = data;

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter((row) => {
        if (filterColumn === "all") {
          return validColumns.some((col) =>
            String(row[col.name] || "").toLowerCase().includes(searchQuery.toLowerCase())
          );
        } else {
          return String(row[filterColumn] || "").toLowerCase().includes(searchQuery.toLowerCase());
        }
      });
    }

    return filtered;
  }, [data, searchQuery, filterColumn, validColumns]);

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortColumn) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aVal = a[sortColumn];
      const bVal = b[sortColumn];
      
      // Handle null/undefined values
      if (aVal == null && bVal == null) return 0;
      if (aVal == null) return sortDirection === "asc" ? -1 : 1;
      if (bVal == null) return sortDirection === "asc" ? 1 : -1;

      // Handle numeric values
      const aNum = parseFloat(aVal);
      const bNum = parseFloat(bVal);
      if (!isNaN(aNum) && !isNaN(bNum)) {
        return sortDirection === "asc" ? aNum - bNum : bNum - aNum;
      }

      // Handle string values
      const aStr = String(aVal).toLowerCase();
      const bStr = String(bVal).toLowerCase();
      if (aStr < bStr) return sortDirection === "asc" ? -1 : 1;
      if (aStr > bStr) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortColumn, sortDirection]);

  // Paginate data
  const paginatedData = useMemo(() => {
    if (!showPagination) return sortedData;
    
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedData.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedData, currentPage, itemsPerPage, showPagination]);

  const totalPages = showPagination ? Math.ceil(sortedData.length / itemsPerPage) : 1;

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const getSortIcon = (column: string) => {
    if (sortColumn !== column) return <ArrowUpDown className="w-4 h-4 opacity-50" />;
    return sortDirection === "asc" ? 
      <ArrowUp className="w-4 h-4" /> : 
      <ArrowDown className="w-4 h-4" />;
  };

  const formatCellValue = (value: any, column: DatasetColumn) => {
    if (value == null || value === "") return <span className="text-gray-400">—</span>;
    
    if (column.type === "number") {
      const num = parseFloat(value);
      return !isNaN(num) ? num.toLocaleString() : value;
    }
    
    if (column.type === "date") {
      const date = new Date(value);
      return !isNaN(date.getTime()) ? 
        date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : 
        value;
    }
    
    return String(value);
  };

  const getStatusBadge = (value: any) => {
    const status = String(value).toLowerCase();
    if (status.includes("active")) return <Badge className="bg-green-100 text-green-800">Active</Badge>;
    if (status.includes("pending")) return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
    if (status.includes("discontinued")) return <Badge className="bg-red-100 text-red-800">Discontinued</Badge>;
    return formatCellValue(value, { name: "status", type: "text" });
  };

  if (validColumns.length === 0 || data.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No data available to display</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search and Filter Controls */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search data..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-10"
          />
        </div>
        <Select value={filterColumn} onValueChange={setFilterColumn}>
          <SelectTrigger className="w-48">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All columns</SelectItem>
            {validColumns.map((column) => (
              <SelectItem key={column.name} value={column.name}>
                {column.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Data Table */}
      <div className="overflow-x-auto border rounded-lg">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {validColumns.map((column) => (
                <th
                  key={column.name}
                  className="text-left py-3 px-6 font-medium text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => handleSort(column.name)}
                >
                  <div className="flex items-center space-x-2">
                    <span>{column.name}</span>
                    {getSortIcon(column.name)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {paginatedData.map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-gray-50 transition-colors">
                {validColumns.map((column) => (
                  <td key={column.name} className="py-4 px-6 text-gray-900">
                    {column.name.toLowerCase().includes("status") ? 
                      getStatusBadge(row[column.name]) : 
                      formatCellValue(row[column.name], column)
                    }
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {showPagination && totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Showing{" "}
            <span className="font-medium">
              {(currentPage - 1) * itemsPerPage + 1}
            </span>{" "}
            to{" "}
            <span className="font-medium">
              {Math.min(currentPage * itemsPerPage, sortedData.length)}
            </span>{" "}
            of{" "}
            <span className="font-medium">{sortedData.length.toLocaleString()}</span> results
          </p>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            
            <div className="flex items-center space-x-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(page => 
                  page === 1 || 
                  page === totalPages || 
                  Math.abs(page - currentPage) <= 1
                )
                .map((page, index, array) => (
                  <div key={page} className="flex items-center">
                    {index > 0 && array[index - 1] !== page - 1 && (
                      <span className="px-2 text-muted-foreground">...</span>
                    )}
                    <Button
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </Button>
                  </div>
                ))}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
