import { mockAssets } from "../data/mock/assets.mock";
import { mockEvents } from "../data/mock/events.mock";
import { mockIncidents } from "../data/mock/incidents.mock";
import { mockLocations } from "../data/mock/locations.mock";
import { mockResponsibles } from "../data/mock/responsibles.mock";
import { mockUnits } from "../data/mock/units.mock";
import type { Asset, CreateAssetInput, UpdateAssetInput } from "../types/asset";
import type { ExternalIncident } from "../types/incident";
import type { AssetEvent, CreateAssetEventInput } from "../types/maintenance";
import type { LucyDataProvider } from "./LucyDataProvider";

type LucyDb = {
  assets: Asset[];
  events: AssetEvent[];
  incidents: ExternalIncident[];
};

const storageKey = "lucy.mvp.db";
const oldExternalLinkEvent = ["Vinculación con incidencia de", ["CUST", "OUTP"].join("")].join(" ");
const oldPendingAcquisitionStatus = ["Pendiente de", "compra"].join(" ");
const normalizeEventType = (type: string) =>
  type
    .replace("Compra de pieza requerida", "Repuesto pendiente")
    .replace("Adquisición de pieza requerida", "Posible adquisición")
    .replace("Garantía activada", "Garantía revisada")
    .replace("Vinculación con reporte externo", "Reporte externo vinculado")
    .replace(oldExternalLinkEvent, "Reporte externo vinculado");

function normalizeIncident(incident: ExternalIncident | Record<string, unknown>, index: number): ExternalIncident {
  if ("externalReportId" in incident && "summaryDescription" in incident) return incident as ExternalIncident;
  return {
    id: String(incident.id ?? `linked-report-${String(index + 1).padStart(3, "0")}`),
    externalReportId: String(incident.incidentId ?? `REF-${String(index + 1).padStart(4, "0")}`),
    origin: "CUSTOUTP",
    summaryDescription: String(incident.summary ?? incident.description ?? "Referencia externa vinculada al activo."),
    referenceStatus: String(incident.status ?? "Referencia recibida"),
    reportedLocation: String(incident.reportedLocation ?? "Sin ubicación reportada"),
    linkedAssetIds: Array.isArray(incident.linkedAssetIds) ? incident.linkedAssetIds.map(String) : [],
    reportedAt: String(incident.reportedAt ?? new Date().toISOString()),
    createdAt: String(incident.createdAt ?? incident.reportedAt ?? new Date().toISOString()),
  };
}

function freshDb(): LucyDb {
  return {
    assets: mockAssets,
    events: mockEvents,
    incidents: mockIncidents,
  };
}

function readDb(): LucyDb {
  const raw = localStorage.getItem(storageKey);
  if (!raw) {
    const seeded = freshDb();
    localStorage.setItem(storageKey, JSON.stringify(seeded));
    return seeded;
  }
  const parsed = JSON.parse(raw) as LucyDb;
  const normalized: LucyDb = {
    ...parsed,
    assets: parsed.assets.map((asset) => ({
      ...asset,
      status: String(asset.status) === oldPendingAcquisitionStatus
        ? "Pendiente de adquisición"
        : String(asset.status) === "Pendiente de verificación"
          ? "Pendiente de revisión"
          : asset.status,
      institutionalArea: String(asset.institutionalArea) === "Compras" ? "Gestión de insumos" : asset.institutionalArea,
    })) as LucyDb["assets"],
    events: parsed.events.map((event) => ({
      ...event,
      type: normalizeEventType(String(event.type)),
      description: event.description
        .replace(/Compra de pieza requerida/g, "Repuesto pendiente")
        .replace(/Adquisición de pieza requerida/g, "Posible adquisición")
        .replace(/Garantía activada/g, "Garantía revisada")
        .replace(/Vinculación con reporte externo/g, "Reporte externo vinculado")
        .replace(new RegExp(oldExternalLinkEvent, "g"), "Reporte externo vinculado"),
    })) as LucyDb["events"],
    incidents: parsed.incidents.map(normalizeIncident),
  };
  if (JSON.stringify(parsed) !== JSON.stringify(normalized)) writeDb(normalized);
  return normalized;
}

function writeDb(db: LucyDb) {
  localStorage.setItem(storageKey, JSON.stringify(db));
}

const makeId = (prefix: string) => `${prefix}-${crypto.randomUUID()}`;

export class MockLucyDataProvider implements LucyDataProvider {
  async listAssets() {
    return readDb().assets;
  }

  async getAssetById(id: string) {
    return readDb().assets.find((asset) => asset.id === id) ?? null;
  }

  async createAsset(input: CreateAssetInput) {
    const db = readDb();
    const now = new Date().toISOString();
    const asset: Asset = {
      ...input,
      id: makeId("asset"),
      qrToken: makeId("qr"),
      createdAt: now,
      updatedAt: now,
    };
    db.assets = [asset, ...db.assets];
    writeDb(db);
    return asset;
  }

  async updateAsset(id: string, input: UpdateAssetInput) {
    const db = readDb();
    const current = db.assets.find((asset) => asset.id === id);
    if (!current) throw new Error("Activo no encontrado.");
    const updated = { ...current, ...input, updatedAt: new Date().toISOString() };
    db.assets = db.assets.map((asset) => (asset.id === id ? updated : asset));
    writeDb(db);
    return updated;
  }

  async deleteAsset(id: string) {
    const db = readDb();
    const linked = db.incidents.some((incident) => incident.linkedAssetIds.includes(id));
    if (linked) throw new Error("No se puede eliminar un activo con reportes externos vinculados.");
    db.assets = db.assets.filter((asset) => asset.id !== id);
    db.events = db.events.filter((event) => event.assetId !== id);
    writeDb(db);
  }

  async listAssetEvents(assetId: string) {
    return readDb().events.filter((event) => event.assetId === assetId);
  }

  async createAssetEvent(input: CreateAssetEventInput) {
    const db = readDb();
    const event = { ...input, id: makeId("event") };
    db.events = [event, ...db.events];
    writeDb(db);
    return event;
  }

  async listLocations() {
    return mockLocations;
  }

  async listUnits() {
    return mockUnits;
  }

  async listResponsibles() {
    return mockResponsibles;
  }

  async listIncidents() {
    return readDb().incidents;
  }

  async updateIncident(incident: ExternalIncident) {
    const db = readDb();
    db.incidents = db.incidents.map((item) => (item.id === incident.id ? incident : item));
    writeDb(db);
    return incident;
  }

  async reset() {
    writeDb(freshDb());
  }
}

