import {
  BarChart3,
  Boxes,
  Home,
  Link2,
  LogOut,
  Menu,
  MapPin,
  Settings,
  ShieldCheck,
  Users,
  Wrench,
  X,
} from "lucide-react";
import { useState } from "react";
import { navigate } from "../../hooks/useRouter";
import { useLucyStore } from "../../store/useLucyStore";

const navItems = [
  { path: "/", label: "Dashboard", icon: Home },
  { path: "/assets", label: "Activos", icon: Boxes },
  { path: "/locations", label: "Ubicaciones", icon: MapPin },
  { path: "/units", label: "Unidades", icon: Users },
  { path: "/maintenance", label: "Mantenimiento", icon: Wrench },
  { path: "/external-reports", label: "Reportes externos", icon: Link2 },
  { path: "/reports", label: "Reportes", icon: BarChart3 },
  { path: "/settings", label: "Configuración", icon: Settings },
];

export function AppLayout({ children, path }: { children: React.ReactNode; path: string }) {
  const { currentUser, logout } = useLucyStore();
  const [menuOpen, setMenuOpen] = useState(false);

  function goTo(nextPath: string) {
    navigate(nextPath);
    setMenuOpen(false);
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <aside className="fixed inset-y-0 left-0 hidden w-72 border-r border-border bg-card/80 backdrop-blur lg:block">
        <div className="flex h-16 items-center gap-3 border-b border-border px-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold">Lucy</p>
            <p className="text-xs text-muted-foreground">Activos UTP</p>
          </div>
        </div>
        <nav className="space-y-1 p-3">
          {navItems.map((item) => {
            const active = item.path === "/" ? path === "/" : path.startsWith(item.path);
            const Icon = item.icon;
            return (
              <button
                key={item.path}
                onClick={() => goTo(item.path)}
                className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm transition ${
                  active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </button>
            );
          })}
        </nav>
      </aside>

      <main className="lg:pl-72">
        <header className="sticky top-0 z-20 border-b border-border bg-background/90 px-4 py-3 backdrop-blur lg:px-8">
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <button
                aria-expanded={menuOpen}
                aria-label="Abrir menú principal"
                className="btn btn-secondary px-2 lg:hidden"
                onClick={() => setMenuOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </button>
              <div className="min-w-0">
              <h1 className="text-xl font-semibold">Sistema Lucy</h1>
                <p className="truncate text-sm text-muted-foreground">Activos operativos institucionales</p>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <div className="hidden text-right sm:block">
                <p className="text-sm font-medium">{currentUser?.name}</p>
                <p className="text-xs text-muted-foreground">{currentUser?.role}</p>
              </div>
              <button className="btn btn-secondary" onClick={logout}>
                <LogOut className="h-4 w-4" /> Salir
              </button>
            </div>
          </div>
        </header>
        <div className="px-4 py-6 lg:px-8">{children}</div>
      </main>

      {menuOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Menú principal">
          <button className="absolute inset-0 bg-black/60" aria-label="Cerrar menú" onClick={() => setMenuOpen(false)} />
          <aside className="relative flex h-full w-[min(86vw,22rem)] flex-col border-r border-border bg-card shadow-2xl">
            <div className="flex h-16 items-center justify-between border-b border-border px-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-primary-foreground">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold">Lucy</p>
                  <p className="text-xs text-muted-foreground">Activos UTP</p>
                </div>
              </div>
              <button className="btn btn-secondary px-2" aria-label="Cerrar menú principal" onClick={() => setMenuOpen(false)}>
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex-1 space-y-1 overflow-y-auto p-3">
              {navItems.map((item) => {
                const active = item.path === "/" ? path === "/" : path.startsWith(item.path);
                const Icon = item.icon;
                return (
                  <button
                    key={item.path}
                    onClick={() => goTo(item.path)}
                    className={`flex w-full items-center gap-3 rounded-md px-3 py-3 text-left text-sm transition ${
                      active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </button>
                );
              })}
            </nav>
            <div className="border-t border-border p-4">
              <p className="text-sm font-medium">{currentUser?.name}</p>
              <p className="text-xs text-muted-foreground">{currentUser?.role}</p>
            </div>
          </aside>
        </div>
      ) : null}
    </div>
  );
}
