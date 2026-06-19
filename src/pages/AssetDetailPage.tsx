import { Copy, Edit, Link2, Printer, Trash2 } from "lucide-react";
import { useState } from "react";
import { Badge, StatusBadge } from "../components/ui/Badge";
import { Card, CardBody, CardHeader } from "../components/ui/Card";
import { navigate } from "../hooks/useRouter";
import { getAssetIncidentHistory, getAssetOperationalContext } from "../services/externalReportIntegrationService";
import { useLucyStore } from "../store/useLucyStore";
import { formatDate } from "../utils/dates";
import { mockQrMatrix } from "../utils/qr";
import { warrantyStatus } from "../utils/status";

const tabs = ["Resumen", "Historial técnico", "Reportes externos", "Garantía", "Ubicación/responsable", "QR", "Documentos"];

export function AssetDetailPage({ assetId }: { assetId: string }) {
  const store = useLucyStore();
  const [tab, setTab] = useState(tabs[0]);
  const asset = store.assets.find((item) => item.id === assetId);
  if (!asset) return <p>Activo no encontrado.</p>;

  const events = store.events.filter((event) => event.assetId === asset.id).sort((a, b) => b.date.localeCompare(a.date));
  const incidents = getAssetIncidentHistory(asset.id, store.incidents);
  const context = getAssetOperationalContext(asset, store.events, store.incidents, store.locations, store.units, store.responsibles);
  const location = store.locations.find((item) => item.id === asset.locationId);
  const unit = store.units.find((item) => item.id === asset.responsibleUnitId);
  const responsible = store.responsibles.find((item) => item.id === asset.responsiblePersonId);
  const qrLink = `${window.location.origin}/assets/${asset.id}`;
  const assetForActions = asset;

  async function remove() {
    try {
      await store.provider.deleteAsset(assetForActions.id);
      await store.refresh();
      navigate("/assets");
    } catch (error) {
      alert(error instanceof Error ? error.message : "No se pudo eliminar.");
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-semibold">{asset.name}</h2>
            <StatusBadge status={asset.status} />
          </div>
          <p className="text-muted-foreground">{asset.code} · {asset.type} · {asset.brand} {asset.model}</p>
        </div>
        <div className="flex gap-2">
          <button className="btn btn-secondary" onClick={() => navigate(`/assets/${asset.id}/edit`)}><Edit className="h-4 w-4" /> Editar</button>
          <button className="btn btn-secondary" onClick={() => void remove()}><Trash2 className="h-4 w-4" /> Eliminar</button>
        </div>
      </div>
      <div className="flex gap-2 overflow-x-auto">
        {tabs.map((item) => (
          <button key={item} className={`btn shrink-0 ${tab === item ? "btn-primary" : "btn-secondary"}`} onClick={() => setTab(item)}>{item}</button>
        ))}
      </div>
      <Card>
        <CardBody>
          {tab === "Resumen" ? (
            <div className="grid gap-4 lg:grid-cols-3">
              <Info label="Descripción" value={asset.description} />
              <Info label="Área asociada" value={context.associatedArea} />
              <Info label="Eventos técnicos" value={String(context.technicalEventsCount)} />
              <Info label="Unidad" value={unit?.name} />
              <Info label="Responsable" value={responsible?.name} />
              <Info label="Garantía" value={warrantyStatus(asset)} />
            </div>
          ) : null}
          {tab === "Historial técnico" ? (
            <div className="space-y-3">
              {events.map((event) => (
                <div key={event.id} className="rounded-md border border-border p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="font-medium">{event.type}</p>
                    <Badge>{formatDate(event.date)}</Badge>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{event.description}</p>
                  <p className="mt-2 text-xs text-muted-foreground">Registró: {event.registeredBy} · Validado supervisor: {event.supervisorValidated ? "Sí" : "No"}</p>
                </div>
              ))}
            </div>
          ) : null}
          {tab === "Reportes externos" ? (
            <div className="space-y-3">
              {incidents.map((incident) => (
                <div key={incident.id} className="rounded-md border border-border p-4">
                  <p className="font-medium">{incident.externalReportId} · {incident.origin}</p>
                  <p className="text-sm text-muted-foreground">{incident.summaryDescription}</p>
                  <p className="mt-2 text-xs text-muted-foreground">Estado de referencia: {incident.referenceStatus}. Esta relación no modifica el activo sin validación.</p>
                </div>
              ))}
              {!incidents.length ? <p className="text-sm text-muted-foreground">Sin reportes externos vinculados.</p> : null}
            </div>
          ) : null}
          {tab === "Garantía" ? (
            <div className="grid gap-4 md:grid-cols-3">
              <Info label="Estado" value={warrantyStatus(asset)} />
              <Info label="Adquisición" value={formatDate(asset.acquisitionDate)} />
              <Info label="Vence" value={formatDate(asset.warrantyExpiresAt)} />
            </div>
          ) : null}
          {tab === "Ubicación/responsable" ? (
            <div className="grid gap-4 md:grid-cols-3">
              <Info label="Ubicación" value={location?.description} />
              <Info label="Unidad responsable" value={unit?.name} />
              <Info label="Persona responsable" value={responsible?.name} />
            </div>
          ) : null}
          {tab === "QR" ? (
            <div className="flex flex-col gap-5 md:flex-row md:items-center">
              <div className="grid h-48 w-48 grid-cols-9 rounded-lg border border-border bg-white p-3">
                {mockQrMatrix(asset.qrToken).flatMap((row, rowIndex) => row.map((cell, colIndex) => (
                  <span key={`${rowIndex}-${colIndex}`} className={cell ? "bg-slate-950" : "bg-white"} />
                )))}
              </div>
              <div className="space-y-3">
                <p className="font-medium">{asset.qrToken}</p>
                <p className="text-sm text-muted-foreground">{qrLink}</p>
                <div className="flex gap-2">
                  <button className="btn btn-secondary" onClick={() => void navigator.clipboard.writeText(qrLink)}><Copy className="h-4 w-4" /> Copiar enlace</button>
                  <button className="btn btn-secondary" onClick={() => window.print()}><Printer className="h-4 w-4" /> Imprimir etiqueta</button>
                </div>
              </div>
            </div>
          ) : null}
          {tab === "Documentos" ? (
            <div className="space-y-3 text-sm text-muted-foreground">
              <p><Link2 className="mr-2 inline h-4 w-4" />Comprobante de adquisición digitalizado.</p>
              <p><Link2 className="mr-2 inline h-4 w-4" />Certificado de garantía del proveedor.</p>
              <p><Link2 className="mr-2 inline h-4 w-4" />Acta de traslado o cambio de custodia.</p>
            </div>
          ) : null}
        </CardBody>
      </Card>
      <Card>
        <CardHeader title="Contexto operativo del activo" />
        <CardBody>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <Info label="Código institucional" value={context.assetCode} />
            <Info label="Estado de garantía" value={context.warrantyStatus} />
            <Info label="Reportes externos vinculados" value={String(context.linkedIncidentsCount)} />
            <Info label="Requiere repuesto" value={context.requiresParts ? "Sí, revisar solicitud de pieza" : "No identificado"} />
            <Info label="Eventos técnicos registrados" value={String(context.technicalEventsCount)} />
            <Info label="Área asociada" value={context.associatedArea} />
            <Info label="Ubicación" value={context.location} />
            <Info label="Responsable" value={context.responsiblePerson} />
          </div>
          <div className="mt-5">
            <p className="mb-3 text-sm font-medium">Últimos eventos técnicos</p>
            <div className="space-y-2">
              {context.recentMaintenanceEvents.map((event) => (
                <div className="rounded-md border border-border p-3 text-sm" key={event.id}>
                  <span className="font-medium">{event.type}</span>
                  <span className="text-muted-foreground"> · {formatDate(event.date)} · {event.responsibleArea}</span>
                </div>
              ))}
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

function Info({ label, value }: { label: string; value?: string }) {
  return (
    <div className="rounded-md border border-border p-4">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-2 text-sm font-medium">{value || "Sin dato"}</p>
    </div>
  );
}

