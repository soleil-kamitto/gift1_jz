'use strict';

/* =========================================================
   ✏️  EDITA AQUÍ TODOS LOS TEXTOS
   (El interior de la carta ya viene dibujado en assets/interior.*;
    aquí solo están los textos de apoyo y las cositas extra.)
   ========================================================= */
const CONTENIDO = {
  nombre: 'Jz',
  firma: 'Soleil',                       // aparece en la licencia ("Expedida por")
  rotuloPortada: 'para Jz 💙',          // solo se ve si todavía no hay portada en /assets
  pistaAbrir: 'toca para abrir 💙',
  pistaAbierta: 'desliza, hay más sorpresitas ↓',

  // Texto para lectores de pantalla: lo mismo que está dibujado en cada panel del interior
  altIzquierdo: 'te amo. Aunque hoy no pueda darte un carrito en la mano, quise hacerte esta carta para que sepas lo especial que eres para mí. Gracias por cada llamada, cada risa y cada detalle que nos acerca.',
  altCentro: 'Te amo Jz. Aunque estemos lejos, siempre vamos en la misma pista. Una pista en forma de corazón con carritos y las banderas de Perú y Ecuador.',
  altDerecho: 'La distancia es solo una curva más del camino, y yo quiero seguir recorriéndola contigo. Te elijo hoy, mañana y en cada vuelta que nos toque dar juntos. Con cariño para ti, Soleil.',

  // Garaje de razones (6 textos)
  tituloGaraje: 'Garaje de razones',
  subGaraje: 'toca cada carrito 🏎️',
  razones: [
    'Porque tu risa me arregla hasta el día más gris.',
    'Porque contigo una videollamada de cinco minutos se siente como un abrazo.',
    'Porque eres mi persona favorita para hablar de todo y de nada.',
    'Porque me inspiras a ser mejor cada día, sin pedírmelo.',
    'Porque haces que la distancia se sienta chiquitita.',
    'Porque contigo quiero dar todas las vueltas de la pista.',
  ],
  razonesProgreso: 'descubiertas: {n} de {total}',
  razonesCompletas: '¡Las descubriste todas! Igual me quedan infinitas más 💙',

  // Licencia
  tituloLicencia: 'Licencia de conducir de mi corazón',
  licenciaPais: 'República de mi Corazón',
  licenciaCategoria: 'piloto oficial de mi corazón',
  licenciaVigencia: 'para siempre',
  licenciaNumero: 'JZ-💙-∞',
  foto: 'assets/jz.jpg',

  // Contador a distancia (zonas horarias IANA: https://en.wikipedia.org/wiki/List_of_tz_database_time_zones)
  // bandera: 'pe' (Perú) o 'ec' (Ecuador)
  tituloReloj: 'Contador a distancia',
  zonas: [
    { etiqueta: 'Mi ciudad · Lima', zona: 'America/Lima', bandera: 'pe' },
    { etiqueta: 'Tu ciudad · Ecuador', zona: 'America/Guayaquil', bandera: 'ec' },
  ],
  lemaDistancia: 'aunque estemos lejos, estamos en la misma pista',
  diferenciaTexto: 'nos separan {h} de reloj, pero ni un segundo de cariño',
  mismaHora: 'tenemos la misma hora, qué bonito 💙',

  botonFinal: '¿una vuelta más? 🏁',
};

/* =========================================================
   A partir de aquí no hace falta tocar nada
   ========================================================= */
const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];
const espera = ms => new Promise(r => setTimeout(r, ms));
const dosCuadros = () => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
const mqReducido = matchMedia('(prefers-reduced-motion: reduce)');
const reducido = () => mqReducido.matches;
const esMovil = () => document.documentElement.clientWidth < 768;
const SVGNS = 'http://www.w3.org/2000/svg';

const DUR = 1400, RETRASO = 120, DESATAR = 500, FUNDIDO = 400;

const leer = (k, def) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : def; } catch { return def; } };
const guardar = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* sin almacenamiento */ } };

const escenario = $('#escenario');
const carta = $('#carta');
const btnAbrir = $('#abrir');
const btnCerrar = $('#cerrar');
const pistaAbrir = $('#pista-abrir');
const extras = $('#extras');

/* ---------- Textos ---------- */
function pintarTextos() {
  $$('[data-c]').forEach(el => {
    const v = CONTENIDO[el.dataset.c];
    if (v != null) el.textContent = v;
  });
  $$('[data-banderas]').forEach(el => {
    el.innerHTML = el.dataset.banderas.split(' ').map(banderaSVG).join('<span class="corazon-flag" aria-hidden="true">♥</span>');
  });
  btnAbrir.setAttribute('aria-label', `Abrir la carta para ${CONTENIDO.nombre}`);
}

