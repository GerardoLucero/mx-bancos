import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import bancos, {
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
} from './index.js';

// CLABE de ejemplo de IXE (codigo 032): digito verificador correcto, pero IXE ya no participa en SPEI.
const CLABE_IXE = '032180000118359719';

describe('catalogo de Banxico', () => {
  it('trae los participantes de SPEI con codigo, clave SPEI y tipo', () => {
    const lista = getBancos();
    expect(lista.length).toBeGreaterThan(80);
    for (const b of lista) {
      expect(b.codigo).toMatch(/^\d{3}$/);
      expect(b.claveSpei).toMatch(/^\d{4,5}$/);
      expect(b.claveSpei.endsWith(b.codigo)).toBe(true);
      expect(['Banca múltiple', 'Banca de desarrollo', 'Participante no bancario', 'Banco central']).toContain(b.tipo);
    }
  });

  it('no repite codigos CLABE', () => {
    const codigos = getBancos().map((b) => b.codigo);
    expect(new Set(codigos).size).toBe(codigos.length);
  });

  it('incluye instituciones nuevas que los catalogos viejos no tenian', () => {
    expect(buscarBanco('638').nombre).toBe('NUBANK');
    expect(buscarBanco('722').nombre).toMatch(/Mercado Pago/);
    expect(buscarBanco('728').nombre).toBe('SPIN BY OXXO');
  });

  it('devuelve copias que no alteran el catalogo', () => {
    getBancos()[0].nombre = 'X';
    buscarBanco('012').nombre = 'X';
    expect(buscarBanco('012').nombre).toBe('BBVA MEXICO');
  });

  it('expone fuente, url y fecha', () => {
    const info = infoCatalogo();
    expect(info.fuente).toContain('Banco de Mexico');
    expect(info.url).toContain('banxico.org.mx');
    expect(info.fecha).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});

describe('buscarBanco', () => {
  it.each([['012'], [12], ['40012'], [' 012 ']])('encuentra BBVA con %p', (codigo) => {
    expect(buscarBanco(codigo)).toEqual({ codigo: '012', claveSpei: '40012', nombre: 'BBVA MEXICO', tipo: 'Banca múltiple' });
  });

  it('encuentra a Banxico por su clave de 4 digitos', () => {
    expect(buscarBanco('2001').tipo).toBe('Banco central');
  });

  it.each([['999'], ['032'], ['abc'], [''], [null], [undefined], [-1], [1.5], ['123456']])('devuelve null con %p', (codigo) => {
    expect(buscarBanco(codigo)).toBeNull();
  });
});

describe('buscarBancoPorNombre', () => {
  it('ignora acentos y mayusculas', () => {
    expect(buscarBancoPorNombre('bbva').map((b) => b.codigo)).toContain('012');
    expect(buscarBancoPorNombre('MÉXICO').length).toBeGreaterThan(0);
  });

  it('devuelve lista vacia sin texto', () => {
    expect(buscarBancoPorNombre('')).toEqual([]);
    expect(buscarBancoPorNombre(null)).toEqual([]);
    expect(buscarBancoPorNombre('zzzz')).toEqual([]);
  });
});

describe('digito verificador', () => {
  it('calcula con pesos 3, 7, 1', () => {
    expect(calcularDigitoVerificador('00218000011835971')).toBe(0);
    expect(calcularDigitoVerificador('03218000011835971')).toBe(9);
  });

  it('exige 17 digitos', () => {
    expect(() => calcularDigitoVerificador('123')).toThrow('17 digitos');
    expect(() => calcularDigitoVerificador(123)).toThrow('17 digitos');
  });
});

describe('validarCLABE', () => {
  it('acepta CLABEs de bancos vigentes con espacios o guiones', () => {
    expect(validarCLABE('002180000118359710')).toBe(true);
    expect(validarCLABE('002 180 00011835971 0')).toBe(true);
    expect(validarCLABE('638-180-00000000001-7')).toBe(true);
  });

  it('rechaza digito verificador incorrecto, longitud o caracteres', () => {
    expect(validarCLABE('002180000118359711')).toBe(false);
    expect(validarCLABE('00218000011835971')).toBe(false);
    expect(validarCLABE('00218000011835971a')).toBe(false);
    expect(validarCLABE(null)).toBe(false);
    expect(validarCLABE(2180000118359710)).toBe(false);
  });

  it('rechaza bancos que ya no participan en SPEI, salvo que se pida no verificarlo', () => {
    expect(validarCLABE(CLABE_IXE)).toBe(false);
    expect(validarCLABE(CLABE_IXE, { verificarBanco: false })).toBe(true);
  });
});

describe('extraerInfoCLABE', () => {
  it('separa las partes e identifica el banco', () => {
    expect(extraerInfoCLABE('012 180 01234567890 9')).toEqual({
      clabe: '012180012345678909',
      codigoBanco: '012',
      codigoPlaza: '180',
      numeroCuenta: '01234567890',
      digitoVerificador: '9',
      banco: { codigo: '012', claveSpei: '40012', nombre: 'BBVA MEXICO', tipo: 'Banca múltiple' }
    });
  });

  it('devuelve banco null si el codigo ya no participa en SPEI', () => {
    expect(extraerInfoCLABE(CLABE_IXE).banco).toBeNull();
  });

  it('devuelve null si la CLABE no es valida', () => {
    expect(extraerInfoCLABE('012180012345678900')).toBeNull();
  });
});

describe('generarCLABE', () => {
  it('genera CLABEs que pasan la validacion', () => {
    const clabe = generarCLABE('722', '969', '01234567890');
    expect(clabe).toBe('722969012345678902');
    expect(validarCLABE(clabe)).toBe(true);
  });

  it('rellena con ceros y acepta numeros', () => {
    expect(generarCLABE(12, 180, 1234567890)).toBe('012180012345678909');
  });

  it('devuelve null con banco fuera de SPEI o partes invalidas', () => {
    expect(generarCLABE('032', '180', '1')).toBeNull();
    expect(generarCLABE('012', '1800', '1')).toBeNull();
    expect(generarCLABE('012', '180', '123456789012')).toBeNull();
    expect(generarCLABE('012', 'abc', '1')).toBeNull();
    expect(generarCLABE('012', '180')).toBeNull();
  });
});

describe('formatearCLABE', () => {
  it('agrupa banco, plaza, cuenta y verificador', () => {
    expect(formatearCLABE('002180000118359710')).toBe('002 180 00011835971 0');
  });

  it('devuelve la entrada sin cambios si no es valida', () => {
    expect(formatearCLABE('123')).toBe('123');
  });
});

describe('getEstadisticas y exportacion por defecto', () => {
  it('cuenta por tipo', () => {
    const e = getEstadisticas();
    expect(Object.values(e.porTipo).reduce((a, b) => a + b, 0)).toBe(e.totalBancos);
    expect(e.porTipo['Banco central']).toBe(1);
  });

  it('expone las mismas funciones', () => {
    expect(Object.keys(bancos)).toHaveLength(10);
    expect(bancos.validarCLABE('002180000118359710')).toBe(true);
  });
});

describe('ejemplos del README', () => {
  const readme = readFileSync(join(process.cwd(), 'README.md'), 'utf8');

  it('usa resultados reales', () => {
    expect(readme).toContain(`${getEstadisticas().totalBancos} instituciones`);
    expect(readme).toContain(`fechaCatalogo: '${getEstadisticas().fechaCatalogo}'`);
    for (const clabe of ['002180000118359710', '722969012345678902', '012180012345678909']) {
      expect(readme).toContain(clabe);
      expect(validarCLABE(clabe)).toBe(true);
    }
    expect(readme).toContain(CLABE_IXE);
  });
});
