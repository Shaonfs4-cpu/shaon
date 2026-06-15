/* ═══════════════════════════════════════════
   SHORIFUL ISLAM SHAON — script.js
═══════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  // ── 1. FLOATING GRAPHICS TABLETS & PENS ────────
  (function initFloatingTech() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let W, H;

    function resize() {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    // Color palette for floating elements
    const PALETTE = [
      'rgba(0, 245, 255, 0.25)', // cyan
      'rgba(255, 0, 255, 0.25)', // pink
      'rgba(0, 255, 136, 0.25)'  // green
    ];

    const elements = [];
    const ELEM_COUNT = 15; // Koto gulo tablet/pen vashbe

    // Elements generate kora hocche
    for (let i = 0; i < ELEM_COUNT; i++) {
      elements.push({
        x: Math.random() * W,
        y: Math.random() * H,
        size: 25 + Math.random() * 35,
        speedY: -(0.2 + Math.random() * 0.6), // upore vashbe
        speedX: (Math.random() - 0.5) * 0.5,
        angle: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.015,
        type: Math.random() > 0.4 ? 'tablet' : 'pen',
        color: PALETTE[Math.floor(Math.random() * PALETTE.length)]
      });
    }

    // Tablet draw korar function
    function drawTablet(ctx, size) {
      // Main body
      ctx.beginPath();
      ctx.roundRect(-size, -size * 0.65, size * 2, size * 1.3, 6);
      ctx.stroke();
      // Screen area
      ctx.beginPath();
      ctx.rect(-size * 0.4, -size * 0.5, size * 1.2, size * 1.0);
      ctx.stroke();
      // Buttons on the left
      ctx.beginPath();
      ctx.arc(-size * 0.7, -size * 0.3, size * 0.08, 0, Math.PI * 2);
      ctx.arc(-size * 0.7, 0, size * 0.08, 0, Math.PI * 2);
      ctx.arc(-size * 0.7, size * 0.3, size * 0.08, 0, Math.PI * 2);
      ctx.fill();
    }

    // Pen draw korar function
    function drawPen(ctx, size) {
      ctx.beginPath();
      ctx.moveTo(0, -size);
      ctx.lineTo(size * 0.12, -size * 0.7);
      ctx.lineTo(size * 0.12, size * 0.8);
      ctx.lineTo(0, size); // tip
      ctx.lineTo(-size * 0.12, size * 0.8);
      ctx.lineTo(-size * 0.12, -size * 0.7);
      ctx.closePath();
      ctx.stroke();
      // Pen button
      ctx.beginPath();
      ctx.rect(-size * 0.12, -size * 0.1, size * 0.24, size * 0.3);
      ctx.fill();
    }

    // Animation Loop
    function loop() {
      ctx.clearRect(0, 0, W, H);
      
      elements.forEach(el => {
        el.x += el.speedX;
        el.y += el.speedY;
        el.angle += el.rotSpeed;

        // Screen theke ber hoye gele abar onno dik theke asbe
        if (el.y + el.size < -50) el.y = H + 50;
        if (el.x > W + 50) el.x = -50;
        if (el.x < -50) el.x = W + 50;

        ctx.save();
        ctx.translate(el.x, el.y);
        ctx.rotate(el.angle);
        ctx.strokeStyle = el.color;
        ctx.fillStyle = el.color;
        ctx.lineWidth = 1.5;
        ctx.shadowColor = el.color;
        ctx.shadowBlur = 10;

        if (el.type === 'tablet') {
          drawTablet(ctx, el.size);
        } else {
          drawPen(ctx, el.size);
        }

        ctx.restore();
      });

      requestAnimationFrame(loop);
    }
    loop();
  })();

  // ── 2. TYPING EFFECT ──────────────────────────
  (function initTyping() {
    const el = document.getElementById('typed-text');
    if (!el) return;

    const text = el.dataset.text || '';
    let i = 0;

    function type() {
      if (i <= text.length) {
        el.textContent = text.slice(0, i);
        i++;
        setTimeout(type, i === text.length ? 300 : 75);
      } else {
        document.querySelectorAll('.hero-after-type').forEach(el => {
          el.style.opacity = '1';
          el.style.transform = 'translateY(0)';
        });
      }
    }
    setTimeout(type, 600);
  })();

  // ── 3. SCROLL REVEAL ──────────────────────────
  (function initReveal() {
    const items = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.1 });
    items.forEach(el => io.observe(el));
  })();

  // ── 4. COUNT UP ───────────────────────────────
  (function initCountUp() {
    const counters = document.querySelectorAll('[data-count]');
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const el     = e.target;
        const target = parseFloat(el.dataset.count);
        const suffix = el.dataset.suffix || '';
        const isFloat = target % 1 !== 0;
        const duration = 1400;
        const start = performance.now();

        function step(now) {
          const progress = Math.min((now - start) / duration, 1);
          const ease = 1 - Math.pow(1 - progress, 3);
          const val  = isFloat
            ? (ease * target).toFixed(1)
            : Math.round(ease * target);
          el.textContent = val + suffix;
          if (progress < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
        io.unobserve(el);
      });
    }, { threshold: 0.5 });
    counters.forEach(el => io.observe(el));
  })();

  // ── 5. NAVBAR SCROLL ──────────────────────────
  (function initNavbar() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 60);
    }, { passive: true });
  })();

  // ── 6. MOBILE MENU ────────────────────────────
  (function initMobileMenu() {
    const burger = document.querySelector('.nav-burger');
    const links  = document.querySelector('.nav-links');
    if (!burger || !links) return;

    burger.addEventListener('click', () => {
      links.classList.toggle('open');
      const spans = burger.querySelectorAll('span');
      const isOpen = links.classList.contains('open');
      spans[0].style.transform = isOpen ? 'rotate(45deg) translate(5px,5px)' : '';
      spans[1].style.opacity   = isOpen ? '0' : '1';
      spans[2].style.transform = isOpen ? 'rotate(-45deg) translate(5px,-5px)' : '';
    });

    links.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        links.classList.remove('open');
        burger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = '1'; });
      });
    });
  })();

  // ── 7. NAV ACTIVE SECTION ─────────────────────
  (function initNavActive() {
    const sections = document.querySelectorAll('section[id], header[id]');
    const navLinks = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
      let current = '';
      sections.forEach(sec => {
        if (window.scrollY >= sec.offsetTop - 160) current = sec.id;
      });
      navLinks.forEach(a => {
        a.style.color = a.getAttribute('href') === '#' + current
          ? 'var(--neon-cyan)'
          : '';
      });
    }, { passive: true });
  })();

  // ── 8. GLITCH HOVER on hero name ──────────────
  (function initGlitch() {
    const el = document.querySelector('.hero-name');
    if (!el) return;
    const chars = '!<>-_\\/[]{}—=+*^?#@$%&~';

    let interval;
    el.addEventListener('mouseenter', () => {
      let iter = 0;
      clearInterval(interval);
      interval = setInterval(() => {
        el.querySelectorAll('[data-val]').forEach(span => {
          if (iter > parseInt(span.dataset.iter || '0')) {
            span.textContent = span.dataset.val;
          } else {
            span.textContent = chars[Math.floor(Math.random() * chars.length)];
          }
        });
        iter += 0.5;
        if (iter >= 10) {
          clearInterval(interval);
          el.querySelectorAll('[data-val]').forEach(span => {
            span.textContent = span.dataset.val;
          });
        }
      }, 40);
    });
  })();

});