/* =========================================================
   Carritos (ilustraciones originales, vista desde arriba)
   ========================================================= */
const PALETAS = [
  { cuerpo: 'url(#g-metal)',  llama: '#FF7A1A', llama2: '#E6C878', franja: '#FAF7F0', aleron: '#FAF7F0' },
  { cuerpo: 'url(#g-perla)',  llama: '#1F3FA6', llama2: '#3A62D9', franja: '#1F3FA6', aleron: '#FF7A1A' },
  { cuerpo: 'url(#g-noche)',  llama: '#FAF7F0', llama2: '#E6C878', franja: '#FF7A1A', aleron: '#C9A24A' },
  { cuerpo: 'url(#g-perla)',  llama: '#FF7A1A', llama2: '#E6C878', franja: '#3A62D9', aleron: '#1F3FA6' },
  { cuerpo: 'url(#g-brillo)', llama: '#FAF7F0', llama2: '#FF7A1A', franja: '#0F1E4D', aleron: '#0F1E4D' },
  { cuerpo: 'url(#g-metal)',  llama: '#E6C878', llama2: '#FAF7F0', franja: '#FF7A1A', aleron: '#E6C878' },
];
const LLAMA = 'M13.5 0 C12 -3.5 8 -4.6 3 -5 C5 -3.8 4.5 -3.2 .5 -3.4 C3 -2.4 2.5 -1.6 -1.5 -1.2 C1 -.5 1 .5 -1.5 1.2 C2.5 1.6 3 2.4 .5 3.4 C4.5 3.2 5 3.8 3 5 C8 4.6 12 3.5 13.5 0 Z';

