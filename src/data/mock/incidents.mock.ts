import type { ExternalIncident } from "../../types/incident";

const descriptions = [
  "Aviso externo asociado a equipo que no enciende.",
  "Referencia externa sobre impresora sin respuesta.",
  "Aviso externo relacionado con conectividad en laboratorio.",
  "Referencia externa sobre equipo de climatizacion con ruido.",
];

export const mockIncidents: ExternalIncident[] = Array.from({ length: 12 }, (_, index) => ({
  id: `linked-report-${String(index + 1).padStart(3, "0")}`,
  externalReportId: `REF-${String(index + 1).padStart(4, "0")}`,
  origin: index % 4 === 0 ? "SOLICITA" : index % 5 === 0 ? "OTRO" : "CUSTOUTP",
  summaryDescription: descriptions[index % descriptions.length],
  referenceStatus: index % 5 === 0 ? "En revision externa" : "Referencia recibida",
  reportedLocation: index % 2 === 0 ? "Laboratorio 301" : "Biblioteca",
  linkedAssetIds: index < 8 ? [`asset-${String((index % 6) + 1).padStart(3, "0")}`] : [],
  reportedAt: `2026-06-${String((index % 18) + 1).padStart(2, "0")}T10:30:00.000Z`,
  createdAt: `2026-06-${String((index % 18) + 1).padStart(2, "0")}T10:45:00.000Z`,
}));
