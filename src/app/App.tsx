import { AppLayout } from "../components/layout/AppLayout";
import { useRouter } from "../hooks/useRouter";
import { LucyStoreProvider, useLucyStore } from "../store/useLucyStore";
import { AuthPage } from "../pages/AuthPage";
import { AssetDetailPage } from "../pages/AssetDetailPage";
import { AssetFormPage } from "../pages/AssetFormPage";
import { AssetsPage } from "../pages/AssetsPage";
import { ExternalReportsPage } from "../pages/ExternalReportsPage";
import { DashboardPage } from "../pages/DashboardPage";
import { LocationsPage } from "../pages/LocationsPage";
import { MaintenancePage } from "../pages/MaintenancePage";
import { ReportsPage } from "../pages/ReportsPage";
import { SettingsPage } from "../pages/SettingsPage";
import { UnitsPage } from "../pages/UnitsPage";

export function App() {
  return (
    <LucyStoreProvider>
      <AppShell />
    </LucyStoreProvider>
  );
}

function AppShell() {
  const { path } = useRouter();
  const { currentUser, loading } = useLucyStore();

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center bg-background text-foreground">Cargando Lucy...</div>;
  }

  if (!currentUser) {
    return <AuthPage />;
  }

  return (
    <AppLayout path={path}>
      <Route path={path} />
    </AppLayout>
  );
}

function Route({ path }: { path: string }) {
  if (path === "/") return <DashboardPage />;
  if (path === "/assets") return <AssetsPage />;
  if (path === "/assets/new") return <AssetFormPage />;
  if (path.startsWith("/assets/") && path.endsWith("/edit")) return <AssetFormPage assetId={path.split("/")[2]} />;
  if (path.startsWith("/assets/")) return <AssetDetailPage assetId={path.split("/")[2]} />;
  if (path === "/locations") return <LocationsPage />;
  if (path === "/units") return <UnitsPage />;
  if (path === "/maintenance") return <MaintenancePage />;
  if (path === "/external-reports") return <ExternalReportsPage />;
  if (path === "/reports") return <ReportsPage />;
  if (path === "/settings") return <SettingsPage />;
  return <DashboardPage />;
}
