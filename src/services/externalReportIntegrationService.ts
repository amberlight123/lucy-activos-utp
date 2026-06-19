import type { Asset } from "../types/asset";
import type { ExternalIncident } from "../types/incident";
import type { AssetEvent } from "../types/maintenance";
import type { Location } from "../types/location";
import type { Responsible } from "../types/responsible";
import type { Unit } from "../types/unit";
import { warrantyStatus } from "../utils/status";

export function resolveAssetForIncident(incident: ExternalIncident, assets: Asset[], locations: Location[]) {
  const query = `${incident.externalReportId} ${incident.summaryDescription} ${incident.reportedLocation}`.toLowerCase();
  return assets.filter((asset) => {
    const location = locations.find((item) => item.id === asset.locationId);
    return (
      query.includes(asset.type.toLowerCase()) ||
      query.includes(asset.category.toLowerCase()) ||
      query.includes(asset.code.toLowerCase()) ||
      (location && query.includes(location.area.toLowerCase()))
    );
  });
}

export function linkIncidentToAsset(incident: ExternalIncident, assetId: string) {
  if (incident.linkedAssetIds.includes(assetId)) return incident;
  return { ...incident, linkedAssetIds: [...incident.linkedAssetIds, assetId] };
}

export function unlinkIncidentFromAsset(incident: ExternalIncident, assetId: string) {
  return { ...incident, linkedAssetIds: incident.linkedAssetIds.filter((id) => id !== assetId) };
}

export function getAssetIncidentHistory(assetId: string, incidents: ExternalIncident[]) {
  return incidents.filter((incident) => incident.linkedAssetIds.includes(assetId));
}

export function getAssetOperationalContext(
  asset: Asset,
  events: AssetEvent[],
  incidents: ExternalIncident[],
  locations: Location[],
  units: Unit[],
  responsibles: Responsible[],
) {
  const recentMaintenanceEvents = events
    .filter((event) => event.assetId === asset.id)
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 5);
  const technicalEventsCount = events.filter((event) => event.assetId === asset.id).length;
  const linkedIncidents = getAssetIncidentHistory(asset.id, incidents);
  return {
    assetId: asset.id,
    assetCode: asset.code,
    name: asset.name,
    type: asset.type,
    category: asset.category,
    status: asset.status,
    location: locations.find((location) => location.id === asset.locationId)?.description ?? "Sin ubicación",
    responsibleUnit: units.find((unit) => unit.id === asset.responsibleUnitId)?.name ?? "Sin unidad",
    responsiblePerson: responsibles.find((person) => person.id === asset.responsiblePersonId)?.name ?? "Sin responsable",
    warrantyStatus: warrantyStatus(asset),
    recentMaintenanceEvents,
    technicalEventsCount,
    linkedIncidentsCount: linkedIncidents.length,
    requiresParts: asset.status === "Pendiente de repuesto" || recentMaintenanceEvents.some((event) => event.associatedParts.length > 0),
    associatedArea: asset.institutionalArea,
  };
}
