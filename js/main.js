/* ================================================
   SoydeJux - Main JavaScript
   ================================================ */

// ── NAV DROPDOWNS (mobile + click) ──
function initNav() {
  const items = document.querySelectorAll('.nav-item');
  items.forEach(item => {
    const link = item.querySelector('.nav-link');
    const dropdown = item.querySelector('.dropdown');
    if (!dropdown) return;

    link.addEventListener('click', (e) => {
      if (window.innerWidth <= 700) {
        e.preventDefault();
        item.classList.toggle('open');
      }
    });
  });

  // hamburger
  const burger = document.querySelector('.hamburger');
  const navCont = document.querySelector('.nav-container');
  if (burger && navCont) {
    burger.addEventListener('click', () => {
      navCont.classList.toggle('open');
      burger.innerHTML = navCont.classList.contains('open') ? '✕' : '☰';
    });
  }

  // active link
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href && (href === currentPage || href.endsWith(currentPage))) {
      link.classList.add('active');
    }
  });
}

// ── MINI GALLERY ──
function initGalleries() {
  document.querySelectorAll('.mini-gallery').forEach(gallery => {
    const slides = gallery.querySelectorAll('.gallery-slide');
    const dots   = gallery.querySelectorAll('.gallery-dot');
    const prev   = gallery.querySelector('.gallery-prev');
    const next   = gallery.querySelector('.gallery-next');
    const count  = gallery.querySelector('.gallery-counter');
    let current  = 0;

    function goTo(n) {
      slides[current].classList.remove('active');
      dots[current]?.classList.remove('active');
      current = (n + slides.length) % slides.length;
      slides[current].classList.add('active');
      dots[current]?.classList.add('active');
      if (count) count.textContent = `${current + 1} / ${slides.length}`;
    }

    if (prev) prev.addEventListener('click', () => goTo(current - 1));
    if (next) next.addEventListener('click', () => goTo(current + 1));

    dots.forEach((dot, i) => dot.addEventListener('click', () => goTo(i)));

    // keyboard on focus
    gallery.addEventListener('keydown', e => {
      if (e.key === 'ArrowLeft') goTo(current - 1);
      if (e.key === 'ArrowRight') goTo(current + 1);
    });

    // auto-advance
    setInterval(() => goTo(current + 1), 5500);

    // init
    goTo(0);
  });
}

// ── SEARCH OVERLAY ──
function initSearch() {
  const triggers   = document.querySelectorAll('[data-search-open]');
  const overlay    = document.getElementById('searchOverlay');
  const closeBtn   = document.getElementById('searchClose');
  const input      = document.getElementById('searchInput');
  const resultsEl  = document.getElementById('searchResults');

  if (!overlay) return;

  // search data index (páginas del sitio)
  const pages = [
    { title: 'Inicio — SoydeJux', url: '../index.html', desc: 'Página principal sobre cultura mixteca de Oaxaca.' },
    { title: 'Historia de la Mixteca', url: 'historia.html', desc: 'Orígenes, civilización y legado de la región mixteca.' },
    { title: 'Tradiciones y Festividades', url: 'tradiciones.html', desc: 'Guelaguetza, Día de Muertos, Carnaval y más.' },
    { title: 'Gastronomía Mixteca', url: 'gastronomia.html', desc: 'Mole negro, tlayudas, tasajo y bebidas tradicionales.' },
    { title: 'Arte y Artesanías', url: 'artesanias.html', desc: 'Alebrijes, tapetes de lana, joyería en oro.' },
    { title: 'Lengua Mixteca', url: 'lengua.html', desc: 'El mixteco, lengua viva de la región.' },
    { title: 'Municipios y Comunidades', url: 'municipios.html', desc: 'Huajuapan, Tlaxiaco, Juxtlahuaca y más.' },
    { title: 'Mapa del Sitio', url: 'sitemap.html', desc: 'Navegación completa de SoydeJux.' },
    { title: 'Música Tradicional', url: 'musica.html', desc: 'Sones, chilenas y la música de banda.' },
    { title: 'Vestimenta Tradicional', url: 'vestimenta.html', desc: 'Trajes típicos bordados de la Mixteca.' },
  ];

  function search(q) {
    if (!q || q.length < 2) { resultsEl.innerHTML = ''; return; }
    const q2 = q.toLowerCase();
    const found = pages.filter(p =>
      p.title.toLowerCase().includes(q2) || p.desc.toLowerCase().includes(q2)
    );
    if (!found.length) {
      resultsEl.innerHTML = '<p style="color:var(--color-piedra);padding:1rem 0;">Sin resultados para "' + q + '"</p>';
      return;
    }
    resultsEl.innerHTML = found.map(p => `
      <div class="search-result-item">
        <a href="${p.url}">${p.title}</a>
        <p>${p.desc}</p>
      </div>`).join('');
  }

  function open() {
    overlay.classList.add('open');
    input.value = '';
    resultsEl.innerHTML = '';
    setTimeout(() => input.focus(), 100);
  }
  function close() { overlay.classList.remove('open'); }

  triggers.forEach(t => t.addEventListener('click', open));
  if (closeBtn) closeBtn.addEventListener('click', close);
  overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
  if (input) input.addEventListener('input', () => search(input.value));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
}

// ── SMOOTH REVEAL on scroll ──
function initReveal() {
  const els = document.querySelectorAll('.card, .widget, .mini-gallery, .section-header');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animation = 'fadeUp 0.55s ease forwards';
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  els.forEach(el => {
    el.style.opacity = '0';
    io.observe(el);
  });
}

// ── INJECT GLOBAL CSS ANIMATION ──
const style = document.createElement('style');
style.textContent = `
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
}`;
document.head.appendChild(style);

// ── INIT ──
document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initGalleries();
  initSearch();
  initReveal();
});
