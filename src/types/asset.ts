export type AssetStatus =
  | "Operativo"
  | "En mantenimiento"
  | "Dañado"
  | "Pendiente de repuesto"
  | "Pendiente de adquisición"
  | "En garantía"
  | "En bodega"
  | "Trasladado"
  | "Dado de baja"
  | "Pendiente de revisión";

export type InstitutionalArea =
  | "DEMI"
  | "DITIC"
  | "Soporte Técnico"
  | "Redes"
  | "Gestión de insumos"
  | "Facultad"
  | "Laboratorio"
  | "Administrativo"
  | "Otro";

export type Asset = {
  id: string;
  code: string;
  serialNumber?: string;
  name: string;
  type: string;
  category: string;
  brand: string;
  model: string;
  description: string;
  status: AssetStatus;
  locationId: string;
  responsibleUnitId: string;
  responsiblePersonId: string;
  institutionalArea: InstitutionalArea;
  acquisitionDate: string;
  warrantyExpiresAt?: string;
  provider: string;
  estimatedCost?: number;
  observations: string;
  tags: string[];
  qrToken: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateAssetInput = Omit<Asset, "id" | "qrToken" | "createdAt" | "updatedAt">;
export type UpdateAssetInput = Partial<CreateAssetInput>;

export const assetStatuses: AssetStatus[] = [
  "Operativo",
  "En mantenimiento",
  "Dañado",
  "Pendiente de repuesto",
  "Pendiente de adquisición",
  "En garantía",
  "En bodega",
  "Trasladado",
  "Dado de baja",
  "Pendiente de revisión",
];

export const assetTypes = [
  "Computadora de escritorio",
  "Laptop",
  "Monitor",
  "Impresora",
  "UPS",
  "Router",
  "Switch",
  "Access point",
  "Servidor",
  "Proyector",
  "Aire acondicionado",
  "Equipo de refrigeración",
  "Equipo eléctrico",
  "Mobiliario",
  "Mesa",
  "Silla",
  "Equipo de laboratorio",
  "Herramienta",
  "Material",
  "Repuesto",
  "Otro",
];

export const institutionalAreas: InstitutionalArea[] = [
  "DEMI",
  "DITIC",
  "Soporte Técnico",
  "Redes",
  "Gestión de insumos",
  "Facultad",
  "Laboratorio",
  "Administrativo",
  "Otro",
];
