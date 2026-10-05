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
	var LABEL_CLOSE = { ca: 'Tancar menú', es: 'Cerrar menú', en: 'Close menu', fr: 'Fermer le menu' };
	var labelOpen = toggle ? toggle.getAttribute('aria-label') : '';
	var labelClose = LABEL_CLOSE[(document.documentElement.lang || 'ca').slice(0, 2)] || LABEL_CLOSE.ca;

	function setMenu(open) {
		if (!toggle || !mobileMenu) return;
		toggle.classList.toggle('is-open', open);
		toggle.setAttribute('aria-expanded', String(open));
		toggle.setAttribute('aria-label', open ? labelClose : labelOpen);
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
		if (window.innerWidth <= 640) bottom = 54;
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


/* ==========================================================================
   DIREKTE — Selector d'idioma: es tanca en clicar fora o amb Esc
   ========================================================================== */

(function () {
	'use strict';
	var menus = document.querySelectorAll('.lang-menu');
	if (!menus.length) return;
	document.addEventListener('click', function (e) {
		menus.forEach(function (m) { if (m.open && !m.contains(e.target)) m.open = false; });
	});
	document.addEventListener('keydown', function (e) {
		if (e.key === 'Escape') menus.forEach(function (m) { m.open = false; });
	});
})();


/* ==========================================================================
   DIREKTE — Vals — formulari de comanda (sense pagament en línia)
   Envia la comanda per email via FormSubmit. Primer enviament: FormSubmit
   envia un correu d'activació a GIFT_EMAIL que cal clicar una vegada.
   ========================================================================== */

(function () {
	'use strict';

	var GIFT_EMAIL = 'reserves@direkte.cat';
	var ENDPOINT = 'https://formsubmit.co/ajax/' + GIFT_EMAIL;
	var MIN_OPEN = 20;

	var triggers = document.querySelectorAll('[data-gift]');
	if (!triggers.length || typeof HTMLDialogElement === 'undefined') return;

	var I18N = {
		ca: {
			kicker: 'Vals regal', title: 'Regala DIREKTE.',
			intro: "Omple les dades i t'escriurem per confirmar el val i indicar-te com fer el pagament.",
			product: 'Què vols regalar?', amount: 'Import per val', qtyMenu: 'Per a quantes persones?', qtyExtra: 'Quantitat',
			total: 'Total', you: 'Les teves dades', name: 'Nom i cognoms', email: 'Email', phone: 'Telèfon',
			gift: 'El regal', recipient: 'Per a qui és?', date: 'Per quan el necessites?', message: 'Dedicatòria', optional: '(opcional)',
			privacy: ['He llegit i accepto la ', 'política de privacitat', '.'],
			submit: 'Enviar la comanda', sending: 'Enviant…', note: 'No pagues res ara.',
			doneTitle: 'Rebut.', doneText: "T'escriurem a {email} per confirmar el val i el pagament.", close: 'Tancar',
			errRequired: 'Revisa els camps marcats.', errAmount: "L'import mínim és de 20 €.",
			errSend: "No s'ha pogut enviar. T'obrim el correu amb la comanda ja escrita.",
			minus: 'Treure una', plus: 'Afegir una', yes: 'Sí', no: 'No'
		},
		es: {
			kicker: 'Vales regalo', title: 'Regala DIREKTE.',
			intro: 'Rellena los datos y te escribiremos para confirmar el vale e indicarte cómo hacer el pago.',
			product: '¿Qué quieres regalar?', amount: 'Importe por vale', qtyMenu: '¿Para cuántas personas?', qtyExtra: 'Cantidad',
			total: 'Total', you: 'Tus datos', name: 'Nombre y apellidos', email: 'Email', phone: 'Teléfono',
			gift: 'El regalo', recipient: '¿Para quién es?', date: '¿Para cuándo lo necesitas?', message: 'Dedicatoria', optional: '(opcional)',
			privacy: ['He leído y acepto la ', 'política de privacidad', '.'],
			submit: 'Enviar el pedido', sending: 'Enviando…', note: 'Ahora no pagas nada.',
			doneTitle: 'Recibido.', doneText: 'Te escribiremos a {email} para confirmar el vale y el pago.', close: 'Cerrar',
			errRequired: 'Revisa los campos marcados.', errAmount: 'El importe mínimo es de 20 €.',
			errSend: 'No se ha podido enviar. Te abrimos el correo con el pedido ya escrito.',
			minus: 'Quitar una', plus: 'Añadir una', yes: 'Sí', no: 'No'
		},
		en: {
			kicker: 'Gift vouchers', title: 'Give DIREKTE.',
			intro: "Fill in your details and we'll write to confirm the voucher and explain how to pay.",
			product: 'What would you like to give?', amount: 'Amount per voucher', qtyMenu: 'For how many people?', qtyExtra: 'Quantity',
			total: 'Total', you: 'Your details', name: 'Full name', email: 'Email', phone: 'Phone',
			gift: 'The gift', recipient: 'Who is it for?', date: 'When do you need it?', message: 'Message', optional: '(optional)',
			privacy: ['I have read and accept the ', 'privacy policy', '.'],
			submit: 'Send request', sending: 'Sending…', note: "You don't pay anything now.",
			doneTitle: 'Received.', doneText: "We'll write to {email} to confirm the voucher and payment.", close: 'Close',
			errRequired: 'Please check the highlighted fields.', errAmount: 'The minimum amount is €20.',
			errSend: "It couldn't be sent. We're opening your email with the request already written.",
			minus: 'One less', plus: 'One more', yes: 'Yes', no: 'No'
		},
		fr: {
			kicker: 'Bons cadeaux', title: 'Offrir DIREKTE.',
			intro: 'Remplissez vos coordonnées et nous vous écrirons pour confirmer le bon et vous indiquer comment payer.',
			product: 'Que souhaitez-vous offrir ?', amount: 'Montant par bon', qtyMenu: 'Pour combien de personnes ?', qtyExtra: 'Quantité',
			total: 'Total', you: 'Vos coordonnées', name: 'Nom et prénom', email: 'Email', phone: 'Téléphone',
			gift: 'Le cadeau', recipient: 'Pour qui est-il ?', date: 'Pour quand en avez-vous besoin ?', message: 'Dédicace', optional: '(facultatif)',
			privacy: ["J'ai lu et j'accepte la ", 'politique de confidentialité', '.'],
			submit: 'Envoyer la demande', sending: 'Envoi…', note: 'Vous ne payez rien maintenant.',
			doneTitle: 'Reçu.', doneText: 'Nous vous écrirons à {email} pour confirmer le bon et le paiement.', close: 'Fermer',
			errRequired: 'Vérifiez les champs signalés.', errAmount: 'Le montant minimum est de 20 €.',
			errSend: "L'envoi a échoué. Nous ouvrons votre messagerie avec la demande déjà rédigée.",
			minus: 'Un de moins', plus: 'Un de plus', yes: 'Oui', no: 'Non'
		}
	};

	var lang = (document.documentElement.lang || 'ca').slice(0, 2);
	var t = I18N[lang] || I18N.ca;
	var privacyLink = document.querySelector('a[href$="privacitat.html"]');
	var privacyHref = privacyLink ? privacyLink.getAttribute('href') : 'privacitat.html';
	var sealImg = document.querySelector('.validity__seal');
	var sealSrc = sealImg ? sealImg.getAttribute('src') : '';

	function txt(el) { return el ? el.textContent.replace(/\s+/g, ' ').trim() : ''; }
	function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
	function eur(n) { return n + ' €'; }

	/* Catàleg llegit del DOM — així cada idioma ja porta els seus noms */
	var products = [];
	triggers.forEach(function (a) {
		var item = a.closest('.val-item, .extra');
		if (!item) return;
		var p = { id: a.getAttribute('data-gift'), trigger: a, item: item, isMenu: item.classList.contains('val-item') };
		p.open = item.classList.contains('val-item--open');
		p.name = txt(item.querySelector('.val-item__name, .extra__name'));
		var base = item.querySelector('.val-item__price-value[data-base]');
		p.price = base ? parseInt(base.getAttribute('data-base'), 10) : parseInt(txt(item.querySelector('.extra__price')), 10) || 0;
		var pair = item.querySelector('.val-pairing__input');
		if (pair) {
			p.pairInput = pair;
			p.pairPrice = parseInt(pair.getAttribute('data-extra'), 10) || 0;
			var label = item.querySelector('.val-pairing__text');
			p.pairLabel = label ? txt(label.firstChild) : '';
		}
		products.push(p);
	});

	var html =
		'<form class="gift-form" novalidate>' +
			'<div class="gift-form__head">' +
				'<div>' +
					'<div class="kicker"><span class="kicker__num">—</span><span>' + esc(t.kicker) + '</span></div>' +
					'<h2 class="gift-form__title" id="gift-title">' + esc(t.title) + '</h2>' +
				'</div>' +
				'<button type="button" class="gift-form__close" data-gift-close aria-label="' + esc(t.close) + '"><span aria-hidden="true">×</span></button>' +
			'</div>' +
			'<p class="gift-form__intro">' + esc(t.intro) + '</p>' +

			'<div class="gift-form__group">' +
				'<label class="gift-field"><span class="gift-field__label">' + esc(t.product) + '</span>' +
					'<select class="gift-input gift-input--select" name="product">' +
					products.map(function (p, i) { return '<option value="' + i + '">' + (p.open ? '' : eur(p.price) + ' · ') + esc(p.name) + '</option>'; }).join('') +
					'</select></label>' +
				'<label class="val-pairing gift-form__pairing" data-when="pair">' +
					'<input type="checkbox" class="val-pairing__input" name="pairing">' +
					'<span class="val-pairing__box" aria-hidden="true"></span>' +
					'<span class="val-pairing__text"><span data-pair-label></span> <span class="val-pairing__price" data-pair-price></span></span>' +
				'</label>' +
				'<div class="gift-form__row">' +
					'<label class="gift-field" data-when="open"><span class="gift-field__label">' + esc(t.amount) + '</span>' +
						'<span class="gift-amount"><input class="gift-input gift-amount__input" type="number" name="amount" min="' + MIN_OPEN + '" step="10" inputmode="numeric" placeholder="' + MIN_OPEN + '"><span class="gift-amount__cur">€</span></span></label>' +
					'<div class="gift-field"><span class="gift-field__label" id="gift-qty-label" data-qty-label></span>' +
						'<div class="gift-stepper" role="group" aria-labelledby="gift-qty-label">' +
							'<button type="button" class="gift-stepper__btn" data-step="-1" aria-label="' + esc(t.minus) + '">−</button>' +
							'<input class="gift-stepper__input" type="number" name="qty" value="1" min="1" max="20" inputmode="numeric" aria-labelledby="gift-qty-label">' +
							'<button type="button" class="gift-stepper__btn" data-step="1" aria-label="' + esc(t.plus) + '">+</button>' +
						'</div></div>' +
				'</div>' +
				'<div class="gift-total" aria-live="polite"><span class="gift-total__label">' + esc(t.total) + '</span><span class="gift-total__value" data-total>—</span></div>' +
			'</div>' +

			'<div class="gift-form__group" role="group" aria-labelledby="gift-you">' +
				'<h3 class="gift-form__legend" id="gift-you">' + esc(t.you) + '</h3>' +
				'<label class="gift-field"><span class="gift-field__label">' + esc(t.name) + '</span><input class="gift-input" type="text" name="name" autocomplete="name" required></label>' +
				'<div class="gift-form__row">' +
					'<label class="gift-field"><span class="gift-field__label">' + esc(t.email) + '</span><input class="gift-input" type="email" name="email" autocomplete="email" required></label>' +
					'<label class="gift-field"><span class="gift-field__label">' + esc(t.phone) + '</span><input class="gift-input" type="tel" name="phone" autocomplete="tel" required></label>' +
				'</div>' +
			'</div>' +

			'<div class="gift-form__group" role="group" aria-labelledby="gift-gift">' +
				'<h3 class="gift-form__legend" id="gift-gift">' + esc(t.gift) + '</h3>' +
				'<div class="gift-form__row">' +
					'<label class="gift-field"><span class="gift-field__label">' + esc(t.recipient) + ' <em>' + esc(t.optional) + '</em></span><input class="gift-input" type="text" name="recipient"></label>' +
					'<label class="gift-field"><span class="gift-field__label">' + esc(t.date) + ' <em>' + esc(t.optional) + '</em></span><input class="gift-input" type="date" name="date"></label>' +
				'</div>' +
				'<label class="gift-field"><span class="gift-field__label">' + esc(t.message) + ' <em>' + esc(t.optional) + '</em></span><textarea class="gift-input gift-input--area" name="message" rows="3" maxlength="400"></textarea></label>' +
			'</div>' +

			'<input type="text" name="_honey" class="gift-hp" tabindex="-1" autocomplete="off" aria-hidden="true">' +

			'<label class="val-pairing gift-form__check">' +
				'<input type="checkbox" class="val-pairing__input" name="privacy" required>' +
				'<span class="val-pairing__box" aria-hidden="true"></span>' +
				'<span class="val-pairing__text">' + esc(t.privacy[0]) + '<a href="' + esc(privacyHref) + '" target="_blank" rel="noopener">' + esc(t.privacy[1]) + '</a>' + esc(t.privacy[2]) + '</span>' +
			'</label>' +

			'<p class="gift-form__error" role="alert" hidden></p>' +
			'<div class="gift-form__actions">' +
				'<button type="submit" class="btn btn--accent btn--block" data-submit>' + esc(t.submit) + '</button>' +
				'<p class="gift-form__note">' + esc(t.note) + '</p>' +
			'</div>' +
		'</form>' +
		'<div class="gift-done" hidden>' +
			(sealSrc ? '<img src="' + esc(sealSrc) + '" alt="" class="gift-done__seal" aria-hidden="true">' : '') +
			'<h2 class="gift-done__title" tabindex="-1">' + esc(t.doneTitle) + '</h2>' +
			'<p class="gift-done__text" data-done-text></p>' +
			'<button type="button" class="btn btn--ghost" data-gift-close>' + esc(t.close) + '</button>' +
		'</div>';

	var dialog = document.createElement('dialog');
	dialog.className = 'gift-dialog';
	dialog.setAttribute('aria-labelledby', 'gift-title');
	dialog.innerHTML = html;
	document.body.appendChild(dialog);

	var form = dialog.querySelector('.gift-form');
	var done = dialog.querySelector('.gift-done');
	var sel = form.elements.product;
	var pairRow = form.querySelector('[data-when="pair"]');
	var openRow = form.querySelector('[data-when="open"]');
	var qtyLabel = form.querySelector('[data-qty-label]');
	var totalEl = form.querySelector('[data-total]');
	var errorEl = form.querySelector('.gift-form__error');
	var submitBtn = form.querySelector('[data-submit]');
	var today = new Date();
	form.elements.date.min = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().slice(0, 10);

	function current() { return products[parseInt(sel.value, 10)] || products[0]; }
	function qty() { var q = parseInt(form.elements.qty.value, 10); return isNaN(q) ? 1 : Math.min(20, Math.max(1, q)); }
	function unitPrice(p) {
		if (p.open) return parseInt(form.elements.amount.value, 10) || 0;
		return p.price + (p.pairInput && form.elements.pairing.checked ? p.pairPrice : 0);
	}

	function sync() {
		var p = current();
		pairRow.hidden = !p.pairInput;
		openRow.hidden = !p.open;
		if (p.pairInput) {
			pairRow.querySelector('[data-pair-label]').textContent = p.pairLabel;
			pairRow.querySelector('[data-pair-price]').textContent = '+ ' + eur(p.pairPrice);
		}
		qtyLabel.textContent = p.isMenu ? t.qtyMenu : t.qtyExtra;
		var u = unitPrice(p);
		totalEl.textContent = u ? eur(u * qty()) : '—';
	}

	function setInvalid(el, bad) {
		var wrap = el.closest('.gift-field, .val-pairing');
		if (wrap) wrap.classList.toggle('is-invalid', bad);
		if (bad) el.setAttribute('aria-invalid', 'true'); else el.removeAttribute('aria-invalid');
	}

	function showError(msg) { errorEl.textContent = msg; errorEl.hidden = !msg; }

	function openFor(p) {
		form.hidden = false; done.hidden = true; showError('');
		sel.value = String(products.indexOf(p));
		if (p.pairInput) form.elements.pairing.checked = p.pairInput.checked;
		if (p.open) {
			var cardAmount = p.item.querySelector('.val-item__amount-input');
			form.elements.amount.value = cardAmount ? cardAmount.value : '';
		}
		form.querySelectorAll('.is-invalid').forEach(function (el) { el.classList.remove('is-invalid'); });
		sync();
		document.documentElement.classList.add('has-dialog');
		dialog.showModal();
		dialog.scrollTop = 0;
	}

	function close() { if (dialog.open) dialog.close(); }

	dialog.addEventListener('close', function () { document.documentElement.classList.remove('has-dialog'); });
	dialog.addEventListener('click', function (e) {
		if (e.target === dialog || e.target.closest('[data-gift-close]')) close();
	});

	products.forEach(function (p) {
		p.trigger.addEventListener('click', function (e) { e.preventDefault(); openFor(p); });
	});

	sel.addEventListener('change', function () {
		var p = current();
		form.elements.pairing.checked = p.pairInput ? p.pairInput.checked : false;
		sync();
	});
	form.elements.pairing.addEventListener('change', sync);
	form.elements.amount.addEventListener('input', sync);
	form.elements.qty.addEventListener('input', sync);
	form.elements.qty.addEventListener('blur', function () { form.elements.qty.value = qty(); sync(); });
	form.querySelectorAll('[data-step]').forEach(function (b) {
		b.addEventListener('click', function () {
			form.elements.qty.value = Math.min(20, Math.max(1, qty() + parseInt(b.getAttribute('data-step'), 10)));
			sync();
		});
	});
	form.addEventListener('input', function (e) { if (e.target.getAttribute('aria-invalid')) setInvalid(e.target, false); });
	form.addEventListener('change', function (e) { if (e.target.getAttribute('aria-invalid')) setInvalid(e.target, false); });

	function summary() {
		var p = current();
		var f = form.elements;
		var unit = unitPrice(p);
		var hasPair = p.pairInput && f.pairing.checked;
		var line = p.name + (hasPair ? ' + ' + p.pairLabel : '') + ' × ' + qty();
		var data = {
			'Producte': p.name + (p.open ? '' : ' (' + eur(p.price) + ')'),
			'Maridatge': p.pairInput ? (hasPair ? I18N.ca.yes + ' (+ ' + eur(p.pairPrice) + ')' : I18N.ca.no) : '—',
			'Preu per unitat': eur(unit),
			'Quantitat': String(qty()),
			'Total': eur(unit * qty()),
			'Nom': f.name.value.trim(),
			'Email': f.email.value.trim(),
			'Telèfon': f.phone.value.trim(),
			'Per a qui és': f.recipient.value.trim() || '—',
			'Per quan': f.date.value || '—',
			'Dedicatòria': f.message.value.trim() || '—',
			'Idioma de la web': lang.toUpperCase()
		};
		return { line: line, total: unit * qty(), data: data };
	}

	function mailtoFallback(s) {
		var body = Object.keys(s.data).map(function (k) { return k + ': ' + s.data[k]; }).join('\n');
		window.location.href = 'mailto:' + GIFT_EMAIL + '?subject=' + encodeURIComponent('Vals regal · ' + s.line + ' · ' + eur(s.total)) + '&body=' + encodeURIComponent(body);
	}

	form.addEventListener('submit', function (e) {
		e.preventDefault();
		var f = form.elements;
		var p = current();
		var bad = false;
		['name', 'email', 'phone', 'privacy'].forEach(function (n) {
			var el = f[n];
			var ok = el.type === 'checkbox' ? el.checked : el.value.trim() && el.checkValidity();
			setInvalid(el, !ok);
			if (!ok) bad = true;
		});
		var amountBad = p.open && unitPrice(p) < MIN_OPEN;
		setInvalid(f.amount, amountBad);
		if (bad || amountBad) {
			showError(amountBad && !bad ? t.errAmount : t.errRequired);
			var first = form.querySelector('[aria-invalid="true"]');
			if (first) first.focus();
			return;
		}
		if (f._honey.value) return;
		showError('');

		var s = summary();
		var payload = Object.assign({
			_subject: 'Vals regal · ' + s.line + ' · ' + eur(s.total),
			_replyto: s.data.Email,
			_template: 'table',
			_captcha: 'false'
		}, s.data);

		submitBtn.disabled = true;
		submitBtn.textContent = t.sending;

		fetch(ENDPOINT, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
			body: JSON.stringify(payload)
		})
			.then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { return r.ok && String(j.success) === 'true'; }); })
			.catch(function () { return false; })
			.then(function (ok) {
				submitBtn.disabled = false;
				submitBtn.textContent = t.submit;
				if (!ok) { errorEl.innerHTML = esc(t.errSend) + ' <a href="mailto:' + GIFT_EMAIL + '">' + GIFT_EMAIL + '</a>'; errorEl.hidden = false; setTimeout(function () { mailtoFallback(s); }, 900); return; }
				done.querySelector('[data-done-text]').textContent = t.doneText.replace('{email}', s.data.Email);
				form.hidden = true;
				done.hidden = false;
				dialog.scrollTop = 0;
				done.querySelector('.gift-done__title').focus();
				form.reset();
				f.qty.value = 1;
			});
	});
})();


