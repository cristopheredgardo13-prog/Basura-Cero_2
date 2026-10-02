/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { Camera, MapPin, FileText, X, Check, AlertCircle } from 'lucide-react';
import { Reporte } from '../types/reporte';
import { obtenerFechaActualFormateada } from '../utils/fechas';
import { optimizarFoto } from '../utils/imagenes';

interface FormularioReporteProps {
  onReporteCreado: (nuevoReporte: Reporte) => void;
  onCancelar?: () => void;
}

export const FormularioReporte: React.FC<FormularioReporteProps> = ({ onReporteCreado, onCancelar }) => {
  const [fotoUrl, setFotoUrl] = useState<string>('');
  const [descripcion, setDescripcion] = useState<string>('');
  const [ubicacion, setUbicacion] = useState<string>('');
  const [errorValidacion, setErrorValidacion] = useState<string | null>(null);
  const [estaCargandoFoto, setEstaCargandoFoto] = useState<boolean>(false);

  // Referencia al input file para poder limpiarlo por completo si el usuario cancela la foto
  const fileInputRef = useRef<HTMLInputElement>(null);

  /**
   * Optimización automática de la fotografía antes de guardarla.
   * Reduce las dimensiones a un máximo de 800px de ancho y convierte a formato JPEG
   * de calidad media, evitando desbordar la memoria de almacenamiento.
   */
  const manejarSeleccionFoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorValidacion(null);
    const archivo = e.target.files?.[0];

    if (!archivo) {
      return;
    }

    // Validación sin términos técnicos: comprobar si es imagen
    if (!archivo.type.startsWith('image/')) {
      setErrorValidacion('El archivo que seleccionaste no es una foto válida. Por favor elige una imagen.');
      return;
    }

    setEstaCargandoFoto(true);
    try {
      const fotoOptimizada = await optimizarFoto(archivo);
      setFotoUrl(fotoOptimizada);
    } catch {
      setErrorValidacion('Hubo un problema al procesar la foto. Por favor intenta tomar otra.');
    } finally {
      setEstaCargandoFoto(false);
    }
  };

  const eliminarFoto = () => {
    setFotoUrl('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const manejarEnvio = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorValidacion(null);

    // Validación de campos obligatorios con mensajes claros y cotidianos
    if (!fotoUrl) {
      setErrorValidacion('Por favor toma o sube una foto del botadero para poder registrarlo.');
      return;
    }

    if (!descripcion.trim()) {
      setErrorValidacion('Por favor escribe qué tipo de basura o desechos hay en el lugar.');
      return;
    }

    if (!ubicacion.trim()) {
      setErrorValidacion('Por favor escribe la dirección o un punto de referencia para encontrar el lugar.');
      return;
    }

    // Crear el nuevo reporte con estado 'abierto' por defecto y fecha actual
    const nuevoReporte: Reporte = {
      id: `rep-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      fotoUrl,
      descripcion: descripcion.trim(),
      ubicacion: ubicacion.trim(),
      estado: 'abierto',
      fechaCreacion: obtenerFechaActualFormateada(),
    };

    onReporteCreado(nuevoReporte);

    // Limpiar formulario
    eliminarFoto();
    setDescripcion('');
    setUbicacion('');
  };

  return (
    <form
      onSubmit={manejarEnvio}
      className="bg-white border-2 border-stone-900 rounded-2xl p-4 sm:p-6 shadow-md space-y-6 max-w-full"
    >
      <div className="border-b-2 border-stone-200 pb-4">
        <h2 className="text-xl sm:text-2xl font-black text-stone-950 flex items-center gap-2">
          <Camera className="w-6 h-6 text-emerald-900 shrink-0" aria-hidden="true" />
          <span>Reportar un botadero ilegal</span>
        </h2>
        <p className="text-base text-stone-900 font-medium mt-1">
          Llená estos datos para que la unidad ambiental de la alcaldía organice la recolección.
        </p>
      </div>

      {/* Mensaje de error visible en caso de faltar información */}
      {errorValidacion && (
        <div
          role="alert"
          className="flex items-start gap-3 p-4 bg-rose-100 border-2 border-rose-800 rounded-xl text-rose-950 text-base font-bold"
        >
          <AlertCircle className="w-6 h-6 shrink-0 text-rose-800 mt-0.5" aria-hidden="true" />
          <div>
            <p className="font-black text-base">Atención:</p>
            <p className="font-semibold text-base">{errorValidacion}</p>
          </div>
        </div>
      )}

      {/* 1. SECCIÓN DE FOTO CON ETIQUETA VISIBLE Y VISTA PREVIA */}
      <div className="space-y-2">
        <label
          htmlFor="input-foto"
          className="block text-base font-bold text-stone-950"
        >
          Foto de la basura o botadero <span className="text-rose-800 font-bold">(Obligatorio)</span>
        </label>
        <p className="text-base text-stone-800 font-normal">
          Mostrá claramente los desechos para que la cuadrilla sepa qué equipo llevar.
        </p>

        {fotoUrl ? (
          /* Vista previa de la foto antes de guardar */
          <div className="rounded-xl overflow-hidden border-2 border-stone-900 bg-stone-100 relative">
            <img
              src={fotoUrl}
              alt="Vista previa de la foto que vas a guardar"
              className="w-full max-h-72 object-cover block"
            />
            <div className="p-3 bg-stone-900 text-white flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <span className="flex items-center gap-2 text-base font-bold text-emerald-300">
                <Check className="w-5 h-5 shrink-0 text-emerald-400" aria-hidden="true" />
                Foto lista para guardar
              </span>
              {/* Botón secundario para cambiar foto */}
              <button
                type="button"
                onClick={eliminarFoto}
                className="min-h-[48px] px-4 py-2.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-white text-base font-bold border-2 border-stone-400 flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <X className="w-5 h-5" aria-hidden="true" />
                Cambiar foto
              </button>
            </div>
          </div>
        ) : (
          /* Botón grande para captura de imagen con el dedo */
          <div className="border-2 border-dashed border-stone-800 hover:border-emerald-900 rounded-xl p-6 text-center transition-colors bg-stone-50">
            <input
              ref={fileInputRef}
              type="file"
              id="input-foto"
              accept="image/*"
              capture="environment"
              onChange={manejarSeleccionFoto}
              className="hidden"
            />
            <label
              htmlFor="input-foto"
              className="cursor-pointer flex flex-col items-center justify-center gap-3 min-h-[96px]"
            >
              <div className="w-14 h-14 rounded-full bg-emerald-100 border-2 border-emerald-900 text-emerald-950 flex items-center justify-center">
                <Camera className="w-7 h-7" aria-hidden="true" />
              </div>
              <div>
                <span className="block text-base font-bold text-stone-950 underline decoration-2">
                  {estaCargandoFoto ? 'Procesando foto...' : 'Tocar aquí para tomar foto o elegir archivo'}
                </span>
                <span className="block text-base text-stone-800 mt-1 font-normal">
                  Podrás ver cómo queda antes de guardar el reporte.
                </span>
              </div>
            </label>
          </div>
        )}
      </div>

      {/* 2. SECCIÓN DE DESCRIPCIÓN CON ETIQUETA VISIBLE */}
      <div className="space-y-2">
        <label
          htmlFor="input-descripcion"
          className="block text-base font-bold text-stone-950 flex items-center gap-2"
        >
          <FileText className="w-5 h-5 text-stone-900 shrink-0" aria-hidden="true" />
          <span>Descripción del problema</span>
          <span className="text-rose-800 font-bold">(Obligatorio)</span>
        </label>
        <p className="text-base text-stone-800 font-normal">
          Contanos qué hay tirado: bolsas plásticas, ramas, ripio, animales muertos o llantas.
        </p>
        <textarea
          id="input-descripcion"
          rows={3}
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          placeholder="Ejemplo: Gran acumulación de bolsas con basura de casas, ramas secas y llantas cerca de la cuneta."
          className="w-full p-3.5 rounded-xl border-2 border-stone-800 focus:outline-none focus:ring-4 focus:ring-emerald-900/20 focus:border-emerald-900 text-base text-stone-950 placeholder:text-stone-600 bg-white font-medium"
        />
      </div>

      {/* 3. SECCIÓN DE UBICACIÓN ESCRITA CON ETIQUETA VISIBLE */}
      <div className="space-y-2">
        <label
          htmlFor="input-ubicacion"
          className="block text-base font-bold text-stone-950 flex items-center gap-2"
        >
          <MapPin className="w-5 h-5 text-stone-900 shrink-0" aria-hidden="true" />
          <span>Ubicación escrita y puntos de referencia</span>
          <span className="text-rose-800 font-bold">(Obligatorio)</span>
        </label>
        <p className="text-base text-stone-800 font-normal">
          Indicá la calle, colonia y señas fáciles para que la cuadrilla llegue directo.
        </p>
        <input
          id="input-ubicacion"
          type="text"
          value={ubicacion}
          onChange={(e) => setUbicacion(e.target.value)}
          placeholder="Ejemplo: Calle principal, colonia Las Flores, frente a la cancha comunal"
          className="w-full p-3.5 rounded-xl border-2 border-stone-800 focus:outline-none focus:ring-4 focus:ring-emerald-900/20 focus:border-emerald-900 text-base text-stone-950 placeholder:text-stone-600 bg-white font-medium"
        />
      </div>

      {/* BOTONES DE ACCIÓN: UN SOLO BOTÓN PRINCIPAL ("Guardar reporte"), EL OTRO SECUNDARIO */}
      <div className="pt-2 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-3">
        {onCancelar && (
          <button
            type="button"
            onClick={onCancelar}
            className="w-full sm:w-auto min-h-[48px] px-6 py-3.5 rounded-xl border-2 border-stone-800 bg-white hover:bg-stone-100 text-stone-950 text-base font-bold transition-colors cursor-pointer text-center"
          >
            Cancelar y volver
          </button>
        )}
        <button
          type="submit"
          className="w-full sm:w-auto min-h-[48px] px-8 py-3.5 rounded-xl bg-emerald-900 hover:bg-emerald-950 text-white text-base font-black shadow-md border-2 border-emerald-950 transition-colors cursor-pointer flex items-center justify-center gap-2 text-center"
        >
          <Check className="w-5 h-5 shrink-0" aria-hidden="true" />
          <span>Guardar reporte</span>
        </button>
      </div>
    </form>
  );
};
