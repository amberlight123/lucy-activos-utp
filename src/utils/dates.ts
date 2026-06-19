export function formatDate(value?: string) {
  if (!value) return "Sin fecha";
  return new Intl.DateTimeFormat("es-PA", { dateStyle: "medium" }).format(new Date(value));
}

export function daysUntil(value?: string) {
  if (!value) return null;
  const today = new Date();
  const target = new Date(value);
  return Math.ceil((target.getTime() - today.getTime()) / 86_400_000);
}
