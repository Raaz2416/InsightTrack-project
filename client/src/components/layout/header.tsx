import { Search, Bell, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export default function Header({ title, subtitle }: HeaderProps) {
  return (
    <header className="bg-background/95 backdrop-blur-md border-b border-border sticky top-0 z-40 shadow-sm">
      <div className="px-6 py-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-foreground tracking-tight">{title}</h1>
            {subtitle && (
              <p className="text-muted-foreground text-base">{subtitle}</p>
            )}
          </div>
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search your data..."
                className="w-80 pl-11 pr-4 py-3 bg-white border-border rounded-xl focus:bg-background transition-colors shadow-sm"
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            </div>
            <Button variant="ghost" size="sm" className="w-10 h-10 rounded-xl hover:bg-secondary">
              <Bell className="w-5 h-5 text-muted-foreground" />
            </Button>
            <Button variant="ghost" size="sm" className="w-10 h-10 rounded-xl hover:bg-secondary">
              <Settings className="w-5 h-5 text-muted-foreground" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
