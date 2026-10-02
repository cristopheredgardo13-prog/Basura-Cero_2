/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { DiagnosticoAmbientalIA } from '../types/reporte';

export interface ResultadoEvaluacionIA {
  exito: boolean;
  datos?: DiagnosticoAmbientalIA;
  error?: string;
  fuente?: string;
}

/**
 * Llama a la ruta backend /api/evaluar-botadero para obtener el Sello Ambiental con Gemini.
 * Protege contra caídas de red, tiempos de espera (timeout) y respuestas incompletas.
 */
export async function solicitarSelloAmbientalIA(
  descripcion: string,
  ubicacion: string,
  modoPrueba: boolean = false
): Promise<ResultadoEvaluacionIA> {
  const controlador = new AbortController();
  const idTiempo = setTimeout(() => controlador.abort(), 15000); // 15 segundos timeout

  try {
    const respuesta = await fetch('/api/evaluar-botadero', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        descripcion,
        ubicacion,
        modoPrueba,
      }),
      signal: controlador.signal,
    });

    clearTimeout(idTiempo);

    if (!respuesta.ok) {
      const errorJson = await respuesta.json().catch(() => ({}));
      return {
        exito: false,
        error:
          errorJson.error ||
          'El servicio de evaluación ambiental no respondió correctamente. Intenta más tarde.',
      };
    }

    const payload = await respuesta.json();

    if (!payload.exito || !payload.datos) {
      return {
        exito: false,
        error: payload.error || 'La respuesta devuelta por la IA no tiene el formato esperado.',
      };
    }

    // Validación defensiva del esquema recibido
    const datos = payload.datos as DiagnosticoAmbientalIA;
    if (
      !datos.nivelUrgencia ||
      typeof datos.diasMaximosAtencion !== 'number' ||
      !Array.isArray(datos.tipoVectores) ||
      !datos.equipoRequerido
    ) {
      return {
        exito: false,
        error: 'El diagnóstico recibido no cumple con las métricas sanitarias requeridas.',
      };
    }

    return {
      exito: true,
      datos,
      fuente: payload.fuente,
    };
  } catch (error: any) {
    clearTimeout(idTiempo);
    if (error.name === 'AbortError') {
      return {
        exito: false,
        error: 'La evaluación con IA tardó demasiado en responder (tiempo límite excedido).',
      };
    }
    return {
      exito: false,
      error:
        'No se pudo conectar con el servicio de IA. Revisa tu conexión a internet o intenta nuevamente.',
    };
  }
}
