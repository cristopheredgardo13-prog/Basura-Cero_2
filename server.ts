import express from 'express';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const app = express();
const port = 3000;

app.use(express.json({ limit: '10mb' }));

// Inicialización de GoogleGenAI del lado del servidor
const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

/**
 * Ejemplo de respuesta de prueba para desarrollar sin gastar llamadas de API
 */
export const diagnosticoPrueba = {
  nivelUrgencia: "ALTO",
  diasMaximosAtencion: 3,
  tipoVectores: ["Zancudos Aedes aegypti", "Moscas domésticas", "Cucarachas"],
  equipoRequerido: "Camión de 6 toneladas y cuadrilla de 3 operarios con rastrillos y bolsas",
  requiereFumigacion: true,
  resumenRiesgo: "Foco infeccioso con recipientes que acumulan agua de lluvia, generando alto riesgo de zancudos del dengue."
};

/**
 * Endpoint del Sello de Evaluación Ambiental con Gemini
 */
app.post('/api/evaluar-botadero', async (req, res) => {
  const { descripcion, ubicacion, modoPrueba } = req.body;

  // Si se fuerza modo prueba o si no hay API key configurada en el entorno
  if (modoPrueba || !ai) {
    return res.json({
      exito: true,
      datos: diagnosticoPrueba,
      fuente: !ai ? 'simulado_sin_apikey' : 'simulado_modo_prueba',
    });
  }

  try {
    const prompt = `Actúa como inspector de la Unidad Ambiental Municipal de El Salvador.
Analiza este botadero ilegal y clasifícalo para coordinar la limpieza:
- Descripción de los desechos: "${descripcion}"
- Ubicación / referencias: "${ubicacion}"

Devuelve estrictamente un objeto JSON con el esquema definido.`;

    const respuesta = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            nivelUrgencia: {
              type: Type.STRING,
              description: 'Nivel de urgencia: CRITICO, ALTO, MEDIO o BAJO',
            },
            diasMaximosAtencion: {
              type: Type.INTEGER,
              description: 'Plazo máximo de días sugeridos para que la cuadrilla retire los desechos',
            },
            tipoVectores: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Plagas o vectores asociados a este tipo de basura',
            },
            equipoRequerido: {
              type: Type.STRING,
              description: 'Maquinaria, herramientas y número de operarios recomendados',
            },
            requiereFumigacion: {
              type: Type.BOOLEAN,
              description: 'Si el sitio necesita fumigación sanitaria después de levantada la basura',
            },
            resumenRiesgo: {
              type: Type.STRING,
              description: 'Evaluación técnica sintetizada del peligro ambiental y sanitario',
            },
          },
          required: [
            'nivelUrgencia',
            'diasMaximosAtencion',
            'tipoVectores',
            'equipoRequerido',
            'requiereFumigacion',
            'resumenRiesgo',
          ],
        },
      },
    });

    const texto = respuesta.text?.trim();
    if (!texto) {
      throw new Error('La respuesta devuelta por la IA está vacía');
    }

    const datosParseados = JSON.parse(texto);
    return res.json({
      exito: true,
      datos: datosParseados,
      fuente: 'gemini_api',
    });
  } catch (error: any) {
    console.error('Error al generar diagnóstico con Gemini:', error);
    return res.status(500).json({
      exito: false,
      error: 'No se pudo obtener el diagnóstico con IA en este momento.',
      detalle: error.message || 'Error de conexión con el servicio',
    });
  }
});

async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static('dist'));
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Servidor Basura Cero listo en http://localhost:${port}`);
  });
}

startServer();
