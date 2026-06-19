import { Card, CardBody, CardHeader } from "../components/ui/Card";
import { useLucyStore } from "../store/useLucyStore";
import { formatDate } from "../utils/dates";

export function MaintenancePage() {
  const { events, assets } = useLucyStore();
  const sorted = [...events].sort((a, b) => b.date.localeCompare(a.date));
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-semibold">Mantenimiento</h2>
        <p className="text-muted-foreground">Historial técnico global de activos y cambios importantes.</p>
      </div>
      <Card>
        <CardHeader title="Eventos técnicos" />
        <CardBody className="space-y-3">
          {sorted.map((event) => (
            <div key={event.id} className="rounded-md border border-border p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-medium">{event.type}</p>
                <span className="text-sm text-muted-foreground">{formatDate(event.date)}</span>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{assets.find((asset) => asset.id === event.assetId)?.name}</p>
              <p className="mt-2 text-sm">{event.description}</p>
              <p className="mt-2 text-xs text-muted-foreground">Área: {event.responsibleArea} · Registró: {event.registeredBy}</p>
            </div>
          ))}
        </CardBody>
      </Card>
    </div>
  );
}
