# mx-bancos

<!-- BADGES-DONATIONS-START -->
[![Ko-fi](https://img.shields.io/badge/Ko--fi-Donate-orange?logo=ko-fi)](https://ko-fi.com/gerardolucero)
[![BuyMeACoffee](https://img.shields.io/badge/Buy%20Me%20a%20Coffee-Support-yellow?logo=buy-me-a-coffee)](https://buymeacoffee.com/lucerorios0)
<!-- BADGES-DONATIONS-END -->


[![npm version](https://badge.fury.io/js/mx-bancos.svg)](https://badge.fury.io/js/mx-bancos)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Catálogo completo de bancos mexicanos con códigos CLABE y validación.

## Instalación

```bash
npm install mx-bancos
```

## Uso

```javascript
import { getBancos, validarCLABE, generarCLABE } from 'mx-bancos';

// Obtener todos los bancos
const bancos = getBancos();

// Validar CLABE
const esValida = validarCLABE('012180001234567895');
console.log(esValida); // true/false

// Generar CLABE
const clabe = generarCLABE('012', '18000', '1234567890');
```

## API

### `getBancos()`
Retorna array con todos los bancos mexicanos.

### `validarCLABE(clabe)`
Valida formato y dígito verificador de CLABE.

### `generarCLABE(codigoBanco, sucursal, cuenta)`
Genera CLABE con dígito verificador correcto.

## Características

- ✅ 50+ bancos mexicanos incluidos
- ✅ Validación completa de CLABE
- ✅ Generación de dígito verificador
- ✅ Códigos de banco actualizados
- ✅ Información de sucursales

## Licencia

MIT © Gerardo Lucero

<!-- DONATIONS-START -->
## 💖 Apoya el Ecosistema Mexicano OSS

Si estos paquetes te ayudan (RFC, ISR, Nómina, Bancos, Feriados, Nombres, Códigos Postales, Validadores), considera invitarme un café o apoyar el mantenimiento:

- [Ko-fi](https://ko-fi.com/gerardolucero)
- [Buy Me a Coffee](https://buymeacoffee.com/lucerorios0)

> Gracias por tu apoyo 🙌. Priorizaré issues/PRs con **contexto de uso en México** (SAT/IMSS/INFONAVIT, bancos, feriados) y publicaré avances en los READMEs.
<!-- DONATIONS-END -->
