import type { Asset } from "../types/asset";

export function exportAssetsToCsv(assets: Asset[]) {
  const headers = ["codigo", "nombre", "tipo", "categoria", "estado", "ubicacion", "unidad", "garantia"];
  const rows = assets.map((asset) => [
    asset.code,
    asset.name,
    asset.type,
    asset.category,
    asset.status,
    asset.locationId,
    asset.responsibleUnitId,
    asset.warrantyExpiresAt ?? "",
  ]);
  return [headers, ...rows].map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")).join("\n");
}

export function downloadText(filename: string, content: string, mime = "application/json") {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
