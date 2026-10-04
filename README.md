# Carta gatefold digital 💙

Una carta de amor interactiva en formato **gatefold** (dos solapas que se abren) hecha con HTML, CSS y JavaScript puro — sin frameworks, sin dependencias.  
Pensada para adaptar a tu propia historia, personajes de anime, pareja o cualquier persona especial.

---

## Demo en vivo

> Sube la tuya y pon el link aquí.

---

## ¿Qué incluye?

| Función | Descripción |
|---|---|
| **Portada animada** | Video/GIF/JPG que cubre las dos solapas cerradas |
| **Animación gatefold 3D** | Las solapas se abren con perspectiva CSS, como un sobre de verdad |
| **Interior con video** | El interior viene de un archivo de video o imagen que tú pones |
| **Pétalos y brillos** | Canvas con pétalos que caen y destellos dorados de fondo |
| **Garaje de razones** | 6 carticos ocultos que se revelan uno a uno |
| **Licencia de conducir** | Carnecito personalizado con foto, nombre y firma |
| **Reloj de distancia** | Dos zonas horarias en vivo con banderas |
| **Responsive** | 3D en escritorio, apilado vertical en celular |
| **Accesibilidad** | aria-labels, prefers-reduced-motion, foco de teclado |

---

## Cómo personalizar

### 1. Editar el texto

Abre `script.js` y busca el objeto `CONTENIDO` al principio del archivo.  
Cambia los textos, nombre, firma, razones, zonas horarias, etc.

```js
const CONTENIDO = {
  nombre: 'Jz',           // nombre de quien recibe la carta
  firma: 'Soleil',        // tu nombre
  rotuloPortada: 'para Jz 💙',
  // ...
  razones: [
    'Porque tu risa hace que todo valga la pena',
    // 6 razones en total
  ],
  zonas: [
    { etiqueta: 'Mi ciudad · Lima', zona: 'America/Lima', bandera: 'pe' },
    { etiqueta: 'Tu ciudad · Ecuador', zona: 'America/Guayaquil', bandera: 'ec' },
  ],
  // ...
};
```

Los códigos de bandera (`bandera: 'pe'`) usan el formato ISO 3166-1 alpha-2 (pe = Perú, ec = Ecuador, mx = México, ar = Argentina, jp = Japón, etc.).

---

### 2. Reemplazar los archivos multimedia

Pon tus propios archivos en la carpeta `assets/`:

| Archivo | Para qué sirve | Dimensiones recomendadas |
|---|---|---|
| `portada.webm` (o `.mp4`, `.gif`) | Animación de la portada cerrada | 1080 × 1620 px (proporción 2:3) |
| `portada-poster.jpg` | Primer cuadro de la portada (se carga primero) | Mismas dimensiones |
| `interior.webm` (o `.mp4`, `.gif`) | Interior de la carta al abrirse | 1440 × 1080 px (proporción 4:3) |
| `interior.jpg` | Primer cuadro del interior (fallback) | Mismas dimensiones |
| `jz.jpg` | Foto para la licencia de conducir | Cualquier tamaño, preferible 3:4 |

Si no tienes video, con solo el JPG funciona igual.

---

### 3. Ajustar las piezas del interior

El interior se dibuja por piezas recortadas del archivo `interior.webm/jpg`.  
Si tu archivo tiene las cosas en posiciones diferentes, edita el objeto `INTERIOR` en `script.js`:

```js
const INTERIOR = {
  base: [1440, 1080],   // dimensiones de tu archivo interior
  paneles: {
    izq: [
      // cada pieza: [x, y, ancho, alto en el archivo], escala, arriba/abajo en el panel
      { recorte: [22, 252, 230, 400], escala: 1.4, arriba: 120 },
      { recorte: [5, 757, 247, 223], escala: 1.1, abajo: 70 },
    ],
    centro: [
      { recorte: [386, 142, 666, 838], escala: 1.12 },
    ],
    der: [
      { recorte: [1078, 232, 260, 400], escala: 1.4, arriba: 80 },
      { recorte: [1085, 662, 268, 112], escala: 1.33, abajo: 330 },
      { recorte: [1200, 767, 240, 213], escala: 1.1, abajo: 40 },
    ],
  },
};
```

> **Tip:** Para saber en qué coordenadas está algo en tu imagen, ábrela en Photoshop, GIMP o incluso en el Paint y lee el cursor cuando lo pones sobre ese punto.

---

### 4. Adaptar a tu anime o historia

- Cambia la paleta de colores en `styles.css`, sección de variables `--azul-rey`, `--dorado-veta`, etc.
- Reemplaza el SVG del lazo (`<svg class="lazo">` en `index.html`) por el símbolo o elemento de tu historia.
- Cambia las fuentes en el `<link>` de Google Fonts en `index.html` — Caveat y Patrick Hand dan ese toque escrito a mano, pero puedes usar cualquier otra.
- El fondo del papel (textura) está en `assets/marmol.svg` — puedes cambiarlo por cualquier SVG o imagen.

---

## Estructura del proyecto

```
gift1_jz/
├── index.html        # estructura HTML de la carta
├── styles.css        # estilos y animaciones CSS
├── script.js         # toda la lógica (edita CONTENIDO arriba del archivo)
└── assets/
    ├── portada.webm       # video de la portada
    ├── portada-poster.jpg # primer cuadro de la portada
    ├── interior.webm      # video del interior
    ├── interior.jpg       # primer cuadro del interior
    ├── jz.jpg             # foto para la licencia (opcional)
    ├── marmol.svg         # textura de fondo del papel
    └── estrella.svg       # estrellita decorativa
```

---

## Cómo desplegarlo (Vercel, gratis)

1. Crea una cuenta en [vercel.com](https://vercel.com) si no tienes.
2. Instala la CLI: `npm i -g vercel`
3. Desde la carpeta del proyecto: `npx vercel --prod`
4. Listo — te da un link que puedes mandarle a quien quieras.

También puedes arrastrarlo a [Netlify Drop](https://app.netlify.com/drop) sin instalar nada.

---

## Licencia

Úsalo, adáptalo, compártelo — sin restricciones.  
Si lo compartes en redes y quieres dar crédito, con mencionar este repositorio alcanza 💙
