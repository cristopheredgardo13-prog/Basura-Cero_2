/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Reporte, EstadoReporte, DiagnosticoAmbientalIA } from '../types/reporte';
import { TarjetaReporte } from './TarjetaReporte';
import { AlertCircle, CheckCircle2, Inbox, PlusCircle } from 'lucide-react';

interface ListaReportesProps {
  reportes: Reporte[];
  onCambiarEstado: (id: string, nuevoEstado: EstadoReporte) => void;
  onIniciarReporte?: () => void;
  onActualizarDiagnostico?: (id: string, diagnostico: DiagnosticoAmbientalIA) => void;
}

export const ListaReportes: React.FC<ListaReportesProps> = ({
  reportes,
  onCambiarEstado,
  onIniciarReporte,
  onActualizarDiagnostico,
}) => {
  const [vista, setVista] = useState<'activos' | 'resueltos'>('activos');

  const reportesActivos = reportes.filter((r) => r.estado !== 'resuelto');
  const reportesResueltos = reportes.filter((r) => r.estado === 'resuelto');
  const reportesVisibles = vista === 'activos' ? reportesActivos : reportesResueltos;

  return (
    <div className="space-y-4">
      {/* Controles de pestaña (Botones secundarios accesibles con el pulgar) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-2 rounded-2xl border-2 border-stone-800">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setVista('activos')}
            className={`min-h-[48px] px-4 py-3 rounded-xl text-base font-black transition-colors cursor-pointer flex items-center justify-center gap-2 border-2 ${
              vista === 'activos'
                ? 'bg-amber-100 text-stone-950 border-stone-900 shadow-xs'
                : 'bg-stone-50 text-stone-900 border-stone-300 hover:bg-stone-100'
            }`}
          >
            <AlertCircle className="w-5 h-5 text-amber-900 shrink-0" aria-hidden="true" />
            <span>Activos ({reportesActivos.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setVista('resueltos')}
            className={`min-h-[48px] px-4 py-3 rounded-xl text-base font-black transition-colors cursor-pointer flex items-center justify-center gap-2 border-2 ${
              vista === 'resueltos'
                ? 'bg-emerald-100 text-stone-950 border-stone-900 shadow-xs'
                : 'bg-stone-50 text-stone-900 border-stone-300 hover:bg-stone-100'
            }`}
          >
            <CheckCircle2 className="w-5 h-5 text-emerald-900 shrink-0" aria-hidden="true" />
            <span>Resueltos ({reportesResueltos.length})</span>
          </button>
        </div>

        <span className="text-base text-stone-900 font-bold px-2 text-center sm:text-right">
          {vista === 'activos' ? 'Casos que necesitan limpieza' : 'Casos atendidos y limpios'}
        </span>
      </div>

      {/* ESTADO VACÍO: cuando no hay ningún dato o la pestaña está vacía */}
      {reportesVisibles.length === 0 ? (
        <div className="bg-white border-2 border-stone-800 rounded-2xl p-6 sm:p-10 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-stone-100 border-2 border-stone-800 text-stone-900 mx-auto flex items-center justify-center">
            <Inbox className="w-8 h-8" aria-hidden="true" />
          </div>

          <div className="space-y-2 max-w-lg mx-auto">
            <h3 className="text-xl sm:text-2xl font-black text-stone-950">
              {reportes.length === 0
                ? 'Todavía no hay ningún botadero registrado'
                : vista === 'activos'
                ? '¡Excelente noticia! No hay botaderos activos pendientes'
                : 'Todavía no hay botaderos resueltos'}
            </h3>

            {/* Frase que invita explícitamente a la primera acción */}
            <p className="text-base font-semibold text-stone-850 text-stone-900 leading-relaxed">
              {reportes.length === 0
                ? 'Sé el primero en documentar un botadero en tu comunidad para que la alcaldía pueda organizar su limpieza.'
                : vista === 'activos'
                ? 'Si descubrís un nuevo botadero clandestino en tu colonia, reportalo aquí para que podamos erradicarlo.'
                : 'Cuando la cuadrilla de limpieza atienda uno de los botaderos activos, cambiá su estado a "Resuelto" para guardarlo en este historial.'}
            </p>
          </div>

          {/* Botón que invita a la acción */}
          {onIniciarReporte && vista === 'activos' && (
            <div className="pt-2 flex justify-center">
              <button
                type="button"
                onClick={onIniciarReporte}
                className="w-full sm:w-auto min-h-[48px] px-8 py-3.5 rounded-xl bg-emerald-900 hover:bg-emerald-950 text-white text-base font-black shadow-md border-2 border-emerald-950 transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <PlusCircle className="w-5 h-5 shrink-0" aria-hidden="true" />
                <span>
                  {reportes.length === 0 ? 'Hacer el primer reporte' : 'Reportar un botadero'}
                </span>
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {reportesVisibles.map((reporte) => (
            <TarjetaReporte
              key={reporte.id}
              reporte={reporte}
              onCambiarEstado={onCambiarEstado}
              onActualizarDiagnostico={onActualizarDiagnostico}
            />
          ))}
        </div>
      )}
    </div>
  );
};
