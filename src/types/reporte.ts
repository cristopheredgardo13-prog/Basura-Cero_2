/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * PUNTO CRÍTICO DE ERROR #1: Tipado estricto de los estados permitidos.
 * No utilizar `string` genérico. Si se usa `string`, un error tipográfico
 * como 'abierta' o 'terminado' pasaría desapercibido y rompería los filtros
 * de la unidad ambiental.
 */
export type EstadoReporte = 'abierto' | 'avisado' | 'resuelto';

export interface Reporte {
  id: string;
  fotoUrl: string; // Base64 o URL de la imagen
  descripcion: string;
  ubicacion: string; // Dirección escrita por el vecino (ej: "Calle principal, colonia Las Flores, frente a la cancha")
  estado: EstadoReporte;
  fechaCreacion: string; // Formato ISO o fecha formateada en español
}
