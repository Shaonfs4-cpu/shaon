/* ═══════════════════════════════════════════
   SHORIFUL ISLAM SHAON — script.js
═══════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  // ── 1. PEN / TABLET DRAWING ANIMATION ────────
  (function initPenAnimation() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let W, H;

    function resize() {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
      initStrokes();
    }
    window.addEventListener('resize', resize);

    // ── Color palette: neon cyan, pink, purple, green ──
    const PALETTE = [
      { r: 0,   g: 245, b: 255 },  // cyan
      { r: 255, g: 0,   b: 255 },  // pink
      { r: 139, g: 0,   b: 255 },  // purple
      { r: 0,   g: 255, b: 136 },  // green
      { r: 255, g: 230, b: 0   },  // yellow
    ];

    // ── Pen cursor object ──
    let pen = { x: 0, y: 0, angle: -35, size: 28 };

    // ── Stroke definitions ──
    // Each stroke is a smooth bezier path across screen
    // Generated dynamically so they cover full responsive canvas
    let strokes = [];
    const STROKE_COUNT = 7;

    function makeStrokePath() {
      const pts = [];
      const segs = 5 + Math.floor(Math.random() * 4);
      for (let i = 0; i <= segs; i++) {
        pts.push({
          x: (Math.random() * 0.85 + 0.05) * W,
          y: (Math.random() * 0.85 + 0.05) * H,
        });
      }
      return pts;
    }

    function initStrokes() {
      strokes = [];
      for (let i = 0; i < STROKE_COUNT; i++) {
        const c = PALETTE[i % PALETTE.length];
        strokes.push({
          pts:      makeStrokePath(),
          t:        Math.random(),          // 0..1 progress along path
          speed:    0.0012 + Math.random() * 0.001,
          color:    c,
          width:    0.8 + Math.random() * 1.2,
          alpha:    0.18 + Math.random() * 0.18,
          drawn:    [],                     // array of {x,y} already drawn
          maxLen:   120 + Math.floor(Math.random() * 180), // trail length in points
          phase:    Math.random() * Math.PI * 2,
          isPen:    i === 0,               // first stroke drives the pen cursor
        });
      }
    }

    // Catmull-Rom spline interpolation for smooth curves
    function catmullRom(pts, t) {
      const n   = pts.length - 1;
      const idx = Math.floor(t * n);
      const i0  = Math.max(0, idx - 1);
      const i1  = idx;
      const i2  = Math.min(n, idx + 1);
      const i3  = Math.min(n, idx + 2);
      const tt  = t * n - idx;

      const p0 = pts[i0], p1 = pts[i1], p2 = pts[i2], p3 = pts[i3];
      const tt2 = tt * tt, tt3 = tt2 * tt;

      return {
        x: 0.5 * ((2*p1.x) + (-p0.x+p2.x)*tt + (2*p0.x-5*p1.x+4*p2.x-p3.x)*tt2 + (-p0.x+3*p1.x-3*p2.x+p3.x)*tt3),
        y: 0.5 * ((2*p1.y) + (-p0.y+p2.y)*tt + (2*p0.y-5*p1.y+4*p2.y-p3.y)*tt2 + (-p0.y+3*p1.y-3*p2.y+p3.y)*tt3),
      };
    }

    // Draw stylus / pen cursor at position
    function drawPen(x, y, angle) {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle * Math.PI / 180);

      const len = pen.size;
      // pen body
      ctx.beginPath();
      ctx.moveTo(0, -len * 0.5);
      ctx.lineTo(len * 0.18, len * 0.3);
      ctx.lineTo(0, len * 0.5);
      ctx.lineTo(-len * 0.18, len * 0.3);
      ctx.closePath();
      ctx.fillStyle = 'rgba(20,30,50,0.9)';
      ctx.strokeStyle = 'rgba(0,245,255,0.8)';
      ctx.lineWidth = 0.8;
      ctx.fill();
      ctx.stroke();

      // pen tip glow dot
      ctx.beginPath();
      ctx.arc(0, len * 0.5, 2.2, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0,245,255,1)';
      ctx.shadowColor = 'rgba(0,245,255,1)';
      ctx.shadowBlur = 8;
      ctx.fill();

      // neon accent stripe on pen
      ctx.beginPath();
      ctx.moveTo(-len * 0.06, -len * 0.3);
      ctx.lineTo(-len * 0.06,  len * 0.1);
      ctx.strokeStyle = 'rgba(0,245,255,0.5)';
      ctx.lineWidth = 1;
      ctx.shadowBlur = 0;
      ctx.stroke();

      ctx.restore();
    }

    // Draw a glowing stroke trail
    function drawTrail(stroke) {
      const pts = stroke.drawn;
      if (pts.length < 2) return;
      const { r, g, b } = stroke.color;

      // outer glow pass
      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
      ctx.strokeStyle = `rgba(${r},${g},${b},${stroke.alpha * 0.35})`;
      ctx.lineWidth = stroke.width * 5;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.shadowColor = `rgba(${r},${g},${b},0.9)`;
      ctx.shadowBlur = 14;
      ctx.stroke();

      // inner bright line
      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
      ctx.strokeStyle = `rgba(${r},${g},${b},${stroke.alpha * 0.9})`;
      ctx.lineWidth = stroke.width;
      ctx.shadowBlur = 4;
      ctx.stroke();

      ctx.shadowBlur = 0;
    }

    // Tiny sparkle dot at the drawing tip
    function drawTip(x, y, color) {
      const { r, g, b } = color;
      ctx.beginPath();
      ctx.arc(x, y, 2, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${r},${g},${b},0.9)`;
      ctx.shadowColor = `rgba(${r},${g},${b},1)`;
      ctx.shadowBlur = 10;
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    // ── Floating ink drop particles ──
    let inkDrops = [];
    function spawnInkDrop(x, y, color) {
      if (Math.random() > 0.04) return;
      const { r, g, b } = color;
      inkDrops.push({
        x, y,
        vx: (Math.random() - 0.5) * 1.2,
        vy: (Math.random() - 0.5) * 1.2,
        r:  Math.random() * 2 + 0.5,
        alpha: 0.6,
        color: `rgba(${r},${g},${b},`,
      });
    }
    function updateInkDrops() {
      inkDrops = inkDrops.filter(d => d.alpha > 0.02);
      inkDrops.forEach(d => {
        d.x += d.vx; d.y += d.vy;
        d.alpha *= 0.96;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = d.color + d.alpha + ')';
        ctx.fill();
      });
    }

    // ── Grid dots (very subtle) ──
    function drawGridDots() {
      const step = Math.min(W, H) > 600 ? 60 : 40;
      ctx.fillStyle = 'rgba(0,245,255,0.03)';
      for (let x = step; x < W; x += step) {
        for (let y = step; y < H; y += step) {
          ctx.beginPath();
          ctx.arc(x, y, 1, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    let frame = 0;
    function loop() {
      ctx.clearRect(0, 0, W, H);
      drawGridDots();

      strokes.forEach((stroke, si) => {
        // advance t
        stroke.t += stroke.speed;
        if (stroke.t > 1) {
          stroke.t = 0;
          stroke.pts = makeStrokePath();
          stroke.drawn = [];
        }

        const pos = catmullRom(stroke.pts, stroke.t);

        // push to drawn trail
        stroke.drawn.push({ x: pos.x, y: pos.y });
        if (stroke.drawn.length > stroke.maxLen) stroke.drawn.shift();

        drawTrail(stroke);
        drawTip(pos.x, pos.y, stroke.color);
        spawnInkDrop(pos.x, pos.y, stroke.color);

        // first stroke drives pen cursor
        if (stroke.isPen) {
          // calculate angle from velocity
          const prev = stroke.drawn[stroke.drawn.length - 2];
          if (prev) {
            const dx = pos.x - prev.x, dy = pos.y - prev.y;
            pen.angle = Math.atan2(dy, dx) * 180 / Math.PI + 90;
          }
          pen.x = pos.x;
          pen.y = pos.y;
        }
      });

      updateInkDrops();
      drawPen(pen.x, pen.y, pen.angle);

      frame++;
      requestAnimationFrame(loop);
    }

    resize();
    loop();
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
