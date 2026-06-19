export type UserRole =
  | "Gestión local"
  | "Técnico ejecutor"
  | "Supervisor"
  | "Gestión de insumos"
  | "Dirección"
  | "Administración"
  | "Consulta";

export type MockUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
};
