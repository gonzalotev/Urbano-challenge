export function formatDate(date: Date): string {
  const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long' };
  return date.toLocaleDateString('es-ES', options);
}
