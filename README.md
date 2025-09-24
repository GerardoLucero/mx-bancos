# mx-bancos

[![npm version](https://badge.fury.io/js/mx-bancos.svg)](https://www.npmjs.com/package/mx-bancos)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Catálogo completo de **50 bancos mexicanos** con códigos CLABE, sucursales y validación completa.

## ✨ Características

- 🏦 **50 bancos mexicanos** completos (todos los oficiales)
- 🔍 **Búsqueda avanzada** por código y nombre
- ✅ **Validación CLABE** con algoritmo oficial
- 🧮 **Generación CLABE** para testing
- 📊 **Información detallada** de cada banco
- 🎯 **Extracción de datos** de cuentas CLABE
- 📱 **Números telefónicos** y sitios web
- 🌐 **Códigos SWIFT** internacionales

## 🚀 Instalación

```bash
npm install mx-bancos
```

## 📖 Uso

```javascript
import bancos from 'mx-bancos';

// Obtener todos los bancos (50 bancos)
const todosBancos = bancos.getBancos();
console.log(todosBancos.length); // 50

// Buscar banco por código
const banamex = bancos.buscarBanco('002');
console.log(banamex.nombre); // 'BANAMEX'
console.log(banamex.telefono); // '800-021-2345'
console.log(banamex.swift); // 'BNMXMXMM'

// Buscar por nombre (case-insensitive)
const resultados = bancos.buscarBancoPorNombre('Santander');
console.log(resultados[0].nombreCompleto); // 'Banco Santander México S.A.'

// Validar CLABE (con algoritmo oficial)
const esValida = bancos.validarCLABE('002010077777777771');
console.log(esValida); // true

// Extraer información completa de CLABE
const info = bancos.extraerInfoCLABE('002010077777777771');
console.log(info);
/*
{
  clabe: '002010077777777771',
  banco: { codigo: '002', nombre: 'BANAMEX', telefono: '800-021-2345', ... },
  codigoBanco: '002',
  codigoSucursal: '010',
  numeroCuenta: '07777777777',
  digitoVerificador: '1',
  esValida: true
}
*/

// Generar CLABE para testing
const clabe = bancos.generarCLABE('002', '010', '07777777777');
console.log(clabe); // '002010077777777771'

// Formatear CLABE para legibilidad
const formateada = bancos.formatearCLABE('002010077777777771');
console.log(formateada); // '002-010-07777777777-1'
```

## 🔧 API

### `getBancos(): Array`
Obtiene todos los 50 bancos disponibles.

### `buscarBanco(codigo: string): Object|null`
Busca un banco por su código de 3 dígitos.

### `buscarBancoPorNombre(nombre: string): Array`
Busca bancos por nombre (búsqueda parcial, case-insensitive).

### `validarCLABE(clabe: string): boolean`
Valida una cuenta CLABE interbancaria usando el algoritmo oficial.

### `extraerInfoCLABE(clabe: string): Object|null`
Extrae información detallada de una CLABE válida.

### `generarCLABE(codigoBanco, codigoSucursal, numeroCuenta): string|null`
Genera una CLABE válida para testing.

### `formatearCLABE(clabe: string): string`
Formatea una CLABE para mejor legibilidad.

### `getEstadisticas(): Object`
Obtiene estadísticas del catálogo de bancos.

## 🏦 Bancos Incluidos (50 total)

### Bancos Principales
- **Banamex** (002) - Banco Nacional de México
- **BBVA México** (012) - BBVA México S.A.
- **Santander** (014) - Banco Santander México
- **HSBC** (021) - HSBC México
- **Banorte** (072) - Banco Mercantil del Norte
- **Scotiabank** (044) - Scotiabank Inverlat

### Bancos de Desarrollo
- **Bancomext** (006) - Banco Nacional de Comercio Exterior
- **Banobras** (009) - Banco Nacional de Obras y Servicios Públicos
- **Banjercito** (019) - Banco Nacional del Ejército, Fuerza Aérea y Armada
- **Nafin** (135) - Nacional Financiera
- **Bansefi** (166) - Banco del Ahorro Nacional
- **SHF** (168) - Sociedad Hipotecaria Federal

### Bancos Comerciales
- **BanBajío** (030), **Inbursa** (036), **Mifel** (042)
- **Banregio** (058), **Invex** (059), **Afirme** (062)
- **Azteca** (116), **Compartamos** (130), **Bancoppel** (137)
- **Actinver** (133), **CIBanco** (143), **Banco Base** (145)

### Bancos Extranjeros
- **American Express** (103), **Bank of America** (106)
- **JP Morgan** (110), **Deutsche Bank** (124)
- **Credit Suisse** (113), **UBS Bank** (139)
- **Barclays** (129), **MUFG** (108)

### Casas de Bolsa
- **Monex** (600), **GBM** (601), **Masari** (602)

## �� Tests

```bash
npm test
npm run test:coverage
```

## 📊 Estadísticas

- **50 bancos** incluidos
- **100% de cobertura** de tests
- **Validación CLABE** con algoritmo oficial
- **Información completa**: teléfonos, sitios web, códigos SWIFT
- **Actualizado 2024** con datos oficiales de CNBV

## 📄 Licencia

MIT © Gerardo Lucero

---

**El catálogo de bancos mexicanos más completo disponible en NPM** 🇲🇽
