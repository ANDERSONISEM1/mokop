// ==================== 0) Util: estado simulado ====================
const mockDB = {
  usuario: { nombre: "José Salazar", puesto: "Soporte TI", ingreso: "12/04/2022", correo: "jsalazar@blplegal.com" },
  vacaciones: {
    saldo: 8, acumulado: 15, tomados: 7,
    historial: [
      { inicio: "2025-06-10", fin: "2025-06-12", dias: 3, estado: "Aprobada" },
      { inicio: "2025-02-03", fin: "2025-02-07", dias: 5, estado: "Aprobada" },
      { inicio: "2024-11-25", fin: "2024-11-27", dias: 3, estado: "Rechazada" }
    ]
  },
  permiso: {
    pendientes: 1, aprobados: 4, rechazados: 1,
    solicitudes: [
      { fecha: "2025-09-05", tipo: "Médico", horas: 3, estado: "Aprobado" },
      { fecha: "2025-08-28", tipo: "Personal", horas: 2, estado: "Pendiente" },
      { fecha: "2025-08-10", tipo: "Duelo", horas: 8, estado: "Aprobado" }
    ]
  },
  prestamo: {
    saldo: 3200, cuotas: 8, tasa: 8.5,
    prestamos: [
      { folio: "PR-1021", monto: 5000, plazo: 12, estado: "Pagando" },
      { folio: "PR-0960", monto: 3000, plazo: 10, estado: "Liquidado" }
    ]
  },
  expediente: {
    docs: [
      { nombre: "Contrato Laboral.pdf", fecha: "2022-04-12" },
      { nombre: "DPI - Anverso.png", fecha: "2022-04-10" },
      { nombre: "DPI - Reverso.png", fecha: "2022-04-10" },
      { nombre: "Constancia IGSS.pdf", fecha: "2024-12-01" }
    ]
  },
  marcaje: {
    hoy: 2, mes: 18, tardanzas: 1,
    marcajes: [
      { fecha: "2025-09-10", entrada: "08:03", salida: "12:05", obs: "" },
      { fecha: "2025-09-10", entrada: "13:05", salida: "17:00", obs: "—" },
      { fecha: "2025-09-09", entrada: "08:00", salida: "17:00", obs: "" }
    ]
  },
  cartas: {
    recientes: [
      { titulo: "Carta laboral - Banco G&T", fecha: "2025-09-03", estado: "Firmada" },
      { titulo: "Carta de ingresos - Arrendamiento", fecha: "2025-08-12", estado: "Enviada" }
    ]
  },
  dias: {
    vacaciones: 8, personales: 2, enfermedad: 4,
    anual: [
      { anio: 2025, asignados: 15, tomados: 7, saldo: 8 },
      { anio: 2024, asignados: 15, tomados: 15, saldo: 0 },
      { anio: 2023, asignados: 15, tomados: 14, saldo: 1 }
    ]
  },
  documentos: {
    files: [
      { nombre: "Recibo de pago - Ago 2025.pdf", peso: "220 KB" },
      { nombre: "Constancia Vacaciones 2024.pdf", peso: "180 KB" },
      { nombre: "Permiso médico 2025-08-28.pdf", peso: "95 KB" }
    ]
  },
  tickets: {
    abiertos: 1, proceso: 2, cerrados: 6,
    tickets: [
      { id: "T-4312", asunto: "Actualizar datos personales", estado: "Abierto", fecha: "2025-09-08" },
      { id: "T-4260", asunto: "Corrección de saldo de vacaciones", estado: "En proceso", fecha: "2025-09-02" },
      { id: "T-4201", asunto: "Consulta de beneficios", estado: "Cerrado", fecha: "2025-08-20" }
    ]
  },
  beneficios: {
    benefits: [
      "Seguro médico privado",
      "Cuota de gimnasio (opcional)",
      "Descuentos alianzas (farmacias, ópticas)",
      "Capacitaciones internas"
    ],
    policies: [
      "Política de vacaciones y permisos (v2.1)",
      "Código de conducta",
      "Teletrabajo y uso de dispositivos",
      "Política de escritorio limpio"
    ]
  }
};

