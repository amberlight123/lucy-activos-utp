import { Card, CardBody, CardHeader } from "../components/ui/Card";
import { useLucyStore } from "../store/useLucyStore";

export function LocationsPage() {
  const { locations, assets } = useLucyStore();
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-semibold">Ubicaciones</h2>
        <p className="text-muted-foreground">Catálogo institucional de campus, edificios, laboratorios, oficinas y áreas.</p>
      </div>
      <Card>
        <CardHeader title="Catálogo de ubicaciones" />
        <CardBody>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {locations.map((location) => (
              <div key={location.id} className="rounded-md border border-border p-4">
                <p className="font-medium">{location.description}</p>
                <p className="mt-1 text-sm text-muted-foreground">{location.campus} · {location.building} · Piso {location.floor}</p>
                <p className="mt-3 text-sm">{assets.filter((asset) => asset.locationId === location.id).length} activos registrados</p>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
