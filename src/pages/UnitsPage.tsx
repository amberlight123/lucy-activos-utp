import { Card, CardBody, CardHeader } from "../components/ui/Card";
import { useLucyStore } from "../store/useLucyStore";

export function UnitsPage() {
  const { units, responsibles, locations } = useLucyStore();
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-semibold">Unidades y responsables</h2>
        <p className="text-muted-foreground">Catálogo funcional de DEMI, DITIC, Soporte, Redes, Gestión de insumos y unidades académicas.</p>
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader title="Unidades" />
          <CardBody className="space-y-3">
            {units.map((unit) => (
              <div className="rounded-md border border-border p-4" key={unit.id}>
                <p className="font-medium">{unit.name}</p>
                <p className="text-sm text-muted-foreground">{unit.type} · {unit.email}</p>
                <p className="mt-2 text-xs text-muted-foreground">Ubicación: {locations.find((location) => location.id === unit.mainLocationId)?.description}</p>
              </div>
            ))}
          </CardBody>
        </Card>
        <Card>
          <CardHeader title="Responsables" />
          <CardBody className="space-y-3">
            {responsibles.map((person) => (
              <div className="rounded-md border border-border p-4" key={person.id}>
                <p className="font-medium">{person.name}</p>
                <p className="text-sm text-muted-foreground">{person.position} · {person.operationalRole}</p>
                <p className="mt-2 text-xs text-muted-foreground">{person.email}</p>
              </div>
            ))}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
