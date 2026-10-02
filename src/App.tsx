/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { PlusCircle, CheckCircle2, Download, AlertTriangle, X, Sparkles } from 'lucide-react';
import { Reporte, EstadoReporte } from './types/reporte';
import { obtenerFechaCorta } from './utils/fechas';
import { leerReportes, guardarReportes, exportarRespaldo } from './utils/almacenamiento';
import { FormularioReporte } from './components/FormularioReporte';
import { ListaReportes } from './components/ListaReportes';

export default function App() {
  /**
   * Carga inicial confiable desde almacenamiento local.
   * Si no hay registros previos, inicializa con los datos de prueba.
   */
  const [reportes, setReportes] = useState<Reporte[]>(() => leerReportes());
  const [mostrarFormulario, setMostrarFormulario] = useState<boolean>(false);
  const [mensajeExito, setMensajeExito] = useState<string | null>(null);
  const [errorAlmacenamiento, setErrorAlmacenamiento] = useState<string | null>(null);

  /**
   * Agrega un nuevo reporte y lo guarda de forma persistente.
   * Si falla el guardado, emite una alerta clara sin términos técnicos.
   */
  const agregarReporte = (nuevoReporte: Reporte) => {
    setErrorAlmacenamiento(null);
    const actualizados = [nuevoReporte, ...reportes];
    setReportes(actualizados);

    const resultado = guardarReportes(actualizados);
    if (!resultado.exito) {
      setErrorAlmacenamiento(
        resultado.error ||
          'No se pudo guardar el reporte de forma permanente en este dispositivo. Podría perderse si cierras el navegador.'
      );
    } else {
      setMensajeExito('¡El reporte se guardó correctamente! Ya aparece en la lista de casos activos.');
      setTimeout(() => setMensajeExito(null), 6000);
    }

    setMostrarFormulario(false);
  };

  /**
   * Actualiza el estado de un reporte registrando la fecha del cambio.
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
        resultado.error ||
          'El cambio de estado no se pudo guardar de forma permanente en este dispositivo.'
      );
    }
  };

  /**
   * Guarda el Sello de Evaluación Ambiental emitido por la IA para un reporte.
   */
  const actualizarDiagnosticoReporte = (id: string, diagnostico: any) => {
    const actualizados = reportes.map((r) =>
      r.id === id ? { ...r, diagnosticoIA: diagnostico } : r
    );
    setReportes(actualizados);
    guardarReportes(actualizados);
  };

  const totalActivos = reportes.filter((r) => r.estado !== 'resuelto').length;
  const totalAbiertos = reportes.filter((r) => r.estado === 'abierto').length;
  const totalAvisados = reportes.filter((r) => r.estado === 'avisado').length;

  const manejarExportacion = () => {
    try {
      exportarRespaldo(reportes);
      setMensajeExito('¡El archivo de respaldo se descargó en tu carpeta de descargas!');
      setTimeout(() => setMensajeExito(null), 5000);
    } catch {
      setErrorAlmacenamiento('No se pudo generar el archivo de respaldo en tu dispositivo.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-stone-100 text-stone-950 font-sans">
      {/* BARRA SUPERIOR INSTITUCIONAL (Accesible desde 320px de ancho y con una sola mano) */}
      <header className="bg-emerald-950 text-white border-b-2 border-black sticky top-0 z-30 shadow-md">
        <div className="max-w-5xl mx-auto p-3 sm:p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-900 border-2 border-emerald-400 flex items-center justify-center text-white font-black text-2xl shrink-0">
              BC
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white leading-tight">
                BASURA CERO
              </h1>
              <p className="text-base text-emerald-200 font-semibold leading-snug">
                Comunidad y Alcaldía en El Salvador
              </p>
            </div>
          </div>

          {/* CONTROLES DE LA BARRA: 1 botón principal por pantalla, los demás secundarios */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
            {/* Botón secundario: Exportar respaldo */}
            <button
              type="button"
              onClick={manejarExportacion}
              className="min-h-[48px] px-4 py-3 rounded-xl text-base font-bold bg-emerald-900/90 hover:bg-emerald-900 text-white border-2 border-emerald-600 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              title="Descargar una copia de todos los reportes a tu dispositivo"
            >
              <Download className="w-5 h-5 shrink-0" aria-hidden="true" />
              <span>Exportar respaldo</span>
            </button>

            {/*
              REGLA DE UN SOLO BOTÓN PRINCIPAL:
              - Si el formulario está CERRADO: este botón es el BOTÓN PRINCIPAL de la pantalla.
              - Si el formulario está ABIERTO: este botón pasa a ser SECUNDARIO ("Cerrar"),
                ya que el único botón principal de la pantalla pasa a ser "Guardar reporte" en el formulario.
            */}
            <button
              onClick={() => setMostrarFormulario(!mostrarFormulario)}
              className={`min-h-[48px] px-5 py-3 rounded-xl text-base font-black transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md ${
                mostrarFormulario
                  ? 'bg-transparent text-white border-2 border-white hover:bg-emerald-900'
                  : 'bg-white text-emerald-950 border-2 border-white hover:bg-stone-200'
              }`}
            >
              {mostrarFormulario ? (
                <>
                  <X className="w-5 h-5 shrink-0" aria-hidden="true" />
                  <span>Cerrar formulario</span>
                </>
              ) : (
                <>
                  <PlusCircle className="w-5 h-5 shrink-0 text-emerald-950" aria-hidden="true" />
                  <span>+ Reportar botadero</span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-3 sm:p-5 space-y-5">
        {/* BANNER DE PROPÓSITO CON ALTO CONTRASTE PARA LEER AL SOL */}
        <section className="bg-white border-2 border-stone-800 rounded-2xl p-4 sm:p-6 shadow-sm space-y-4">
          <div className="space-y-1.5">
            <span className="block text-base font-black uppercase tracking-wider text-emerald-900">
              Vigilancia Ambiental Ciudadana
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-stone-950 leading-snug">
              Los botaderos ilegales de basura crecen porque nadie los documenta.
            </h2>
            <p className="text-base text-stone-950 font-medium leading-relaxed">
              Tomá una foto, describí qué desechos hay e indicá la dirección exacta para coordinar con la cuadrilla municipal de recolección y mantener limpia nuestra comunidad.
            </p>
          </div>

          {/* Resumen de estados con contraste alto y texto >= 16px */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 border-t-2 border-stone-200">
            <div className="p-3 bg-rose-100 border-2 border-rose-900 rounded-xl flex items-center justify-between">
              <span className="text-base font-bold text-rose-950">Casos abiertos:</span>
              <span className="text-xl font-black text-rose-950">{totalAbiertos}</span>
            </div>
            <div className="p-3 bg-amber-100 border-2 border-amber-900 rounded-xl flex items-center justify-between">
              <span className="text-base font-bold text-amber-950">Avisados a alcaldía:</span>
              <span className="text-xl font-black text-amber-950">{totalAvisados}</span>
            </div>
            <div className="p-3 bg-stone-200 border-2 border-stone-800 rounded-xl flex items-center justify-between">
              <span className="text-base font-bold text-stone-950">Total activos:</span>
              <span className="text-xl font-black text-stone-950">{totalActivos}</span>
            </div>
          </div>

          {/* Notificación de funcionalidad de IA activa */}
          <div className="flex items-center gap-2 pt-3 border-t-2 border-stone-200 text-base font-bold text-emerald-950">
            <Sparkles className="w-5 h-5 text-emerald-900 shrink-0" aria-hidden="true" />
            <span>
              Evaluación Sanitaria con Gemini IA activa: cada reporte cuenta con diagnóstico de urgencia, vectores y equipo municipal recomendado.
            </span>
          </div>
        </section>

        {/* MENSAJE DE ERROR VISIBLE, EN ESPAÑOL Y SIN PALABRAS TÉCNICAS */}
        {errorAlmacenamiento && (
          <div
            role="alert"
            className="p-4 bg-rose-100 border-2 border-rose-900 rounded-2xl text-rose-950 text-base font-bold flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md"
          >
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-rose-900 shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <p className="font-black text-base">Aviso importante:</p>
                <p className="font-semibold text-base">{errorAlmacenamiento}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setErrorAlmacenamiento(null)}
              className="min-h-[44px] px-4 py-2 rounded-lg bg-rose-900 text-white font-bold text-base hover:bg-rose-950 transition-colors cursor-pointer self-end sm:self-auto"
            >
              Entendido
            </button>
          </div>
        )}

        {/* MENSAJE DE ÉXITO VISIBLE, EN ESPAÑOL Y SIN PALABRAS TÉCNICAS */}
        {mensajeExito && (
          <div
            role="status"
            className="p-4 bg-emerald-100 border-2 border-emerald-900 rounded-2xl text-emerald-950 text-base font-bold flex items-center gap-3 shadow-md"
          >
            <CheckCircle2 className="w-6 h-6 text-emerald-900 shrink-0" aria-hidden="true" />
            <span className="font-bold text-base">{mensajeExito}</span>
          </div>
        )}

        {/* FORMULARIO DE NUEVO REPORTE */}
        {mostrarFormulario && (
          <section>
            <FormularioReporte
              onReporteCreado={agregarReporte}
              onCancelar={() => setMostrarFormulario(false)}
            />
          </section>
        )}

        {/* LISTADO DE REPORTES ACTIVOS O VACÍO */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h2 className="text-xl sm:text-2xl font-black text-stone-950">
              Monitoreo de botaderos comunitarios
            </h2>
            {!mostrarFormulario && (
              <button
                type="button"
                onClick={() => setMostrarFormulario(true)}
                className="text-base font-black text-emerald-900 hover:text-emerald-950 underline decoration-2 flex items-center gap-1.5 cursor-pointer self-start sm:self-auto min-h-[44px]"
              >
                <PlusCircle className="w-5 h-5 shrink-0" aria-hidden="true" />
                <span>Registrar otro botadero</span>
              </button>
            )}
          </div>

          <ListaReportes
            reportes={reportes}
            onCambiarEstado={cambiarEstadoReporte}
            onIniciarReporte={() => setMostrarFormulario(true)}
            onActualizarDiagnostico={actualizarDiagnosticoReporte}
          />
        </section>
      </main>

      {/* PIE DE PÁGINA ACCESIBLE Y LEGIBLE */}
      <footer className="bg-stone-200 border-t-2 border-stone-400 py-6 text-center text-base text-stone-950 mt-auto font-medium">
        <div className="max-w-5xl mx-auto px-4 space-y-1.5">
          <p className="font-black text-stone-950 text-base">
            BASURA CERO · Iniciativa Comunitaria y Municipal en El Salvador
          </p>
          <p className="text-stone-900 text-base">
            Documentando la basura para proteger la salud de nuestras familias, ríos y quebradas.
          </p>
        </div>
      </footer>
    </div>
  );
}
