export type UnitType =
  | "Facultad"
  | "Dirección"
  | "Departamento"
  | "Laboratorio"
  | "DEMI"
  | "DITIC"
  | "Soporte Técnico"
  | "Redes"
  | "Gestión de insumos"
  | "Otro";

export type Unit = {
  id: string;
  name: string;
  type: UnitType;
  email?: string;
  phone?: string;
  mainLocationId: string;
};
