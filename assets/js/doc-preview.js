/* Report preview modal.
   Word (.docx) templates can't be rendered by a browser, so a "Preview"
   button shows the identical PDF version of the same report in an overlay.
   Markup contract: <button data-preview-pdf="path/to/report.pdf"
   data-preview-title="Marfan syndrome — Version 1">Preview</button>
   Paths may contain spaces and parentheses; they are encoded here. */
(function () {

	var overlay, frame, titleEl, tabLink, lastFocused;

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
					'<span>Preview shows the PDF version of this report.</span>' +
					'<a class="doc-preview__tab" target="_blank" rel="noopener">Open in new tab</a>' +
				'</div>' +
			'</div>';
		document.body.appendChild(overlay);

		frame = overlay.querySelector('.doc-preview__frame');
		titleEl = overlay.querySelector('.doc-preview__title');
		tabLink = overlay.querySelector('.doc-preview__tab');

		overlay.querySelector('.doc-preview__close').addEventListener('click', close);
		overlay.addEventListener('click', function (e) {
			if (e.target === overlay) close();
		});
	}

	function open(pdf, title) {
		if (!overlay) build();

		var src = encodeURI(pdf);
		titleEl.textContent = title || 'Report preview';
		frame.src = src;
		tabLink.href = src;

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

		e.preventDefault();
		open(trigger.getAttribute('data-preview-pdf'), trigger.getAttribute('data-preview-title'));
	});

	document.addEventListener('keydown', function (e) {
		if (e.key === 'Escape' || e.keyCode === 27) close();
	});

})();
