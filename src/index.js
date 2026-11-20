import catalogo from './catalogo.js';

const PESOS = [3, 7, 1];
const POR_CODIGO = new Map(catalogo.bancos.map((b) => [b.codigo, b]));
const POR_CLAVE_SPEI = new Map(catalogo.bancos.map((b) => [b.claveSpei, b]));

const copia = (banco) => (banco ? { ...banco } : null);

const normalizar = (texto) =>
  texto.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/\s+/g, ' ').trim();

const limpiarCLABE = (clabe) =>
  typeof clabe === 'string' ? clabe.replace(/[\s-]/g, '') : '';

/** Todas las instituciones participantes de SPEI. */
export function getBancos() {
  return catalogo.bancos.map(copia);
}

/**
 * Busca una institucion por su codigo CLABE de 3 digitos ('012' o 12)
 * o por su clave SPEI de 5 digitos ('40012').
 */
export function buscarBanco(codigo) {
  if (typeof codigo === 'number' && Number.isInteger(codigo) && codigo >= 0) codigo = String(codigo);
  if (typeof codigo !== 'string') return null;
  const limpio = codigo.trim();
  if (!/^\d{1,5}$/.test(limpio)) return null;
  if (limpio.length > 3) return copia(POR_CLAVE_SPEI.get(limpio));
  return copia(POR_CODIGO.get(limpio.padStart(3, '0')));
}

/** Busca instituciones cuyo nombre contenga el texto, sin importar acentos ni mayusculas. */
export function buscarBancoPorNombre(texto) {
  if (typeof texto !== 'string' || !texto.trim()) return [];
  const buscado = normalizar(texto);
  return catalogo.bancos.filter((b) => normalizar(b.nombre).includes(buscado)).map(copia);
}

/** Digito verificador (0-9) de los primeros 17 digitos de una CLABE. */
export function calcularDigitoVerificador(primeros17) {
  if (typeof primeros17 !== 'string' || !/^\d{17}$/.test(primeros17)) {
    throw new Error('Se esperan exactamente 17 digitos');
  }
  let suma = 0;
  for (let i = 0; i < 17; i++) suma += (Number(primeros17[i]) * PESOS[i % 3]) % 10;
  return (10 - (suma % 10)) % 10;
}

/**
 * True si la CLABE tiene 18 digitos, su digito verificador es correcto y,
 * salvo que se pida lo contrario, su codigo de banco es un participante vigente de SPEI.
 */
export function validarCLABE(clabe, { verificarBanco = true } = {}) {
  const limpia = limpiarCLABE(clabe);
  if (!/^\d{18}$/.test(limpia)) return false;
  if (calcularDigitoVerificador(limpia.slice(0, 17)) !== Number(limpia[17])) return false;
  return !verificarBanco || POR_CODIGO.has(limpia.slice(0, 3));
}

/** Partes de una CLABE valida y la institucion que la emite; null si no es valida. */
export function extraerInfoCLABE(clabe) {
  if (!validarCLABE(clabe, { verificarBanco: false })) return null;
  const limpia = limpiarCLABE(clabe);
  return {
    clabe: limpia,
    codigoBanco: limpia.slice(0, 3),
    codigoPlaza: limpia.slice(3, 6),
    numeroCuenta: limpia.slice(6, 17),
    digitoVerificador: limpia.slice(17),
    banco: copia(POR_CODIGO.get(limpia.slice(0, 3)))
  };
}

/**
 * Arma una CLABE con su digito verificador. Util para datos de prueba.
 * Devuelve null si el banco no participa en SPEI o si las partes no son digitos.
 */
export function generarCLABE(codigoBanco, codigoPlaza, numeroCuenta) {
  const partes = [codigoBanco, codigoPlaza, numeroCuenta].map((p) => (typeof p === 'number' ? String(p) : p));
  if (partes.some((p) => typeof p !== 'string' || !/^\d+$/.test(p))) return null;
  const [banco, plaza, cuenta] = partes;
  if (banco.length > 3 || plaza.length > 3 || cuenta.length > 11) return null;
  const codigo = banco.padStart(3, '0');
  if (!POR_CODIGO.has(codigo)) return null;
  const base = codigo + plaza.padStart(3, '0') + cuenta.padStart(11, '0');
  return base + calcularDigitoVerificador(base);
}

/** '002180000118359710' -> '002 180 00011835971 0'. Devuelve la entrada sin cambios si no es una CLABE valida. */
export function formatearCLABE(clabe) {
  if (!validarCLABE(clabe, { verificarBanco: false })) return clabe;
  const l = limpiarCLABE(clabe);
  return `${l.slice(0, 3)} ${l.slice(3, 6)} ${l.slice(6, 17)} ${l.slice(17)}`;
}

/** Totales del catalogo por tipo de institucion. */
export function getEstadisticas() {
  const porTipo = {};
  for (const b of catalogo.bancos) porTipo[b.tipo] = (porTipo[b.tipo] ?? 0) + 1;
  return { totalBancos: catalogo.bancos.length, porTipo, fechaCatalogo: catalogo.fecha };
}

/** Fuente, URL y fecha del catalogo incluido. */
export function infoCatalogo() {
  return { fuente: catalogo.fuente, url: catalogo.url, fecha: catalogo.fecha };
}

export default {
  getBancos,
  buscarBanco,
  buscarBancoPorNombre,
  calcularDigitoVerificador,
  validarCLABE,
  extraerInfoCLABE,
  generarCLABE,
  formatearCLABE,
  getEstadisticas,
  infoCatalogo
};