// ==================== 1) Emoji login ====================
const inputPassword = document.getElementById('password');
const cara = document.getElementById('cara-emoji');
if (inputPassword && cara){
  inputPassword.addEventListener('focus', () => { cara.textContent = '😎'; });
  inputPassword.addEventListener('blur',  ()  => { cara.textContent = '😀'; });
}

// ==================== 2) Viewport real + “no scroll” ====================
const app  = document.getElementById('app');
const card = document.getElementById('loginCard');

function setVH(pxHeight){ document.documentElement.style.setProperty('--vh', `${pxHeight / 100}px`); }
function setCompactMode(availH){
  const isCompact = availH < 560;
  if (card) card.classList.toggle('compact', isCompact);
}
function fitCard(){
  if (!app || !card) return;
  const availH  = app.clientHeight;
  const cardH   = card.scrollHeight;
  const padding = 16;
  setCompactMode(availH);
  if (cardH + padding > availH){
    const scale = Math.max(0.70, (availH - padding) / cardH);
    card.style.transform = `scale(${scale})`;
  } else {
    card.style.transform = 'scale(1)';
  }
}
function applyViewportHeight(){
  const vv = window.visualViewport;
  setVH(vv ? vv.height : window.innerHeight);
  requestAnimationFrame(fitCard);
}
if (window.visualViewport){
  visualViewport.addEventListener('resize', applyViewportHeight);
  visualViewport.addEventListener('scroll', applyViewportHeight);
}
window.addEventListener('resize', applyViewportHeight);
window.addEventListener('orientationchange', applyViewportHeight);
// Evita scroll-bounce en móviles
document.addEventListener('touchmove', (e) => { e.preventDefault(); }, { passive: false });
applyViewportHeight();

// ==================== 3) Login prototipo (sin validar) ====================
const formLogin   = document.getElementById('formLogin');
const loginWrap   = document.getElementById('loginWrapper');
const blankScreen = document.getElementById('blankScreen');

if (formLogin){
  formLogin.setAttribute('novalidate', '');
  document.getElementById('usuario')?.removeAttribute('required');
  document.getElementById('password')?.removeAttribute('required');

  formLogin.addEventListener('submit', (e) => {
    e.preventDefault();
    loginWrap.classList.add('hidden');
    blankScreen.classList.remove('hidden');
    blankScreen.setAttribute('aria-hidden', 'false');
  });
}

window.addEventListener('load', () => {
  const u = document.getElementById('usuario');
  if (window.innerWidth > 768) u?.focus();
});

// ==================== 4) Router simple para vistas ====================
const view = document.getElementById('view');
const viewTitle = document.getElementById('viewTitle');
const viewSubtitle = document.getElementById('viewSubtitle');
const viewContent = document.getElementById('viewContent');
const viewSearch = document.getElementById('viewSearch');
const btnBack = document.getElementById('btnBack');

const titles = {
  vacaciones: ["Solicitud de Vacaciones", "Revisa tu saldo, historial y solicita en segundos."],
  permiso:    ["Solicitud de Permiso", "Crea permisos por horas o día completo."],
  prestamo:   ["Solicitud de Préstamo", "Simula y envía tu solicitud de forma segura."],
  expediente: ["Verificar Expediente", "Consulta tus datos y documentos personales."],
  marcaje:    ["Marcaje", "Resumen de asistencias y marcajes recientes."],
  cartas:     ["Cartas Laborales", "Genera cartas en formato PDF."],
  dias:       ["Días Disponibles", "Detalle de saldos por tipo y por año."],
  documentos: ["Mis Documentos", "Descarga tus archivos de RRHH."],
  tickets:    ["Tickets RRHH", "Da seguimiento a tus gestiones y casos."],
  beneficios: ["Beneficios & Políticas", "Conoce los programas y normas vigentes."]
};

