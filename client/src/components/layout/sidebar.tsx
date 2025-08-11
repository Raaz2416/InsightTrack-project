import { Link, useLocation } from "wouter";
import { 
  BarChart3, 
  Upload, 
  Table, 
  PieChart, 
  Bookmark, 
  User,
  Zap,
  Settings,
  Bell
} from "lucide-react";

const navigation = [
  { name: "Overview", href: "/", icon: BarChart3 },
  { name: "Upload", href: "/upload", icon: Upload },
  { name: "Data Table", href: "/data", icon: Table },
  { name: "Analytics", href: "/visualizations", icon: PieChart },
  { name: "Saved", href: "/saved-dashboards", icon: Bookmark },
];

export default function Sidebar() {
  const [location] = useLocation();

  return (
    <div className="fixed inset-y-0 left-0 z-50 w-64 bg-sidebar border-r border-sidebar-border">
      {/* Logo Section */}
      <div className="flex items-center px-6 py-6 border-b border-sidebar-border">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center animate-glow">
            <Zap className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-sidebar-foreground">InsightTrack</h1>
            <p className="text-xs text-muted-foreground">Analytics Platform</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="mt-8 px-4">
        <div className="space-y-2">
          {navigation.map((item) => {
            const isActive = location === item.href || 
              (item.href !== "/" && location.startsWith(item.href));
            const Icon = item.icon;
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                  isActive
                    ? "bg-sidebar-accent text-sidebar-primary-foreground shadow-lg border border-sidebar-primary/20"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                }`}
              >
                <Icon 
                  className={`mr-3 w-5 h-5 transition-colors ${
                    isActive ? "text-primary" : "text-muted-foreground group-hover:text-sidebar-foreground"
                  }`} 
                />
                <span className="font-medium">{item.name}</span>
                {isActive && (
                  <div className="ml-auto w-2 h-2 bg-primary rounded-full"></div>
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Quick Actions */}
      <div className="mt-8 px-4">
        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          Quick Actions
        </div>
        <div className="space-y-2">
          <button className="w-full flex items-center px-4 py-2 text-sm text-sidebar-foreground hover:bg-sidebar-accent/50 rounded-lg transition-colors">
            <Settings className="mr-3 w-4 h-4 text-muted-foreground" />
            Settings
          </button>
          <button className="w-full flex items-center px-4 py-2 text-sm text-sidebar-foreground hover:bg-sidebar-accent/50 rounded-lg transition-colors">
            <Bell className="mr-3 w-4 h-4 text-muted-foreground" />
            Notifications
          </button>
        </div>
      </div>

      {/* User Profile */}
      <div className="absolute bottom-0 w-full p-4 border-t border-sidebar-border">
        <div className="flex items-center space-x-3 p-3 rounded-xl bg-secondary/50 border border-border shadow-sm">
          <div className="w-10 h-10 gradient-secondary rounded-full flex items-center justify-center">
            <User className="text-white w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-sidebar-foreground truncate">Data Analyst</p>
            <p className="text-xs text-muted-foreground truncate">admin@insighttrack.com</p>
          </div>
        </div>
      </div>
    </div>
  );
}
