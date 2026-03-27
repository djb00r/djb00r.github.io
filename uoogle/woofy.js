/* removed Woofy inline script from index.html — Woofy logic is now modular here */

(function () {
  const btn = document.getElementById('feelingWoofy');
  const dog = document.getElementById('mainDogLogo');
  const logo = document.querySelector('.logo .wordmark');
  const overlay = document.getElementById('woofyOverlay');

  if (!btn || !dog || !logo || !overlay) return;

  function clearOverlay() {
    overlay.innerHTML = '';
    dog.className = dog.className.replace(/\bwoofy-\S+/g, '').trim();
    logo.className = logo.className.replace(/\bwoofy-\S+/g, '').trim();
    document.body.classList.remove('woofy-invert-site');
    document.documentElement.classList.remove('woofy-site-collapse');
  }

  function centerFor(el) {
    const rect = el.getBoundingClientRect();
    return {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2
    };
  }

  function createFloating(content, x, y, extraClass) {
    const span = document.createElement('div');
    span.className = 'woofy-floating ' + (extraClass || '');
    span.textContent = content;
    span.style.left = x + 'px';
    span.style.top = y + 'px';
    overlay.appendChild(span);
    return span;
  }

  function anim1_swapSpin() {
    dog.classList.add('woofy-swap-dog');
    logo.classList.add('woofy-swap-logo');
    setTimeout(clearOverlay, 1700);
  }

  function anim2_boneThrow() {
    const centerDog = centerFor(dog);
    createFloating('🦴', centerDog.x, centerDog.y, 'woofy-bone');
    dog.classList.add('woofy-dog-run');
    logo.classList.add('woofy-logo-hit');
    setTimeout(clearOverlay, 1600);
  }

  function anim3_barkSpin() {
    const c = centerFor(dog);
    const bark = createFloating('BARK', c.x + 40, c.y - 20, 'woofy-bark');
    dog.classList.add('woofy-dog-spin');
    setTimeout(() => {
      if (bark.parentNode) bark.parentNode.removeChild(bark);
    }, 1100);
    setTimeout(clearOverlay, 1500);
  }

  function anim4_logoExplodeConfused() {
    logo.classList.add('woofy-logo-fall');
    const logoCenter = centerFor(logo);
    const burst = document.createElement('div');
    burst.className = 'woofy-floating woofy-explosion-burst';
    burst.style.left = (logoCenter.x - 40) + 'px';
    burst.style.top = (logoCenter.y + 40) + 'px';
    overlay.appendChild(burst);

    const dogCenter = centerFor(dog);
    const q = createFloating('?', dogCenter.x + 10, dogCenter.y - 70, '');
    q.style.color = '#ff9800';
    q.style.fontSize = '2rem';
    dog.classList.add('woofy-confused');

    setTimeout(clearOverlay, 1800);
  }

  function anim5_policeChase() {
    const rect = dog.getBoundingClientRect();
    const police = document.createElement('img');
    police.src = 'blue_dog.png';
    police.alt = 'Police dog';
    police.className = 'woofy-police-dog';
    police.style.left = (rect.left - 10) + 'px';
    police.style.top = (rect.top + rect.height - 60) + 'px';
    overlay.appendChild(police);

    dog.classList.add('woofy-dog-run-away');
    setTimeout(() => {
      dog.classList.remove('woofy-dog-run-away');
      dog.classList.add('woofy-dog-return');
    }, 1200);

    setTimeout(clearOverlay, 2600);
  }

  function anim6_invertSite() {
    document.body.classList.add('woofy-invert-site');
    const c = centerFor(dog);
    const mark = createFloating('!', c.x + 5, c.y - 70, 'woofy-alert-mark');
    setTimeout(() => {
      if (mark.parentNode) mark.parentNode.removeChild(mark);
      document.body.classList.remove('woofy-invert-site');
    }, 1300);
    setTimeout(clearOverlay, 1500);
  }

  function anim7_lampStomp() {
    const logoRect = logo.getBoundingClientRect();
    const lamp = document.createElement('div');
    lamp.className = 'woofy-floating woofy-lamp';
    lamp.style.left = (logoRect.left + logoRect.width - 40) + 'px';
    lamp.style.top = (logoRect.top - 80) + 'px';
    overlay.appendChild(lamp);
    logo.classList.add('woofy-logo-squash');

    setTimeout(() => {
      lamp.classList.add('woofy-lamp-eat');
    }, 900);

    setTimeout(clearOverlay, 1900);
  }

  function anim8_siteTruckFix() {
    document.documentElement.classList.add('woofy-site-collapse');

    const truck = document.createElement('div');
    truck.className = 'woofy-truck';
    overlay.appendChild(truck);

    const count = 6;
    for (let i = 0; i < count; i++) {
      const fixDog = document.createElement('img');
      fixDog.src = 'dog.png';
      fixDog.alt = 'Fixing dog';
      fixDog.className = 'woofy-fix-dog';
      const left = 10 + (window.innerWidth - 80) * Math.random();
      fixDog.style.left = left + 'px';
      overlay.appendChild(fixDog);
    }

    setTimeout(clearOverlay, 2600);
  }

  function runRandomWoofy() {
    clearOverlay();
    const animations = [
      anim1_swapSpin,
      anim2_boneThrow,
      anim3_barkSpin,
      anim4_logoExplodeConfused,
      anim5_policeChase,
      anim6_invertSite,
      anim7_lampStomp,
      anim8_siteTruckFix
    ];
    const choice = animations[Math.floor(Math.random() * animations.length)];
    choice();
  }

  btn.addEventListener('click', (e) => {
    e.preventDefault();
    runRandomWoofy();
  });
})();