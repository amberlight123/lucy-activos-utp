import type { Asset, AssetStatus } from "../types/asset";
import { daysUntil } from "./dates";

export const criticalStatuses: AssetStatus[] = [
  "Dañado",
  "Dado de baja",
  "Pendiente de repuesto",
  "Pendiente de adquisición",
  "En mantenimiento",
  "Trasladado",
];

export function warrantyStatus(asset: Asset) {
  const days = daysUntil(asset.warrantyExpiresAt);
  if (days === null) return "Sin garantía registrada";
  if (days < 0) return "Garantía vencida";
  if (days <= 90) return "Garantía próxima a vencer";
  return "Garantía vigente";
}

export function statusTone(status: AssetStatus) {
  if (status === "Operativo" || status === "En garantía") return "border-success/40 bg-success/10 text-green-200";
  if (status.includes("Pendiente") || status === "En mantenimiento") return "border-warning/40 bg-warning/10 text-yellow-100";
  if (status === "Dañado" || status === "Dado de baja") return "border-danger/40 bg-danger/10 text-red-100";
  return "border-border bg-muted text-muted-foreground";
}
