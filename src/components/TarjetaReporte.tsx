/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { MapPin, Calendar, AlertTriangle, Send, CheckCircle2, ChevronRight } from 'lucide-react';
import { Reporte, EstadoReporte } from '../types/reporte';

interface TarjetaReporteProps {
  reporte: Reporte;
  onCambiarEstado: (id: string, nuevoEstado: EstadoReporte) => void;
}

export const TarjetaReporte: React.FC<TarjetaReporteProps> = ({ reporte, onCambiarEstado }) => {
  /**
   * Configuración de estilos y etiquetas según el estado del reporte.
   * Sin utilizar píldoras genéricas ("pills") recargadas, sino metadatos sobrios y legibles.
   */
  const configEstado: Record<EstadoReporte, { etiqueta: string; colorTexto: string; colorBorde: string; bgSoft: string; icon: React.ReactNode; descripcionEstado: string }> = {
    abierto: {
      etiqueta: 'Abierto',
      colorTexto: 'text-rose-700',
      colorBorde: 'border-rose-200',
      bgSoft: 'bg-rose-50',
      icon: <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />,
      descripcionEstado: 'Pendiente de gestión comunitaria o municipal',
    },
    avisado: {
      etiqueta: 'Avisado',
      colorTexto: 'text-amber-700',
      colorBorde: 'border-amber-200',
      bgSoft: 'bg-amber-50',
      icon: <Send className="w-3.5 h-3.5 text-amber-600" />,
      descripcionEstado: 'Notificado a la unidad ambiental de la alcaldía',
    },
    resuelto: {
      etiqueta: 'Resuelto',
      colorTexto: 'text-emerald-700',
      colorBorde: 'border-emerald-200',
      bgSoft: 'bg-emerald-50',
      icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />,
      descripcionEstado: 'Zona limpiada y desechos recolectados',
    },
  };

  const infoActual = configEstado[reporte.estado];

  return (
    <article className="bg-white border border-stone-200 rounded-xl overflow-hidden shadow-xs hover:shadow-sm transition-shadow flex flex-col md:flex-row">
      {/* 1. FOTO DEL BOTADERO */}
      <div className="w-full md:w-56 h-48 md:h-auto shrink-0 relative bg-stone-100 border-b md:border-b-0 md:border-r border-stone-200 overflow-hidden">
        <img
          src={reporte.fotoUrl}
          alt={`Evidencia en ${reporte.ubicacion}`}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute top-2.5 left-2.5 md:hidden">
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold ${infoActual.bgSoft} ${infoActual.colorTexto} border ${infoActual.colorBorde} shadow-xs backdrop-blur-xs`}>
            {infoActual.icon}
            {infoActual.etiqueta}
          </span>
        </div>
      </div>

      {/* 2. DETALLES DEL REPORTE */}
      <div className="p-4 md:p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2.5">
          {/* Metadatos superiores: Estado y Fecha */}
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-stone-500">
            <div className="hidden md:flex items-center gap-1.5 font-medium">
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold ${infoActual.bgSoft} ${infoActual.colorTexto} border ${infoActual.colorBorde}`}>
                {infoActual.icon}
                {infoActual.etiqueta}
              </span>
              <span className="text-stone-400">·</span>
              <span className="text-stone-600">{infoActual.descripcionEstado}</span>
            </div>

            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-stone-500">
              <div className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-stone-400" />
                <span>{reporte.fechaCreacion}</span>
              </div>
              {reporte.fechaCambioEstado && (
                <>
                  <span className="text-stone-300" aria-hidden="true">·</span>
                  <span className="font-medium text-stone-800 bg-stone-100 px-2 py-0.5 rounded border border-stone-200 text-xs">
                    {reporte.fechaCambioEstado}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Descripción del botadero */}
          <p className="text-stone-900 text-sm md:text-base leading-relaxed font-normal">
            {reporte.descripcion}
          </p>

          {/* Ubicación escrita */}
          <div className="flex items-start gap-1.5 text-xs md:text-sm text-stone-700 bg-stone-50 p-2.5 rounded-lg border border-stone-100">
            <MapPin className="w-4 h-4 text-emerald-800 shrink-0 mt-0.5" />
            <span className="font-medium text-stone-800">{reporte.ubicacion}</span>
          </div>
        </div>

        {/* 3. CONTROL PARA CAMBIAR DE ESTADO */}
        {/*
          PUNTO CRÍTICO DE ERROR #5: Manejo del cambio de estado.
          El selector no debe mutar directamente la propiedad reporte.estado = nuevoEstado.
          Debe llamar a onCambiarEstado(id, nuevo) para que el componente padre
          realice una actualización inmutable en el array de React (por ej: usando .map()).
        */}
        <div className="pt-3 border-t border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <label htmlFor={`estado-${reporte.id}`} className="text-xs font-medium text-stone-600">
            Cambiar estado del reporte:
          </label>

          <div className="flex items-center gap-1.5">
            <select
              id={`estado-${reporte.id}`}
              value={reporte.estado}
              onChange={(e) => onCambiarEstado(reporte.id, e.target.value as EstadoReporte)}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-stone-300 bg-stone-50 hover:bg-white text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-700 cursor-pointer"
            >
              <option value="abierto">Abierto (Sin avisar)</option>
              <option value="avisado">Avisado a la alcaldía</option>
              <option value="resuelto">Resuelto (Limpio)</option>
            </select>
          </div>
        </div>
      </div>
    </article>
  );
};
