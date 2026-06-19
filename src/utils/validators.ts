import type { Asset, CreateAssetInput, UpdateAssetInput } from "../types/asset";

export function validateAsset(input: CreateAssetInput | UpdateAssetInput, assets: Asset[], currentId?: string) {
  const errors: string[] = [];
  const code = input.code?.trim();
  const name = input.name?.trim();

  if (!code) errors.push("El código de activo es requerido.");
  if (!name) errors.push("El nombre es requerido.");
  if (!input.type) errors.push("El tipo es requerido.");
  if (!input.category) errors.push("La categoría es requerida.");
  if (!input.status) errors.push("El estado es requerido.");
  if (!input.locationId) errors.push("La ubicación es requerida.");
  if (!input.responsibleUnitId) errors.push("La unidad responsable es requerida.");

  if (code && assets.some((asset) => asset.code === code && asset.id !== currentId)) {
    errors.push("El código de activo debe ser único.");
  }

  if (input.serialNumber && assets.some((asset) => asset.serialNumber === input.serialNumber && asset.id !== currentId)) {
    errors.push("El número de serie debe ser único.");
  }

  if (input.acquisitionDate && input.warrantyExpiresAt && input.warrantyExpiresAt < input.acquisitionDate) {
    errors.push("La garantía no puede vencer antes de la adquisición.");
  }

  return errors;
}
