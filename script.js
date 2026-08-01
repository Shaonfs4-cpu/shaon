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

    const PALETTE = [
      'rgba(0, 245, 255, 0.25)',
      'rgba(255, 0, 255, 0.25)',
      'rgba(0, 255, 136, 0.25)'
    ];

    const elements = [];
    const ELEM_COUNT = 15;

    for (let i = 0; i < ELEM_COUNT; i++) {
      elements.push({
        x: Math.random() * W,
        y: Math.random() * H,
        size: 25 + Math.random() * 35,
        speedY: -(0.2 + Math.random() * 0.6),
        speedX: (Math.random() - 0.5) * 0.5,
        angle: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.015,
        type: Math.random() > 0.4 ? 'tablet' : 'pen',
        color: PALETTE[Math.floor(Math.random() * PALETTE.length)]
      });
    }

    function drawTablet(ctx, size) {
      ctx.beginPath();
      ctx.roundRect(-size, -size * 0.65, size * 2, size * 1.3, 6);
      ctx.stroke();
      ctx.beginPath();
      ctx.rect(-size * 0.4, -size * 0.5, size * 1.2, size * 1.0);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(-size * 0.7, -size * 0.3, size * 0.08, 0, Math.PI * 2);
      ctx.arc(-size * 0.7, 0, size * 0.08, 0, Math.PI * 2);
      ctx.arc(-size * 0.7, size * 0.3, size * 0.08, 0, Math.PI * 2);
      ctx.fill();
    }

    function drawPen(ctx, size) {
      ctx.beginPath();
      ctx.moveTo(0, -size);
      ctx.lineTo(size * 0.12, -size * 0.7);
      ctx.lineTo(size * 0.12, size * 0.8);
      ctx.lineTo(0, size);
      ctx.lineTo(-size * 0.12, size * 0.8);
      ctx.lineTo(-size * 0.12, -size * 0.7);
      ctx.closePath();
      ctx.stroke();
      ctx.beginPath();
      ctx.rect(-size * 0.12, -size * 0.1, size * 0.24, size * 0.3);
      ctx.fill();
    }

    function loop() {
      ctx.clearRect(0, 0, W, H);

      elements.forEach(el => {
        el.x += el.speedX;
        el.y += el.speedY;
        el.angle += el.rotSpeed;

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

  // ── 3. SCROLL REVEAL (reusable observer) ──────
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        revealObserver.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });

  // Exposed so dynamically-added elements (like portfolio videos
  // loaded from data/videos.txt) can also get the reveal animation.
  function observeReveal(elements) {
    elements.forEach(el => revealObserver.observe(el));
  }

  (function initReveal() {
    observeReveal(document.querySelectorAll('.reveal, .reveal-left, .reveal-right'));
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

  // ── 9. DYNAMIC CONTENT — Featured Work + Portfolio + Designs ──
  // All three sections read from the SAME data/videos.txt and
  // data/designs.txt, fetched once here and shared, so adding a
  // new video/design in the .txt files is the only thing needed —
  // no HTML/JS edits required anywhere.
  (function initDynamicContent() {
    const featuredGrid  = document.getElementById('featured-grid');
    const portfolioGrid = document.getElementById('portfolio-grid');
    const designGrid    = document.getElementById('design-grid');

    function escapeHtml(str) {
      return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    }

    // Generic "---" separated block parser, used for both txt files.
    function parseBlocks(text) {
      return text
        .split(/^---\s*$/m)
        .map(block => block.trim())
        .filter(Boolean)
        .map(block => {
          const obj = {};
          block.split('\n').forEach(rawLine => {
            const line = rawLine.trim();
            if (!line || line.startsWith('#')) return;
            const idx = line.indexOf(':');
            if (idx === -1) return;
            const key = line.slice(0, idx).trim().toLowerCase();
            const value = line.slice(idx + 1).trim();
            obj[key] = value;
          });
          return obj;
        });
    }

    function parseVideos(text) {
      return parseBlocks(text).filter(v => v.link);
    }

    function parseDesigns(text) {
      return parseBlocks(text).filter(d => d.title || d.image);
    }

    function fetchFirstAvailable(paths) {
      return paths.reduce(
        (promise, path) => promise.catch(() =>
          fetch(path, { cache: 'no-store' }).then(res => {
            if (!res.ok) throw new Error('not ok');
            return res.text();
          })
        ),
        Promise.reject()
      );
    }

    const VIDEOS_PATHS = [
      'data/videos.txt', 'data/Videos.txt', 'data/Videos.TXT', 'data/videos.TXT',
      'Data/videos.txt', 'Data/Videos.txt', 'Data/Videos.TXT',
      'videos.txt', 'Videos.txt', 'Videos.TXT'
    ];
    const DESIGNS_PATHS = [
      'data/designs.txt', 'data/Designs.txt', 'data/Designs.TXT', 'data/designs.TXT',
      'Data/designs.txt', 'Data/Designs.txt',
      'designs.txt', 'Designs.txt', 'Designs.TXT'
    ];

    function renderVideoCard(v, i, { compact = false } = {}) {
      const orientation = (v.type || 'horizontal').toLowerCase();
      const badge       = ['cyan', 'purple', 'green'].includes((v.badge || '').toLowerCase())
        ? v.badge.toLowerCase() : 'cyan';
      const caption     = escapeHtml(v.caption || '');
      const link        = escapeHtml(v.link);
      const revealClass = compact ? 'reveal' : (i % 2 === 0 ? 'reveal-left' : 'reveal-right');
      const delayClass  = 'd' + ((i % 5) + 1);

      const iframe = `
        <iframe style="aspect-ratio:${orientation === 'vertical' ? '9/16' : '16/9'};${orientation === 'vertical' ? 'width:100%' : ''}"
          src="${link}" title="${caption}" frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`;

      if (orientation === 'vertical') {
        return `
          <div class="shorts-center ${revealClass} ${delayClass}">
            <div class="video-card shorts-card">
              ${iframe}
              <div class="video-badge"><span class="badge badge-${badge}">${caption}</span></div>
            </div>
          </div>`;
      }

      return `
        <div class="video-card ${revealClass} ${delayClass}">
          ${iframe}
          <div class="video-badge"><span class="badge badge-${badge}">${caption}</span></div>
        </div>`;
    }

    function renderDesignCard(d, i) {
      const title = escapeHtml(d.title || 'Untitled');
      const link  = escapeHtml(d.link || '#');
      const image = escapeHtml(d.image || '');
      const delayClass = 'd' + ((i % 5) + 1);

      const imageHtml = image
        ? `<img src="${image}" alt="${title}" loading="lazy" onerror="this.closest('.design-card-image-wrap').classList.add('no-image')" />`
        : '';

      return `
        <a href="${link}" target="_blank" class="design-card reveal ${delayClass}">
          <div class="design-card-image-wrap">
            ${imageHtml}
            <div class="design-card-badge"><i class="fab fa-behance"></i></div>
          </div>
          <div class="design-card-info">
            <h3>${title}</h3>
            <span>View Project →</span>
          </div>
        </a>`;
    }

    // ---- Featured Work (top of page): first horizontal + first vertical
    // video, plus the first 1-2 designs ----
    function renderFeatured(videos, designs) {
      if (!featuredGrid) return;

      const horizontal = videos.find(v => (v.type || 'horizontal').toLowerCase() !== 'vertical');
      const vertical    = videos.find(v => (v.type || '').toLowerCase() === 'vertical');
      const topDesigns  = designs.slice(0, 2);

      if (!horizontal && !vertical && !topDesigns.length) {
        featuredGrid.innerHTML = '<p class="loading-text">No featured work yet — add items to data/videos.txt or data/designs.txt.</p>';
        return;
      }

      let html = '';
      html += `<div class="featured-video-wrap">${horizontal ? renderVideoCard(horizontal, 0, { compact: true }) : ''}</div>`;
      html += `<div class="featured-portrait-wrap">${vertical ? renderVideoCard(vertical, 1, { compact: true }) : ''}</div>`;
      html += `<div class="featured-designs-wrap">${topDesigns.map(renderDesignCard).join('')}</div>`;

      featuredGrid.innerHTML = html;
      observeReveal(featuredGrid.querySelectorAll('.reveal, .reveal-left, .reveal-right'));
    }

    function renderPortfolio(videos) {
      if (!portfolioGrid) return;
      if (!videos.length) {
        portfolioGrid.innerHTML = '<p class="loading-text">Ekhono kono video add kora hoyni. data/videos.txt e video add korun.</p>';
        return;
      }
      portfolioGrid.innerHTML = videos.map((v, i) => renderVideoCard(v, i)).join('');
      observeReveal(portfolioGrid.querySelectorAll('.reveal, .reveal-left, .reveal-right'));
    }

    function renderDesigns(designs) {
      if (!designGrid) return;
      if (!designs.length) {
        designGrid.innerHTML = '<p class="loading-text">Ekhono kono design add kora hoyni. data/designs.txt e design add korun.</p>';
        return;
      }
      designGrid.innerHTML = designs.map(renderDesignCard).join('');
      observeReveal(designGrid.querySelectorAll('.reveal, .reveal-left, .reveal-right'));
    }

    const videosPromise = fetchFirstAvailable(VIDEOS_PATHS)
      .then(parseVideos)
      .catch(err => {
        console.error('videos.txt load failed:', err);
        if (portfolioGrid) portfolioGrid.innerHTML = '<p class="loading-text">Video load korte problem hocche. "data" folder-e videos.txt file ache kina check korun.</p>';
        return [];
      });

    const designsPromise = fetchFirstAvailable(DESIGNS_PATHS)
      .then(parseDesigns)
      .catch(err => {
        console.error('designs.txt load failed:', err);
        if (designGrid) designGrid.innerHTML = '<p class="loading-text">Design load korte problem hocche. "data" folder-e designs.txt file ache kina check korun.</p>';
        return [];
      });

    Promise.all([videosPromise, designsPromise]).then(([videos, designs]) => {
      renderFeatured(videos, designs);
      renderPortfolio(videos);
      renderDesigns(designs);
    });
  })();

});
