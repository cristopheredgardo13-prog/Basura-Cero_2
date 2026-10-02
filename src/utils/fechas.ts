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
function obtenerFechaSegura(): Date {
  const ahora = new Date();
  const anio = ahora.getFullYear();
  // Si el reloj del dispositivo está descalibrado hacia un pasado o futuro inverosímil
  if (anio < 2024 || anio > 2030 || isNaN(ahora.getTime())) {
    return new Date(2026, 9, 2); // 2 de octubre de 2026
  }
  return ahora;
}

export function obtenerFechaActualFormateada(): string {
  const fecha = obtenerFechaSegura();
  
  // Opciones para asegurar formato largo en español: "2 de octubre de 2026"
  return fecha.toLocaleDateString('es-SV', {
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
  const fecha = obtenerFechaSegura();
  const dia = String(fecha.getDate()).padStart(2, '0');
  const mes = String(fecha.getMonth() + 1).padStart(2, '0');
  const anio = fecha.getFullYear();
  return `${dia}/${mes}/${anio}`;
}
