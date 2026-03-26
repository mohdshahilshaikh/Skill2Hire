/* =========================================
   SKILLS2HIRE – script.js
   ========================================= */

'use strict';

/* =========================================
   1. NAVBAR – Sticky + Scroll effect
   ========================================= */
const navbar = document.getElementById('navbar');
const scrollTopBtn = document.getElementById('scrollTop');

window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
    scrollTopBtn.classList.add('show');
  } else {
    navbar.classList.remove('scrolled');
    scrollTopBtn.classList.remove('show');
  }
});

scrollTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* =========================================
   2. MOBILE MENU TOGGLE
   ========================================= */
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});

// Close menu when a link is clicked
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

/* =========================================
   3. SMOOTH SCROLLING
   ========================================= */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const navH = navbar.offsetHeight;
      const offerH = document.getElementById('offerBanner').offsetHeight;
      const offset = navH + offerH + 16;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* =========================================
   4. COUNTDOWN TIMER (48hrs from load)
   ========================================= */
function initCountdown() {
  const storageKey = 's2h_offer_end';
  let endTime = localStorage.getItem(storageKey);

  if (!endTime) {
    endTime = Date.now() + 48 * 60 * 60 * 1000;
    try { localStorage.setItem(storageKey, endTime); } catch(e) {}
  } else {
    endTime = parseInt(endTime, 10);
    // Reset if expired
    if (endTime < Date.now()) {
      endTime = Date.now() + 48 * 60 * 60 * 1000;
      try { localStorage.setItem(storageKey, endTime); } catch(e) {}
    }
  }

  const hoursEl = document.getElementById('hours');
  const minutesEl = document.getElementById('minutes');
  const secondsEl = document.getElementById('seconds');

  function pad(n) { return String(n).padStart(2, '0'); }

  function tick() {
    const diff = Math.max(0, endTime - Date.now());
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    hoursEl.textContent = pad(h);
    minutesEl.textContent = pad(m);
    secondsEl.textContent = pad(s);
    if (diff === 0) clearInterval(timer);
  }

  tick();
  const timer = setInterval(tick, 1000);
}

initCountdown();

/* =========================================
   5. TESTIMONIALS SLIDER
   ========================================= */
function initSlider() {
  const slides = document.querySelectorAll('.slide');
  const dotsContainer = document.getElementById('sliderDots');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  let current = 0;
  let autoplay;

  // Create dots
  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
    dot.addEventListener('click', () => goTo(i));
    dotsContainer.appendChild(dot);
  });

  function goTo(index) {
    slides[current].classList.remove('active');
    dotsContainer.children[current].classList.remove('active');
    current = (index + slides.length) % slides.length;
    slides[current].classList.add('active');
    dotsContainer.children[current].classList.add('active');
    resetAutoplay();
  }

  function resetAutoplay() {
    clearInterval(autoplay);
    autoplay = setInterval(() => goTo(current + 1), 5000);
  }

  prevBtn.addEventListener('click', () => goTo(current - 1));
  nextBtn.addEventListener('click', () => goTo(current + 1));

  // Touch swipe
  let startX = 0;
  const slider = document.getElementById('slider');
  slider.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
  slider.addEventListener('touchend', e => {
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) goTo(diff > 0 ? current + 1 : current - 1);
  });

  resetAutoplay();
}

initSlider();

/* =========================================
   6. SCROLL REVEAL ANIMATION
   ========================================= */
function initScrollReveal() {
  const revealTargets = [
    '.pricing-card',
    '.why-card',
    '.highlight-card',
    '.about-content',
    '.about-visual',
    '.contact-info',
    '.form-wrap',
    '.trust-item',
  ];

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  revealTargets.forEach(selector => {
    document.querySelectorAll(selector).forEach((el, i) => {
      el.classList.add('reveal');
      el.style.transitionDelay = `${i * 80}ms`;
      observer.observe(el);
    });
  });
}

initScrollReveal();

/* =========================================
   7. PRICING CARD HOVER – extra effect
   ========================================= */
