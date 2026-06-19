export type Location = {
  id: string;
  campus: string;
  building: string;
  facultyOrUnit: string;
  floor: string;
  room?: string;
  lab?: string;
  office?: string;
  area: string;
  description: string;
  status: "Activa" | "Inactiva";
};
