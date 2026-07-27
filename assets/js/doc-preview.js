/* Report preview overlay.
   A browser cannot render a Word file, so clicking a report shows the
   identical PDF version in an overlay; when the click came from a .docx
   link, the overlay also offers that Word file as a download.

   Markup contract: any <a> or <button> carrying
     data-preview-pdf="path/to/report.pdf"
     data-preview-title="Marfan syndrome - Version 1"
   On an <a href="...docx"> the href is kept as the download target and as
   the no-JavaScript fallback. Paths may contain spaces and parentheses;
   they are encoded here. */
(function () {

	var overlay, frame, titleEl, tabLink, docLink, lastFocused;

	function build() {
		overlay = document.createElement('div');
		overlay.className = 'doc-preview';
		overlay.setAttribute('role', 'dialog');
		overlay.setAttribute('aria-modal', 'true');
		overlay.setAttribute('aria-label', 'Report preview');
		overlay.innerHTML =
			'<div class="doc-preview__panel">' +
				'<div class="doc-preview__bar">' +
					'<span class="doc-preview__title"></span>' +
					'<button type="button" class="doc-preview__close" aria-label="Close preview">' +
						'<i class="fas fa-times"></i>' +
					'</button>' +
				'</div>' +
				'<iframe class="doc-preview__frame" title="Report preview"></iframe>' +
				'<div class="doc-preview__foot">' +
					'<span class="doc-preview__note">Preview shows the PDF version of this report.</span>' +
					'<a class="doc-preview__doc" download><i class="fas fa-file-word"></i>Download Word file</a>' +
					'<a class="doc-preview__tab" target="_blank" rel="noopener">Open PDF in new tab</a>' +
				'</div>' +
			'</div>';
		document.body.appendChild(overlay);

		frame = overlay.querySelector('.doc-preview__frame');
		titleEl = overlay.querySelector('.doc-preview__title');
		tabLink = overlay.querySelector('.doc-preview__tab');
		docLink = overlay.querySelector('.doc-preview__doc');

		overlay.querySelector('.doc-preview__close').addEventListener('click', close);
		overlay.addEventListener('click', function (e) {
			if (e.target === overlay) close();
		});
	}

	function open(pdf, title, doc) {
		if (!overlay) build();

		var src = encodeURI(pdf);
		titleEl.textContent = title || 'Report preview';
		frame.src = src;
		tabLink.href = src;

		if (doc) {
			docLink.href = encodeURI(doc);
			docLink.style.display = '';
		} else {
			docLink.removeAttribute('href');
			docLink.style.display = 'none';
		}

		lastFocused = document.activeElement;
		overlay.classList.add('is-open');
		document.body.classList.add('doc-preview-open');
		overlay.querySelector('.doc-preview__close').focus();
	}

	function close() {
		if (!overlay || !overlay.classList.contains('is-open')) return;

		overlay.classList.remove('is-open');
		document.body.classList.remove('doc-preview-open');
		frame.src = 'about:blank';
		if (lastFocused && lastFocused.focus) lastFocused.focus();
	}

	document.addEventListener('click', function (e) {
		var trigger = e.target.closest ? e.target.closest('[data-preview-pdf]') : null;
		if (!trigger) return;

		var href = trigger.getAttribute('href') || '';
		var doc = /\.docx?$/i.test(href) ? href : null;

		e.preventDefault();
		open(trigger.getAttribute('data-preview-pdf'), trigger.getAttribute('data-preview-title'), doc);
	});

	document.addEventListener('keydown', function (e) {
		if (e.key === 'Escape' || e.keyCode === 27) close();
	});

})();