document.querySelectorAll('.pricing-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 10;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 10;
    if (!card.classList.contains('popular')) {
      card.style.transform = `perspective(800px) rotateX(${-y * 0.4}deg) rotateY(${x * 0.4}deg) translateY(-8px)`;
    }
  });
  card.addEventListener('mouseleave', () => {
    if (!card.classList.contains('popular')) {
      card.style.transform = '';
    }
  });
});

/* =========================================
   8. ENROLL NOW QUICK-FILL
   ========================================= */
document.querySelectorAll('.card-btn[data-course]').forEach(btn => {
  btn.addEventListener('click', (e) => {
    const course = btn.getAttribute('data-course');
    const select = document.getElementById('fcourse');
    if (select && course) {
      for (let i = 0; i < select.options.length; i++) {
        if (select.options[i].text.toLowerCase().includes(course.toLowerCase().slice(0, 12))) {
          select.selectedIndex = i;
          break;
        }
      }
    }
  });
});

/* =========================================
   9. FORM VALIDATION
   ========================================= */
const form = document.getElementById('enrollForm');
const formSuccess = document.getElementById('formSuccess');

function showError(inputId, errId, msg) {
  const input = document.getElementById(inputId);
  const err = document.getElementById(errId);
  if (input) input.classList.add('error');
  if (err) err.textContent = msg;
}

function clearError(inputId, errId) {
  const input = document.getElementById(inputId);
  const err = document.getElementById(errId);
  if (input) input.classList.remove('error');
  if (err) err.textContent = '';
}

// Live validation
['fname', 'femail', 'fphone', 'fcourse'].forEach(id => {
  const el = document.getElementById(id);
  if (el) {
    el.addEventListener('input', () => {
      const errId = { fname: 'nameErr', femail: 'emailErr', fphone: 'phoneErr', fcourse: 'courseErr' }[id];
      clearError(id, errId);
    });
  }
});

form.addEventListener('submit', (e) => {
  e.preventDefault();
  let valid = true;

  const name = document.getElementById('fname').value.trim();
  const email = document.getElementById('femail').value.trim();
  const phone = document.getElementById('fphone').value.trim();
  const course = document.getElementById('fcourse').value;

  // Clear previous errors
  ['fname','femail','fphone','fcourse'].forEach((id, i) => {
    const errIds = ['nameErr','emailErr','phoneErr','courseErr'];
    clearError(id, errIds[i]);
  });

  // Validate Name
  if (!name || name.length < 2) {
    showError('fname', 'nameErr', 'Please enter your full name (min 2 characters).');
    valid = false;
  }

  // Validate Email
  const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRx.test(email)) {
    showError('femail', 'emailErr', 'Please enter a valid email address.');
    valid = false;
  }

  // Validate Phone
  const phoneRx = /^[\+]?[\d\s\-]{10,14}$/;
  if (!phone || !phoneRx.test(phone)) {
    showError('fphone', 'phoneErr', 'Please enter a valid phone number (10–14 digits).');
    valid = false;
  }

  // Validate Course
  if (!course) {
    showError('fcourse', 'courseErr', 'Please select a course.');
    valid = false;
  }

  if (!valid) return;

  // Simulate submission
  const submitBtn = form.querySelector('.form-submit');
  submitBtn.textContent = 'Submitting…';
  submitBtn.disabled = true;

  setTimeout(() => {
    form.reset();
    formSuccess.classList.add('show');
    submitBtn.innerHTML = '<span>Book Free Counselling</span><i class="fas fa-paper-plane"></i>';
    submitBtn.disabled = false;

    setTimeout(() => formSuccess.classList.remove('show'), 6000);
  }, 1200);
});

/* =========================================
   10. ACTIVE NAV LINK ON SCROLL
   ========================================= */
const sections = document.querySelectorAll('section[id]');

const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      document.querySelectorAll('.nav-links a').forEach(a => {
        a.style.color = '';
        if (a.getAttribute('href') === `#${id}`) {
          a.style.color = 'var(--primary)';
        }
      });
    }
  });
}, { rootMargin: '-40% 0px -40% 0px' });

sections.forEach(s => navObserver.observe(s));
