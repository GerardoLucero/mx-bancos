# MX Bancos

Catálogo completo de bancos mexicanos con validación y generación de CLABE, códigos bancarios oficiales e información detallada de instituciones financieras.

[![Ko-fi](https://img.shields.io/badge/Ko--fi-FF5E5B?style=flat&logo=ko-fi&logoColor=white)](https://ko-fi.com/gerardolucero)
[![Buy Me a Coffee](https://img.shields.io/badge/Buy%20Me%20a%20Coffee-FFDD00?style=flat&logo=buy-me-a-coffee&logoColor=black)](https://buymeacoffee.com/lucerorios0)
[![GitHub Stars](https://img.shields.io/github/stars/GerardoLucero/mx-bancos?style=social)](https://github.com/GerardoLucero/mx-bancos)
[![npm version](https://badge.fury.io/js/mx-bancos.svg)](https://badge.fury.io/js/mx-bancos)
[![npm downloads](https://img.shields.io/npm/dm/mx-bancos.svg)](https://www.npmjs.com/package/mx-bancos)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

- **50+ bancos mexicanos** — catálogo completo y actualizado
- **Validación de CLABE** — algoritmo oficial con dígito verificador
- **Generación de CLABE** — crear cuentas válidas automáticamente
- **Códigos bancarios oficiales** — números de institución BANXICO
- **Información completa** — nombres, abreviaciones, sitios web
- **Búsqueda avanzada** — por nombre, código, abreviación
- **TypeScript ready** — definiciones de tipos incluidas
- **Sin dependencias** — librería ligera y rápida

## Instalación

```bash
npm install mx-bancos
```

## Uso

```javascript
// ES6 Modules
import { getBancos, validarCLABE, generarCLABE, buscarBanco } from 'mx-bancos';

// Obtener todos los bancos
const bancos = getBancos();
console.log(bancos.length); // 50+

// Buscar banco específico
const banamex = buscarBanco('002');
console.log(banamex.nombre); // 'Banco Nacional de México'

// Validar CLABE
const esValida = validarCLABE('012180001234567895');
console.log(esValida); // true

// Generar CLABE válida
const clabe = generarCLABE('002', '12345', '1234567890');
console.log(clabe); // 002123451234567897
```

## Bancos incluidos

| Código | Banco | Abreviación |
|--------|-------|-------------|
| 002 | Banco Nacional de México | BANAMEX |
| 012 | Banco Mercantil del Norte | BANORTE |
| 014 | Banco Santander México | SANTANDER |
| 021 | HSBC México | HSBC |
| 030 | Banco Bajío | BAJIO |
| 032 | ING Bank México | ING |
| 036 | Banco Inbursa | INBURSA |
| 044 | Scotiabank Inverlat | SCOTIABANK |

## Estructura de CLABE

```
002 12345 1234567890 7
│   │     │          │
│   │     │          └─ Dígito verificador
│   │     └─────────────── Número de cuenta
│   └───────────────────── Código de sucursal
└───────────────────────── Código de banco
```

## Licencia

MIT © [Gerardo Lucero](https://github.com/GerardoLucero)

---

**¿Necesitas validar RFC también?** Revisa [`validador-fiscal-mx`](https://github.com/GerardoLucero/validador-fiscal-mx) para validaciones fiscales completas.
