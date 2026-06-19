import type { Asset, AssetStatus, InstitutionalArea } from "../../types/asset";

const names = [
  ["Laptop Dell Latitude", "Laptop", "Equipo informático", "Dell", "Latitude 5440", "Secretaría Académica"],
  ["Impresora HP LaserJet", "Impresora", "Periférico", "HP", "LaserJet Pro M404", "Facultad de Sistemas"],
  ["UPS APC", "UPS", "Energía protegida", "APC", "Smart-UPS 1500", "laboratorio de redes"],
  ["Switch Cisco", "Switch", "Redes", "Cisco", "Catalyst 2960", "cuarto de comunicaciones"],
  ["Aire acondicionado", "Aire acondicionado", "Climatización", "Carrier", "Split 24000 BTU", "Laboratorio 301"],
  ["Proyector Epson", "Proyector", "Audiovisual", "Epson", "PowerLite X49", "salón 204"],
  ["Silla ergonómica", "Silla", "Mobiliario", "Sillas Panamá", "Ergo Pro", "oficina administrativa"],
  ["Router MikroTik", "Router", "Redes", "MikroTik", "CCR2004", "laboratorio"],
  ["Monitor Lenovo", "Monitor", "Equipo informático", "Lenovo", "ThinkVision 24", "biblioteca"],
  ["Equipo de laboratorio", "Equipo de laboratorio", "Laboratorio", "PASCO", "SensorLab", "facultad"],
];

const statuses: AssetStatus[] = ["Operativo", "En mantenimiento", "Dañado", "Pendiente de repuesto", "En garantía", "Dado de baja", "Pendiente de adquisición", "En bodega", "Trasladado", "Pendiente de revisión"];
const areas: InstitutionalArea[] = ["DITIC", "Soporte Técnico", "Redes", "DEMI", "Facultad", "Laboratorio", "Administrativo", "Gestión de insumos"];

export const mockAssets: Asset[] = Array.from({ length: 30 }, (_, index) => {
  const base = names[index % names.length];
  const locationId = `loc-00${(index % 8) + 1}`;
  const unitId = `unit-00${(index % 8) + 1}`;
  const respId = `resp-${String((index % 10) + 1).padStart(3, "0")}`;
  const acquiredYear = 2020 + (index % 5);
  const warrantyYear = index % 6 === 0 ? 2024 : index % 5 === 0 ? 2026 : 2027;

  return {
    id: `asset-${String(index + 1).padStart(3, "0")}`,
    code: `UTP-AF-${String(index + 1).padStart(4, "0")}`,
    serialNumber: `SN-LCY-${String(10000 + index)}`,
    name: `${base[0]} ${index + 1}`,
    type: base[1],
    category: base[2],
    brand: base[3],
    model: base[4],
    description: `${base[0]} asignado a ${base[5]} para operación institucional.`,
    status: statuses[index % statuses.length],
    locationId,
    responsibleUnitId: unitId,
    responsiblePersonId: respId,
    institutionalArea: areas[index % areas.length],
    acquisitionDate: `${acquiredYear}-0${(index % 9) + 1}-15`,
    warrantyExpiresAt: `${warrantyYear}-0${(index % 9) + 1}-20`,
    provider: index % 3 === 0 ? "Tecnología Global S.A." : index % 3 === 1 ? "Suministros UTP" : "Proveedor externo",
    estimatedCost: 450 + index * 85,
    observations: index % 7 === 0 ? "Revisar historial técnico disponible." : "Sin observaciones críticas.",
    tags: [base[1].toLowerCase(), base[2].toLowerCase(), locationId],
    qrToken: `LUCY-QR-${String(index + 1).padStart(4, "0")}`,
    createdAt: `2025-01-${String((index % 28) + 1).padStart(2, "0")}T09:00:00.000Z`,
    updatedAt: `2026-06-${String((index % 18) + 1).padStart(2, "0")}T15:00:00.000Z`,
  };
});
