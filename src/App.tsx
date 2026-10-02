/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { PlusCircle, ShieldAlert, Sparkles, Trash2, CheckCircle2, AlertCircle, Download, AlertTriangle } from 'lucide-react';
import { Reporte, EstadoReporte } from './types/reporte';
import { reportesIniciales } from './data/seed';
import { obtenerFechaCorta } from './utils/fechas';
import { leerReportes, guardarReportes, exportarRespaldo } from './utils/almacenamiento';
import { FormularioReporte } from './components/FormularioReporte';
import { ListaReportes } from './components/ListaReportes';

export default function App() {
  /**
   * Carga inicial confiable desde localStorage.
   * Si no hay datos, retorna los reportes de ejemplo precargados.
   */
  const [reportes, setReportes] = useState<Reporte[]>(() => leerReportes());
  const [mostrarFormulario, setMostrarFormulario] = useState<boolean>(false);
  const [mensajeExito, setMensajeExito] = useState<string | null>(null);
  const [errorAlmacenamiento, setErrorAlmacenamiento] = useState<string | null>(null);

  /**
   * Guarda un nuevo reporte de forma inmutable y lo persiste en localStorage.
   * Si localStorage falla por cuota u otro error, se alerta visiblemente al usuario.
   */
  const agregarReporte = (nuevoReporte: Reporte) => {
    setErrorAlmacenamiento(null);
    const actualizados = [nuevoReporte, ...reportes];
    setReportes(actualizados);

    const resultado = guardarReportes(actualizados);
    if (!resultado.exito) {
      setErrorAlmacenamiento(
        resultado.error || 'El reporte no se pudo guardar de forma permanente en el dispositivo.'
      );
    } else {
      setMensajeExito('¡Reporte guardado con éxito! Aparece ahora en la lista de reportes activos.');
      setTimeout(() => setMensajeExito(null), 5000);
    }

    setMostrarFormulario(false);
  };

  /**
   * Actualiza el estado del reporte con su fecha de cambio y lo guarda en localStorage.
   */
  const cambiarEstadoReporte = (id: string, nuevoEstado: EstadoReporte) => {
    setErrorAlmacenamiento(null);
    const prefijo = nuevoEstado === 'abierto' ? 'Abierto' : nuevoEstado === 'avisado' ? 'Avisado' : 'Resuelto';
    const fechaTexto = `${prefijo} el ${obtenerFechaCorta()}`;

    const actualizados = reportes.map((r) =>
      r.id === id
        ? {
            ...r,
            estado: nuevoEstado,
            fechaCambioEstado: fechaTexto,
          }
        : r
    );
    setReportes(actualizados);

    const resultado = guardarReportes(actualizados);
    if (!resultado.exito) {
      setErrorAlmacenamiento(
        resultado.error || 'El cambio de estado no se pudo guardar de forma permanente en el dispositivo.'
      );
    }
  };

  const totalActivos = reportes.filter((r) => r.estado !== 'resuelto').length;
  const totalAbiertos = reportes.filter((r) => r.estado === 'abierto').length;
  const totalAvisados = reportes.filter((r) => r.estado === 'avisado').length;

  return (
    <div className="min-h-screen flex flex-col bg-stone-100 text-stone-900 selection:bg-emerald-200">
      {/* BARRA SUPERIOR INSTITUCIONAL Y COMUNITARIA */}
      <header className="bg-emerald-900 text-white border-b border-emerald-950 sticky top-0 z-30 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-800 border border-emerald-700/60 flex items-center justify-center text-emerald-200 font-black text-xl">
              BC
            </div>
            <div>
              <h1 className="text-lg md:text-xl font-bold tracking-tight text-white leading-tight">
                BASURA CERO
              </h1>
              <p className="text-xs text-emerald-300 hidden sm:block">
                Unidad Ambiental Municipal y Red de Vecinos Vigilantes · El Salvador
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* BOTÓN EXPORTAR RESPALDO */}
            <button
              type="button"
              onClick={() => exportarRespaldo(reportes)}
              className="px-3 py-2 rounded-lg text-xs md:text-sm font-medium bg-emerald-800/80 hover:bg-emerald-800 text-emerald-100 hover:text-white border border-emerald-700/60 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
              title="Descargar archivo JSON con todos los reportes"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Exportar respaldo</span>
              <span className="sm:hidden">Respaldo</span>
            </button>

            <button
              onClick={() => setMostrarFormulario(!mostrarFormulario)}
              className={`px-3.5 py-2 rounded-lg text-xs md:text-sm font-semibold transition-colors flex items-center gap-2 cursor-pointer shadow-xs ${
                mostrarFormulario
                  ? 'bg-emerald-950 text-emerald-200 hover:bg-black'
                  : 'bg-emerald-700 hover:bg-emerald-600 text-white'
              }`}
            >
              <PlusCircle className="w-4 h-4" />
              <span>{mostrarFormulario ? 'Cerrar' : 'Nuevo reporte'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-6 space-y-6">
        {/* Banner de propósito comunitario */}
        <section className="bg-white border border-stone-200 rounded-xl p-4 md:p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-semibold tracking-wider uppercase text-emerald-800">
              Vigilancia Ambiental Comunitaria
            </span>
            <h2 className="text-base md:text-lg font-bold text-stone-900">
              Los botaderos ilegales de basura crecen porque nadie los documenta.
            </h2>
            <p className="text-xs md:text-sm text-stone-600 leading-relaxed max-w-2xl">
              Tomá una foto, describí el problema e indicá la dirección exacta para coordinar con la cuadrilla municipal de recolección y erradicar los focos de contaminación.
            </p>
          </div>

          {/* Resumen numérico rápido */}
          <div className="flex items-center gap-3 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-stone-100">
            <div className="px-3 py-2 bg-rose-50 border border-rose-100 rounded-lg text-center">
              <span className="block text-xs font-medium text-rose-700">Abiertos</span>
              <span className="text-lg font-bold text-rose-900">{totalAbiertos}</span>
            </div>
            <div className="px-3 py-2 bg-amber-50 border border-amber-100 rounded-lg text-center">
              <span className="block text-xs font-medium text-amber-700">Avisados</span>
              <span className="text-lg font-bold text-amber-900">{totalAvisados}</span>
            </div>
            <div className="px-3 py-2 bg-stone-100 border border-stone-200 rounded-lg text-center">
              <span className="block text-xs font-medium text-stone-700">Total activos</span>
              <span className="text-lg font-bold text-stone-900">{totalActivos}</span>
            </div>
          </div>
        </section>

        {/* ALERTA DE ERROR DE ALMACENAMIENTO */}
        {errorAlmacenamiento && (
          <div className="p-4 bg-rose-50 border border-rose-300 rounded-xl text-rose-900 text-sm flex items-start gap-2.5">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold">Aviso de almacenamiento permanente:</p>
              <p>{errorAlmacenamiento}</p>
            </div>
            <button
              onClick={() => setErrorAlmacenamiento(null)}
              className="text-rose-700 hover:text-rose-900 text-xs font-semibold cursor-pointer underline"
            >
              Cerrar
            </button>
          </div>
        )}

        {/* Notificación de éxito temporal */}
        {mensajeExito && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 text-sm font-medium flex items-center gap-2.5 animate-fadeIn">
            <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
            <span>{mensajeExito}</span>
          </div>
        )}

        {/* Formulario de nuevo reporte (desplegable o directo) */}
        {mostrarFormulario && (
          <section className="transition-all">
            <FormularioReporte
              onReporteCreado={agregarReporte}
              onCancelar={() => setMostrarFormulario(false)}
            />
          </section>
        )}

        {/* Lista de reportes activos */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-stone-900">
              Monitoreo y seguimiento de botaderos
            </h2>
            {!mostrarFormulario && (
              <button
                type="button"
                onClick={() => setMostrarFormulario(true)}
                className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 flex items-center gap-1 cursor-pointer"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                Reportar otro botadero
              </button>
            )}
          </div>

          <ListaReportes
            reportes={reportes}
            onCambiarEstado={cambiarEstadoReporte}
          />
        </section>
      </main>

      {/* PIE DE PÁGINA */}
      <footer className="bg-stone-200/80 border-t border-stone-300 py-6 text-center text-xs text-stone-600 mt-auto">
        <div className="max-w-5xl mx-auto px-4 space-y-1">
          <p className="font-semibold text-stone-800">
            BASURA CERO · Iniciativa Comunitaria y Municipal en El Salvador
          </p>
          <p>
            Documentando la basura para proteger la salud de nuestras familias, ríos y quebradas.
          </p>
        </div>
      </footer>
    </div>
  );
}
