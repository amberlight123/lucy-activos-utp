import type { AssetEvent, AssetEventType } from "../../types/maintenance";

const eventTypes: AssetEventType[] = [
  "Mantenimiento preventivo",
  "Mantenimiento correctivo",
  "Revisión técnica",
  "Traslado",
  "Cambio de estado",
  "Repuesto pendiente",
  "Posible adquisición",
  "Garantía revisada",
  "Repuesto instalado",
  "Observación técnica",
  "Reporte externo vinculado",
];

export const mockEvents: AssetEvent[] = Array.from({ length: 36 }, (_, index) => {
  const assetIndex = index < 6 ? 1 : (index % 30) + 1;
  const type = eventTypes[index % eventTypes.length];
  return {
    id: `event-${String(index + 1).padStart(3, "0")}`,
    assetId: `asset-${String(assetIndex).padStart(3, "0")}`,
    type,
    date: `2026-0${(index % 6) + 1}-${String((index % 24) + 1).padStart(2, "0")}`,
    registeredBy: index % 2 === 0 ? "Carlos Méndez" : "Javier Castillo",
    responsibleArea: index % 4 === 0 ? "DEMI" : index % 3 === 0 ? "Redes" : "Soporte Técnico",
    description: `${type} registrado para trazabilidad técnica del activo.`,
    previousStatus: index % 5 === 0 ? "Operativo" : undefined,
    newStatus: index % 5 === 0 ? "En mantenimiento" : undefined,
    evidence: index % 4 === 0 ? "evidencia-mock.pdf" : undefined,
    relatedIncidentId: index % 6 === 0 ? `INC-${String(index + 1).padStart(4, "0")}` : undefined,
    associatedParts: type.includes("Repuesto") || type.includes("pieza") ? ["Fuente", "Cableado"] : [],
    estimatedCost: type.includes("correctivo") ? 120 : undefined,
    closingComment: index % 3 === 0 ? "Pendiente de validación final." : "Atendido para seguimiento operativo.",
    supervisorValidated: index % 2 === 0,
  };
});
