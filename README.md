# mx-bancos

Catálogo de los bancos e instituciones que participan en SPEI, tomado de Banco de México, más validación y generación de cuentas CLABE.

[![npm](https://img.shields.io/npm/v/mx-bancos.svg)](https://www.npmjs.com/package/mx-bancos)
[![CI](https://github.com/GerardoLucero/mx-bancos/actions/workflows/ci.yml/badge.svg)](https://github.com/GerardoLucero/mx-bancos/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

- 97 instituciones: banca múltiple, banca de desarrollo, participantes no bancarios (casas de bolsa, SOFIPOs, fintech como Nu, Mercado Pago o Spin by OXXO) y Banxico.
- Cada institución trae su código CLABE de 3 dígitos y su clave SPEI de 5.
- Valida el dígito verificador **y** que el banco siga participando en SPEI.
- Sin dependencias y sin llamadas a internet. Funciona con `import` y `require` en Node 20 o superior, con tipos de TypeScript.

## Instalación

```bash
npm install mx-bancos
```

## Validar una CLABE

```js
import { validarCLABE, extraerInfoCLABE } from 'mx-bancos';
// o: const { validarCLABE } = require('mx-bancos');

validarCLABE('002180000118359710');     // true
validarCLABE('002 180 00011835971 0');  // true, acepta espacios y guiones
validarCLABE('002180000118359711');     // false, digito verificador incorrecto

extraerInfoCLABE('012180012345678909');
// {
//   clabe: '012180012345678909',
//   codigoBanco: '012',
//   codigoPlaza: '180',
//   numeroCuenta: '01234567890',
//   digitoVerificador: '9',
//   banco: { codigo: '012', claveSpei: '40012', nombre: 'BBVA MEXICO', tipo: 'Banca múltiple' }
// }
```

`validarCLABE` también revisa que el banco esté en el catálogo vigente de SPEI. Una CLABE de un banco que ya desapareció, como IXE (`032`), tiene el dígito verificador correcto pero no puede recibir transferencias:

```js
validarCLABE('032180000118359719');                            // false
validarCLABE('032180000118359719', { verificarBanco: false }); // true
extraerInfoCLABE('032180000118359719').banco;                  // null
```

## Buscar bancos

```js
import { buscarBanco, buscarBancoPorNombre, getBancos } from 'mx-bancos';

buscarBanco('012');      // por codigo CLABE
buscarBanco(12);         // tambien como numero
buscarBanco('40012');    // por clave SPEI
// { codigo: '012', claveSpei: '40012', nombre: 'BBVA MEXICO', tipo: 'Banca múltiple' }

buscarBancoPorNombre('mercado pago'); // sin importar acentos ni mayusculas
getBancos();                          // las 97 instituciones
```

## Generar CLABEs de prueba

```js
import { generarCLABE, formatearCLABE, calcularDigitoVerificador } from 'mx-bancos';

generarCLABE('722', '969', '01234567890'); // '722969012345678902'
generarCLABE('032', '180', '1');           // null, IXE ya no participa en SPEI
formatearCLABE('002180000118359710');      // '002 180 00011835971 0'
calcularDigitoVerificador('00218000011835971'); // 0
```

## API

| Función | Devuelve |
|---|---|
| `getBancos()` | Todas las instituciones |
| `buscarBanco(codigo)` | Institución por código CLABE o clave SPEI, o `null` |
| `buscarBancoPorNombre(texto)` | Instituciones cuyo nombre contiene el texto |
| `validarCLABE(clabe, { verificarBanco })` | `true` si es válida; `verificarBanco` es `true` por defecto |
| `extraerInfoCLABE(clabe)` | Banco, plaza, cuenta y verificador, o `null` |
| `generarCLABE(banco, plaza, cuenta)` | CLABE con verificador, o `null` |
| `calcularDigitoVerificador(primeros17)` | Dígito de 0 a 9 |
| `formatearCLABE(clabe)` | `'BBB PPP CCCCCCCCCCC V'` |
| `getEstadisticas()` | Totales por tipo y fecha del catálogo |
| `infoCatalogo()` | Fuente, URL y fecha |

```js
getEstadisticas();
// { totalBancos: 97, porTipo: { 'Banco central': 1, 'Banca múltiple': 46, 'Banca de desarrollo': 6, 'Participante no bancario': 44 }, fechaCatalogo: '2026-11-19' }
```

## Datos

- **Fuente:** lista de instituciones que publica [Banco de México](https://www.banxico.org.mx/cep/) en su servicio de Comprobante Electrónico de Pago (CEP), es decir, los participantes de SPEI.
- **Fecha del catálogo incluido:** 2026-11-19. Hoy son 97 instituciones.
- **Tipo:** se deduce del prefijo de la clave SPEI: `40` banca múltiple, `37` banca de desarrollo, `90` participante no bancario y `2` Banco de México.
- **Nombres:** tal como los publica Banxico (por ejemplo `BBVA MEXICO`, `NUBANK`).
- **Actualización:** `node scripts/actualizar-catalogo.mjs AAAA-MM-DD` descarga la lista y regenera `src/catalogo.js`. El script se detiene si el formato cambia o si dos instituciones comparten código.

## Cambios

Ver [CHANGELOG.md](CHANGELOG.md). La versión 2.0.0 cambia el catálogo y algunos campos.

## Licencia

MIT
