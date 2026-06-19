import { Download, Eye, FileJson, Filter, Plus, RotateCcw, Search, X } from "lucide-react";
import { useMemo, useState } from "react";
import { StatusBadge } from "../components/ui/Badge";
import { Card, CardBody } from "../components/ui/Card";
import { navigate } from "../hooks/useRouter";
import { useLucyStore } from "../store/useLucyStore";
import { assetStatuses } from "../types/asset";
import { downloadText, exportAssetsToCsv } from "../utils/csv";
import { warrantyStatus } from "../utils/status";

export function AssetsPage() {
  const { assets, locations, units, resetData } = useLucyStore();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [sort, setSort] = useState("updatedAt");
  const categories = [...new Set(assets.map((asset) => asset.category))];
  const activeFilters = [status, category, location].filter(Boolean).length + (query ? 1 : 0);
  const statusSummary = {
    critical: assets.filter((asset) => asset.status === "Dañado" || asset.status === "Pendiente de adquisición" || asset.status === "Pendiente de repuesto").length,
    maintenance: assets.filter((asset) => asset.status === "En mantenimiento").length,
    warranty: assets.filter((asset) => warrantyStatus(asset) !== "Garantía vigente").length,
  };

  const filtered = useMemo(() => {
    return assets
      .filter((asset) => {
        const haystack = `${asset.code} ${asset.name} ${asset.serialNumber} ${asset.type} ${asset.category}`.toLowerCase();
        return (
          haystack.includes(query.toLowerCase()) &&
          (!status || asset.status === status) &&
          (!category || asset.category === category) &&
          (!location || asset.locationId === location)
        );
      })
      .sort((a, b) => String(b[sort as keyof typeof b]).localeCompare(String(a[sort as keyof typeof a])));
  }, [assets, category, location, query, sort, status]);

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Activos</h2>
          <p className="text-muted-foreground">Inventario institucional con búsqueda rápida, filtros y acciones por activo.</p>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
          <button className="btn btn-secondary" onClick={() => downloadText("activos-lucy.json", JSON.stringify(assets, null, 2))}>
            <FileJson className="h-4 w-4" /> JSON
          </button>
          <button className="btn btn-secondary" onClick={() => downloadText("activos-lucy.csv", exportAssetsToCsv(assets), "text/csv")}>
            <Download className="h-4 w-4" /> CSV
          </button>
          <button className="btn btn-secondary" onClick={() => void resetData()}>
            <RotateCcw className="h-4 w-4" /> Datos ejemplo
          </button>
          <button className="btn btn-primary" onClick={() => navigate("/assets/new")}>
            <Plus className="h-4 w-4" /> Nuevo activo
          </button>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <InventoryStat label="Resultados" value={filtered.length} detail={`${assets.length} activos totales`} />
        <InventoryStat label="Revisión técnica" value={statusSummary.critical} detail="Dañados, repuestos o adquisición" />
        <InventoryStat label="Garantía a revisar" value={statusSummary.warranty} detail="Vencida o próxima a vencer" />
      </div>

      <Card>
        <CardBody className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Filter className="h-4 w-4 text-primary" />
              Búsqueda y filtros
            </div>
            {activeFilters ? (
              <button
                className="btn btn-secondary px-2 py-1 text-xs"
                onClick={() => {
                  setQuery("");
                  setStatus("");
                  setCategory("");
                  setLocation("");
                }}
              >
                <X className="h-3.5 w-3.5" /> Limpiar ({activeFilters})
              </button>
            ) : null}
          </div>
          <div className="grid gap-3 lg:grid-cols-[minmax(240px,2fr)_repeat(4,minmax(150px,1fr))]">
            <label className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <input className="field w-full pl-9" placeholder="Buscar por código, serie, nombre o tipo" value={query} onChange={(event) => setQuery(event.target.value)} />
            </label>
            <select className="field" value={status} onChange={(event) => setStatus(event.target.value)}>
              <option value="">Todos los estados</option>
              {assetStatuses.map((item) => <option key={item}>{item}</option>)}
            </select>
            <select className="field" value={category} onChange={(event) => setCategory(event.target.value)}>
              <option value="">Todas las categorías</option>
              {categories.map((item) => <option key={item}>{item}</option>)}
            </select>
            <select className="field" value={location} onChange={(event) => setLocation(event.target.value)}>
              <option value="">Todas las ubicaciones</option>
              {locations.map((item) => <option value={item.id} key={item.id}>{item.description}</option>)}
            </select>
            <select className="field" value={sort} onChange={(event) => setSort(event.target.value)}>
              <option value="updatedAt">Ordenar por actualización</option>
              <option value="name">Nombre</option>
              <option value="code">Código</option>
              <option value="status">Estado</option>
              <option value="locationId">Ubicación</option>
            </select>
          </div>
        </CardBody>
      </Card>

      <div className="grid gap-3 lg:hidden">
        {filtered.map((asset) => (
          <button
            className="rounded-lg border border-border bg-card p-4 text-left transition hover:border-primary/60"
            key={asset.id}
            onClick={() => navigate(`/assets/${asset.id}`)}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-semibold">{asset.name}</p>
                <p className="mt-1 text-xs text-muted-foreground">{asset.code} · {asset.type}</p>
              </div>
              <StatusBadge status={asset.status} />
            </div>
            <div className="mt-4 grid gap-2 text-sm text-muted-foreground">
              <span>{locations.find((item) => item.id === asset.locationId)?.description}</span>
              <span>{units.find((item) => item.id === asset.responsibleUnitId)?.name}</span>
              <span>{warrantyStatus(asset)}</span>
            </div>
          </button>
        ))}
      </div>

      <div className="hidden overflow-hidden rounded-lg border border-border lg:block">
        <table className="w-full min-w-[980px] border-collapse bg-card text-sm">
          <thead className="bg-muted text-left text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Código</th>
              <th className="px-4 py-3">Activo</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3">Ubicación</th>
              <th className="px-4 py-3">Unidad</th>
              <th className="px-4 py-3">Garantía</th>
              <th className="px-4 py-3 text-right">Acción</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((asset) => (
              <tr className="border-t border-border" key={asset.id}>
                <td className="px-4 py-3 font-medium">{asset.code}</td>
                <td className="px-4 py-3">
                  <div>{asset.name}</div>
                  <div className="text-xs text-muted-foreground">{asset.type} · {asset.brand} {asset.model}</div>
                </td>
                <td className="px-4 py-3"><StatusBadge status={asset.status} /></td>
                <td className="px-4 py-3 text-muted-foreground">{locations.find((item) => item.id === asset.locationId)?.description}</td>
                <td className="px-4 py-3 text-muted-foreground">{units.find((item) => item.id === asset.responsibleUnitId)?.name}</td>
                <td className="px-4 py-3 text-muted-foreground">{warrantyStatus(asset)}</td>
                <td className="px-4 py-3 text-right">
                  <button className="btn btn-secondary" onClick={() => navigate(`/assets/${asset.id}`)}>
                    <Eye className="h-4 w-4" /> Ver
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function InventoryStat({ label, value, detail }: { label: string; value: number; detail: string }) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-2 text-2xl font-semibold">{value}</p>
      <p className="mt-1 text-xs text-muted-foreground">{detail}</p>
    </div>
  );
}
