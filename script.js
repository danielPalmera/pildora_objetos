/* ============================================================
   SCRIPT.JS — Objetos en JavaScript: Demo Interactiva
   ============================================================
   Estado global compartido entre las 3 secciones.
   El objeto "personaje" viaja por toda la aplicación.
============================================================ */

// ─────────────────────────────────────────────────────────────
// 1. ESTADO GLOBAL
// ─────────────────────────────────────────────────────────────

/**
 * Objeto global del personaje.
 * Creado en la Sección 1 (Ruddy), modificado en Sección 2 (Ana),
 * y utilizado en el combate de la Sección 3 (Dani).
 */
let personaje = null;

/**
 * Objeto del enemigo.
 * Definido en la Sección 3 (Dani).
 * Demuestra cómo dos objetos interactúan entre sí.
 */
let enemigo = {
  nombre:   "Zarak el Oscuro",
  clase:    "Nigromante",
  vida:     120,
  vidaMax:  120,
  ataque:   12,
  nivel:    3,
  activo:   true,

  // Método dentro del objeto enemigo
  presentarse() {
    return `Soy ${this.nombre}, ${this.clase} nivel ${this.nivel}. ¡Tiembla!`;
  }
};

// Vidas máximas para la barra de progreso
let personajeVidaMax = 100;


// ─────────────────────────────────────────────────────────────
// 2. NAVEGACIÓN — cambiarTab()
// ─────────────────────────────────────────────────────────────

/**
 * Cambia la sección visible.
 * @param {number} index - Índice del tab (0, 1 o 2)
 */
function cambiarTab(index) {
  // Ocultar todas las secciones
  document.querySelectorAll('.tab-section').forEach(sec => {
    sec.classList.remove('active');
  });

  // Desactivar todos los tabs
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.remove('active');
  });

  // Activar la sección y el tab seleccionados
  document.getElementById(`section-${index}`).classList.add('active');
  document.querySelector(`[data-tab="${index}"]`).classList.add('active');

  // Si entramos en la sección 2 (Ana), refrescar el estado
  if (index === 1) refrescarEstado();

  // Si entramos en la sección 3 (Dani), sincronizar la UI de batalla
  if (index === 2) sincronizarBatalla();
}

// Navegación desde los avatares del header
document.querySelectorAll('.presenter').forEach(p => {
  p.addEventListener('click', () => {
    cambiarTab(parseInt(p.dataset.section));
  });
});


// ─────────────────────────────────────────────────────────────
// 3. SECCIÓN 1 — RUDDY: Fundamentos
// ─────────────────────────────────────────────────────────────

/**
 * DEMO 1: Crea el objeto personaje con notación literal.
 * Guarda el resultado en la variable global `personaje`.
 */
function crearPersonaje() {
  // Leer los valores de los inputs
  const nombre = document.getElementById('inp-nombre').value.trim() || "Kael";
  const clase  = document.getElementById('inp-clase').value;
  const vida   = parseInt(document.getElementById('inp-vida').value)   || 100;
  const ataque = parseInt(document.getElementById('inp-ataque').value) || 15;
  const activo = document.getElementById('inp-activo').value === "true";

  // ── NOTACIÓN LITERAL DE OBJETO ──────────────────────────
  // Aquí se crea el objeto con pares clave: valor
  personaje = {
    nombre:  nombre,   // clave: valor (string)
    clase:   clase,    // clave: valor (string)
    vida:    vida,     // clave: valor (number)
    vidaMax: vida,     // vida máxima para la barra
    ataque:  ataque,   // clave: valor (number)
    nivel:   1,        // valor por defecto
    activo:  activo,   // clave: valor (boolean)

    // ── MÉTODO con 'this' ──────────────────────────────────
    // 'this' dentro del método se refiere al propio objeto
    presentarse() {
      return `Soy ${this.nombre}, un ${this.clase} nivel ${this.nivel}. ` +
             `Tengo ${this.vida} de vida y ${this.ataque} de ataque.`;
    }
  };

  // Guardar vida máxima en variable separada (para la barra)
  personajeVidaMax = vida;

  // Actualizar la barra de estado del objeto en la nav
  actualizarNavStatus();

  // Mostrar output de éxito
  mostrarOutput('output-crear', 'success',
    `✅ Objeto creado: <strong>personaje.nombre</strong> = "${personaje.nombre}" | ` +
    `<strong>personaje.vida</strong> = ${personaje.vida} | ` +
    `<strong>personaje.ataque</strong> = ${personaje.ataque}`
  );

  // Mostrar el código generado
  const codeEl = document.getElementById('code-personaje');
  const textEl = document.getElementById('code-personaje-text');
  codeEl.classList.remove('hidden');
  textEl.textContent =
`let personaje = {
  nombre:  "${personaje.nombre}",
  clase:   "${personaje.clase}",
  vida:    ${personaje.vida},
  vidaMax: ${personaje.vidaMax},
  ataque:  ${personaje.ataque},
  nivel:   ${personaje.nivel},
  activo:  ${personaje.activo},

  presentarse() {
    return \`Soy \${this.nombre}, un \${this.clase} nivel \${this.nivel}.\`;
  //              ↑ this = el propio objeto personaje
  }
};`;
}

