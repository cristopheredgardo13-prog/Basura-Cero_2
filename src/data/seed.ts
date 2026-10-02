/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Reporte } from '../types/reporte';

// Imágenes SVG en formato Data URI para que la app funcione 100% offline y sin llamadas a servicios externos
const svgFoto1 = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="600" height="400" fill="%23e2e8f0"/><rect x="40" y="240" width="520" height="130" fill="%2394a3b8" rx="8"/><circle cx="160" cy="270" r="45" fill="%2364748b"/><circle cx="230" cy="285" r="35" fill="%23475569"/><rect x="290" y="250" width="90" height="70" fill="%2378716c" rx="4"/><polygon points="400,320 450,220 500,320" fill="%23a8a29e"/><text x="300" y="160" font-family="sans-serif" font-size="20" font-weight="bold" fill="%23334155" text-anchor="middle">Foto de evidencia: Botadero calle principal</text><text x="300" y="190" font-family="sans-serif" font-size="14" fill="%2364748b" text-anchor="middle">Bolsas plásticas, ripio y restos de poda</text></svg>`;

const svgFoto2 = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="600" height="400" fill="%23f1f5f9"/><rect x="50" y="230" width="500" height="140" fill="%23cbd5e1" rx="6"/><circle cx="180" cy="290" r="50" fill="%23334155"/><circle cx="180" cy="290" r="22" fill="%23f1f5f9"/><circle cx="280" cy="290" r="50" fill="%23334155"/><circle cx="280" cy="290" r="22" fill="%23f1f5f9"/><rect x="360" y="260" width="120" height="60" fill="%23b45309" rx="4"/><text x="300" y="150" font-family="sans-serif" font-size="20" font-weight="bold" fill="%231e293b" text-anchor="middle">Foto de evidencia: Llantas y desechos</text><text x="300" y="180" font-family="sans-serif" font-size="14" fill="%2364748b" text-anchor="middle">Pasaje 4, cerca de la quebrada</text></svg>`;

/**
 * Reportes iniciales en memoria para que la aplicación muestre datos desde el primer inicio
 * y permita probar de inmediato la lista de activos y el cambio de estado.
 */
export const reportesIniciales: Reporte[] = [
  {
    id: 'rep-001',
    fotoUrl: svgFoto1,
    descripcion: 'Acumulación de bolsas de basura, ripio y ramas que obstaculizan el paso peatonal en la cuneta.',
    ubicacion: 'Calle principal, colonia Las Flores, frente a la cancha',
    estado: 'abierto',
    fechaCreacion: '2 de octubre de 2026',
    diagnosticoIA: {
      nivelUrgencia: 'ALTO',
      diasMaximosAtencion: 3,
      tipoVectores: ['Zancudos', 'Moscas comunes', 'Roedores'],
      equipoRequerido: 'Camión recolector de 6T y cuadrilla de 3 operarios con palas',
      requiereFumigacion: true,
      resumenRiesgo: 'Obstrucción de cuneta con agua estancada, generando alto riesgo de criaderos de zancudos frente a la cancha comunal.',
      fuente: 'gemini_api',
    },
  },
  {
    id: 'rep-002',
    fotoUrl: svgFoto2,
    descripcion: 'Llantas usadas y desechos comerciales acumulados a la orilla del camino, propensos a criaderos de zancudos.',
    ubicacion: 'Avenida Monseñor Romero, pasaje 4, a 50 metros del puente',
    estado: 'avisado',
    fechaCreacion: '1 de octubre de 2026',
    fechaCambioEstado: 'Avisado el 01/10/2026',
    diagnosticoIA: {
      nivelUrgencia: 'CRITICO',
      diasMaximosAtencion: 1,
      tipoVectores: ['Zancudos Aedes aegypti (Dengue)', 'Culebras', 'Alacranes'],
      equipoRequerido: 'Camión plataforma para retiro de llantas y equipo de termonebulización',
      requiereFumigacion: true,
      resumenRiesgo: 'Las llantas con agua estancada constituyen el criadero principal de dengue en la zona.',
      fuente: 'gemini_api',
    },
  },
];