function carroSVG(p) {
  const rueda = (x, y, w, h) =>
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="1.9"/>` +
    `<rect class="rin" x="${x + w / 2 - 1.6}" y="${y + h / 2 - .8}" width="3.2" height="1.6" rx=".8"/>`;
  return `
    <g class="ruedas">
      ${rueda(-12.6, -9.8, 8.8, 4.8)}${rueda(-12.6, 5, 8.8, 4.8)}
      ${rueda(4.8, -9, 7.4, 4.2)}${rueda(4.8, 4.8, 7.4, 4.2)}
    </g>
    <path d="M-14 -5.6 C-15.6 -3 -15.6 3 -14 5.6 L-4 6.6 C2 6.9 9 6 13 3.6 C15.6 1.8 15.6 -1.8 13 -3.6 C9 -6 2 -6.9 -4 -6.6 Z"
          fill="${p.cuerpo}" stroke="#0F1E4D" stroke-width=".6"/>
    <rect x="-13.6" y="-1.7" width="7.4" height="1.1" rx=".5" fill="${p.franja}"/>
    <rect x="-13.6" y=".6" width="7.4" height="1.1" rx=".5" fill="${p.franja}"/>
    <path d="${LLAMA}" fill="${p.llama}"/>
    <path d="${LLAMA}" transform="translate(5.6 0) scale(.58)" fill="${p.llama2}"/>
    <path d="M-6 -4.1 C-2 -4.7 1 -4.1 2.6 -2.6 C3.3 -1 3.3 1 2.6 2.6 C1 4.1 -2 4.7 -6 4.1 C-7 1.5 -7 -1.5 -6 -4.1 Z"
          fill="url(#g-vidrio)" stroke="#0F1E4D" stroke-width=".5"/>
    <path d="M-4.6 -3 C-2.6 -3.3 -.6 -3 .6 -2.2" fill="none" stroke="#fff" stroke-width=".6" stroke-linecap="round" opacity=".8"/>
    <rect x="-16.4" y="-7.4" width="2.8" height="14.8" rx="1.1" fill="${p.aleron}" stroke="#0F1E4D" stroke-width=".4"/>
    <circle cx="13.6" cy="-2.6" r=".9" fill="#fff"/>
    <circle cx="13.6" cy="2.6" r=".9" fill="#fff"/>`;
}

/* ---------- Banderitas (SVG simple) ---------- */
function banderaSVG(codigo) {
  if (codigo === 'pe') {
    return `<svg class="bandera" viewBox="0 0 30 20" role="img" aria-label="Bandera de Perú">
      <rect width="30" height="20" fill="#fff"/>
      <rect width="10" height="20" fill="#D91023"/><rect x="20" width="10" height="20" fill="#D91023"/></svg>`;
  }
  if (codigo === 'ec') {
    return `<svg class="bandera" viewBox="0 0 30 20" role="img" aria-label="Bandera de Ecuador">
      <rect width="30" height="10" fill="#FFD100"/><rect y="10" width="30" height="5" fill="#034EA2"/>
      <rect y="15" width="30" height="5" fill="#ED1C24"/>
      <ellipse cx="15" cy="10" rx="2.6" ry="3.2" fill="#C9A24A" stroke="#034EA2" stroke-width=".6"/></svg>`;
  }
  return '';
}

/* =========================================================
   Portada: poster primero, luego video (mp4/webm) o GIF
   ========================================================= */
const POSTER = 'assets/portada-poster.jpg';
const videosPortada = [];

function probarImagen(src) {
  return new Promise(r => {
    const i = new Image();
    i.onload = () => r(true);
    i.onerror = () => r(false);
    i.src = src;
  });
}
function probarVideo(src, tipo) {
  return new Promise(r => {
    const v = document.createElement('video');
    if (!v.canPlayType(tipo)) return r(false);
    let listo = false;
    const fin = ok => { if (listo) return; listo = true; v.removeAttribute('src'); v.load(); r(ok); };
    v.muted = true;
    v.preload = 'metadata';
    v.onloadedmetadata = () => fin(true);
    v.onerror = () => fin(false);
    setTimeout(() => fin(false), 8000);
    v.src = src;
  });
}

function montarGif(src) {
  $$('.portada .capa-media').forEach(capa => {
    capa.style.backgroundImage = `url("${src}")`;
    capa.classList.add('cargada');
  });
  carta.classList.remove('sin-portada');
}

function montarVideo(src, hayPoster) {
  $$('.portada .capa-media').forEach(capa => {
    const v = document.createElement('video');
    v.className = 'video-portada';
    v.muted = true;
    v.defaultMuted = true;
    v.loop = true;
    v.playsInline = true;
    v.setAttribute('muted', '');
    v.setAttribute('playsinline', '');
    v.setAttribute('aria-hidden', 'true');
    v.preload = 'auto';
    if (hayPoster) v.poster = POSTER;
    v.src = src;
    capa.appendChild(v);
    videosPortada.push(v);
  });
  let listos = 0;
  videosPortada.forEach(v => v.addEventListener('canplay', () => {
    if (++listos === videosPortada.length) {
      videosPortada.forEach(x => { x.currentTime = 0; });
      reanudarPortada();
    }
  }, { once: true }));
  videosPortada[0].addEventListener('playing', () => {
    $$('.portada .capa-media').forEach(c => c.classList.add('cargada'));
    carta.classList.remove('sin-portada');
  }, { once: true });
  // Mantiene ambas mitades sincronizadas
  setInterval(() => {
    const [a, b] = videosPortada;
    if (!a.paused && Math.abs(a.currentTime - b.currentTime) > .1) b.currentTime = a.currentTime;
  }, 1000);
}
function pausarPortada() { videosPortada.forEach(v => v.pause()); }
function reanudarPortada() { videosPortada.forEach(v => { const p = v.play(); if (p) p.catch(() => {}); }); }

async function cargarPortada() {
  const hayPoster = await probarImagen(POSTER);
  if (!hayPoster) carta.classList.add('sin-portada');
  for (const [ext, tipo] of [['mp4', 'video/mp4'], ['webm', 'video/webm']]) {
    if (await probarVideo(`assets/portada.${ext}`, tipo)) { montarVideo(`assets/portada.${ext}`, hayPoster); return; }
  }
  if (await probarImagen('assets/portada.gif')) montarGif('assets/portada.gif');
}

/* =========================================================
   Interior: assets/interior.(mp4|webm|gif) + assets/interior.jpg
   Cada panel es un <canvas> con la proporción exacta (1:3, 2:3, 1:3).
   En él se dibujan "piezas" recortadas del archivo, agrandadas y
   centradas, con bordes suavizados sobre el color del papel.
   ========================================================= */
const INTERIOR = {
  base: [1440, 1080],          // tamaño del archivo para el que están medidos los recortes
  // Unidades del panel: la carta cerrada mide 760 × 1140 (cada lateral 380 × 1140).
  // recorte: [x, y, ancho, alto] en el archivo · escala: cuánto se agranda
  // arriba / abajo: distancia al borde del panel (si no hay, va centrada en vertical)
  paneles: {
    izq: [
      { recorte: [22, 252, 230, 400], escala: 1.4, arriba: 120 },     // "te amo" + párrafo
      { recorte: [5, 757, 247, 223], escala: 1.1, abajo: 70 },       // flor
    ],
    centro: [
      { recorte: [386, 142, 666, 838], escala: 1.12 },               // pista, "Te amo Jz", banderas
    ],
    der: [
      { recorte: [1078, 232, 260, 400], escala: 1.4, arriba: 80 },   // lazo + párrafo
      { recorte: [1085, 662, 268, 112], escala: 1.33, abajo: 330 },   // "Con cariño para ti, Soleil"
      { recorte: [1200, 767, 240, 213], escala: 1.1, abajo: 40 },    // flor
    ],
  },
  borde: 10,                   // suavizado de los bordes de cada pieza
  resolucion: 1.5,             // nitidez del canvas
  papelArriba: '#FDFAF1',      // color del papel arriba y abajo, para rellenar sin cortes
  papelAbajo: '#F4EBE0',
};
const INTERIOR_JPG = 'assets/interior.jpg';
const interior = { fuente: null, animada: false, lienzos: [], raf: 0, activo: false, ultimoTiempo: -1 };

// Máscara con bordes que se desvanecen, para que cada pieza se funda con el papel
function mascaraSuave(w, h, b) {
  const m = document.createElement('canvas');
  m.width = w; m.height = h;
  const c = m.getContext('2d');
  c.fillStyle = '#000';
  c.fillRect(0, 0, w, h);
  c.globalCompositeOperation = 'destination-out';
  const borde = (x0, y0, x1, y1, rx, ry, rw, rh) => {
    const g = c.createLinearGradient(x0, y0, x1, y1);
    g.addColorStop(0, 'rgba(0,0,0,1)');
    g.addColorStop(1, 'rgba(0,0,0,0)');
    c.fillStyle = g;
    c.fillRect(rx, ry, rw, rh);
  };
  borde(0, 0, b, 0, 0, 0, b, h);
  borde(w, 0, w - b, 0, w - b, 0, b, h);
  borde(0, 0, 0, b, 0, 0, w, b);
  borde(0, h, 0, h - b, 0, h - b, w, b);
  return m;
}

function crearLienzosInterior() {
  const R = INTERIOR.resolucion, H = 1140;
  interior.lienzos = $$('.interior').map(el => {
    const zona = el.dataset.zona;
    const W = zona === 'centro' ? 760 : 380;
    const cv = document.createElement('canvas');
    cv.width = Math.round(W * R);
    cv.height = Math.round(H * R);
    cv.setAttribute('aria-hidden', 'true');
    el.appendChild(cv);
    const ctx = cv.getContext('2d');
    ctx.setTransform(R, 0, 0, R, 0, 0);
    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, INTERIOR.papelArriba);
    grad.addColorStop(1, INTERIOR.papelAbajo);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);
    const piezas = INTERIOR.paneles[zona].map(p => {
      const [, , w, h] = p.recorte;
      const dw = w * p.escala, dh = h * p.escala;
      const dx = (W - dw) / 2;
      const dy = p.arriba != null ? p.arriba : p.abajo != null ? H - p.abajo - dh : (H - dh) / 2;
      const pw = Math.round(dw * R), ph = Math.round(dh * R);
      const tmp = document.createElement('canvas');
      tmp.width = pw; tmp.height = ph;
      return { ...p, dx, dy, dw, dh, tmp, tctx: tmp.getContext('2d'), mascara: mascaraSuave(pw, ph, INTERIOR.borde * R) };
    });
    return { ctx, W, H, grad, piezas };
  });
}

function pintarInterior(fuente, anchoFuente) {
  const k = anchoFuente / INTERIOR.base[0];
  for (const l of interior.lienzos) {
    l.ctx.fillStyle = l.grad;
    l.ctx.fillRect(0, 0, l.W, l.H);
    for (const p of l.piezas) {
      const [x, y, w, h] = p.recorte;
      const t = p.tctx;
      t.globalCompositeOperation = 'source-over';
      t.clearRect(0, 0, p.tmp.width, p.tmp.height);
      t.drawImage(fuente, x * k, y * k, w * k, h * k, 0, 0, p.tmp.width, p.tmp.height);
      t.globalCompositeOperation = 'destination-in';
      t.drawImage(p.mascara, 0, 0);
      l.ctx.drawImage(p.tmp, p.dx, p.dy, p.dw, p.dh);
    }
  }
}

function dibujarInterior() {
  const f = interior.fuente;
  if (f instanceof HTMLVideoElement) {
    if (f.readyState >= 2 && f.currentTime !== interior.ultimoTiempo) {
      interior.ultimoTiempo = f.currentTime;
      pintarInterior(f, f.videoWidth);
    }
  } else if (f) {
    pintarInterior(f, f.naturalWidth);       // GIF: cada cuadro toma el fotograma actual
  }
  interior.raf = requestAnimationFrame(dibujarInterior);
}

function reproducirInterior() {
  const f = interior.fuente;
  if (!f || !interior.animada || document.hidden) return;
  if (f instanceof HTMLVideoElement) { const p = f.play(); if (p) p.catch(() => {}); }
  if (!interior.raf) interior.raf = requestAnimationFrame(dibujarInterior);
}

function detenerInterior() {
  cancelAnimationFrame(interior.raf);
  interior.raf = 0;
  if (interior.fuente instanceof HTMLVideoElement) interior.fuente.pause();
}

// Se llama al empezar a abrir (para que las caras ya se vean mientras giran) y al terminar de cerrar
function interiorActivo(si) {
  interior.activo = si;
  if (si) reproducirInterior();
  else detenerInterior();
}

function usarFuenteAnimada(f) {
  interior.fuente = f;
  interior.animada = true;
  if (interior.activo) reproducirInterior();
}

function montarInteriorVideo(src) {
  const v = document.createElement('video');
  v.className = 'video-fuente';
  v.muted = true;
  v.defaultMuted = true;
  v.loop = true;
  v.playsInline = true;
  v.setAttribute('muted', '');
  v.setAttribute('playsinline', '');
  v.setAttribute('aria-hidden', 'true');
  v.preload = 'auto';
  v.src = src;
  document.body.appendChild(v);
  v.addEventListener('loadeddata', () => {
    pintarInterior(v, v.videoWidth);
    usarFuenteAnimada(v);
  }, { once: true });
  // Si el video falla, se queda dibujado el JPG
  v.addEventListener('error', () => {
    if (interior.fuente === v) { detenerInterior(); interior.fuente = null; interior.animada = false; }
    pintarJpg();
  });
}

let imgJpg = null;
function pintarJpg() {
  if (imgJpg && imgJpg.naturalWidth) pintarInterior(imgJpg, imgJpg.naturalWidth);
}

async function cargarInterior() {
  crearLienzosInterior();
  // 1) JPG fijo al toque (ya está precargado), para que nunca se vea un panel vacío
  imgJpg = new Image();
  imgJpg.onload = () => { if (!interior.animada) pintarJpg(); };
  imgJpg.src = INTERIOR_JPG;
  // 2) Versión animada: mp4 → webm → gif
  for (const [ext, tipo] of [['mp4', 'video/mp4'], ['webm', 'video/webm']]) {
    if (await probarVideo(`assets/interior.${ext}`, tipo)) { montarInteriorVideo(`assets/interior.${ext}`); return; }
  }
  const gif = new Image();
  gif.onload = () => usarFuenteAnimada(gif);
  gif.src = 'assets/interior.gif';
}

/* =========================================================
   Abrir / cerrar la carta
   ========================================================= */
const estado = { abierta: false, ocupada: false };

const medida = document.createElement('div');
medida.style.cssText = 'position:absolute;left:0;top:0;height:0;visibility:hidden;pointer-events:none;width:var(--card-w)';
document.body.appendChild(medida);

function actualizarEscala() {
  const w = medida.offsetWidth;
  const vw = document.documentElement.clientWidth;
  const e = Math.min(1, (vw * 0.94) / (2 * w));
  escenario.style.setProperty('--escala', e.toFixed(4));
}

// Cambia de layout (3D ↔ apilado) con un fundido rápido
async function cambiarLayout(apilar) {
  escenario.classList.add('fundido');
  await espera(FUNDIDO);
  escenario.classList.add('sin-transicion');
  escenario.classList.toggle('apilada', apilar);
  await dosCuadros();
  escenario.classList.remove('sin-transicion');
  escenario.classList.remove('fundido');
}

async function abrir() {
  if (estado.abierta || estado.ocupada) return;
  estado.ocupada = true;
  btnAbrir.setAttribute('aria-expanded', 'true');
  actualizarEscala();
  interiorActivo(true);

  if (reducido()) {
    escenario.classList.add('fundido');
    await espera(FUNDIDO);
    escenario.classList.add('desatada', 'abierta');
    if (esMovil()) escenario.classList.add('apilada');
    await dosCuadros();
    escenario.classList.remove('fundido');
    await espera(FUNDIDO);
  } else {
    escenario.classList.add('desatada');
    await espera(DESATAR);
    escenario.classList.add('abierta');
    await espera(DUR + RETRASO + 80);
    if (esMovil()) await cambiarLayout(true);
  }

  btnAbrir.hidden = true;
  pausarPortada();
  pistaAbrir.textContent = CONTENIDO.pistaAbierta;
  extras.hidden = false;
  requestAnimationFrame(() => extras.classList.add('visible'));
  btnCerrar.hidden = false;
  $('#panel-izq').focus({ preventScroll: true });
  estado.abierta = true;
  estado.ocupada = false;
}

async function cerrar() {
  if (!estado.abierta || estado.ocupada) return;
  estado.ocupada = true;
  btnCerrar.hidden = true;
  extras.classList.remove('visible');
  extras.hidden = true;
  window.scrollTo({ top: 0, behavior: 'auto' });

  if (reducido()) {
    escenario.classList.add('fundido');
    await espera(FUNDIDO);
    escenario.classList.remove('apilada', 'abierta', 'desatada');
    btnAbrir.hidden = false;
    await dosCuadros();
    escenario.classList.remove('fundido');
    await espera(FUNDIDO);
  } else {
    if (escenario.classList.contains('apilada')) await cambiarLayout(false);
    btnAbrir.hidden = false;
    escenario.classList.remove('abierta');
    await espera(DUR + RETRASO + 80);
    escenario.classList.remove('desatada');
    await espera(DESATAR);
  }

  interiorActivo(false);
  reanudarPortada();
  pistaAbrir.textContent = CONTENIDO.pistaAbrir;
  btnAbrir.setAttribute('aria-expanded', 'false');
  btnAbrir.focus({ preventScroll: true });
  estado.abierta = false;
  estado.ocupada = false;
}

let timerResize = 0;
window.addEventListener('resize', () => {
  clearTimeout(timerResize);
  timerResize = setTimeout(() => {
    actualizarEscala();
    if (!estado.abierta || estado.ocupada) return;
    const apilada = escenario.classList.contains('apilada');
    if (esMovil() && !apilada) cambiarLayout(true);
    else if (!esMovil() && apilada) cambiarLayout(false);
  }, 150);
});

/* =========================================================
   Pétalos azul rey cayendo (canvas ligero)
   ========================================================= */
function iniciarPetalos() {
  const cv = $('#petalos');
  const ctx = cv.getContext('2d');
  if (!ctx) return;
  let w = 0, h = 0, raf = 0, ultimo = 0;

  const sprite = document.createElement('canvas');
  sprite.width = 80; sprite.height = 112;
  const s = sprite.getContext('2d');
  const grad = s.createLinearGradient(0, 0, 80, 112);
  grad.addColorStop(0, '#5f83ee');
  grad.addColorStop(.45, '#1F3FA6');
  grad.addColorStop(1, '#0F1E4D');
  s.fillStyle = grad;
  s.beginPath();
  s.moveTo(40, 108);
  s.bezierCurveTo(4, 80, 0, 28, 40, 4);
  s.bezierCurveTo(80, 28, 76, 80, 40, 108);
  s.fill();
  s.strokeStyle = 'rgba(255,255,255,.4)';
  s.lineWidth = 3;
  s.lineCap = 'round';
  s.beginPath();
  s.moveTo(28, 24);
  s.quadraticCurveTo(22, 54, 32, 84);
  s.stroke();

  const nPetalos = innerWidth < 600 ? 16 : 25;
  const nBrillos = innerWidth < 600 ? 8 : 14;
  let petalos = [], brillos = [];

  const nuevoPetalo = inicio => ({
    x: Math.random() * w,
    y: inicio ? Math.random() * h : -40,
    t: 10 + Math.random() * 12,
    vy: 16 + Math.random() * 24,
    fase: Math.random() * 6.28,
    vf: .5 + Math.random() * 1.1,
    rot: Math.random() * 6.28,
    vr: (Math.random() - .5) * .9,
    amp: 14 + Math.random() * 26,
    a: .5 + Math.random() * .35,
  });
  const nuevoBrillo = () => ({
    x: Math.random() * w, y: Math.random() * h,
    r: .7 + Math.random() * 1.3, fase: Math.random() * 6.28, vf: .6 + Math.random() * 1.2,
  });

  function ajustar() {
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    w = innerWidth; h = innerHeight;
    cv.width = Math.round(w * dpr);
    cv.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (!petalos.length) {
      petalos = Array.from({ length: nPetalos }, () => nuevoPetalo(true));
      brillos = Array.from({ length: nBrillos }, nuevoBrillo);
    }
  }

  function dibujar(dt) {
    ctx.clearRect(0, 0, w, h);
    for (const b of brillos) {
      b.fase += b.vf * dt;
      b.y -= 4 * dt;
      if (b.y < -5) { b.y = h + 5; b.x = Math.random() * w; }
      ctx.fillStyle = `rgba(230,200,120,${(.08 + .3 * (Math.sin(b.fase) * .5 + .5)).toFixed(3)})`;
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.r, 0, 6.283);
      ctx.fill();
    }
    for (const p of petalos) {
      p.y += p.vy * dt;
      p.fase += p.vf * dt;
      p.rot += p.vr * dt;
      if (p.y > h + 40) Object.assign(p, nuevoPetalo(false));
      const x = p.x + Math.sin(p.fase) * p.amp;
      ctx.save();
      ctx.globalAlpha = p.a;
      ctx.translate(x, p.y);
      ctx.rotate(p.rot);
      ctx.scale(.3 + .7 * Math.abs(Math.cos(p.fase * 1.3)), 1);
      ctx.drawImage(sprite, -p.t / 2, -p.t * .7, p.t, p.t * 1.4);
      ctx.restore();
    }
  }

  function bucle(t) {
    const dt = Math.min(60, t - (ultimo || t)) / 1000;
    ultimo = t;
    dibujar(dt);
    raf = requestAnimationFrame(bucle);
  }
  function arrancar() {
    if (raf || reducido() || document.hidden) return;
    ultimo = 0;
    raf = requestAnimationFrame(bucle);
  }
  function parar() { cancelAnimationFrame(raf); raf = 0; }

  ajustar();
  dibujar(0);
  arrancar();
  window.addEventListener('resize', () => { ajustar(); if (!raf) dibujar(0); });
  document.addEventListener('visibilitychange', () => (document.hidden ? parar() : arrancar()));
  mqReducido.addEventListener?.('change', () => (reducido() ? parar() : arrancar()));
}

/* =========================================================
   Garaje de razones
   ========================================================= */
function iniciarGaraje() {
  const repisa = $('#repisa');
  const tarjeta = $('#tarjetita');
  const progreso = $('#progreso');
  const total = CONTENIDO.razones.length;
  const vistas = new Set(leer('jz-razones-vistas', []).filter(i => i < total));

  const pintarProgreso = () => {
    progreso.textContent = vistas.size >= total
      ? CONTENIDO.razonesCompletas
      : CONTENIDO.razonesProgreso.replace('{n}', vistas.size).replace('{total}', total);
  };

  CONTENIDO.razones.forEach((txt, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'auto-repisa';
    b.innerHTML = `<svg viewBox="-19 -13 38 26" aria-hidden="true">${carroSVG(PALETAS[i % PALETAS.length])}</svg><span>#${i + 1}</span>`;
    const etiquetar = () => b.setAttribute('aria-label', `Razón ${i + 1}${vistas.has(i) ? ' (ya la viste)' : ''}`);
    if (vistas.has(i)) b.classList.add('vista');
    etiquetar();
    b.addEventListener('click', () => {
      $$('.auto-repisa', repisa).forEach(x => x.classList.remove('activa'));
      b.classList.add('activa', 'vista');
      vistas.add(i);
      guardar('jz-razones-vistas', [...vistas]);
      etiquetar();
      $('#tarjetita-num').textContent = `Razón #${i + 1}`;
      $('#tarjetita-txt').textContent = txt;
      tarjeta.hidden = false;
      tarjeta.classList.remove('salta');
      void tarjeta.offsetWidth;
      tarjeta.classList.add('salta');
      pintarProgreso();
    });
    repisa.appendChild(b);
  });
  pintarProgreso();
}