/**
 * DEMO 2 — Dot Notation: lee personaje.propiedad
 */
function leerDot() {
  if (!validarPersonaje('dot-output', true)) return;

  const key = document.getElementById('dot-key').value.trim();
  const output = document.getElementById('dot-output');

  if (key in personaje) {
    // Dot notation: personaje.nombre, personaje.vida, etc.
    const valor = personaje[key]; // equivalente a personaje.key
    output.classList.remove('hidden');
    output.textContent = `personaje.${key} → ${JSON.stringify(valor)}`;
  } else {
    output.classList.remove('hidden');
    output.textContent = `❌ La propiedad "${key}" no existe en personaje`;
    output.style.color = 'var(--red)';
  }
}

/**
 * DEMO 2 — Bracket Notation: lee personaje["propiedad"]
 */
function leerBracket() {
  if (!validarPersonaje('bracket-output', true)) return;

  const key = document.getElementById('bracket-key').value.trim();
  const output = document.getElementById('bracket-output');

  if (key in personaje) {
    // Bracket notation — útil cuando la clave está en una variable
    const valor = personaje[key];
    output.classList.remove('hidden');
    output.textContent = `personaje["${key}"] → ${JSON.stringify(valor)}`;
  } else {
    output.classList.remove('hidden');
    output.textContent = `❌ La propiedad "${key}" no existe`;
  }
}

/**
 * DEMO 3 — Llama al método personaje.presentarse()
 */
function llamarMetodo() {
  if (!validarPersonaje('output-metodo')) return;

  // Los métodos se llaman igual que cualquier función, pero con el objeto delante
  const mensaje = personaje.presentarse();

  mostrarOutput('output-metodo', 'info',
    `<strong>personaje.presentarse()</strong> devuelve:<br>"${mensaje}"`
  );
}

/**
 * DEMO 4 — Destructuring
 */
function mostrarDestructuring() {
  if (!validarPersonaje('output-destructuring')) return;

  // ── DESTRUCTURING ──────────────────────────────────────────
  // Extraer propiedades en variables locales de forma elegante
  const { nombre, vida, clase, ataque } = personaje;

  mostrarOutput('output-destructuring', 'success',
    `<strong>Destructuring aplicado:</strong><br>` +
    `const { nombre, vida, clase, ataque } = personaje;<br><br>` +
    `→ nombre = "${nombre}"<br>` +
    `→ vida = ${vida}<br>` +
    `→ clase = "${clase}"<br>` +
    `→ ataque = ${ataque}`
  );
}


// ─────────────────────────────────────────────────────────────
// 4. SECCIÓN 2 — ANA: Manipulación avanzada
// ─────────────────────────────────────────────────────────────

/**
 * Refresca la tarjeta de estado del objeto personaje.
 */
