/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Sparkles, ShieldAlert, Bug, Truck, Clock, RefreshCw, AlertCircle, CheckCircle2 } from 'lucide-react';
import { DiagnosticoAmbientalIA } from '../types/reporte';
import { solicitarSelloAmbientalIA } from '../utils/geminiClient';

interface SelloAmbientalIAProps {
  reporteId: string;
  descripcion: string;
  ubicacion: string;
  diagnosticoActual?: DiagnosticoAmbientalIA;
  onActualizarDiagnostico: (id: string, diagnostico: DiagnosticoAmbientalIA) => void;
}

export const SelloAmbientalIA: React.FC<SelloAmbientalIAProps> = ({
  reporteId,
  descripcion,
  ubicacion,
  diagnosticoActual,
  onActualizarDiagnostico,
}) => {
  const [cargando, setCargando] = useState<boolean>(false);
  const [errorIA, setErrorIA] = useState<string | null>(null);

  const ejecutarEvaluacion = async (modoPrueba: boolean = false) => {
    setCargando(true);
    setErrorIA(null);

    const resultado = await solicitarSelloAmbientalIA(descripcion, ubicacion, modoPrueba);

    if (resultado.exito && resultado.datos) {
      onActualizarDiagnostico(reporteId, resultado.datos);
    } else {
      setErrorIA(resultado.error || 'No se pudo generar la evaluación ambiental con IA.');
    }

    setCargando(false);
  };

  // Colores y niveles de urgencia
  const configUrgencia: Record<string, { bg: string; border: string; text: string }> = {
    CRITICO: { bg: 'bg-rose-100', border: 'border-rose-900', text: 'text-rose-950' },
    ALTO: { bg: 'bg-amber-100', border: 'border-amber-900', text: 'text-amber-950' },
    MEDIO: { bg: 'bg-yellow-100', border: 'border-yellow-900', text: 'text-yellow-950' },
    BAJO: { bg: 'bg-emerald-100', border: 'border-emerald-900', text: 'text-emerald-950' },
  };

  const urgenciaEstilo =
    configUrgencia[diagnosticoActual?.nivelUrgencia?.toUpperCase() || ''] || configUrgencia.ALTO;

  return (
    <div className="mt-3 pt-3 border-t-2 border-stone-200">
      {/* Encabezado del módulo de IA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-emerald-900 shrink-0" aria-hidden="true" />
          <h4 className="text-base font-black text-stone-950">
            Sello de Evaluación Ambiental con IA
          </h4>
        </div>

        {/* Acciones para consultar IA o usar dato de prueba */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => ejecutarEvaluacion(false)}
            disabled={cargando}
            className="min-h-[44px] px-3 py-1.5 rounded-lg border-2 border-emerald-900 bg-white hover:bg-emerald-50 text-emerald-950 text-base font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            title="Evaluar reporte con la API de Gemini"
          >
            <RefreshCw className={`w-4 h-4 ${cargando ? 'animate-spin' : ''}`} />
            <span>{cargando ? 'Evaluando...' : diagnosticoActual ? 'Reevaluar' : 'Evaluar con IA'}</span>
          </button>

          <button
            type="button"
            onClick={() => ejecutarEvaluacion(true)}
            disabled={cargando}
            className="min-h-[44px] px-2.5 py-1.5 rounded-lg border border-stone-400 bg-stone-100 hover:bg-stone-200 text-stone-900 text-base font-semibold cursor-pointer disabled:opacity-50"
            title="Cargar ejemplo de prueba sin gastar llamadas de API"
          >
            Dato de prueba
          </button>
        </div>
      </div>

      {/* ESTADO DE ERROR DE IA (Manejo de fallo visible en español) */}
      {errorIA && (
        <div
          role="alert"
          className="p-3 my-2 bg-rose-100 border-2 border-rose-900 rounded-xl text-rose-950 text-base font-bold flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2"
        >
          <div className="flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-rose-900 shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <p className="font-black text-base">Error en la evaluación de IA:</p>
              <p className="font-semibold text-base">{errorIA}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => ejecutarEvaluacion(false)}
            className="px-3 py-1 bg-rose-900 text-white rounded-lg text-base font-bold hover:bg-rose-950 cursor-pointer self-end sm:self-auto"
          >
            Reintentar
          </button>
        </div>
      )}

      {/* CONSUMO Y VISUALIZACIÓN DEL JSON COMO DATOS ESTRUCTURADOS (NO COMO PÁRRAFO) */}
      {diagnosticoActual ? (
        <div className="bg-stone-50 border-2 border-stone-800 rounded-xl p-3 sm:p-4 space-y-3">
          {/* Métricas clave en cuadrícula */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {/* Dato 1: Nivel de Urgencia */}
            <div className={`p-2.5 rounded-lg border-2 ${urgenciaEstilo.border} ${urgenciaEstilo.bg}`}>
              <div className="flex items-center gap-1.5 text-base font-bold text-stone-900">
                <ShieldAlert className="w-4 h-4 text-stone-900 shrink-0" />
                <span>Nivel de urgencia:</span>
              </div>
              <span className={`block text-xl font-black ${urgenciaEstilo.text} mt-0.5`}>
                {diagnosticoActual.nivelUrgencia}
              </span>
            </div>

            {/* Dato 2: Días máximos de atención */}
            <div className="p-2.5 rounded-lg border-2 border-stone-800 bg-white">
              <div className="flex items-center gap-1.5 text-base font-bold text-stone-900">
                <Clock className="w-4 h-4 text-stone-900 shrink-0" />
                <span>Plazo de retiro:</span>
              </div>
              <span className="block text-xl font-black text-stone-950 mt-0.5">
                {diagnosticoActual.diasMaximosAtencion} días máx.
              </span>
            </div>

            {/* Dato 3: Fumigación requerida */}
            <div className="p-2.5 rounded-lg border-2 border-stone-800 bg-white">
              <div className="flex items-center gap-1.5 text-base font-bold text-stone-900">
                <CheckCircle2 className="w-4 h-4 text-stone-900 shrink-0" />
                <span>Fumigación sanitaria:</span>
              </div>
              <span className="block text-xl font-black text-stone-950 mt-0.5">
                {diagnosticoActual.requiereFumigacion ? 'Requerida' : 'No prioritaria'}
              </span>
            </div>
          </div>

          {/* Dato 4: Vectores y plagas detectadas (como etiquetas separadas) */}
          <div>
            <div className="flex items-center gap-1.5 text-base font-bold text-stone-950 mb-1">
              <Bug className="w-4 h-4 text-stone-900 shrink-0" />
              <span>Vectores y plagas asociadas:</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {diagnosticoActual.tipoVectores.map((vector, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 bg-stone-200 border-2 border-stone-800 rounded-lg text-base font-bold text-stone-950"
                >
                  {vector}
                </span>
              ))}
            </div>
          </div>

          {/* Dato 5: Maquinaria y cuadrilla requerida */}
          <div className="p-2.5 bg-white border-2 border-stone-300 rounded-lg">
            <div className="flex items-center gap-1.5 text-base font-bold text-stone-950">
              <Truck className="w-4 h-4 text-emerald-900 shrink-0" />
              <span>Equipo municipal recomendado:</span>
            </div>
            <p className="text-base font-semibold text-stone-900 mt-0.5">
              {diagnosticoActual.equipoRequerido}
            </p>
          </div>

          {/* Dato 6: Resumen técnico */}
          <div className="text-base text-stone-850 text-stone-900 font-medium bg-emerald-50/50 p-2.5 rounded-lg border border-emerald-200">
            <span className="font-bold text-emerald-950 block">Diagnóstico sanitario:</span>
            {diagnosticoActual.resumenRiesgo}
          </div>
        </div>
      ) : (
        <p className="text-base text-stone-700 italic">
          Sin diagnóstico de IA emitido. Presiona &ldquo;Evaluar con IA&rdquo; o &ldquo;Dato de prueba&rdquo; para obtener el sello sanitario de este botadero.
        </p>
      )}
    </div>
  );
};