/* =========================================================
   Licencia de conducir del corazón
   ========================================================= */
const AVATAR = `
<svg viewBox="0 0 120 160" role="img" aria-label="Avatar dibujado de ${CONTENIDO.nombre} con casco de piloto">
  <rect width="120" height="160" fill="#E3E9F8"/>
  <path d="M14 18 l1.6 4 4 1.6 -4 1.6 -1.6 4 -1.6 -4 -4 -1.6 4 -1.6z M104 34 l1.2 3 3 1.2 -3 1.2 -1.2 3 -1.2 -3 -3 -1.2 3 -1.2z" fill="#C9A24A"/>
  <path d="M16 160 C18 128 38 114 60 114 C82 114 102 128 104 160 Z" fill="url(#g-metal)"/>
  <path d="M50 114 L60 130 L70 114 Z" fill="#FAF7F0"/>
  <path d="M30 140 C40 136 46 146 56 142" stroke="#FF7A1A" stroke-width="3" fill="none" stroke-linecap="round"/>
  <circle cx="60" cy="72" r="40" fill="url(#g-metal)" stroke="#0F1E4D" stroke-width="1.5"/>
  <path d="M55 32.5 C57 32 63 32 65 32.5 L65 52 L55 52 Z" fill="#FF7A1A"/>
  <path d="M26 70 C26 58 36 54 60 54 C84 54 94 58 94 70 C94 86 84 92 60 92 C36 92 26 86 26 70 Z" fill="#0F1E4D"/>
  <path d="M32 66 C36 60 46 58 54 59" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round" opacity=".55"/>
  <path d="M68 78 C62 73 62 68 65 66.5 C67.4 65.4 69.4 67 70 68.6 C70.8 67 72.8 65.4 75 66.6 C78 68.4 76 73.6 70 78 Z" fill="#E6C878"/>
  <path d="M40 104 C44 110 76 110 80 104" stroke="#FAF7F0" stroke-width="3" fill="none" stroke-linecap="round"/>
</svg>`;

