// PBE_server.js
const express  = require('express');
const cors     = require('cors');
const mongoose = require('mongoose');

// ─────────────────────────────────────────────────────────
// 1. Conexión a la BD  (Mongo y Node viven en el MISMO PC)
//    URI → 127.0.0.1  evita ambigüedad IPv6 de 'localhost'
// ─────────────────────────────────────────────────────────
const URI  = 'mongodb://127.0.0.1:27017/pbe';

mongoose.connect(URI, { useNewUrlParser:true, useUnifiedTopology:true })
  .then(()=>console.log('  MongoDB conectado'))
  .catch(err => { console.error(' Error MongoDB:', err); process.exit(1); });

// ─────────────────────────────────────────────────────────
const app  = express();
const PORT = 3000;      // si lo cambias, actualiza el front

app.use(cors());
app.use(express.json());

// Rutas API
app.use('/', require('./routes/rutas'));

// ─────────────────────────────────────────────────────────
// 2. Escuchar en TODAS las interfaces → 0.0.0.0
//    Así funciona desde localhost y desde 192.168.x.x
// ─────────────────────────────────────────────────────────
app.listen(PORT, '0.0.0.0', () =>
  console.log(` API en   http://0.0.0.0:${PORT}`)
);
