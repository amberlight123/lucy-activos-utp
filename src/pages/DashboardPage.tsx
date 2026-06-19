import { AlertTriangle, Archive, Boxes, CheckCircle2, Clock3, Link2, Search, ShieldAlert, ShieldCheck, Wrench } from "lucide-react";
import { Card, CardBody, CardHeader } from "../components/ui/Card";
import { StatusBadge } from "../components/ui/Badge";
import { useLucyStore } from "../store/useLucyStore";
import { buildDashboard } from "../services/dashboardService";
import { formatDate } from "../utils/dates";
import { navigate } from "../hooks/useRouter";

export function DashboardPage() {
  const { assets, events, incidents, locations, units } = useLucyStore();
  const dashboard = buildDashboard(assets, events, incidents);
  const byLocation = assets.reduce<Record<string, number>>((acc, asset) => {
    const location = locations.find((item) => item.id === asset.locationId);
    const label = location ? `${location.building} · ${location.area}` : "Sin ubicación";
    acc[label] = (acc[label] ?? 0) + 1;
    return acc;
  }, {});
  const byUnit = assets.reduce<Record<string, number>>((acc, asset) => {
    const unit = units.find((item) => item.id === asset.responsibleUnitId);
    const label = unit?.name ?? "Sin unidad";
    acc[label] = (acc[label] ?? 0) + 1;
    return acc;
  }, {});
  const recentEvents = [...events].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5);
  const metrics = [
    { label: "Total de activos", value: dashboard.total, icon: Boxes },
    { label: "Operativos", value: dashboard.byStatus.Operativo ?? 0, icon: CheckCircle2 },
    { label: "Dañados", value: dashboard.byStatus.Dañado ?? 0, icon: ShieldAlert },
    { label: "En mantenimiento", value: dashboard.byStatus["En mantenimiento"] ?? 0, icon: Wrench },
    { label: "Pendientes repuesto", value: dashboard.byStatus["Pendiente de repuesto"] ?? 0, icon: AlertTriangle },
    { label: "Pendientes adquisición", value: dashboard.byStatus["Pendiente de adquisición"] ?? 0, icon: Clock3 },
    { label: "Garantía vencida", value: dashboard.warrantyExpired.length, icon: ShieldAlert },
    { label: "Garantía por vencer", value: dashboard.warrantySoon.length, icon: ShieldCheck },
    { label: "Dados de baja", value: dashboard.byStatus["Dado de baja"] ?? 0, icon: Archive },
    { label: "Con reportes vinculados", value: dashboard.withIncidents, icon: Link2 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Dashboard general</h2>
        <p className="text-muted-foreground">Resumen operativo de activos, garantías, repuestos, daño y reportes externos vinculados.</p>
      </div>

      <Card>
        <CardBody className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-medium">Inventario operativo</p>
            <p className="mt-1 text-sm text-muted-foreground">Usa Activos para buscar por código, serie, ubicación, estado o responsable.</p>
          </div>
          <button className="btn btn-primary w-full sm:w-auto" onClick={() => navigate("/assets")}>
            <Search className="h-4 w-4" /> Buscar activos
          </button>
        </CardBody>
      </Card>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <Card key={metric.label} className="p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm text-muted-foreground">{metric.label}</p>
                  <p className="mt-2 text-2xl font-semibold">{metric.value}</p>
                </div>
                <Icon className="h-6 w-6 shrink-0 text-primary" />
              </div>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <Card>
          <CardHeader title="Activos por categoría" />
          <CardBody className="space-y-3">
            {Object.entries(dashboard.byCategory).slice(0, 8).map(([name, count]) => (
              <div key={name} className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{name}</span>
                <span className="font-semibold">{count}</span>
              </div>
            ))}
          </CardBody>
        </Card>
        <Card>
          <CardHeader title="Activos por ubicación" />
          <CardBody className="space-y-3">
            {Object.entries(byLocation).slice(0, 8).map(([name, count]) => (
              <div key={name} className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{name}</span>
                <span className="font-semibold">{count}</span>
              </div>
            ))}
          </CardBody>
        </Card>
        <Card>
          <CardHeader title="Activos por unidad" />
          <CardBody className="space-y-3">
            {Object.entries(byUnit).slice(0, 8).map(([name, count]) => (
              <div key={name} className="flex items-center justify-between gap-3 text-sm">
                <span className="text-muted-foreground">{name}</span>
                <span className="font-semibold">{count}</span>
              </div>
            ))}
          </CardBody>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_1.35fr]">
        <Card>
          <CardHeader title="Alertas" subtitle="Garantías, daños y pendientes" />
          <CardBody className="space-y-3">
            {[...dashboard.warrantyExpired, ...dashboard.warrantySoon, ...dashboard.damaged, ...dashboard.pending].slice(0, 8).map((asset) => (
              <div key={`${asset.id}-${asset.status}`} className="rounded-md border border-border p-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium">{asset.name}</p>
                    <p className="text-xs text-muted-foreground">Garantía: {formatDate(asset.warrantyExpiresAt)}</p>
                  </div>
                  <StatusBadge status={asset.status} />
                </div>
              </div>
            ))}
          </CardBody>
        </Card>
        <Card>
          <CardHeader title="Cambios recientes" subtitle="Últimos eventos técnicos registrados" />
          <CardBody className="space-y-3">
            {recentEvents.map((event) => (
              <div key={event.id} className="rounded-md border border-border p-3 text-sm">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                  <span className="font-medium">{event.type}</span>
                  <span className="text-muted-foreground">{formatDate(event.date)}</span>
                </div>
                <p className="mt-1 text-muted-foreground">{event.description}</p>
              </div>
            ))}
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardHeader title="Avisos operativos" subtitle="Elementos que requieren revisión documental o técnica" />
        <CardBody className="grid gap-4 md:grid-cols-3">
          <Notice
            title="Garantía vencida"
            value={dashboard.warrantyExpired.length}
            detail="Verificar proveedor, fecha de adquisición y documentos del activo."
          />
          <Notice
            title="Repuesto o adquisición"
            value={dashboard.pending.length}
            detail="Mantener la necesidad registrada como dato operativo del inventario."
          />
          <Notice
            title="Activos dañados"
            value={dashboard.damaged.length}
            detail="Confirmar estado operativo y dejar evento técnico en el historial."
          />
        </CardBody>
      </Card>
    </div>
  );
}

function Notice({ title, value, detail }: { title: string; value: number; detail: string }) {
  return (
    <div className="rounded-md border border-border p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="font-medium">{title}</p>
        <span className="rounded-full bg-primary px-2.5 py-1 text-sm font-semibold text-primary-foreground">{value}</span>
      </div>
      <p className="mt-2 text-sm text-muted-foreground">{detail}</p>
    </div>
  );
}
