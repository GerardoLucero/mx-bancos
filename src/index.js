'use strict';

/**
 * Catálogo completo de bancos mexicanos con códigos CLABE, sucursales y validación
 * @author Gerardo Lucero
 * @version 1.0.0
 */

import { bancosData } from './bancos-data.js';

// Algoritmo para validar dígito verificador de CLABE
const FACTORES_CLABE = [3, 7, 1, 3, 7, 1, 3, 7, 1, 3, 7, 1, 3, 7, 1, 3, 7];

/**
 * Obtiene todos los bancos disponibles
 * @returns {Array} Lista de bancos
 */
export function getBancos() {
  return Object.values(bancosData.bancos).map(banco => ({
    ...banco,
    activo: true
  }));
}

/**
 * Busca un banco por su código
 * @param {string} codigo - Código del banco (3 dígitos)
 * @returns {Object|null} Información del banco o null
 */
export function buscarBanco(codigo) {
  if (!codigo || typeof codigo !== 'string') return null;
  
  const codigoLimpio = codigo.trim().padStart(3, '0');
  return bancosData.bancos[codigoLimpio] || null;
}

/**
 * Busca bancos por nombre (búsqueda parcial)
 * @param {string} nombre - Nombre a buscar
 * @returns {Array} Lista de bancos que coinciden
 */
export function buscarBancoPorNombre(nombre) {
  if (!nombre || typeof nombre !== 'string') return [];
  
  const nombreLimpio = nombre.toLowerCase().trim();
  const resultados = [];
  
  Object.values(bancosData.bancos).forEach(banco => {
    if (banco.nombre.toLowerCase().includes(nombreLimpio) ||
        banco.nombreCompleto.toLowerCase().includes(nombreLimpio) ||
        banco.nombreCorto.toLowerCase().includes(nombreLimpio)) {
      resultados.push(banco);
    }
  });
  
  return resultados;
}

/**
 * Valida una cuenta CLABE interbancaria
 * @param {string} clabe - Cuenta CLABE a validar
 * @returns {boolean} True si es válida
 */
export function validarCLABE(clabe) {
  if (!clabe || typeof clabe !== 'string') return false;
  
  const clabeClean = clabe.trim().replace(/[\s-]/g, '');
  
  // Debe tener exactamente 18 dígitos
  if (clabeClean.length !== 18 || !/^\d{18}$/.test(clabeClean)) {
    return false;
  }
  
  // Validar que el banco exista
  const codigoBanco = clabeClean.substring(0, 3);
  if (!bancosData.bancos[codigoBanco]) {
    return false;
  }
  
  // Validar dígito verificador
  return validarDigitoVerificadorCLABE(clabeClean);
}

/**
 * Valida el dígito verificador de una CLABE
 * @param {string} clabe - CLABE completa de 18 dígitos
 * @returns {boolean} True si el dígito verificador es correcto
 */
function validarDigitoVerificadorCLABE(clabe) {
  const primeros17 = clabe.substring(0, 17);
  const digitoVerificador = parseInt(clabe.charAt(17));
  
  let suma = 0;
  for (let i = 0; i < 17; i++) {
    suma += parseInt(primeros17.charAt(i)) * FACTORES_CLABE[i];
  }
  
  const residuo = suma % 10;
  const digitoCalculado = residuo === 0 ? 0 : 10 - residuo;
  
  return digitoCalculado === digitoVerificador;
}

/**
 * Extrae información detallada de una CLABE
 * @param {string} clabe - Cuenta CLABE válida
 * @returns {Object|null} Información extraída o null
 */
export function extraerInfoCLABE(clabe) {
  if (!validarCLABE(clabe)) return null;
  
  const clabeClean = clabe.trim().replace(/[\s-]/g, '');
  const codigoBanco = clabeClean.substring(0, 3);
  const codigoSucursal = clabeClean.substring(3, 6);
  const numeroCuenta = clabeClean.substring(6, 17);
  const digitoVerificador = clabeClean.substring(17, 18);
  
  return {
    clabe: clabeClean,
    banco: bancosData.bancos[codigoBanco],
    codigoBanco,
    codigoSucursal,
    numeroCuenta,
    digitoVerificador,
    esValida: true
  };
}

/**
 * Genera una CLABE válida (para testing)
 * @param {string} codigoBanco - Código del banco
 * @param {string} codigoSucursal - Código de sucursal
 * @param {string} numeroCuenta - Número de cuenta (11 dígitos)
 * @returns {string|null} CLABE generada o null si es inválida
 */
export function generarCLABE(codigoBanco, codigoSucursal, numeroCuenta) {
  if (!bancosData.bancos[codigoBanco]) return null;
  
  const codigoBancoLimpio = codigoBanco.padStart(3, '0');
  const codigoSucursalLimpio = codigoSucursal.padStart(3, '0');
  const numeroCuentaLimpio = numeroCuenta.padStart(11, '0');
  
  if (codigoSucursalLimpio.length !== 3 || numeroCuentaLimpio.length !== 11) {
    return null;
  }
  
  const base = codigoBancoLimpio + codigoSucursalLimpio + numeroCuentaLimpio;
  
  // Calcular dígito verificador
  let suma = 0;
  for (let i = 0; i < 17; i++) {
    suma += parseInt(base.charAt(i)) * FACTORES_CLABE[i];
  }
  
  const residuo = suma % 10;
  const digitoVerificador = residuo === 0 ? 0 : 10 - residuo;
  
  return base + digitoVerificador.toString();
}

/**
 * Formatea una CLABE para mejor legibilidad
 * @param {string} clabe - CLABE a formatear
 * @returns {string} CLABE formateada
 */
export function formatearCLABE(clabe) {
  if (!validarCLABE(clabe)) return clabe;
  
  const clabeClean = clabe.trim().replace(/[\s-]/g, '');
  return `${clabeClean.substring(0, 3)}-${clabeClean.substring(3, 6)}-${clabeClean.substring(6, 17)}-${clabeClean.substring(17, 18)}`;
}

/**
 * Obtiene estadísticas del catálogo
 * @returns {Object} Estadísticas
 */
export function getEstadisticas() {
  const bancos = Object.values(bancosData.bancos);
  const tiposBanco = {};
  
  bancos.forEach(banco => {
    tiposBanco[banco.tipo] = (tiposBanco[banco.tipo] || 0) + 1;
  });
  
  return {
    totalBancos: bancos.length,
    tiposBanco,
    ultimaActualizacion: bancosData.metadata.ultimaActualizacion,
    fuente: bancosData.metadata.fuente
  };
}

export default {
  getBancos,
  buscarBanco,
  buscarBancoPorNombre,
  validarCLABE,
  extraerInfoCLABE,
  generarCLABE,
  formatearCLABE,
  getEstadisticas
};
