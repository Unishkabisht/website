document.addEventListener('DOMContentLoaded', function () {

    // ---- Mobile Menu Toggle ----
    var mobileBtn = document.getElementById('mobile-menu-btn');
    var navbar = document.querySelector('.navbar');
    if (mobileBtn) {
        mobileBtn.addEventListener('click', function () {
            navbar.classList.toggle('nav-open');
        });
    }

    // ---- Navbar Scroll Effect ----
    if (navbar) {
        window.addEventListener('scroll', function () {
            if (window.scrollY > 40) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    // ==========================================
    // CSS ANIMATIONS (IntersectionObserver)
    // ==========================================
    try {
        var observerOptions = { root: null, rootMargin: '0px 0px -10% 0px', threshold: 0 };
        var observer = new IntersectionObserver(function (entries, obs) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                    obs.unobserve(entry.target);
                }
            });
        }, observerOptions);
        document.querySelectorAll('.reveal-wrap, .reveal-text, .fade-up, .clip-reveal, .card-3d').forEach(function (el) {
            observer.observe(el);
        });
        setTimeout(function () {
            document.querySelectorAll('.hero .reveal-text, .hero .fade-up, .hero .clip-reveal').forEach(function (el) {
                el.classList.add('in-view');
            });
        }, 50);
    } catch (err) {
        console.error('IntersectionObserver error:', err);
        document.querySelectorAll('.reveal-text, .fade-up, .clip-reveal').forEach(function (el) {
            el.classList.add('in-view');
        });
    }

    // ==========================================
    // GA4: CTA click tracking
    // ==========================================
    document.querySelectorAll('[data-ga-cta]').forEach(function (el) {
        el.addEventListener('click', function () {
            if (typeof gtag === 'function') {
                gtag('event', 'cta_click', { cta_label: el.dataset.gaCta });
            }
        });
    });

    // ==========================================
    // LENIS SMOOTH SCROLL
    // ==========================================
    var lenis;
    try {
        if (typeof Lenis !== 'undefined') {
            lenis = new Lenis({
                duration: 1.2,
                easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
                direction: 'vertical',
                gestureDirection: 'vertical',
                smooth: true,
                mouseMultiplier: 1,
                smoothTouch: false,
                touchMultiplier: 2,
                infinite: false
            });
            function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
            requestAnimationFrame(raf);
            document.querySelectorAll('a[href^="#"]').forEach(function (link) {
                link.addEventListener('click', function (e) {
                    e.preventDefault();
                    var id = this.getAttribute('href');
                    if (id === '#') return;
                    var el = document.querySelector(id);
                    if (el) {
                        if (navbar) navbar.classList.remove('nav-open');
                        lenis.scrollTo(el, { offset: -80 });
                    }
                });
            });
        }
    } catch (err) { console.error('Lenis error:', err); }

    // ==========================================
    // GSAP SETUP
    // ==========================================
    try {
        if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
            gsap.registerPlugin(ScrollTrigger);
            if (lenis) {
                lenis.on('scroll', ScrollTrigger.update);
                gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
                gsap.ticker.lagSmoothing(0, 0);
            }
            // Image parallax
            gsap.utils.toArray('.feature-media img').forEach(function (img) {
                gsap.to(img, {
                    y: '10%', ease: 'none',
                    scrollTrigger: {
                        trigger: img.closest('.feature-media'),
                        start: 'top bottom', end: 'bottom top', scrub: true
                    }
                });
            });
            // Horizontal scroll (perspectives section)
            var hSection = document.querySelector('.solutions-section');
            var hContainer = document.querySelector('.horizontal-container');
            if (hSection && hContainer) {
                var scrollWidth = hContainer.scrollWidth - window.innerWidth;
                gsap.to(hContainer, {
                    x: -scrollWidth, ease: 'none',
                    scrollTrigger: {
                        trigger: hSection, start: 'top top',
                        end: function () { return '+=' + scrollWidth; },
                        pin: true, scrub: 1
                    }
                });
                window.addEventListener('resize', function () {
                    scrollWidth = hContainer.scrollWidth - window.innerWidth;
                    ScrollTrigger.refresh();
                });
            }
        }
    } catch (err) { console.error('GSAP error:', err); }

    // ==========================================
    // THREE.JS 3D Background
    // ==========================================
    try {
        var canvas = document.getElementById('hero-canvas');
        if (canvas && typeof THREE !== 'undefined') {
            var scene = new THREE.Scene();
            var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
            var renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            var geometry = new THREE.IcosahedronGeometry(1.5, 1);
            var material = new THREE.MeshBasicMaterial({ color: 0x2f5741, wireframe: true, transparent: true, opacity: 0.15 });
            var shape = new THREE.Mesh(geometry, material);
            scene.add(shape);
            camera.position.z = 4;
            shape.position.x = 1.5;
            shape.rotation.x = 0.5;
            function render3D() {
                shape.rotation.y += 0.002;
                shape.rotation.x += 0.001;
                renderer.render(scene, camera);
                requestAnimationFrame(render3D);
            }
            render3D();
            window.addEventListener('resize', function () {
                camera.aspect = window.innerWidth / window.innerHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(window.innerWidth, window.innerHeight);
            });
            if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
                gsap.to(shape.rotation, {
                    y: '+=3', x: '+=2', ease: 'none',
                    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 }
                });
            }
        }
    } catch (err) { console.error('Three.js error:', err); }

    // ==========================================
    // FAQ Accordion (index.html)
    // ==========================================
    document.querySelectorAll('.faq-item').forEach(function (item) {
        var btn = item.querySelector('.faq-question');
        var answer = item.querySelector('.faq-answer');

        item.addEventListener('mouseenter', function () {
            var isOpen = btn.getAttribute('aria-expanded') === 'true';
            if (isOpen) return; // Already open

            // Close all
            document.querySelectorAll('.faq-question').forEach(function (b) {
                b.setAttribute('aria-expanded', 'false');
                b.nextElementSibling.style.maxHeight = null;
            });

            // Open this one
            btn.setAttribute('aria-expanded', 'true');
            answer.style.maxHeight = answer.scrollHeight + 'px';
        });
    });
});
