import type { Asset } from "../types/asset";
import type { ExternalIncident } from "../types/incident";
import type { AssetEvent } from "../types/maintenance";
import { daysUntil } from "../utils/dates";

export function buildReports(assets: Asset[], events: AssetEvent[], incidents: ExternalIncident[]) {
  const correctiveCounts = events.reduce<Record<string, number>>((acc, event) => {
    if (event.type === "Mantenimiento correctivo") acc[event.assetId] = (acc[event.assetId] ?? 0) + 1;
    return acc;
  }, {});
  const eventCounts = events.reduce<Record<string, number>>((acc, event) => {
    acc[event.assetId] = (acc[event.assetId] ?? 0) + 1;
    return acc;
  }, {});
  return {
    withMoreTechnicalEvents: assets
      .map((asset) => ({
        asset,
        totalEvents: eventCounts[asset.id] ?? 0,
        correctiveEvents: correctiveCounts[asset.id] ?? 0,
      }))
      .filter((item) => item.totalEvents > 0)
      .sort((a, b) => b.totalEvents - a.totalEvents)
      .slice(0, 8),
    expiredWarranty: assets.filter((asset) => {
      const days = daysUntil(asset.warrantyExpiresAt);
      return days !== null && days < 0;
    }),
    pendingParts: assets.filter((asset) => asset.status === "Pendiente de repuesto"),
    linkedToIncidents: assets.filter((asset) => incidents.some((incident) => incident.linkedAssetIds.includes(asset.id))),
    recentChanges: [...events].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 12),
  };
}
