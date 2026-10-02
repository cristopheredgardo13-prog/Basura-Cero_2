/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Optimiza y comprime una imagen antes de guardarla en localStorage.
 * 
 * Requerimiento:
 * - Máximo 800 píxeles de ancho (mantiene la proporción de aspecto).
 * - Formato JPEG con calidad media (0.7).
 * Esto reduce una imagen de celular de 4MB-10MB a aproximadamente 50KB-100KB,
 * permitiendo almacenar decenas de reportes con foto sin saturar la cuota de localStorage.
 */
export function optimizarFoto(archivo: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const lector = new FileReader();

    lector.onload = (evento) => {
      const resultado = evento.target?.result;
      if (typeof resultado !== 'string') {
        reject(new Error('No se pudo leer el archivo'));
        return;
      }

      const img = new Image();
      img.onload = () => {
        const MAX_ANCHO = 800;
        let ancho = img.width;
        let alto = img.height;

        // Si la imagen supera los 800px de ancho, redimensionamos proporcionalmente
        if (ancho > MAX_ANCHO) {
          alto = Math.round((alto * MAX_ANCHO) / ancho);
          ancho = MAX_ANCHO;
        }

        const canvas = document.createElement('canvas');
        canvas.width = ancho;
        canvas.height = alto;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('No se pudo inicializar el contexto de canvas'));
          return;
        }

        // Fondo blanco por si la imagen original tenía transparencias (PNG/WEBP)
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, ancho, alto);

        // Dibujamos la imagen escalada
        ctx.drawImage(img, 0, 0, ancho, alto);

        // Convertir a JPEG con calidad media (0.7)
        const imagenComprimida = canvas.toDataURL('image/jpeg', 0.7);
        resolve(imagenComprimida);
      };

      img.onerror = () => reject(new Error('Error al cargar la imagen en memoria'));
      img.src = resultado;
    };

    lector.onerror = () => reject(new Error('Error en el lector de archivos'));
    lector.readAsDataURL(archivo);
  });
}
