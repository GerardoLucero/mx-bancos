# MX Bancos

<!-- BADGES-DONATIONS-START -->
[![Ko-fi](https://img.shields.io/badge/Ko--fi-Donate-orange?logo=ko-fi)](https://ko-fi.com/gerardolucero)
[![BuyMeACoffee](https://img.shields.io/badge/Buy%20Me%20a%20Coffee-Support-yellow?logo=buy-me-a-coffee)](https://buymeacoffee.com/lucerorios0)
<!-- BADGES-DONATIONS-END -->

[![npm version](https://badge.fury.io/js/mx-bancos.svg)](https://badge.fury.io/js/mx-bancos)
[![npm downloads](https://img.shields.io/npm/dm/mx-bancos.svg)](https://www.npmjs.com/package/mx-bancos)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Catálogo completo de **bancos mexicanos** con validación y generación de CLABE, códigos bancarios oficiales y información detallada de instituciones financieras.

## 🚀 Características

- ✅ **50+ bancos mexicanos** - Catálogo completo y actualizado
- ✅ **Validación de CLABE** - Algoritmo oficial con dígito verificador
- ✅ **Generación de CLABE** - Crear cuentas válidas automáticamente
- ✅ **Códigos bancarios oficiales** - Números de institución BANXICO
- ✅ **Información completa** - Nombres, abreviaciones, sitios web
- ✅ **Búsqueda avanzada** - Por nombre, código, abreviación
- ✅ **TypeScript ready** - Definiciones de tipos incluidas
- ✅ **Sin dependencias** - Librería ligera y rápida

## 📦 Instalación

```bash
npm install mx-bancos
```

## 🔧 Uso

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

## 🏦 Bancos Incluidos

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

## 🔢 Estructura de CLABE

```
002 12345 1234567890 7
│   │     │          │
│   │     │          └─ Dígito verificador
│   │     └─────────────── Número de cuenta
│   └───────────────────── Código de sucursal
└───────────────────────── Código de banco
```

## 📄 Licencia

MIT © [Gerardo Lucero](https://github.com/GerardoLucero)

---

**¿Necesitas validar RFC también?** 👀 Revisa `validador-fiscal-mx` para validaciones fiscales completas.

<!-- DONATIONS-START -->
## 💖 Apoya el Ecosistema Mexicano OSS

Si estos paquetes te ayudan (RFC, ISR, Nómina, Bancos, Feriados, Nombres, Códigos Postales, Validadores), considera invitarme un café o apoyar el mantenimiento:

- [Ko-fi](https://ko-fi.com/gerardolucero)
- [Buy Me a Coffee](https://buymeacoffee.com/lucerorios0)

> Gracias por tu apoyo 🙌. Priorizaré issues/PRs con **contexto de uso en México** (SAT/IMSS/INFONAVIT, bancos, feriados) y publicaré avances en los READMEs.
<!-- DONATIONS-END -->
