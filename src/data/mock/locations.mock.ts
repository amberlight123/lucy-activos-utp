import type { Location } from "../../types/location";

export const mockLocations: Location[] = [
  { id: "loc-001", campus: "Campus Víctor Levi Sasso", building: "Edificio 1", facultyOrUnit: "FISC", floor: "3", room: "301", lab: "Laboratorio 301", area: "Laboratorios", description: "Laboratorio de sistemas y redes", status: "Activa" },
  { id: "loc-002", campus: "Campus Víctor Levi Sasso", building: "Edificio 3", facultyOrUnit: "DITIC", floor: "1", office: "Soporte Técnico", area: "Soporte", description: "Taller de soporte técnico", status: "Activa" },
  { id: "loc-003", campus: "Campus Víctor Levi Sasso", building: "Edificio 1", facultyOrUnit: "FISC", floor: "2", room: "204", area: "Aulas", description: "Salón 204", status: "Activa" },
  { id: "loc-004", campus: "Campus Víctor Levi Sasso", building: "Biblioteca", facultyOrUnit: "Biblioteca", floor: "PB", area: "Consulta", description: "Sala de consulta general", status: "Activa" },
  { id: "loc-005", campus: "Campus Víctor Levi Sasso", building: "Edificio Administrativo", facultyOrUnit: "Secretaría Académica", floor: "1", office: "Secretaría", area: "Administrativo", description: "Oficina de Secretaría Académica", status: "Activa" },
  { id: "loc-006", campus: "Campus Víctor Levi Sasso", building: "DEMI", facultyOrUnit: "DEMI", floor: "PB", area: "Taller", description: "Taller electromecánico", status: "Activa" },
  { id: "loc-007", campus: "Campus Víctor Levi Sasso", building: "Centro de Datos", facultyOrUnit: "DITIC", floor: "1", area: "Comunicaciones", description: "Cuarto de comunicaciones principal", status: "Activa" },
  { id: "loc-008", campus: "Campus Víctor Levi Sasso", building: "Almacén", facultyOrUnit: "Gestión de insumos", floor: "PB", area: "Bodega", description: "Bodega institucional de repuestos", status: "Activa" },
];
