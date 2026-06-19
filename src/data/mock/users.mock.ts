import type { MockUser } from "../../types/user";

export const mockUsers: MockUser[] = [
  { id: "usr-gestion", name: "Gestión local", email: "gestion@utp.ac.pa", role: "Gestión local" },
  { id: "usr-tecnico", name: "Técnico ejecutor", email: "tecnico@utp.ac.pa", role: "Técnico ejecutor" },
  { id: "usr-supervisor", name: "Supervisor", email: "supervisor@utp.ac.pa", role: "Supervisor" },
  { id: "usr-insumos", name: "Gestión de insumos", email: "insumos@utp.ac.pa", role: "Gestión de insumos" },
  { id: "usr-direccion", name: "Dirección", email: "direccion@utp.ac.pa", role: "Dirección" },
  { id: "usr-admin", name: "Administración", email: "admin@utp.ac.pa", role: "Administración" },
  { id: "usr-consulta", name: "Consulta", email: "consulta@utp.ac.pa", role: "Consulta" },
];
