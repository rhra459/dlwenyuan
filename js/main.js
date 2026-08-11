/* ============================================
   dlwenyuan.com - Core interactivity
   ============================================ */
(function () {
    'use strict';

    /* ---------- Header scroll state ---------- */
    const header = document.querySelector('.site-header');
    if (header) {
        const onScroll = () => {
            if (window.scrollY > 20) header.classList.add('scrolled');
            else header.classList.remove('scrolled');
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
    }

    /* ---------- Reveal on scroll ---------- */
    const revealEls = document.querySelectorAll('.reveal');
    if (revealEls.length && 'IntersectionObserver' in window) {
        const io = new IntersectionObserver((entries) => {
            entries.forEach((e) => {
                if (e.isIntersecting) {
                    e.target.classList.add('in');
                    io.unobserve(e.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
        revealEls.forEach((el) => io.observe(el));
    } else {
        revealEls.forEach((el) => el.classList.add('in'));
    }

    /* ---------- Hero rotator ---------- */
    const rotator = document.querySelector('.rotator');
    if (rotator) {
        const words = ['Minimalism.', 'Privacy.', 'Experience.', 'Innovation.', 'Craft.'];
        let idx = 0;
        setInterval(() => {
            rotator.style.opacity = '0';
            rotator.style.transform = 'translateY(-12px)';
            setTimeout(() => {
                idx = (idx + 1) % words.length;
                rotator.textContent = words[idx];
                rotator.style.transition = 'opacity .6s ease, transform .6s ease';
                rotator.style.opacity = '1';
                rotator.style.transform = 'translateY(0)';
            }, 320);
        }, 2600);
    }

    /* ---------- Counter animation ---------- */
    const counters = document.querySelectorAll('[data-counter]');
    if (counters.length && 'IntersectionObserver' in window) {
        const cio = new IntersectionObserver((entries) => {
            entries.forEach((e) => {
                if (e.isIntersecting) {
                    const el = e.target;
                    const target = parseFloat(el.dataset.counter);
                    const suffix = el.dataset.suffix || '';
                    const dur = 1600;
                    const start = performance.now();
                    const step = (now) => {
                        const t = Math.min(1, (now - start) / dur);
                        const eased = 1 - Math.pow(1 - t, 3);
                        const v = target * eased;
                        el.textContent = (target % 1 === 0 ? Math.round(v) : v.toFixed(1)) + suffix;
                        if (t < 1) requestAnimationFrame(step);
                    };
                    requestAnimationFrame(step);
                    cio.unobserve(el);
                }
            });
        }, { threshold: 0.4 });
        counters.forEach((el) => cio.observe(el));
    }

    /* ---------- Particle field ---------- */
    const N = 38;
    const layer = document.body;
    const particles = [];
    for (let i = 0; i < N; i++) {
        const p = document.createElement('span');
        p.className = 'particle';
        const size = 1 + Math.random() * 2.5;
        const hue = Math.random() < 0.4 ? '#b78bff' : (Math.random() < 0.5 ? '#5effc1' : '#6ec6ff');
        p.style.width = size + 'px';
        p.style.height = size + 'px';
        p.style.background = hue;
        p.style.boxShadow = '0 0 ' + (6 + size * 2) + 'px ' + hue;
        p.style.left = Math.random() * 100 + '%';
        p.style.top = Math.random() * 100 + '%';
        layer.appendChild(p);
        particles.push({
            el: p,
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            vx: (Math.random() - 0.5) * 0.25,
            vy: (Math.random() - 0.5) * 0.25,
            life: Math.random()
        });
    }
    let mx = window.innerWidth / 2, my = window.innerHeight / 2;
    window.addEventListener('mousemove', (e) => { mx = e.clientX; my = e.clientY; }, { passive: true });
    const tick = () => {
        const W = window.innerWidth, H = window.innerHeight;
        particles.forEach((p) => {
            const dx = (mx - p.x) * 0.0008;
            const dy = (my - p.y) * 0.0008;
            p.vx += dx; p.vy += dy;
            p.vx *= 0.985; p.vy *= 0.985;
            p.x += p.vx; p.y += p.vy;
            if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
            if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
            p.life += 0.004;
            if (p.life > 1) p.life = 0;
            const opacity = Math.sin(p.life * Math.PI) * 0.6;
            p.el.style.transform = 'translate(' + p.x + 'px,' + p.y + 'px)';
            p.el.style.opacity = opacity.toFixed(3);
        });
        requestAnimationFrame(tick);
    };
    if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
        requestAnimationFrame(tick);
    }

    /* ---------- Mobile drawer ---------- */
    const toggle = document.querySelector('.menu-toggle');
    const drawer = document.querySelector('.mobile-drawer');
    if (toggle && drawer) {
        const closeDrawer = () => { toggle.classList.remove('open'); drawer.classList.remove('open'); };
        toggle.addEventListener('click', () => {
            toggle.classList.toggle('open');
            drawer.classList.toggle('open');
        });
        drawer.querySelectorAll('a').forEach((a) => a.addEventListener('click', closeDrawer));
    }

    /* ---------- Tilt effect on cards (subtle) ---------- */
    const tiltEls = document.querySelectorAll('[data-tilt]');
    tiltEls.forEach((el) => {
        el.addEventListener('mousemove', (e) => {
            const r = el.getBoundingClientRect();
            const x = ((e.clientX - r.left) / r.width - 0.5) * 6;
            const y = ((e.clientY - r.top) / r.height - 0.5) * -6;
            el.style.transform = 'translateY(-6px) rotateX(' + y + 'deg) rotateY(' + x + 'deg)';
        });
        el.addEventListener('mouseleave', () => { el.style.transform = ''; });
    });

    /* ---------- Policy table-of-contents ---------- */
    const tocLinks = document.querySelectorAll('.policy-toc a');
    if (tocLinks.length) {
        tocLinks.forEach((a) => {
            a.addEventListener('click', (e) => {
                const id = a.getAttribute('href').slice(1);
                const tgt = document.getElementById(id);
                if (tgt) {
                    e.preventDefault();
                    const y = tgt.getBoundingClientRect().top + window.scrollY - 100;
                    window.scrollTo({ top: y, behavior: 'smooth' });
                }
            });
        });
        if ('IntersectionObserver' in window) {
            const sections = document.querySelectorAll('.policy-content section[id]');
            const map = {};
            tocLinks.forEach((a) => { map[a.getAttribute('href').slice(1)] = a; });
            const so = new IntersectionObserver((entries) => {
                entries.forEach((e) => {
                    if (e.isIntersecting) {
                        tocLinks.forEach((l) => l.classList.remove('active'));
                        const link = map[e.target.id];
                        if (link) link.classList.add('active');
                    }
                });
            }, { rootMargin: '-30% 0px -55% 0px' });
            sections.forEach((s) => so.observe(s));
        }
    }

    /* ---------- Contact form ---------- */
    const form = document.querySelector('.contact-form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const status = form.querySelector('.form-status');
            if (status) {
                status.textContent = 'Thank you — your message has been queued. Our team will reply within 1–2 business days.';
                status.classList.add('success');
                setTimeout(() => status.classList.remove('success'), 6000);
            }
            form.reset();
        });
    }

    /* ---------- Year ---------- */
    document.querySelectorAll('[data-year]').forEach((el) => {
        el.textContent = new Date().getFullYear();
    });

})();
