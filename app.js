(() => {
  'use strict';

  const container = document.getElementById('stories-container');
  const sections = document.querySelectorAll('.story-section');
  const navLogos = document.querySelectorAll('.nav-logo');
  const countersAnimated = new Set();

  // --- Intersection Observer ---
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const section = entry.target;
        section.classList.add('in-view');
        updateNav(section.id);
        animateCounters(section);
      }
    });
  }, {
    root: container,
    threshold: 0.6
  });

  sections.forEach(section => observer.observe(section));

  // --- Nav update ---
  function updateNav(activeId) {
    navLogos.forEach(logo => {
      const isActive = logo.dataset.target === activeId;
      logo.classList.toggle('active', isActive);
      if (isActive) {
        const section = document.getElementById(activeId);
        const accent = section?.dataset.accent;
        if (accent) {
          logo.style.setProperty('--accent', accent);
        }
      }
    });
  }

  // --- Nav click ---
  navLogos.forEach(logo => {
    logo.addEventListener('click', () => {
      const target = document.getElementById(logo.dataset.target);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // --- Keyboard navigation ---
  document.addEventListener('keydown', (e) => {
    const currentIndex = getCurrentSectionIndex();

    if (e.key === 'ArrowDown' || e.key === 'PageDown') {
      e.preventDefault();
      if (currentIndex < sections.length - 1) {
        sections[currentIndex + 1].scrollIntoView({ behavior: 'smooth' });
      }
    } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
      e.preventDefault();
      if (currentIndex > 0) {
        sections[currentIndex - 1].scrollIntoView({ behavior: 'smooth' });
      }
    }
  });

  function getCurrentSectionIndex() {
    const scrollTop = container.scrollTop;
    const vh = window.innerHeight;
    return Math.round(scrollTop / vh);
  }

  // --- Counter animation ---
  function animateCounters(section) {
    if (countersAnimated.has(section.id)) return;
    countersAnimated.add(section.id);

    const counters = section.querySelectorAll('[data-count]');
    counters.forEach(el => {
      const raw = el.dataset.count;
      const prefix = el.dataset.prefix || '';
      const suffix = el.dataset.suffix || '';
      const target = parseFloat(raw);
      const decimals = raw.includes('.') ? raw.split('.')[1].length : 0;
      const duration = 1500;
      const startTime = performance.now();

      function update(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // ease-out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = target * eased;

        el.textContent = prefix + current.toFixed(decimals) + suffix;

        if (progress < 1) {
          requestAnimationFrame(update);
        } else {
          el.textContent = prefix + parseFloat(raw).toFixed(decimals) + suffix;
        }
      }

      requestAnimationFrame(update);
    });
  }

  // --- Initialize first section as in-view ---
  if (sections.length > 0) {
    sections[0].classList.add('in-view');
    updateNav(sections[0].id);
    animateCounters(sections[0]);
  }
})();
