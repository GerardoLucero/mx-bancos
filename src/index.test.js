import bancos from './index.js';

describe('mx-bancos', () => {
  describe('getBancos', () => {
    test('debe retornar lista de bancos', () => {
      const resultado = bancos.getBancos();
      expect(Array.isArray(resultado)).toBe(true);
      expect(resultado.length).toBeGreaterThan(0);
      expect(resultado[0]).toHaveProperty('codigo');
      expect(resultado[0]).toHaveProperty('nombre');
    });
  });

  describe('buscarBanco', () => {
    test('debe encontrar banco por código', () => {
      const banamex = bancos.buscarBanco('002');
      expect(banamex).toBeTruthy();
      expect(banamex.nombre).toBe('BANAMEX');
      expect(banamex.codigo).toBe('002');
    });

    test('debe encontrar banco con código con ceros', () => {
      const banamex = bancos.buscarBanco('2');
      expect(banamex).toBeTruthy();
      expect(banamex.codigo).toBe('002');
    });

    test('debe retornar null para código inexistente', () => {
      const resultado = bancos.buscarBanco('999');
      expect(resultado).toBeNull();
    });

    test('debe manejar entrada inválida', () => {
      expect(bancos.buscarBanco(null)).toBeNull();
      expect(bancos.buscarBanco('')).toBeNull();
      expect(bancos.buscarBanco(123)).toBeNull();
    });
  });

  describe('buscarBancoPorNombre', () => {
    test('debe encontrar bancos por nombre parcial', () => {
      const resultados = bancos.buscarBancoPorNombre('BANAMEX');
      expect(resultados.length).toBe(1);
      expect(resultados[0].nombre).toBe('BANAMEX');
    });

    test('debe ser case insensitive', () => {
      const resultados = bancos.buscarBancoPorNombre('banamex');
      expect(resultados.length).toBe(1);
      expect(resultados[0].nombre).toBe('BANAMEX');
    });

    test('debe buscar en nombre completo', () => {
      const resultados = bancos.buscarBancoPorNombre('Nacional');
      expect(resultados.length).toBeGreaterThan(0);
    });

    test('debe retornar array vacío para búsqueda sin resultados', () => {
      const resultados = bancos.buscarBancoPorNombre('INEXISTENTE');
      expect(resultados).toEqual([]);
    });

    test('debe manejar entrada inválida', () => {
      expect(bancos.buscarBancoPorNombre(null)).toEqual([]);
      expect(bancos.buscarBancoPorNombre('')).toEqual([]);
    });
  });

  describe('validarCLABE', () => {
    test('debe validar CLABE válida', () => {
      // CLABE de prueba válida para Banamex
      expect(bancos.validarCLABE('002010077777777771')).toBe(true);
    });

    test('debe rechazar CLABE con longitud incorrecta', () => {
      expect(bancos.validarCLABE('00201007777777777')).toBe(false); // 17 dígitos
      expect(bancos.validarCLABE('0020100777777777712')).toBe(false); // 19 dígitos
    });

    test('debe rechazar CLABE con caracteres no numéricos', () => {
      expect(bancos.validarCLABE('002010077777777A71')).toBe(false);
      expect(bancos.validarCLABE('002-010-07777777771')).toBe(false);
    });

    test('debe rechazar CLABE con banco inexistente', () => {
      expect(bancos.validarCLABE('999010077777777771')).toBe(false);
    });

    test('debe manejar espacios y guiones', () => {
      expect(bancos.validarCLABE('002 010 077777777771')).toBe(true);
      expect(bancos.validarCLABE('002-010-077777777771')).toBe(true);
    });

    test('debe manejar entrada inválida', () => {
      expect(bancos.validarCLABE(null)).toBe(false);
      expect(bancos.validarCLABE('')).toBe(false);
      expect(bancos.validarCLABE(undefined)).toBe(false);
    });
  });

  describe('extraerInfoCLABE', () => {
    test('debe extraer información de CLABE válida', () => {
      const info = bancos.extraerInfoCLABE('002010077777777771');
      expect(info).toBeTruthy();
      expect(info.codigoBanco).toBe('002');
      expect(info.codigoSucursal).toBe('010');
      expect(info.numeroCuenta).toBe('07777777777');
      expect(info.digitoVerificador).toBe('1');
      expect(info.banco.nombre).toBe('BANAMEX');
      expect(info.esValida).toBe(true);
    });

    test('debe retornar null para CLABE inválida', () => {
      const info = bancos.extraerInfoCLABE('123456789012345678');
      expect(info).toBeNull();
    });
  });

  describe('generarCLABE', () => {
    test('debe generar CLABE válida', () => {
      const clabe = bancos.generarCLABE('002', '010', '07777777777');
      expect(clabe).toBeTruthy();
      expect(clabe.length).toBe(18);
      expect(bancos.validarCLABE(clabe)).toBe(true);
    });

    test('debe manejar códigos con padding', () => {
      const clabe = bancos.generarCLABE('002', '010', '07777777777');
      expect(clabe).toBeTruthy();
      expect(clabe.startsWith('002010')).toBe(true);
    });

    test('debe retornar null para banco inexistente', () => {
      const clabe = bancos.generarCLABE('999', '010', '07777777777');
      expect(clabe).toBeNull();
    });
  });

  describe('formatearCLABE', () => {
    test('debe formatear CLABE válida', () => {
      const formateada = bancos.formatearCLABE('002010077777777771');
      expect(formateada).toBe('002-010-07777777777-1');
    });

    test('debe retornar original si es inválida', () => {
      const invalida = '123456789';
      const formateada = bancos.formatearCLABE(invalida);
      expect(formateada).toBe(invalida);
    });
  });

  describe('getEstadisticas', () => {
    test('debe retornar estadísticas válidas', () => {
      const stats = bancos.getEstadisticas();
      expect(stats).toHaveProperty('totalBancos');
      expect(stats).toHaveProperty('tiposBanco');
      expect(stats).toHaveProperty('ultimaActualizacion');
      expect(stats).toHaveProperty('fuente');
      expect(stats.totalBancos).toBeGreaterThan(0);
    });
  });
});
