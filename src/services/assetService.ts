import type { Asset, CreateAssetInput, UpdateAssetInput } from "../types/asset";
import type { AssetEvent } from "../types/maintenance";
import type { LucyDataProvider } from "../providers/LucyDataProvider";
import { criticalStatuses } from "../utils/status";
import { validateAsset } from "../utils/validators";

export async function createAsset(provider: LucyDataProvider, input: CreateAssetInput, assets: Asset[]) {
  const errors = validateAsset(input, assets);
  if (errors.length) throw new Error(errors.join(" "));
  return provider.createAsset(input);
}

export async function updateAssetWithRules(
  provider: LucyDataProvider,
  asset: Asset,
  input: UpdateAssetInput,
  assets: Asset[],
  registeredBy: string,
) {
  const errors = validateAsset({ ...asset, ...input }, assets, asset.id);
  if (errors.length) throw new Error(errors.join(" "));
  const previousStatus = asset.status;
  const previousLocation = asset.locationId;
  const previousResponsible = asset.responsiblePersonId;
  const updated = await provider.updateAsset(asset.id, input);
  if (input.status && input.status !== previousStatus && criticalStatuses.includes(input.status)) {
    await provider.createAssetEvent({
      assetId: asset.id,
      type: "Cambio de estado",
      date: new Date().toISOString().slice(0, 10),
      registeredBy,
      responsibleArea: updated.institutionalArea,
      description: `Cambio de estado crítico validado: ${previousStatus} -> ${input.status}.`,
      previousStatus,
      newStatus: input.status,
      associatedParts: input.status === "Pendiente de repuesto" ? ["Pendiente por definir"] : [],
      supervisorValidated: false,
    });
  }
  if (input.locationId && input.locationId !== previousLocation) {
    await provider.createAssetEvent({
      assetId: asset.id,
      type: "Cambio de ubicación",
      date: new Date().toISOString().slice(0, 10),
      registeredBy,
      responsibleArea: updated.institutionalArea,
      description: `Cambio de ubicación registrado para control operativo del activo.`,
      associatedParts: [],
      supervisorValidated: false,
    });
  }
  if (input.responsiblePersonId && input.responsiblePersonId !== previousResponsible) {
    await provider.createAssetEvent({
      assetId: asset.id,
      type: "Cambio de responsable",
      date: new Date().toISOString().slice(0, 10),
      registeredBy,
      responsibleArea: updated.institutionalArea,
      description: `Cambio de responsable asignado registrado en historial técnico.`,
      associatedParts: [],
      supervisorValidated: false,
    });
  }
  return updated;
}

export function sortEvents(events: AssetEvent[]) {
  return [...events].sort((a, b) => b.date.localeCompare(a.date));
}