function refrescarEstado() {
  const box = document.getElementById('estado-personaje');

  if (!personaje) {
    box.innerHTML = '<span class="estado-empty">Crea primero el personaje en la Sección 01 →</span>';
    return;
  }

  // Construimos una vista HTML del objeto
  let html = '<span class="estado-label">let personaje = {</span>';
  for (const [clave, valor] of Object.entries(personaje)) {
    // Saltamos los métodos (funciones) para la vista
    if (typeof valor === 'function') continue;
    const valStr = typeof valor === 'string' ? `"${valor}"` : String(valor);
    html += `<span>&nbsp;&nbsp;<span class="estado-key">${clave}</span>: <span class="estado-val">${valStr}</span>,</span>`;
  }
  html += '<span class="estado-label">}</span>';
  box.innerHTML = html;
}

/**
 * DEMO 5 — Spread Operator: crea una copia sin mutar el original
 */
function aplicarSpread() {
  if (!validarPersonaje('output-spread')) return;

  const nivel     = parseInt(document.getElementById('spread-nivel').value)    || 2;
  const bonusAtk  = parseInt(document.getElementById('spread-bonus').value)    || 5;
  const habilidad = document.getElementById('spread-habilidad').value.trim()   || "Bola de fuego";

  // ── SPREAD OPERATOR ────────────────────────────────────────
  // El operador ... copia todas las propiedades al nuevo objeto.
  // Las propiedades posteriores sobreescriben las anteriores.
  // ¡El objeto original NO se modifica!
  const personajeMejorado = {
    ...personaje,                              // copia todo de personaje
    nivel:      nivel,                         // sobreescribe nivel
    ataque:     personaje.ataque + bonusAtk,  // aumenta el ataque
    habilidad:  habilidad                      // nueva propiedad
  };

  mostrarOutput('output-spread', 'success',
    `<strong>Copia creada con spread (sin mutar el original):</strong><br><br>` +
    `personajeMejorado.nivel = <strong>${personajeMejorado.nivel}</strong><br>` +
    `personajeMejorado.ataque = <strong>${personajeMejorado.ataque}</strong> ` +
      `(era ${personaje.ataque} + ${bonusAtk})<br>` +
    `personajeMejorado.habilidad = <strong>"${habilidad}"</strong> (nueva propiedad)<br><br>` +
    `personaje.ataque sigue siendo <strong>${personaje.ataque}</strong> ✅ (sin cambios)`
  );
}

/**
 * DEMO 6 — Object.keys()
 */
function mostrarKeys() {
  if (!validarPersonaje('out-keys')) return;

  // Object.keys() devuelve un array con las claves del objeto
  const claves = Object.keys(personaje).filter(k => typeof personaje[k] !== 'function');

  const el = document.getElementById('out-keys');
  el.classList.remove('hidden');
  el.textContent = `Object.keys(personaje) → [${claves.map(c => `"${c}"`).join(', ')}]`;
}

/**
 * DEMO 6 — Object.values()
 */
function mostrarValues() {
  if (!validarPersonaje('out-values')) return;

  // Object.values() devuelve un array con los valores del objeto
  const valores = Object.entries(personaje)
    .filter(([, v]) => typeof v !== 'function')
    .map(([, v]) => JSON.stringify(v));

  const el = document.getElementById('out-values');
  el.classList.remove('hidden');
  el.textContent = `Object.values(personaje) → [${valores.join(', ')}]`;
}

/**
 * DEMO 6 — Object.entries()
 */
function mostrarEntries() {
  if (!validarPersonaje('out-entries')) return;

  // Object.entries() devuelve un array de pares [clave, valor]
  const entries = Object.entries(personaje)
    .filter(([, v]) => typeof v !== 'function')
    .map(([k, v]) => `["${k}", ${JSON.stringify(v)}]`)
    .join(', ');

  const el = document.getElementById('out-entries');
  el.classList.remove('hidden');
  el.textContent = `Object.entries() → [${entries}]`;
}

/**
 * DEMO TypeScript — Simula la validación de tipos
 */
