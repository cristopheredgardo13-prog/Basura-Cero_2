/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * PUNTO CRÍTICO DE ERROR #2: Formateo de fechas consistente y sin desfase de huso horario.
 * Un error común de desarrollo es usar toISOString().split('T')[0] y luego parsearlo como UTC,
 * lo que en países como El Salvador (UTC-6) a menudo muestra el día anterior o posterior
 * dependiendo de la hora en que se crea el reporte.
 *
 * Esta función obtiene la fecha local del dispositivo del usuario y la formatea en español legible.
 */
export function obtenerFechaActualFormateada(): string {
  const ahora = new Date();
  
  // Opciones para asegurar formato largo en español: "2 de octubre de 2026"
  return ahora.toLocaleDateString('es-SV', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

/**
 * Obtiene la fecha actual en formato DD/MM/AAAA (ej: 02/10/2026)
 * para el registro conciso de cambios de estado.
 */
export function obtenerFechaCorta(): string {
  const ahora = new Date();
  const dia = String(ahora.getDate()).padStart(2, '0');
  const mes = String(ahora.getMonth() + 1).padStart(2, '0');
  const anio = ahora.getFullYear();
  return `${dia}/${mes}/${anio}`;
}
