/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Reporte } from '../types/reporte';
import { reportesIniciales } from '../data/seed';

export const CLAVE_LOCALSTORAGE = 'basura_cero_reportes';

/**
 * 1. LEER reportes desde localStorage.
 * Si no existen registros previos, retorna los reportes de ejemplo iniciales.
 */
export function leerReportes(): Reporte[] {
  try {
    const datosSerializados = localStorage.getItem(CLAVE_LOCALSTORAGE);
    if (!datosSerializados) {
      // Si es la primera vez que se abre la app, guardamos y retornamos los datos iniciales
      guardarReportes(reportesIniciales);
      return reportesIniciales;
    }
    const reportesParseados: Reporte[] = JSON.parse(datosSerializados);
    return Array.isArray(reportesParseados) ? reportesParseados : reportesIniciales;
  } catch (error) {
    console.error('Error al leer de localStorage:', error);
    return reportesIniciales;
  }
}

/**
 * 2. GUARDAR reportes en localStorage.
 * Detecta si el almacenamiento falla por cuota excedida (QuotaExceededError) u otra restricción,
 * retornando un estado para notificar visiblemente al usuario en la interfaz.
 */
export function guardarReportes(reportes: Reporte[]): { exito: boolean; error?: string } {
  try {
    const datosSerializados = JSON.stringify(reportes);
    localStorage.setItem(CLAVE_LOCALSTORAGE, datosSerializados);
    return { exito: true };
  } catch (error: unknown) {
    console.error('Error al guardar en localStorage:', error);
    const esErrorCuota =
      error instanceof DOMException &&
      (error.code === 22 ||
        error.code === 1014 ||
        error.name === 'QuotaExceededError' ||
        error.name === 'NS_ERROR_DOM_QUOTA_REACHED');

    return {
      exito: false,
      error: esErrorCuota
        ? 'El reporte no se pudo guardar de forma permanente porque el espacio de almacenamiento del navegador está lleno.'
        : 'El reporte no se pudo guardar de forma permanente en el dispositivo.',
    };
  }
}

/**
 * 3. BORRAR todos los reportes de localStorage.
 * Elimina la clave y restablece los datos iniciales de prueba.
 */
export function borrarReportes(): void {
  try {
    localStorage.removeItem(CLAVE_LOCALSTORAGE);
  } catch (error) {
    console.error('Error al borrar de localStorage:', error);
  }
}

/**
 * 4. EXPORTAR RESPALDO a un archivo JSON descargable.
 * Crea un archivo con todos los reportes para que el usuario pueda respaldar sus datos
 * fuera del navegador antes de limpiar historial o cambiar de dispositivo.
 */
export function exportarRespaldo(reportes: Reporte[]): void {
  const contenido = JSON.stringify(reportes, null, 2);
  const blob = new Blob([contenido], { type: 'application/json;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const fechaIso = new Date().toISOString().split('T')[0];
  const enlace = document.createElement('a');
  enlace.href = url;
  enlace.download = `respaldo-basura-cero-${fechaIso}.json`;
  document.body.appendChild(enlace);
  enlace.click();

  // Limpieza del elemento y del Object URL en memoria
  document.body.removeChild(enlace);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
