import { Card, CardBody, CardHeader } from "../components/ui/Card";
import { buildReports } from "../services/reportService";
import { useLucyStore } from "../store/useLucyStore";
import { formatDate } from "../utils/dates";

export function ReportsPage() {
  const { assets, events, incidents } = useLucyStore();
  const reports = buildReports(assets, events, incidents);
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-semibold">Reportes</h2>
        <p className="text-muted-foreground">Indicadores operativos para inventario, mantenimiento, garantía, repuestos y reportes externos.</p>
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        <ReportList title="Activos con más eventos técnicos" items={reports.withMoreTechnicalEvents.map(({ asset, totalEvents, correctiveEvents }) => `${asset.code} · ${asset.name} · ${totalEvents} eventos (${correctiveEvents} correctivos)`)} />
        <ReportList title="Garantía vencida" items={reports.expiredWarranty.map((asset) => `${asset.code} · ${asset.name}`)} />
        <ReportList title="Pendientes de repuesto" items={reports.pendingParts.map((asset) => `${asset.code} · ${asset.name}`)} />
        <ReportList title="Con reportes externos vinculados" items={reports.linkedToIncidents.map((asset) => `${asset.code} · ${asset.name}`)} />
      </div>
      <Card>
        <CardHeader title="Historial de cambios recientes" />
        <CardBody className="space-y-2">
          {reports.recentChanges.map((event) => (
            <div className="flex flex-col justify-between rounded-md border border-border p-3 text-sm md:flex-row md:items-center" key={event.id}>
              <span>{event.type} · {event.description}</span>
              <span className="text-muted-foreground">{formatDate(event.date)}</span>
            </div>
          ))}
        </CardBody>
      </Card>
    </div>
  );
}

function ReportList({ title, items }: { title: string; items: string[] }) {
  return (
    <Card>
      <CardHeader title={title} />
      <CardBody className="space-y-2">
        {items.slice(0, 8).map((item) => <p key={item} className="rounded-md border border-border p-3 text-sm">{item}</p>)}
        {!items.length ? <p className="text-sm text-muted-foreground">Sin registros.</p> : null}
      </CardBody>
    </Card>
  );
}