/* ==========================================================================
   DIREKTE — Mapa: l'iframe de Google es carrega només en clicar
   ========================================================================== */

(function () {
	'use strict';
	document.querySelectorAll('.contact-map__facade').forEach(function (box) {
		var btn = box.querySelector('[data-map-load]');
		if (!btn) return;
		btn.addEventListener('click', function () {
			var f = document.createElement('iframe');
			f.src = box.getAttribute('data-map-src');
			f.title = box.getAttribute('data-map-title') || '';
			f.className = 'contact-map__frame';
			f.referrerPolicy = 'no-referrer-when-downgrade';
			box.replaceWith(f);
			f.setAttribute('tabindex', '-1');
			f.focus();
		});
	});
})();


/* ==========================================================================
   DIREKTE — Motion: títols línia a línia darrere d'una màscara
   ========================================================================== */

(function () {
	'use strict';
	if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
	var SEL = '.page-hero__title, .offer__title, .gift-teaser__title, .timeline-intro__title, .chef__title, .family__title, .ferments__title, .extras__title, .vals-faq__title';
	var titles = Array.prototype.slice.call(document.querySelectorAll(SEL));
	if (!titles.length) return;

	function prepare(el) {
		if (el.children.length) { el.classList.add('is-done'); return false; }
		var original = el.innerHTML;
		var text = el.textContent.replace(/\s+/g, ' ').trim();
		// 1. paraules temporals per mesurar on trenca cada línia
		var words = text.split(' ');
		el.innerHTML = words.map(function (w) { return '<span class="w" style="display:inline-block">' + w.replace(/[&<>]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]; }) + '</span>'; }).join(' ');
		var lines = [], top = null;
		Array.prototype.forEach.call(el.querySelectorAll('.w'), function (w) {
			var t = w.offsetTop;
			if (top === null || Math.abs(t - top) > 4) { lines.push([]); top = t; }
			lines[lines.length - 1].push(w.textContent);
		});
		// 2. una màscara per línia
		el.innerHTML = lines.map(function (ws, i) {
			return '<span class="ln" aria-hidden="true"><span class="ln__i" style="--li:' + i + '">' + ws.join(' ').replace(/[&<>]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]; }) + '</span></span>';
		}).join('');
		el.setAttribute('aria-label', text);
		el.classList.add('split');
		el._original = original;
		el._lines = lines.length;
		return true;
	}

	function restore(el) {
		el.innerHTML = el._original;
		el.removeAttribute('aria-label');
		el.classList.remove('split', 'is-split-in');
		el.classList.add('is-done');
	}

	function reveal(el) {
		if (!el.classList.contains('split')) return;
		el.classList.add('is-split-in');
		el._revealed = true;
		var delay = parseInt(getComputedStyle(el).getPropertyValue('--rv-delay'), 10) || 0;
		setTimeout(function () { restore(el); }, delay + 1700 + el._lines * 110);
	}

	var start = function () {
		titles = titles.filter(prepare);
		var rt;
		window.addEventListener('resize', function () {
			clearTimeout(rt);
			rt = setTimeout(function () {
				titles.forEach(function (el) {
					if (el._revealed || !el.classList.contains('split')) return;
					el.innerHTML = el._original; el.classList.remove('split');
					prepare(el);
				});
			}, 200);
		});
		if (!('IntersectionObserver' in window)) { titles.forEach(reveal); return; }
		var io = new IntersectionObserver(function (entries) {
			entries.forEach(function (e) {
				if (!e.isIntersecting) return;
				io.unobserve(e.target);
				reveal(e.target);
			});
		}, { threshold: 0.25, rootMargin: '0px 0px -40px 0px' });
		titles.forEach(function (el) { io.observe(el); });
	};

	var ready = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
	Promise.race([ready, new Promise(function (r) { setTimeout(r, 700); })]).then(start);
})();
