import type { Asset, CreateAssetInput, UpdateAssetInput } from "../types/asset";
import type { ExternalIncident } from "../types/incident";
import type { Location } from "../types/location";
import type { AssetEvent, CreateAssetEventInput } from "../types/maintenance";
import type { Responsible } from "../types/responsible";
import type { Unit } from "../types/unit";

export interface LucyDataProvider {
  listAssets(): Promise<Asset[]>;
  getAssetById(id: string): Promise<Asset | null>;
  createAsset(input: CreateAssetInput): Promise<Asset>;
  updateAsset(id: string, input: UpdateAssetInput): Promise<Asset>;
  deleteAsset(id: string): Promise<void>;
  listAssetEvents(assetId: string): Promise<AssetEvent[]>;
  createAssetEvent(input: CreateAssetEventInput): Promise<AssetEvent>;
  listLocations(): Promise<Location[]>;
  listUnits(): Promise<Unit[]>;
  listResponsibles(): Promise<Responsible[]>;
  listIncidents(): Promise<ExternalIncident[]>;
  updateIncident(incident: ExternalIncident): Promise<ExternalIncident>;
  reset(): Promise<void>;
}
