import { Download, RotateCcw } from "lucide-react";
import { Card, CardBody, CardHeader } from "../components/ui/Card";
import { useLucyStore } from "../store/useLucyStore";
import { downloadText, exportAssetsToCsv } from "../utils/csv";

export function SettingsPage() {
  const store = useLucyStore();
  const currentUser = store.currentUser;
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-semibold">Configuración</h2>
        <p className="text-muted-foreground">Sesión de demostración, modo de datos y operaciones de respaldo local.</p>
      </div>
      <Card>
        <CardHeader title="Usuario actual" />
        <CardBody className="space-y-3">
          <p className="text-sm">Usuario: <strong>{currentUser?.name ?? "Sin sesión"}</strong></p>
          <p className="text-sm">Rol de trabajo: <strong>{currentUser?.role ?? "No definido"}</strong></p>
          <p className="text-sm text-muted-foreground">La autenticación institucional se puede conectar posteriormente sin cambiar el flujo de inventario.</p>
        </CardBody>
      </Card>
      <Card>
        <CardHeader title="Modo de datos" subtitle="Persistencia local con localStorage. Supabase queda preparado como provider futuro." />
        <CardBody className="flex flex-wrap gap-2">
          <button className="btn btn-secondary" onClick={() => downloadText("lucy-backup.json", JSON.stringify({ assets: store.assets, events: store.events, incidents: store.incidents }, null, 2))}>
            <Download className="h-4 w-4" /> Exportar respaldo JSON
          </button>
          <button className="btn btn-secondary" onClick={() => downloadText("lucy-activos.csv", exportAssetsToCsv(store.assets), "text/csv")}>
            <Download className="h-4 w-4" /> Exportar activos CSV
          </button>
          <button className="btn btn-primary" onClick={() => void store.resetData()}>
            <RotateCcw className="h-4 w-4" /> Resetear datos de ejemplo
          </button>
        </CardBody>
      </Card>
    </div>
  );
}
