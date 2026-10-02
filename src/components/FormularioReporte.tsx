/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { Camera, Image as ImageIcon, MapPin, FileText, X, Check, AlertCircle } from 'lucide-react';
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
   * de calidad media, evitando desbordar la cuota de localStorage.
   */
  const manejarSeleccionFoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorValidacion(null);
    const archivo = e.target.files?.[0];

    if (!archivo) {
      return;
    }

    // Validación: asegurarse que el archivo sea realmente una imagen
    if (!archivo.type.startsWith('image/')) {
      setErrorValidacion('El archivo seleccionado no es una imagen válida.');
      return;
    }

    setEstaCargandoFoto(true);
    try {
      const fotoOptimizada = await optimizarFoto(archivo);
      setFotoUrl(fotoOptimizada);
    } catch (err) {
      console.error(err);
      setErrorValidacion('Ocurrió un error al procesar y optimizar la imagen.');
    } finally {
      setEstaCargandoFoto(false);
    }
  };

  /**
   * PUNTO CRÍTICO DE ERROR #4: Limpiar el valor del input file.
   * Si no se resetea fileInputRef.current.value = '', el navegador NO disparará
   * el evento onChange si el usuario elimina la foto y vuelve a seleccionar exactamente la misma.
   */
  const eliminarFoto = () => {
    setFotoUrl('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const manejarEnvio = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorValidacion(null);

    // Validación de campos obligatorios
    if (!fotoUrl) {
      setErrorValidacion('Por favor selecciona o toma una foto del botadero para evidenciar el problema.');
      return;
    }

    if (!descripcion.trim()) {
      setErrorValidacion('Por favor escribe una descripción del botadero (tipo de basura, volumen, etc.).');
      return;
    }

    if (!ubicacion.trim()) {
      setErrorValidacion('Por favor indica la ubicación escrita (calle, colonia, punto de referencia).');
      return;
    }

    // Crear el nuevo reporte con estado 'abierto' por defecto y fecha actual
    const nuevoReporte: Reporte = {
      id: `rep-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      fotoUrl,
      descripcion: descripcion.trim(),
      ubicacion: ubicacion.trim(),
      estado: 'abierto', // Criterio de aceptación: siempre inicia como "abierto"
      fechaCreacion: obtenerFechaActualFormateada(),
    };

    onReporteCreado(nuevoReporte);

    // Limpiar formulario
    eliminarFoto();
    setDescripcion('');
    setUbicacion('');
  };

  return (
    <form onSubmit={manejarEnvio} className="bg-white border border-stone-200 rounded-xl p-5 shadow-sm space-y-5">
      <div className="border-b border-stone-100 pb-3">
        <h2 className="text-lg font-semibold text-stone-900 flex items-center gap-2">
          <Camera className="w-5 h-5 text-emerald-700" />
          Reportar un botadero ilegal
        </h2>
        <p className="text-sm text-stone-500 mt-0.5">
          Documentá el botadero para que la comunidad y la alcaldía puedan darle seguimiento.
        </p>
      </div>

      {/* Mensaje de error de validación */}
      {errorValidacion && (
        <div className="flex items-start gap-2.5 p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-800 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0 text-rose-600 mt-0.5" />
          <p>{errorValidacion}</p>
        </div>
      )}

      {/* 1. SECCIÓN DE FOTO CON VISTA PREVIA */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-stone-800">
          Foto del botadero <span className="text-rose-600">*</span>
        </label>

        {fotoUrl ? (
          /* Vista previa de la foto antes de guardar */
          <div className="relative rounded-lg overflow-hidden border border-stone-200 bg-stone-100 max-h-72 flex items-center justify-center group">
            <img
              src={fotoUrl}
              alt="Vista previa de la evidencia"
              className="w-full h-64 object-cover"
            />
            <div className="absolute top-2 right-2">
              <button
                type="button"
                onClick={eliminarFoto}
                className="bg-stone-900/80 hover:bg-stone-900 text-white p-2 rounded-lg backdrop-blur-xs transition-colors flex items-center gap-1.5 text-xs font-medium cursor-pointer shadow-md"
                title="Quitar foto"
              >
                <X className="w-4 h-4" />
                Cambiar foto
              </button>
            </div>
            <div className="absolute bottom-2 left-2 bg-stone-900/70 text-white text-xs px-2.5 py-1 rounded backdrop-blur-xs flex items-center gap-1">
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              Foto cargada correctamente
            </div>
          </div>
        ) : (
          /* Botón de carga o captura de imagen */
          <div className="border-2 border-dashed border-stone-300 hover:border-emerald-600 rounded-xl p-6 text-center transition-colors bg-stone-50/50">
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
              className="cursor-pointer flex flex-col items-center justify-center gap-2"
            >
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center">
                <Camera className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-stone-800">
                  {estaCargandoFoto ? 'Procesando imagen...' : 'Tomar foto o subir desde el celular / PC'}
                </p>
                <p className="text-xs text-stone-500 mt-1">
                  Formatos JPG, PNG o WEBP (máx. 8MB). Podrás ver la vista previa antes de guardar.
                </p>
              </div>
            </label>
          </div>
        )}
      </div>

      {/* 2. SECCIÓN DE DESCRIPCIÓN */}
      <div className="space-y-1.5">
        <label htmlFor="input-descripcion" className="block text-sm font-medium text-stone-800 flex items-center gap-1.5">
          <FileText className="w-4 h-4 text-stone-500" />
          Descripción del problema <span className="text-rose-600">*</span>
        </label>
        <textarea
          id="input-descripcion"
          rows={3}
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          placeholder="Ej: Acumulación de bolsas plásticas, ripio, restos de poda y recipientes que acumulan agua de lluvia..."
          className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 text-sm text-stone-900 placeholder:text-stone-400 bg-white"
        />
      </div>

      {/* 3. SECCIÓN DE UBICACIÓN ESCRITA */}
      <div className="space-y-1.5">
        <label htmlFor="input-ubicacion" className="block text-sm font-medium text-stone-800 flex items-center gap-1.5">
          <MapPin className="w-4 h-4 text-stone-500" />
          Ubicación escrita <span className="text-rose-600">*</span>
        </label>
        <input
          id="input-ubicacion"
          type="text"
          value={ubicacion}
          onChange={(e) => setUbicacion(e.target.value)}
          placeholder="Ej: Calle principal, colonia Las Flores, frente a la cancha"
          className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 text-sm text-stone-900 placeholder:text-stone-400 bg-white"
        />
        <p className="text-xs text-stone-500">
          Detallá puntos de referencia claros para que la cuadrilla de limpieza municipal pueda encontrar el lugar con facilidad.
        </p>
      </div>

      {/* BOTONES DE ACCIÓN */}
      <div className="pt-2 flex flex-col sm:flex-row items-center justify-end gap-2.5">
        {onCancelar && (
          <button
            type="button"
            onClick={onCancelar}
            className="w-full sm:w-auto px-4 py-2.5 rounded-lg border border-stone-300 text-stone-700 hover:bg-stone-100 text-sm font-medium transition-colors cursor-pointer"
          >
            Cancelar
          </button>
        )}
        <button
          type="submit"
          className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white text-sm font-medium shadow-sm transition-colors cursor-pointer flex items-center justify-center gap-2"
        >
          <Check className="w-4 h-4" />
          Guardar reporte
        </button>
      </div>
    </form>
  );
};