function validarTipo() {
  // Mapa de tipos esperados (simula una interface de TypeScript)
  const interfacePersonaje = {
    nombre: 'string',
    vida:   'number',
    ataque: 'number',
    activo: 'boolean'
  };

  const key   = document.getElementById('ts-key').value;
  const rawVal = document.getElementById('ts-value').value.trim();
  const tipoEsperado = interfacePersonaje[key];

  // Intentar inferir el tipo del valor introducido
  let valorParseado;
  let tipoRecibido;

  if (rawVal === 'true' || rawVal === 'false') {
    valorParseado = rawVal === 'true';
    tipoRecibido = 'boolean';
  } else if (!isNaN(rawVal) && rawVal !== '') {
    valorParseado = Number(rawVal);
    tipoRecibido = 'number';
  } else {
    valorParseado = rawVal;
    tipoRecibido = 'string';
  }

  if (tipoRecibido === tipoEsperado) {
    mostrarOutput('output-ts', 'success',
      `✅ <strong>TypeScript: OK</strong><br>` +
      `personaje.${key} = ${JSON.stringify(valorParseado)}<br>` +
      `Tipo recibido: <strong>${tipoRecibido}</strong> | Tipo esperado: <strong>${tipoEsperado}</strong>`
    );
  } else {
    mostrarOutput('output-ts', 'error',
      `❌ <strong>TypeScript Error</strong><br>` +
      `Type '${tipoRecibido}' is not assignable to type '${tipoEsperado}'.<br>` +
      `→ personaje.${key} espera un <strong>${tipoEsperado}</strong>, pero recibió un <strong>${tipoRecibido}</strong>.`
    );
  }
}


// ─────────────────────────────────────────────────────────────
// 5. SECCIÓN 3 — DANI: Batalla
// ─────────────────────────────────────────────────────────────

/**
 * Sincroniza la UI de batalla con el estado actual del personaje.
 * Se llama al entrar en la sección 3.
 */
function sincronizarBatalla() {
  if (!personaje) return;

  // Actualizar datos del héroe en la UI
  document.getElementById('battle-nombre').textContent = personaje.nombre;
  document.getElementById('battle-clase').textContent  =
    `${personaje.clase} · Lv.${personaje.nivel}`;
  document.getElementById('vida-personaje-num').textContent = personaje.vida;
  document.getElementById('stat-ataque').textContent = personaje.ataque;
  document.getElementById('stat-nivel').textContent  = personaje.nivel;

  // Actualizar barras de vida
  actualizarBarrasDeVida();

  // Actualizar el código mostrado debajo de la arena
  const codeEl = document.getElementById('code-personaje-battle');
  const entries = Object.entries(personaje)
    .filter(([, v]) => typeof v !== 'function')
    .map(([k, v]) => `  ${k}: ${JSON.stringify(v)},`)
    .join('\n');
  codeEl.textContent = `let personaje = {\n${entries}\n  presentarse() { ... }\n};`;
}

/**
 * FUNCIÓN PRINCIPAL DEL JUEGO — atacarEnemigo()
 *
 * Demuestra cómo dos objetos interactúan entre sí:
 * personaje y enemigo se afectan mutuamente.
 */
