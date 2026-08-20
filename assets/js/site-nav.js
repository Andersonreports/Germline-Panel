/* Overlay nav bar.
   .site-nav has no background while it sits over the hero photo. Once the
   page scrolls far enough that the bar would overlap the white content
   below, .is-solid gives it the navy background (see assets/css/home.css). */
(function () {

	var nav = document.querySelector('.site-nav');
	if (!nav) return;

	var hero = document.querySelector('.hero--photo');

	/* Pages with no photo hero (panels.html, metagenomics.html, brochures.html)
	   have nothing transparent for the nav to sit over, so keep it solid from
	   the start instead of running the scroll-based toggle below. */
	if (!hero) {
		nav.classList.add('is-solid');
		return;
	}

	function threshold() {
		/* Switch as the bottom of the bar leaves the hero. */
		var heroHeight = hero ? hero.offsetHeight : 320;
		return Math.max(80, heroHeight - nav.offsetHeight);
	}

	function update() {
		nav.classList.toggle('is-solid', window.pageYOffset > threshold());
	}

	var queued = false;
	function onScroll() {
		if (queued) return;
		queued = true;
		window.requestAnimationFrame(function () {
			queued = false;
			update();
		});
	}

	window.addEventListener('scroll', onScroll, { passive: true });
	window.addEventListener('resize', onScroll);
	update();

})();
