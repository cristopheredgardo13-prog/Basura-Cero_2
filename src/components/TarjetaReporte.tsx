/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { MapPin, Calendar, AlertTriangle, Send, CheckCircle2, Clock, Sparkles } from 'lucide-react';
import { Reporte, EstadoReporte, DiagnosticoAmbientalIA } from '../types/reporte';
import { SelloAmbientalIA } from './SelloAmbientalIA';

interface TarjetaReporteProps {
  reporte: Reporte;
  onCambiarEstado: (id: string, nuevoEstado: EstadoReporte) => void;
  onActualizarDiagnostico?: (id: string, diagnostico: DiagnosticoAmbientalIA) => void;
}

export const TarjetaReporte: React.FC<TarjetaReporteProps> = ({
  reporte,
  onCambiarEstado,
  onActualizarDiagnostico,
}) => {
  /**
   * Configuración de estilos de alto contraste para lectura bajo la luz del sol.
   * Todos los textos tienen un tamaño mínimo de 16px (text-base) y bordes gruesos bien definidos.
   */
  const configEstado: Record<
    EstadoReporte,
    {
      etiqueta: string;
      colorTexto: string;
      colorBorde: string;
      bgSoft: string;
      icon: React.ReactNode;
      descripcionEstado: string;
    }
  > = {
    abierto: {
      etiqueta: 'Abierto',
      colorTexto: 'text-rose-950',
      colorBorde: 'border-rose-900',
      bgSoft: 'bg-rose-100',
      icon: <AlertTriangle className="w-5 h-5 text-rose-900 shrink-0" aria-hidden="true" />,
      descripcionEstado: 'Pendiente de atención por la alcaldía',
    },
    avisado: {
      etiqueta: 'Avisado',
      colorTexto: 'text-amber-950',
      colorBorde: 'border-amber-900',
      bgSoft: 'bg-amber-100',
      icon: <Send className="w-5 h-5 text-amber-900 shrink-0" aria-hidden="true" />,
      descripcionEstado: 'La cuadrilla ya fue notificada',
    },
    resuelto: {
      etiqueta: 'Resuelto',
      colorTexto: 'text-emerald-950',
      colorBorde: 'border-emerald-900',
      bgSoft: 'bg-emerald-100',
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-900 shrink-0" aria-hidden="true" />,
      descripcionEstado: 'Botadero limpiado y retirado',
    },
  };

  /**
   * PROTECCIÓN CONTRA DATOS CORRUPTOS:
   * Si el reporte viene con un estado nulo, indefinido o corrupto desde el almacenamiento,
   * se utiliza 'abierto' como respaldo seguro para que la tarjeta nunca colapse en blanco.
   */
  const estadosPermitidos: EstadoReporte[] = ['abierto', 'avisado', 'resuelto'];
  const estadoValido: EstadoReporte = estadosPermitidos.includes(reporte.estado)
    ? reporte.estado
    : 'abierto';

  const infoActual = configEstado[estadoValido];

  return (
    <article className="bg-white border-2 border-stone-800 rounded-2xl overflow-hidden shadow-sm flex flex-col md:flex-row">
      {/* 1. FOTO DEL BOTADERO CON ALTO CONTRASTE */}
      <div className="w-full md:w-64 h-56 md:h-auto shrink-0 relative bg-stone-100 border-b-2 md:border-b-0 md:border-r-2 border-stone-800">
        <img
          src={reporte.fotoUrl}
          alt={`Foto del botadero en ${reporte.ubicacion}`}
          className="w-full h-full object-cover block"
          loading="lazy"
        />
        {/* Distintivo de estado para pantalla pequeña con alto contraste */}
        <div className="absolute top-3 left-3 md:hidden flex flex-col gap-1.5 items-start">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-base font-black ${infoActual.bgSoft} ${infoActual.colorTexto} border-2 ${infoActual.colorBorde} shadow-md`}
          >
            {infoActual.icon}
            <span>{infoActual.etiqueta}</span>
          </span>
          {reporte.diagnosticoIA && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-base font-black bg-emerald-100 text-emerald-950 border-2 border-emerald-900 shadow-md">
              <Sparkles className="w-4 h-4 text-emerald-900 shrink-0" aria-hidden="true" />
              <span>IA: {reporte.diagnosticoIA.nivelUrgencia}</span>
            </span>
          )}
        </div>
      </div>

      {/* 2. CONTENIDO Y DETALLES DEL REPORTE */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-3">
          {/* Encabezado de estado y fechas (todos >= 16px) */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-200 pb-3">
            <div className="hidden md:flex items-center gap-2 flex-wrap">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-base font-black ${infoActual.bgSoft} ${infoActual.colorTexto} border-2 ${infoActual.colorBorde}`}
              >
                {infoActual.icon}
                <span>{infoActual.etiqueta}</span>
              </span>
              {reporte.diagnosticoIA && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-base font-black bg-emerald-100 text-emerald-950 border-2 border-emerald-900 shadow-xs">
                  <Sparkles className="w-4 h-4 text-emerald-900 shrink-0" aria-hidden="true" />
                  <span>IA: {reporte.diagnosticoIA.nivelUrgencia}</span>
                </span>
              )}
              <span className="text-base text-stone-900 font-semibold">
                — {infoActual.descripcionEstado}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-stone-900">
              <div className="flex items-center gap-1.5 font-bold text-base">
                <Calendar className="w-5 h-5 text-stone-900 shrink-0" aria-hidden="true" />
                <span>Fecha: {reporte.fechaCreacion}</span>
              </div>
              {reporte.fechaCambioEstado && (
                <div className="inline-flex items-center gap-1.5 text-base font-black text-stone-950 bg-stone-200 border-2 border-stone-800 px-2.5 py-1 rounded-lg">
                  <Clock className="w-4 h-4 shrink-0 text-stone-950" aria-hidden="true" />
                  <span>{reporte.fechaCambioEstado}</span>
                </div>
              )}
            </div>
          </div>

          {/* Descripción del botadero */}
          <div>
            <span className="block text-base font-bold text-stone-950 mb-1">
              Problema reportado:
            </span>
            <p className="text-stone-950 text-base font-medium leading-relaxed break-words [overflow-wrap:anywhere]">
              {reporte.descripcion}
            </p>
          </div>

          {/* Ubicación escrita */}
          <div className="p-3 bg-stone-100 rounded-xl border-2 border-stone-300 flex items-start gap-2">
            <MapPin className="w-5 h-5 text-emerald-900 shrink-0 mt-0.5" aria-hidden="true" />
            <div className="min-w-0 flex-1">
              <span className="block text-base font-bold text-stone-950">
                Ubicación del botadero:
              </span>
              <span className="block text-base font-semibold text-stone-900 break-words [overflow-wrap:anywhere]">
                {reporte.ubicacion}
              </span>
            </div>
          </div>

          {/* SELLO DE EVALUACIÓN AMBIENTAL CON IA */}
          {onActualizarDiagnostico && (
            <SelloAmbientalIA
              reporteId={reporte.id}
              descripcion={reporte.descripcion}
              ubicacion={reporte.ubicacion}
              diagnosticoActual={reporte.diagnosticoIA}
              onActualizarDiagnostico={onActualizarDiagnostico}
            />
          )}
        </div>

        {/* 3. CAMBIAR ESTADO: ETIQUETA VISIBLE Y CONTROL CON ALTO CONTRASTE */}
        <div className="pt-3 border-t-2 border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <label
            htmlFor={`estado-${reporte.id}`}
            className="text-base font-bold text-stone-950"
          >
            Cambiar estado del reporte:
          </label>

          <div className="w-full sm:w-auto">
            <select
              id={`estado-${reporte.id}`}
              value={estadoValido}
              onChange={(e) => {
                const nuevo = e.target.value as EstadoReporte;
                if (nuevo !== estadoValido) {
                  onCambiarEstado(reporte.id, nuevo);
                }
              }}
              className="w-full sm:w-auto min-h-[48px] text-base font-black px-4 py-2.5 rounded-xl border-2 border-stone-900 bg-stone-50 hover:bg-white text-stone-950 focus:outline-none focus:ring-4 focus:ring-emerald-900/20 cursor-pointer shadow-xs"
            >
              <option value="abierto">Abierto (Pendiente)</option>
              <option value="avisado">Avisado a la alcaldía</option>
              <option value="resuelto">Resuelto (Limpiado)</option>
            </select>
          </div>
        </div>
      </div>
    </article>
  );
};
