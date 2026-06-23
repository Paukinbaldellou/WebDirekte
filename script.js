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
	   4. Vals — maridatge aplicat als preus
	   ------------------------------------------------------------------ */
	var pairing = document.getElementById('pairing');
	var prices = document.querySelectorAll('.val-item__price-value[data-base]');

	if (pairing && prices.length) {
		pairing.addEventListener('change', function () {
			var extra = pairing.checked ? 45 : 0;

			prices.forEach(function (el) {
				el.classList.add('is-flipping');
				setTimeout(function () {
					var base = parseInt(el.getAttribute('data-base'), 10);
					el.textContent = (base + extra) + ' €';
					el.classList.remove('is-flipping');
				}, 200);
			});
		});
	}
})();
