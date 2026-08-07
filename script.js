/* ==========================================================================
   DIREKTE — it6 · Header, menú mòbil, reveals, maridatge
   ========================================================================== */

(function () {
	'use strict';

	// Marca que hi ha JS — activa els estats inicials dels reveals
	document.documentElement.classList.add('js');

	/* ------------------------------------------------------------------
	   1. Header — fons en fer scroll
	   ------------------------------------------------------------------ */
	var header = document.getElementById('site-header');

	function onScroll() {
		if (!header) return;
		header.classList.toggle('is-scrolled', window.scrollY > 24);
	}

	window.addEventListener('scroll', onScroll, { passive: true });
	onScroll();

	/* ------------------------------------------------------------------
	   2. Menú mòbil
	   ------------------------------------------------------------------ */
	var toggle = document.querySelector('.site-nav__toggle');
	var mobileMenu = document.getElementById('mobile-menu');

	function setMenu(open) {
		if (!toggle || !mobileMenu) return;
		toggle.classList.toggle('is-open', open);
		toggle.setAttribute('aria-expanded', String(open));
		toggle.setAttribute('aria-label', open ? 'Tancar menú' : 'Obrir menú');
		mobileMenu.classList.toggle('is-open', open);
		mobileMenu.setAttribute('aria-hidden', String(!open));
		document.body.style.overflow = open ? 'hidden' : '';
	}

	if (toggle && mobileMenu) {
		toggle.addEventListener('click', function () {
			setMenu(!mobileMenu.classList.contains('is-open'));
		});

		// Tanca el menú en clicar qualsevol enllaç
		mobileMenu.querySelectorAll('a').forEach(function (a) {
			a.addEventListener('click', function () { setMenu(false); });
		});

		document.addEventListener('keydown', function (e) {
			if (e.key === 'Escape') setMenu(false);
		});
	}

	/* ------------------------------------------------------------------
	   3. Reveals en scroll
	   ------------------------------------------------------------------ */
	var reveals = document.querySelectorAll('.rv');

	if ('IntersectionObserver' in window && reveals.length) {
		var io = new IntersectionObserver(function (entries) {
			entries.forEach(function (entry) {
				if (entry.isIntersecting) {
					entry.target.classList.add('in');
					io.unobserve(entry.target);
				}
			});
		}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

		reveals.forEach(function (el) { io.observe(el); });
	} else {
		reveals.forEach(function (el) { el.classList.add('in'); });
	}

	/* ------------------------------------------------------------------
	   4. Vals — maridatge per menú aplicat al preu de cada val
	   ------------------------------------------------------------------ */
	document.querySelectorAll('.val-pairing__input').forEach(function (input) {
		input.addEventListener('change', function () {
			var item = input.closest('.val-item');
			var el = item && item.querySelector('.val-item__price-value[data-base]');
			if (!el) return;
			var extra = input.checked ? parseInt(input.getAttribute('data-extra'), 10) : 0;
			el.classList.add('is-flipping');
			setTimeout(function () {
				var base = parseInt(el.getAttribute('data-base'), 10);
				el.textContent = (base + extra) + ' €';
				el.classList.remove('is-flipping');
			}, 200);
		});
	});
})();


/* ==========================================================================
   DIREKTE — v2 · Cronologia viva: la línia s'omple i les fites s'encenen
   ========================================================================== */

(function () {
	'use strict';

	var timeline = document.querySelector('.ctimeline--live');
	if (!timeline) return;

	var progress = timeline.querySelector('.ctimeline__progress');
	var items = Array.prototype.slice.call(timeline.querySelectorAll('.ctl'));
	if (!progress || !items.length) return;

	var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	if (reduced) {
		items.forEach(function (el) { el.classList.add('is-on'); });
		return;
	}

	var ticking = false;

	function update() {
		ticking = false;

		var rect = timeline.getBoundingClientRect();
		var anchor = window.innerHeight * 0.55;

		// Alçada útil de la línia (mateixos marges que .ctimeline__line)
		var top = 12;
		var bottom = 40;
		if (window.innerWidth >= 900) { top = 0; bottom = 0; }
		var usable = Math.max(rect.height - top - bottom, 1);

		var filled = anchor - rect.top - top;
		filled = Math.max(0, Math.min(filled, usable));
		progress.style.height = filled + 'px';

		items.forEach(function (el) {
			var marker = el.querySelector('.ctl__marker');
			var m = (marker || el).getBoundingClientRect();
			el.classList.toggle('is-on', m.top < anchor + 40);
		});
	}

	function onScroll() {
		if (ticking) return;
		ticking = true;
		window.requestAnimationFrame(update);
	}

	window.addEventListener('scroll', onScroll, { passive: true });
	window.addEventListener('resize', onScroll);
	update();
})();