function iniciarLicencia() {
  const img = $('#lic-foto');
  const caja = $('#lic-foto-caja');
  img.alt = `Foto de ${CONTENIDO.nombre}`;
  img.addEventListener('error', () => { caja.innerHTML = AVATAR; }, { once: true });
  img.src = CONTENIDO.foto;
  $('#lic-emision').textContent = new Intl.DateTimeFormat('es-PE', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date());
}

/* =========================================================
   Contador a distancia
   ========================================================= */
function desfaseMinutos(zona, fecha) {
  const partes = new Intl.DateTimeFormat('en-US', {
    timeZone: zona, hourCycle: 'h23', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit',
  }).formatToParts(fecha);
  const g = t => +partes.find(x => x.type === t).value;
  const local = Date.UTC(g('year'), g('month') - 1, g('day'), g('hour'), g('minute'));
  return Math.round((local - Math.floor(fecha.getTime() / 60000) * 60000) / 60000);
}

function iniciarReloj() {
  const cont = $('#relojes');
  const zonas = CONTENIDO.zonas.slice(0, 2);
  const items = zonas.map(z => {
    const div = document.createElement('div');
    div.className = 'reloj-item';
    div.innerHTML = '<p class="reloj-etiqueta"></p><p class="reloj-hora">--:--</p><p class="reloj-fecha"></p>';
    const etq = div.querySelector('.reloj-etiqueta');
    etq.innerHTML = banderaSVG(z.bandera);
    etq.append(z.etiqueta);
    let fh = null, ff = null;
    try {
      fh = new Intl.DateTimeFormat('es-PE', { timeZone: z.zona, hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true });
      ff = new Intl.DateTimeFormat('es-PE', { timeZone: z.zona, weekday: 'long', day: 'numeric', month: 'long' });
    } catch { /* zona inválida */ }
    return { div, fh, ff, zona: z.zona };
  });
  cont.appendChild(items[0].div);
  const mini = document.createElementNS(SVGNS, 'svg');
  mini.setAttribute('class', 'reloj-pista');
  mini.setAttribute('viewBox', '0 0 74 30');
  mini.setAttribute('aria-hidden', 'true');
  mini.innerHTML = `
    <path d="M4 15 C20 3 54 27 70 15" fill="none" stroke="#fff" stroke-width="12" stroke-linecap="round"/>
    <path d="M4 15 C20 3 54 27 70 15" fill="none" stroke="#FF7A1A" stroke-width="9" stroke-linecap="round"/>
    <path d="M4 15 C20 3 54 27 70 15" fill="none" stroke="#fff" stroke-width=".8" stroke-dasharray="3 3"/>
    <g transform="translate(37 15) rotate(10) scale(.55)">${carroSVG(PALETAS[0])}</g>`;
  if (items[1]) {
    cont.appendChild(mini);
    cont.appendChild(items[1].div);
  }

  const dif = $('#diferencia');
  function tic() {
    const ahora = new Date();
    items.forEach(it => {
      if (!it.fh) return;
      it.div.querySelector('.reloj-hora').textContent = it.fh.format(ahora);
      it.div.querySelector('.reloj-fecha').textContent = it.ff.format(ahora);
    });
    if (items.length === 2) {
      try {
        const m = Math.abs(desfaseMinutos(items[0].zona, ahora) - desfaseMinutos(items[1].zona, ahora));
        if (m === 0) dif.textContent = CONTENIDO.mismaHora;
        else {
          const h = m / 60;
          const hTxt = (Number.isInteger(h) ? h : h.toFixed(1).replace('.', ',')) + (h === 1 ? ' hora' : ' horas');
          dif.textContent = CONTENIDO.diferenciaTexto.replace('{h}', hTxt);
        }
      } catch { dif.textContent = ''; }
    }
  }
  tic();
  setInterval(tic, 1000);
}

/* =========================================================
   Inicio
   ========================================================= */
pintarTextos();
iniciarGaraje();
iniciarLicencia();
iniciarReloj();
actualizarEscala();
iniciarPetalos();

btnAbrir.addEventListener('click', abrir);
btnCerrar.addEventListener('click', cerrar);
document.addEventListener('keydown', e => { if (e.key === 'Escape') cerrar(); });
$('#vuelta').addEventListener('click', async () => {
  await cerrar();
  await espera(350);
  abrir();
});
document.addEventListener('visibilitychange', () => {
  if (document.hidden) detenerInterior();
  else if (interior.activo) reproducirInterior();
});

const cargarMedios = () => { cargarPortada(); cargarInterior(); };
if (document.readyState === 'complete') cargarMedios();
else window.addEventListener('load', cargarMedios, { once: true });

// Atajo para probar: abre la carta directo con …/#abierta
if (location.hash === '#abierta') setTimeout(abrir, 300);