function openView(name){
  const tpl = document.getElementById(`tmpl-${name}`);
  if (!tpl) return;

  // Títulos
  viewTitle.textContent = titles[name]?.[0] ?? "Vista";
  viewSubtitle.textContent = titles[name]?.[1] ?? "";

  // Contenido
  viewContent.innerHTML = "";
  viewContent.appendChild(tpl.content.cloneNode(true));

  // Bind de datos de ejemplo
  bindData(name);

  // Mostrar vista
  view.classList.remove('hidden');
  view.setAttribute('aria-hidden', 'false');
  viewContent.focus({ preventScroll: true });
}
function closeView(){
  view.classList.add('hidden');
  view.setAttribute('aria-hidden', 'true');
}
btnBack.addEventListener('click', closeView);

document.getElementById('tiles')?.addEventListener('click', (e) => {
  const btn = e.target.closest('.tile');
  if (!btn) return;
  const name = btn.getAttribute('data-view');
  openView(name);
});

// ==================== 5) Búsqueda básica dentro de tablas/listas ====================
viewSearch.addEventListener('input', () => {
  const q = viewSearch.value.trim().toLowerCase();
  // filtra tablas
  viewContent.querySelectorAll('tbody tr').forEach(tr => {
    const show = [...tr.children].some(td => td.textContent.toLowerCase().includes(q));
    tr.style.display = show ? "" : "none";
  });
  // filtra listas
  viewContent.querySelectorAll('ul li').forEach(li => {
    const show = li.textContent.toLowerCase().includes(q);
    li.style.display = show ? "" : "none";
  });
});

