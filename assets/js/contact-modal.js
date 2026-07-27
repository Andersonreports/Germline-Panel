/* "Get in Touch" dialog.
   Opens from any element carrying data-contact-modal (the nav CTA), collects
   name / email / message and hands the message to the visitor's mail client.

   The site is served as static files, so there is no server to POST to; the
   Send button composes a mailto: to CONTACT_TO instead. Swap CONTACT_TO here
   if enquiries should reach a different inbox. Elements keep their original
   href as a no-JavaScript fallback (it scrolls to the contact section). */
(function () {

	var CONTACT_TO = 'sachin@anderson.healthcare';

	var overlay, form, statusEl, lastFocused;

	function build() {
		overlay = document.createElement('div');
		overlay.className = 'contact-modal';
		overlay.setAttribute('role', 'dialog');
		overlay.setAttribute('aria-modal', 'true');
		overlay.setAttribute('aria-labelledby', 'contact-modal-title');
		overlay.innerHTML =
			'<div class="contact-modal__panel">' +
				'<div class="contact-modal__bar">' +
					'<span class="contact-modal__title" id="contact-modal-title">Get in touch</span>' +
					'<button type="button" class="contact-modal__close" aria-label="Close">' +
						'<i class="fas fa-times"></i>' +
					'</button>' +
				'</div>' +
				'<form class="contact-modal__form" novalidate>' +
					'<p class="contact-modal__intro">Send us a message and we will get back to you.</p>' +
					'<label for="contact-modal-name">Name</label>' +
					'<input type="text" id="contact-modal-name" name="name" autocomplete="name" required />' +
					'<label for="contact-modal-email">Email</label>' +
					'<input type="email" id="contact-modal-email" name="email" autocomplete="email" required />' +
					'<label for="contact-modal-message">Message</label>' +
					'<textarea id="contact-modal-message" name="message" rows="5" required></textarea>' +
					'<p class="contact-modal__status" role="status"></p>' +
					'<button type="submit" class="contact-modal__send">Send message</button>' +
					'<p class="contact-modal__note">Sending opens your email app with the message ready. ' +
						'You can also write to <a href="mailto:' + CONTACT_TO + '">' + CONTACT_TO + '</a>.</p>' +
				'</form>' +
			'</div>';
		document.body.appendChild(overlay);

		form = overlay.querySelector('.contact-modal__form');
		statusEl = overlay.querySelector('.contact-modal__status');

		overlay.querySelector('.contact-modal__close').addEventListener('click', close);
		overlay.addEventListener('click', function (e) {
			if (e.target === overlay) close();
		});
		form.addEventListener('submit', send);
	}

	function field(name) {
		return form.elements[name].value.trim();
	}

	function say(message, isError) {
		statusEl.textContent = message;
		statusEl.className = 'contact-modal__status' + (isError ? ' is-error' : ' is-ok');
	}

	function send(e) {
		e.preventDefault();

		var name = field('name'),
			email = field('email'),
			message = field('message');

		if (!name || !email || !message) {
			say('Please fill in your name, email and message.', true);
			return;
		}
		if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
			say('That email address does not look right.', true);
			return;
		}

		var body = 'Name: ' + name + '\nEmail: ' + email + '\n\nMessage:\n' + message;

		say('Opening your email app...');
		window.location.href = 'mailto:' + CONTACT_TO +
			'?subject=' + encodeURIComponent('Website enquiry from ' + name) +
			'&body=' + encodeURIComponent(body);
	}

	function open() {
		if (!overlay) build();

		lastFocused = document.activeElement;
		say('');
		overlay.classList.add('is-open');
		document.body.classList.add('contact-modal-open');
		form.elements['name'].focus();
	}

	function close() {
		if (!overlay || !overlay.classList.contains('is-open')) return;

		overlay.classList.remove('is-open');
		document.body.classList.remove('contact-modal-open');
		if (lastFocused && lastFocused.focus) lastFocused.focus();
	}

	document.addEventListener('click', function (e) {
		var trigger = e.target.closest ? e.target.closest('[data-contact-modal]') : null;
		if (!trigger) return;

		e.preventDefault();
		open();
	});

	document.addEventListener('keydown', function (e) {
		if (e.key === 'Escape' || e.keyCode === 27) close();
	});

})();