function atacarEnemigo() {
  // ── Verificaciones ─────────────────────────────────────────
  if (!personaje) {
    agregarLog('⚠ Crea primero un personaje en la Sección 01', 'log-info');
    return;
  }
  if (personaje.vida <= 0 || enemigo.vida <= 0) return;

  // ── TURNO DEL HÉROE ────────────────────────────────────────
  // Accedemos a las propiedades del objeto personaje
  const dañoHéroe = personaje.ataque;
  enemigo.vida   -= dañoHéroe;  // mutamos la propiedad vida del objeto enemigo
  enemigo.vida    = Math.max(0, enemigo.vida);

  agregarLog(
    `⚔ ${personaje.nombre} ataca a ${enemigo.nombre} → ${dañoHéroe} de daño (vida enemigo: ${enemigo.vida})`,
    'log-attack'
  );

  // Animación de golpe al enemigo
  animarGolpe('card-enemigo');

  // Comprobar si el enemigo ha muerto
  if (enemigo.vida <= 0) {
    finalizarBatalla(true);
    actualizarBarrasDeVida();
    return;
  }

  // ── TURNO DEL ENEMIGO ──────────────────────────────────────
  // También accedemos a las propiedades del objeto enemigo
  const dañoEnemigo = enemigo.ataque;
  personaje.vida   -= dañoEnemigo;  // mutamos la propiedad vida del objeto personaje
  personaje.vida    = Math.max(0, personaje.vida);

  agregarLog(
    `💀 ${enemigo.nombre} contraataca → ${dañoEnemigo} de daño (tu vida: ${personaje.vida})`,
    'log-enemy'
  );

  // Animación de golpe al héroe
  animarGolpe('card-personaje');

  // Actualizar UI
  document.getElementById('vida-personaje-num').textContent = personaje.vida;
  document.getElementById('vida-enemigo-num').textContent   = enemigo.vida;
  actualizarBarrasDeVida();
  actualizarNavStatus();

  // Texto central de la batalla
  document.getElementById('battle-log-mini').textContent =
    `¡${personaje.nombre} aguanta! Vida: ${personaje.vida}`;

  // Comprobar si el héroe ha muerto
  if (personaje.vida <= 0) {
    finalizarBatalla(false);
  }
}

/**
 * Finaliza la batalla y muestra el overlay de resultado.
 * @param {boolean} victoria - true si ganó el héroe
 */
function finalizarBatalla(victoria) {
  const overlay   = document.getElementById('battleOverlay');
  const emoji     = document.getElementById('overlay-emoji');
  const titulo    = document.getElementById('overlay-title');
  const subtitulo = document.getElementById('overlay-subtitle');

  document.getElementById('btn-attack').disabled = true;

  if (victoria) {
    emoji.textContent     = '🏆';
    titulo.textContent    = '¡Victoria!';
    subtitulo.textContent =
      `${personaje.nombre} ha derrotado a ${enemigo.nombre}. ` +
      `¡Los objetos han interactuado con éxito!`;
    agregarLog(`🏆 ¡${personaje.nombre} ha ganado la batalla!`, 'log-win');
  } else {
    emoji.textContent     = '💀';
    titulo.textContent    = 'Derrota...';
    subtitulo.textContent =
      `${personaje.nombre} ha caído ante ${enemigo.nombre}. ¡Inténtalo de nuevo!`;
    agregarLog(`💀 ${personaje.nombre} ha sido derrotado. Fin de la partida.`, 'log-enemy');
  }

  overlay.classList.remove('hidden');
}

/**
 * Reinicia la batalla al estado inicial.
 * Solo resetea las vidas, no el objeto personaje completo.
 */
function reiniciarJuego() {
  // Restaurar vida del personaje a su máximo
  if (personaje) {
    personaje.vida = personaje.vidaMax;
  }

  // Restaurar vida del enemigo a su máximo
  enemigo.vida = enemigo.vidaMax;

  // Limpiar el log
  document.getElementById('battleLog').innerHTML =
    '<div class="log-entry log-info">🔄 Batalla reiniciada. ¡Buena suerte!</div>';

  // Rehabilitar botón
  document.getElementById('btn-attack').disabled = false;

  // Ocultar overlay
  document.getElementById('battleOverlay').classList.add('hidden');

  // Actualizar barras y textos
  document.getElementById('vida-personaje-num').textContent = personaje ? personaje.vida : '—';
  document.getElementById('vida-enemigo-num').textContent   = enemigo.vida;
  document.getElementById('battle-log-mini').textContent   = '¡Prepárate para la batalla!';

  actualizarBarrasDeVida();
  actualizarNavStatus();
}

/**
 * Actualiza las barras de vida visuales.
 */
