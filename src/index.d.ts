export type TipoInstitucion =
  | 'Banca múltiple'
  | 'Banca de desarrollo'
  | 'Participante no bancario'
  | 'Banco central';

export interface Banco {
  /** Codigo de 3 digitos con el que empieza la CLABE ('012'). */
  codigo: string;
  /** Clave de la institucion en SPEI ('40012'). */
  claveSpei: string;
  /** Nombre tal como lo publica Banxico. */
  nombre: string;
  tipo: TipoInstitucion;
}

export interface InfoCLABE {
  clabe: string;
  codigoBanco: string;
  codigoPlaza: string;
  numeroCuenta: string;
  digitoVerificador: string;
  /** null si el codigo de banco ya no participa en SPEI. */
  banco: Banco | null;
}

export interface Estadisticas {
  totalBancos: number;
  porTipo: Partial<Record<TipoInstitucion, number>>;
  /** AAAA-MM-DD */
  fechaCatalogo: string;
}

export interface InfoCatalogo {
  fuente: string;
  url: string;
  fecha: string;
}

/** Todas las instituciones participantes de SPEI. */
export function getBancos(): Banco[];
/** Por codigo CLABE de 3 digitos ('012' o 12) o clave SPEI de 5 digitos ('40012'). */
export function buscarBanco(codigo: string | number): Banco | null;
/** Nombre que contenga el texto, sin importar acentos ni mayusculas. */
export function buscarBancoPorNombre(texto: string): Banco[];
/** Digito verificador de los primeros 17 digitos. Lanza Error si no son 17 digitos. */
export function calcularDigitoVerificador(primeros17: string): number;
/** 18 digitos, digito verificador correcto y (por defecto) banco vigente en SPEI. */
export function validarCLABE(clabe: string, opciones?: { verificarBanco?: boolean }): boolean;
/** Partes de la CLABE; null si no tiene 18 digitos o el verificador no cuadra. */
export function extraerInfoCLABE(clabe: string): InfoCLABE | null;
/** CLABE con digito verificador, o null si el banco no participa en SPEI o las partes no son digitos. */
export function generarCLABE(
  codigoBanco: string | number,
  codigoPlaza: string | number,
  numeroCuenta: string | number
): string | null;
/** 'BBB PPP CCCCCCCCCCC V'; la entrada sin cambios si no es valida. */
export function formatearCLABE(clabe: string): string;
export function getEstadisticas(): Estadisticas;
export function infoCatalogo(): InfoCatalogo;

declare const _default: {
  getBancos: typeof getBancos;
  buscarBanco: typeof buscarBanco;
  buscarBancoPorNombre: typeof buscarBancoPorNombre;
  calcularDigitoVerificador: typeof calcularDigitoVerificador;
  validarCLABE: typeof validarCLABE;
  extraerInfoCLABE: typeof extraerInfoCLABE;
  generarCLABE: typeof generarCLABE;
  formatearCLABE: typeof formatearCLABE;
  getEstadisticas: typeof getEstadisticas;
  infoCatalogo: typeof infoCatalogo;
};
export default _default;
