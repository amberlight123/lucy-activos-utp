import type { AssetStatus, InstitutionalArea } from "./asset";

export type AssetEventType =
  | "Mantenimiento preventivo"
  | "Mantenimiento correctivo"
  | "Revisión técnica"
  | "Traslado"
  | "Cambio de responsable"
  | "Cambio de ubicación"
  | "Cambio de estado"
  | "Repuesto pendiente"
  | "Posible adquisición"
  | "Garantía revisada"
  | "Repuesto instalado"
  | "Baja"
  | "Observación técnica"
  | "Reporte externo vinculado";

export type AssetEvent = {
  id: string;
  assetId: string;
  type: AssetEventType;
  date: string;
  registeredBy: string;
  responsibleArea: InstitutionalArea;
  description: string;
  previousStatus?: AssetStatus;
  newStatus?: AssetStatus;
  evidence?: string;
  relatedIncidentId?: string;
  associatedParts: string[];
  estimatedCost?: number;
  closingComment?: string;
  supervisorValidated: boolean;
};

export type CreateAssetEventInput = Omit<AssetEvent, "id">;