// ==================== 6) Enlazar datos mock a cada vista ====================
function bindData(viewName){
  switch(viewName){
    case "vacaciones": {
      const data = mockDB.vacaciones;
      setText('[data-bind="saldo"]', data.saldo);
      setText('[data-bind="acumulado"]', data.acumulado);
      setText('[data-bind="tomados"]', data.tomados);
      fillTable('historial', data.historial, (r) => [
        fmt(r.inicio), fmt(r.fin), r.dias, badge(r.estado)
      ]);
      document.getElementById('formVacaciones')?.addEventListener('submit', (e) => {
        e.preventDefault();
        alert("Solicitud enviada ✅");
      });
      break;
    }
    case "permiso": {
      const d = mockDB.permiso;
      setText('[data-bind="pendientes"]', d.pendientes);
      setText('[data-bind="aprobados"]', d.aprobados);
      setText('[data-bind="rechazados"]', d.rechazados);
      fillTable('solicitudes', d.solicitudes, (r) => [fmt(r.fecha), r.tipo, r.horas, badge(r.estado)]);
      document.getElementById('formPermiso')?.addEventListener('submit', (e) => {
        e.preventDefault(); alert("Permiso enviado ✅");
      });
      break;
    }
    case "prestamo": {
      const d = mockDB.prestamo;
      setText('[data-bind="saldo"]', `Q ${d.saldo.toLocaleString()}`);
      setText('[data-bind="cuotas"]', d.cuotas);
      setText('[data-bind="tasa"]', `${d.tasa}%`);
      fillTable('prestamos', d.prestamos, (r) => [r.folio, `Q ${r.monto.toLocaleString()}`, `${r.plazo} m`, badge(r.estado)]);
      document.getElementById('formPrestamo')?.addEventListener('submit', (e) => {
        e.preventDefault(); alert("Solicitud de préstamo enviada ✅");
      });
      break;
    }
    case "expediente": {
      const u = mockDB.usuario;
      setText('[data-bind="nombre"]', u.nombre);
      setText('[data-bind="puesto"]', u.puesto);
      setText('[data-bind="ingreso"]', u.ingreso);
      setText('[data-bind="correo"]', u.correo);
      const ul = viewContent.querySelector('[data-list="docs"]');
      ul.innerHTML = "";
      mockDB.expediente.docs.forEach(d => {
        const li = document.createElement('li');
        li.className = "list-item";
        li.innerHTML = `<span>📄 ${d.nombre}</span><span style="opacity:.8">${d.fecha}</span>`;
        ul.appendChild(li);
      });
      break;
    }
    case "marcaje": {
      const d = mockDB.marcaje;
      setText('[data-bind="hoy"]', d.hoy);
      setText('[data-bind="mes"]', d.mes);
      setText('[data-bind="tardanzas"]', d.tardanzas);
      fillTable('marcajes', d.marcajes, (r) => [fmt(r.fecha), r.entrada, r.salida, r.obs || "—"]);
      break;
    }
    case "cartas": {
      const ul = viewContent.querySelector('[data-list="cartas"]');
      ul.innerHTML = "";
      mockDB.cartas.recientes.forEach(c => {
        const li = document.createElement('li');
        li.innerHTML = `<span>📄 ${c.titulo}</span><span>${c.estado} · ${fmt(c.fecha)}</span>`;
        ul.appendChild(li);
      });
      document.getElementById('formCartas')?.addEventListener('submit', (e) => {
        e.preventDefault(); alert("Carta generada en PDF ✅");
      });
      break;
    }
    case "dias": {
      const d = mockDB.dias;
      setText('[data-bind="vacaciones"]', d.vacaciones);
      setText('[data-bind="personales"]', d.personales);
      setText('[data-bind="enfermedad"]', d.enfermedad);
      fillTable('anual', d.anual, (r) => [r.anio, r.asignados, r.tomados, r.saldo]);
      break;
    }
    case "documentos": {
      const ul = viewContent.querySelector('[data-list="files"]');
      ul.innerHTML = "";
      mockDB.documentos.files.forEach(f => {
        const li = document.createElement('li');
        li.innerHTML = `<span>🗂️ ${f.nombre}</span><a class="btn-primary" href="#" download>Descargar (${f.peso})</a>`;
        ul.appendChild(li);
      });
      break;
    }
    case "tickets": {
      const d = mockDB.tickets;
      setText('[data-bind="abiertos"]', d.abiertos);
      setText('[data-bind="proceso"]', d.proceso);
      setText('[data-bind="cerrados"]', d.cerrados);
      fillTable('tickets', d.tickets, (r) => [r.id, r.asunto, badge(r.estado), fmt(r.fecha)]);
      break;
    }
    case "beneficios": {
      const ulB = viewContent.querySelector('[data-list="benefits"]');
      const ulP = viewContent.querySelector('[data-list="policies"]');
      ulB.innerHTML = ""; ulP.innerHTML = "";
      mockDB.beneficios.benefits.forEach(b => {
        const li = document.createElement('li'); li.textContent = `✅ ${b}`; ulB.appendChild(li);
      });
      mockDB.beneficios.policies.forEach(p => {
        const li = document.createElement('li'); li.textContent = `📘 ${p}`; ulP.appendChild(li);
      });
      break;
    }
  }
}

// Helpers
function setText(selector, value){
  viewContent.querySelectorAll(selector).forEach(el => el.textContent = value);
}
function fillTable(name, rows, mapFn){
  const tbody = viewContent.querySelector(`[data-table="${name}"] tbody`);
  if (!tbody) return;
  tbody.innerHTML = "";
  rows.forEach(r => {
    const tr = document.createElement('tr');
    mapFn(r).forEach(cell => {
      const td = document.createElement('td');
      if (cell instanceof HTMLElement) td.appendChild(cell);
      else td.innerHTML = cell;
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });
}
function badge(text){
  const span = document.createElement('span');
  span.textContent = text;
  span.style.padding = "4px 8px";
  span.style.borderRadius = "999px";
  span.style.fontSize = "12px";
  span.style.fontWeight = "800";
  span.style.border = "1px solid #ffffff33";
  span.style.background = text.startsWith("Apro") || text === "Aprobada" ? "rgba(0,255,170,.15)"
    : text.startsWith("Recha") ? "rgba(255,60,60,.18)"
    : "rgba(255,255,255,.12)";
  return span;
}
function fmt(d){
  if (!/^\d{4}-\d{2}-\d{2}$/.test(d)) return d;
  const [y,m,da] = d.split('-');
  return `${da}/${m}/${y}`;
}
