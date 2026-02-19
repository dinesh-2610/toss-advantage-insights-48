import { Link, useLocation } from "react-router-dom";
import { BarChart3, Home, LineChart, Info } from "lucide-react";

const navItems = [
  { path: "/", label: "Home", icon: Home },
  { path: "/dashboard", label: "Dashboard", icon: BarChart3 },
  { path: "/insights", label: "Data Insights", icon: LineChart },
  { path: "/about", label: "About Project", icon: Info },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-sm border-b">
        <div className="container flex h-14 items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            <span className="font-semibold text-sm tracking-tight">Toss Advantage Analytics</span>
          </Link>
          <nav className="flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-1.5 text-sm transition-colors duration-200 ${
                  pathname === item.path
                    ? "nav-link-active"
                    : "nav-link"
                }`}
              >
                <item.icon className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <main className="container py-8">{children}</main>
      <footer className="border-t py-6">
        <div className="container text-center text-xs text-muted-foreground">
          B.Tech Project — An Empirical Analysis of Toss Advantage in Cricket Matches
        </div>
      </footer>
    </div>
  );
}
