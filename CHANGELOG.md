# Cambios

## 2.0.0 (2026-11-19)

### Cambios incompatibles
- El catálogo ahora es la lista oficial de participantes de SPEI de Banco de México (97 instituciones al 2026-11-19). Se quitaron bancos que ya no existen (IXE, Famsa, entre otros) y se agregaron los que faltaban (Nu, Mercado Pago, Spin by OXXO, Uala, entre otros).
- Cada banco trae `codigo`, `claveSpei`, `nombre` y `tipo`. Se quitaron `nombreCompleto`, `nombreCorto`, `telefono`, `website`, `swift` y `pais` porque no venían de una fuente verificable.
- `extraerInfoCLABE` devuelve `codigoPlaza` en lugar de `codigoSucursal` (los dígitos 4 a 6 de la CLABE son la plaza) y ya no incluye `esValida`.
- `formatearCLABE` separa con espacios en lugar de guiones.
- `getEstadisticas` devuelve `porTipo` y `fechaCatalogo`.

### Nuevo
- `validarCLABE(clabe, { verificarBanco: false })` valida solo el dígito verificador.
- `buscarBanco` acepta la clave SPEI de 5 dígitos y números.
- `buscarBancoPorNombre` ignora acentos.
- `calcularDigitoVerificador` e `infoCatalogo`.
- `scripts/actualizar-catalogo.mjs` regenera el catálogo desde Banxico.

### Corregido
- `validarCLABE` rechazaba CLABEs reales de instituciones que no estaban en el catálogo anterior.
