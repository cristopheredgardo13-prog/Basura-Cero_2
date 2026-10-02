/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Reporte, EstadoReporte } from '../types/reporte';
import { TarjetaReporte } from './TarjetaReporte';
import { AlertCircle, CheckCircle2, Inbox } from 'lucide-react';

interface ListaReportesProps {
  reportes: Reporte[];
  onCambiarEstado: (id: string, nuevoEstado: EstadoReporte) => void;
}

export const ListaReportes: React.FC<ListaReportesProps> = ({ reportes, onCambiarEstado }) => {
  // Pestaña activa: por defecto siempre muestra los reportes 'activos' según el requerimiento principal
  const [vista, setVista] = useState<'activos' | 'resueltos'>('activos');

  /**
   * PUNTO CRÍTICO DE ERROR #6: Filtrado correcto de reportes activos.
   * Un error común es filtrar únicamente `reporte.estado === 'abierto'`, olvidando
   * que los que están en estado `'avisado'` siguen estando activos y pendientes de limpieza.
   * La definición formal es: activos = todos aquellos cuyo estado NO sea 'resuelto'.
   */
  const reportesActivos = reportes.filter((r) => r.estado !== 'resuelto');
  const reportesResueltos = reportes.filter((r) => r.estado === 'resuelto');

  const reportesVisibles = vista === 'activos' ? reportesActivos : reportesResueltos;

  return (
    <div className="space-y-4">
      {/* Controles de filtro / pestañas de vista */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-stone-100/80 p-1.5 rounded-xl border border-stone-200">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setVista('activos')}
            className={`px-3.5 py-2 rounded-lg text-xs md:text-sm font-semibold transition-all cursor-pointer flex items-center gap-2 ${
              vista === 'activos'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <AlertCircle className={`w-4 h-4 ${vista === 'activos' ? 'text-amber-700' : 'text-stone-400'}`} />
            Reportes Activos ({reportesActivos.length})
          </button>

          <button
            type="button"
            onClick={() => setVista('resueltos')}
            className={`px-3.5 py-2 rounded-lg text-xs md:text-sm font-semibold transition-all cursor-pointer flex items-center gap-2 ${
              vista === 'resueltos'
                ? 'bg-white text-emerald-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <CheckCircle2 className={`w-4 h-4 ${vista === 'resueltos' ? 'text-emerald-700' : 'text-stone-400'}`} />
            Resueltos ({reportesResueltos.length})
          </button>
        </div>

        <span className="text-xs text-stone-500 px-2 font-medium">
          {vista === 'activos'
            ? 'Mostrando botaderos abiertos y avisados'
            : 'Historial de botaderos limpiados'}
        </span>
      </div>

      {/* Lista de tarjetas o estado vacío */}
      {reportesVisibles.length === 0 ? (
        <div className="bg-white border border-stone-200 rounded-xl p-10 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-stone-100 text-stone-400 mx-auto flex items-center justify-center">
            <Inbox className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-stone-800">
              {vista === 'activos'
                ? '¡Excelente noticia! No hay reportes activos'
                : 'Aún no hay reportes resueltos'}
            </h3>
            <p className="text-xs md:text-sm text-stone-500 max-w-md mx-auto mt-1">
              {vista === 'activos'
                ? 'Todos los botaderos documentados han sido atendidos o aún no se ha reportado ninguno nuevo hoy.'
                : 'Cuando la cuadrilla municipal limpie un botadero, cambiale el estado a "Resuelto" para archivar su éxito aquí.'}
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {reportesVisibles.map((reporte) => (
            <TarjetaReporte
              key={reporte.id}
              reporte={reporte}
              onCambiarEstado={onCambiarEstado}
            />
          ))}
        </div>
      )}
    </div>
  );
};