function actualizarBarrasDeVida() {
  if (personaje) {
    const pct = Math.max(0, (personaje.vida / personaje.vidaMax) * 100);
    const bar  = document.getElementById('vida-personaje-bar');
    bar.style.width = pct + '%';

    // Cambiar color según la vida restante
    if (pct > 60) {
      bar.style.background = 'linear-gradient(90deg, #6ee7b7, #34d399)';
    } else if (pct > 30) {
      bar.style.background = 'linear-gradient(90deg, #fde68a, #f59e0b)';
    } else {
      bar.style.background = 'linear-gradient(90deg, #f87171, #ef4444)';
    }
  }

  const ePct = Math.max(0, (enemigo.vida / enemigo.vidaMax) * 100);
  document.getElementById('vida-enemigo-bar').style.width = ePct + '%';
}

/**
 * Añade una entrada al log de batalla.
 * @param {string} mensaje - Texto del log
 * @param {string} tipo - Clase CSS del log
 */
function agregarLog(mensaje, tipo = 'log-info') {
  const log   = document.getElementById('battleLog');
  const entry = document.createElement('div');
  entry.className = `log-entry ${tipo}`;
  entry.textContent = mensaje;
  log.appendChild(entry);
  log.scrollTop = log.scrollHeight; // scroll al final
}

/**
 * Anima visualmente un golpe sobre una tarjeta de combatiente.
 * @param {string} cardId - ID del elemento a animar
 */
function animarGolpe(cardId) {
  const card = document.getElementById(cardId);
  card.classList.add('shake');
  setTimeout(() => card.classList.remove('shake'), 400);
}


// ─────────────────────────────────────────────────────────────
// 6. UTILIDADES GLOBALES
// ─────────────────────────────────────────────────────────────

/**
 * Muestra un mensaje en un elemento output.
 * @param {string} id     - ID del elemento
 * @param {string} tipo   - 'success' | 'error' | 'info' | 'warning'
 * @param {string} html   - Contenido HTML del mensaje
 */
function mostrarOutput(id, tipo, html) {
  const el = document.getElementById(id);
  el.className = `output ${tipo}`;
  el.innerHTML = html;
  el.classList.remove('hidden');
}

/**
 * Valida que el objeto personaje exista antes de operar.
 * @param {string} outputId - ID del elemento donde mostrar el error
 * @param {boolean} inline  - Si true, usa output-inline en vez de output
 * @returns {boolean}
 */
function validarPersonaje(outputId, inline = false) {
  if (!personaje) {
    const el = document.getElementById(outputId);
    if (inline) {
      el.classList.remove('hidden');
      el.textContent = '⚠ Crea primero el personaje en la Sección 01';
      el.style.color = 'var(--red)';
    } else {
      mostrarOutput(outputId, 'error',
        '⚠ <strong>personaje es null</strong>. Crea primero el personaje en la Sección 01.'
      );
    }
    return false;
  }
  return true;
}

/**
 * Actualiza el indicador de estado del objeto en la barra de navegación.
 */
function actualizarNavStatus() {
  const label = document.getElementById('objetoLabel');
  if (personaje) {
    label.textContent = `personaje = { nombre: "${personaje.nombre}", vida: ${personaje.vida} }`;
  } else {
    label.textContent = 'personaje = null (pendiente)';
  }
}


// ─────────────────────────────────────────────────────────────
// 7. INICIALIZACIÓN
// ─────────────────────────────────────────────────────────────

/**
 * Inicializa la app al cargar la página.
 */
(function init() {
  // Valores por defecto en los inputs de la sección 1
  document.getElementById('inp-nombre').value = 'Kael';
  document.getElementById('inp-vida').value   = '100';
  document.getElementById('inp-ataque').value = '15';

  // Inicializar barras de vida del enemigo
  actualizarBarrasDeVida();

  // Log inicial en la batalla
  console.log('%c[ Objetos JS — Demo Interactiva ]', 'color: #6ee7b7; font-weight: bold; font-size: 14px;');
  console.log('Estado global: personaje =', personaje);
  console.log('Estado global: enemigo =', enemigo);
})();
