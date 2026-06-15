/* ═══════════════════════════════════════════
   SHORIFUL ISLAM SHAON — script.js
═══════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  // ── 1. PARTICLES ──────────────────────────────
  (function initParticles() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let W, H;

    const COLORS = [
      'rgba(0,245,255,',
      'rgba(255,0,255,',
      'rgba(139,0,255,',
      'rgba(0,255,136,',
    ];
    const COUNT = 60;
    let particles = [];

    function resize() {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    function Particle() {
      this.reset();
    }
    Particle.prototype.reset = function () {
      this.x     = Math.random() * W;
      this.y     = Math.random() * H;
      this.r     = Math.random() * 1.6 + 0.4;
      this.vx    = (Math.random() - 0.5) * 0.35;
      this.vy    = (Math.random() - 0.5) * 0.35;
      this.alpha = Math.random() * 0.35 + 0.08;
      this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
    };
    Particle.prototype.update = function () {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0) this.x = W;
      if (this.x > W) this.x = 0;
      if (this.y < 0) this.y = H;
      if (this.y > H) this.y = 0;
    };

    for (let i = 0; i < COUNT; i++) particles.push(new Particle());

    function draw() {
      ctx.clearRect(0, 0, W, H);
      for (let i = 0; i < COUNT; i++) {
        const p = particles[i];
        p.update();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color + p.alpha + ')';
        ctx.fill();

        for (let j = i + 1; j < COUNT; j++) {
          const q = particles[j];
          const dx = p.x - q.x, dy = p.y - q.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 110) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = p.color + (0.07 * (1 - dist / 110)) + ')';
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(draw);
    }
    draw();
  })();

  // ── 2. TYPING EFFECT ──────────────────────────
  (function initTyping() {
    const el = document.getElementById('typed-text');
    const cursor = document.getElementById('typed-cursor');
    if (!el) return;

    const text = el.dataset.text || '';
    let i = 0;

    function type() {
      if (i <= text.length) {
        el.textContent = text.slice(0, i);
        i++;
        setTimeout(type, i === text.length ? 300 : 75);
      } else {
        // reveal subtitle + desc after typing done
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

    // close on link click
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
    const orig = el.innerHTML;
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
          // restore safely
          el.querySelectorAll('[data-val]').forEach(span => {
            span.textContent = span.dataset.val;
          });
        }
      }, 40);
    });
  })();

});
