// ==================== 1) Emoji ==================== 
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
document.addEventListener('touchmove', (e) => { e.preventDefault(); }, { passive: false });
applyViewportHeight();

// ==================== 3) UX de enfoque ====================
window.addEventListener('load', () => {
  const u = document.getElementById('usuario');
  if (window.innerWidth > 768) u?.focus(); // Desktop
});

// ===== Prototipo: mostrar pantalla azul y dashboard (sin validar campos) =====
const formLogin   = document.getElementById('formLogin');
const loginWrap   = document.getElementById('loginWrapper');
const blankScreen = document.getElementById('blankScreen');

if (formLogin){
  // Desactiva validación HTML5 para permitir enviar vacío
  formLogin.setAttribute('novalidate', '');
  document.getElementById('usuario')?.removeAttribute('required');
  document.getElementById('password')?.removeAttribute('required');

  formLogin.addEventListener('submit', (e) => {
    e.preventDefault();                 // Modo prototipo
    loginWrap.classList.add('hidden');  // Oculta el login
    blankScreen.classList.remove('hidden'); // Muestra pantalla azul + grid
    blankScreen.setAttribute('aria-hidden', 'false');
  });
}
