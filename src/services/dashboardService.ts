import type { Asset } from "../types/asset";
import type { ExternalIncident } from "../types/incident";
import type { AssetEvent } from "../types/maintenance";
import { daysUntil } from "../utils/dates";

export function buildDashboard(assets: Asset[], events: AssetEvent[], incidents: ExternalIncident[]) {
  const byStatus = assets.reduce<Record<string, number>>((acc, asset) => {
    acc[asset.status] = (acc[asset.status] ?? 0) + 1;
    return acc;
  }, {});
  const byCategory = assets.reduce<Record<string, number>>((acc, asset) => {
    acc[asset.category] = (acc[asset.category] ?? 0) + 1;
    return acc;
  }, {});
  const byArea = assets.reduce<Record<string, number>>((acc, asset) => {
    acc[asset.institutionalArea] = (acc[asset.institutionalArea] ?? 0) + 1;
    return acc;
  }, {});
  const eventCounts = events.reduce<Record<string, number>>((acc, event) => {
    acc[event.assetId] = (acc[event.assetId] ?? 0) + 1;
    return acc;
  }, {});
  return {
    total: assets.length,
    byStatus,
    byCategory,
    byArea,
    withIncidents: assets.filter((asset) => incidents.some((incident) => incident.linkedAssetIds.includes(asset.id))).length,
    topEventAssets: Object.entries(eventCounts).sort((a, b) => b[1] - a[1]).slice(0, 5),
    warrantySoon: assets.filter((asset) => {
      const days = daysUntil(asset.warrantyExpiresAt);
      return days !== null && days >= 0 && days <= 90;
    }),
    warrantyExpired: assets.filter((asset) => {
      const days = daysUntil(asset.warrantyExpiresAt);
      return days !== null && days < 0;
    }),
    damaged: assets.filter((asset) => asset.status === "Dañado"),
    pending: assets.filter((asset) => asset.status === "Pendiente de adquisición" || asset.status === "Pendiente de repuesto"),
  };
}
