#!/usr/bin/env node
// Regenera src/catalogo.js con la lista de instituciones que publica Banxico
// en su servicio de Comprobante Electronico de Pago (CEP), es decir, los
// participantes de SPEI vigentes en la fecha indicada.
//
//   node scripts/actualizar-catalogo.mjs            (fecha de hoy)
//   node scripts/actualizar-catalogo.mjs 2026-11-19
//
// Se detiene sin escribir nada si la respuesta no tiene el formato esperado.
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const fecha = process.argv[2] ?? new Date().toISOString().slice(0, 10);
if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha)) throw new Error('Fecha con formato AAAA-MM-DD');
const [a, m, d] = fecha.split('-');
const url = `https://www.banxico.org.mx/cep/instituciones.do?fecha=${d}-${m}-${a}`;

const TIPOS = {
  2: 'Banco central',
  37: 'Banca de desarrollo',
  40: 'Banca múltiple',
  90: 'Participante no bancario'
};

const res = await fetch(url);
if (!res.ok) throw new Error(`Banxico respondio ${res.status}`);
const { instituciones } = await res.json();
if (!Array.isArray(instituciones) || instituciones.length < 50) throw new Error('Lista vacia o incompleta');

const vistos = new Set();
const bancos = instituciones.map(([claveSpei, nombre]) => {
  if (!/^\d{4,5}$/.test(claveSpei) || typeof nombre !== 'string' || !nombre.trim()) {
    throw new Error(`Registro inesperado: ${JSON.stringify([claveSpei, nombre])}`);
  }
  const prefijo = Number(claveSpei.slice(0, -3));
  const tipo = TIPOS[prefijo];
  if (!tipo) throw new Error(`Prefijo desconocido en ${claveSpei}`);
  const codigo = claveSpei.slice(-3);
  if (vistos.has(codigo)) throw new Error(`Codigo CLABE repetido: ${codigo}`);
  vistos.add(codigo);
  return { codigo, claveSpei, nombre: nombre.trim(), tipo };
}).sort((x, y) => x.codigo.localeCompare(y.codigo));

const catalogo = {
  fuente: 'Banco de Mexico, instituciones participantes de SPEI (servicio CEP)',
  url: 'https://www.banxico.org.mx/cep/',
  fecha,
  bancos
};

const destino = fileURLToPath(new URL('../src/catalogo.js', import.meta.url));
writeFileSync(destino, `// Generado por scripts/actualizar-catalogo.mjs. No editar a mano.\nexport default ${JSON.stringify(catalogo, null, 2)};\n`);
console.log(`${bancos.length} instituciones, fecha ${fecha} -> src/catalogo.js`);
