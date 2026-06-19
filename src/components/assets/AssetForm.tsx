import type { FormEvent } from "react";
import { useState } from "react";
import { assetStatuses, assetTypes, institutionalAreas, type Asset, type CreateAssetInput } from "../../types/asset";

type Props = {
  initial?: Asset;
  locations: { id: string; description: string }[];
  units: { id: string; name: string }[];
  responsibles: { id: string; name: string }[];
  onSubmit(input: CreateAssetInput): Promise<void>;
};

export function AssetForm({ initial, locations, units, responsibles, onSubmit }: Props) {
  const [input, setInput] = useState<CreateAssetInput>({
    code: initial?.code ?? "",
    serialNumber: initial?.serialNumber ?? "",
    name: initial?.name ?? "",
    type: initial?.type ?? "Laptop",
    category: initial?.category ?? "Equipo informático",
    brand: initial?.brand ?? "",
    model: initial?.model ?? "",
    description: initial?.description ?? "",
    status: initial?.status ?? "Operativo",
    locationId: initial?.locationId ?? locations[0]?.id ?? "",
    responsibleUnitId: initial?.responsibleUnitId ?? units[0]?.id ?? "",
    responsiblePersonId: initial?.responsiblePersonId ?? responsibles[0]?.id ?? "",
    institutionalArea: initial?.institutionalArea ?? "DITIC",
    acquisitionDate: initial?.acquisitionDate ?? new Date().toISOString().slice(0, 10),
    warrantyExpiresAt: initial?.warrantyExpiresAt ?? "",
    provider: initial?.provider ?? "",
    estimatedCost: initial?.estimatedCost ?? 0,
    observations: initial?.observations ?? "",
    tags: initial?.tags ?? [],
  });
  const [error, setError] = useState("");

  function setField<K extends keyof CreateAssetInput>(key: K, value: CreateAssetInput[K]) {
    setInput((current) => ({ ...current, [key]: value }));
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError("");
    try {
      await onSubmit(input);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo guardar el activo.");
    }
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      {error ? <div className="rounded-md border border-danger/40 bg-danger/10 p-3 text-sm text-red-100">{error}</div> : null}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <Field label="Código"><input className="field w-full" value={input.code} onChange={(e) => setField("code", e.target.value)} /></Field>
        <Field label="Número de serie"><input className="field w-full" value={input.serialNumber} onChange={(e) => setField("serialNumber", e.target.value)} /></Field>
        <Field label="Nombre"><input className="field w-full" value={input.name} onChange={(e) => setField("name", e.target.value)} /></Field>
        <Field label="Tipo">
          <select className="field w-full" value={input.type} onChange={(e) => setField("type", e.target.value)}>
            {assetTypes.map((item) => <option key={item}>{item}</option>)}
          </select>
        </Field>
        <Field label="Categoría"><input className="field w-full" value={input.category} onChange={(e) => setField("category", e.target.value)} /></Field>
        <Field label="Estado">
          <select className="field w-full" value={input.status} onChange={(e) => setField("status", e.target.value as CreateAssetInput["status"])}>
            {assetStatuses.map((item) => <option key={item}>{item}</option>)}
          </select>
        </Field>
        <Field label="Marca"><input className="field w-full" value={input.brand} onChange={(e) => setField("brand", e.target.value)} /></Field>
        <Field label="Modelo"><input className="field w-full" value={input.model} onChange={(e) => setField("model", e.target.value)} /></Field>
        <Field label="Área institucional">
          <select className="field w-full" value={input.institutionalArea} onChange={(e) => setField("institutionalArea", e.target.value as CreateAssetInput["institutionalArea"])}>
            {institutionalAreas.map((item) => <option key={item}>{item}</option>)}
          </select>
        </Field>
        <Field label="Ubicación">
          <select className="field w-full" value={input.locationId} onChange={(e) => setField("locationId", e.target.value)}>
            {locations.map((item) => <option value={item.id} key={item.id}>{item.description}</option>)}
          </select>
        </Field>
        <Field label="Unidad responsable">
          <select className="field w-full" value={input.responsibleUnitId} onChange={(e) => setField("responsibleUnitId", e.target.value)}>
            {units.map((item) => <option value={item.id} key={item.id}>{item.name}</option>)}
          </select>
        </Field>
        <Field label="Persona responsable">
          <select className="field w-full" value={input.responsiblePersonId} onChange={(e) => setField("responsiblePersonId", e.target.value)}>
            {responsibles.map((item) => <option value={item.id} key={item.id}>{item.name}</option>)}
          </select>
        </Field>
        <Field label="Fecha de adquisición"><input className="field w-full" type="date" value={input.acquisitionDate} onChange={(e) => setField("acquisitionDate", e.target.value)} /></Field>
        <Field label="Vencimiento de garantía"><input className="field w-full" type="date" value={input.warrantyExpiresAt} onChange={(e) => setField("warrantyExpiresAt", e.target.value)} /></Field>
        <Field label="Proveedor"><input className="field w-full" value={input.provider} onChange={(e) => setField("provider", e.target.value)} /></Field>
      </div>
      <Field label="Descripción"><textarea className="field min-h-24 w-full" value={input.description} onChange={(e) => setField("description", e.target.value)} /></Field>
      <Field label="Observaciones"><textarea className="field min-h-20 w-full" value={input.observations} onChange={(e) => setField("observations", e.target.value)} /></Field>
      <div className="flex justify-end">
        <button className="btn btn-primary" type="submit">Guardar activo</button>
      </div>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="space-y-1.5 text-sm">
      <span className="text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}
