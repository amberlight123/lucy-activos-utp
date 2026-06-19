import { Link2, Unlink } from "lucide-react";
import { useState } from "react";
import { Card, CardBody, CardHeader } from "../components/ui/Card";
import { linkIncidentToAsset, resolveAssetForIncident, unlinkIncidentFromAsset } from "../services/externalReportIntegrationService";
import { useLucyStore } from "../store/useLucyStore";

export function ExternalReportsPage() {
  const store = useLucyStore();
  const [selectedAsset, setSelectedAsset] = useState(store.assets[0]?.id ?? "");

  async function link(reportId: string) {
    const incident = store.incidents.find((item) => item.id === reportId);
    if (!incident || !selectedAsset) return;
    await store.provider.updateIncident(linkIncidentToAsset(incident, selectedAsset));
    await store.refresh();
  }

  async function unlink(reportId: string, assetId: string) {
    const incident = store.incidents.find((item) => item.id === reportId);
    if (!incident) return;
    await store.provider.updateIncident(unlinkIncidentFromAsset(incident, assetId));
    await store.refresh();
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-semibold">Reportes externos vinculados</h2>
        <p className="text-muted-foreground">Asocia referencias externas al activo correspondiente para consultar contexto técnico. Lucy no gestiona, prioriza, escala ni cierra reportes.</p>
      </div>
      <Card>
        <CardHeader title="Vincular referencia externa a activo" subtitle="La relación conserva contexto del activo; cualquier cambio operativo requiere validación manual en Lucy." />
        <CardBody>
          <select className="field w-full max-w-xl" value={selectedAsset} onChange={(e) => setSelectedAsset(e.target.value)}>
            {store.assets.map((asset) => <option key={asset.id} value={asset.id}>{asset.code} · {asset.name}</option>)}
          </select>
        </CardBody>
      </Card>
      <div className="grid gap-4 xl:grid-cols-2">
        {store.incidents.map((incident) => {
          const candidates = resolveAssetForIncident(incident, store.assets, store.locations).slice(0, 3);
          return (
            <Card key={incident.id}>
              <CardHeader title={`${incident.externalReportId} · ${incident.origin}`} subtitle={`Estado de referencia: ${incident.referenceStatus}`} />
              <CardBody className="space-y-4">
                <p className="text-sm text-muted-foreground">{incident.summaryDescription}</p>
                <p className="text-xs text-muted-foreground">Ubicación reportada: {incident.reportedLocation}</p>
                <div>
                  <p className="mb-2 text-xs uppercase tracking-wide text-muted-foreground">Activos vinculados</p>
                  <div className="space-y-2">
                    {incident.linkedAssetIds.map((assetId) => (
                      <div className="flex items-center justify-between rounded-md border border-border p-2 text-sm" key={assetId}>
                        <span>{store.assets.find((asset) => asset.id === assetId)?.name ?? assetId}</span>
                        <button className="btn btn-secondary" onClick={() => void unlink(incident.id, assetId)}><Unlink className="h-4 w-4" /> Quitar</button>
                      </div>
                    ))}
                    {!incident.linkedAssetIds.length ? <p className="text-sm text-muted-foreground">Sin vínculos.</p> : null}
                  </div>
                </div>
                <div>
                  <p className="mb-2 text-xs uppercase tracking-wide text-muted-foreground">Activos coincidentes por datos</p>
                  <p className="text-sm text-muted-foreground">{candidates.map((asset) => asset.code).join(", ") || "Sin coincidencias por código, tipo, categoría o ubicación."}</p>
                </div>
                <button className="btn btn-primary" onClick={() => void link(incident.id)}><Link2 className="h-4 w-4" /> Vincular activo seleccionado</button>
              </CardBody>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
