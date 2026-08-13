/* ============================================================
   Designmela — main.js
   Premium GSAP ScrollTrigger animations and loading sequences
   ============================================================ */

(function () {
  'use strict';

  // Register ScrollTrigger with GSAP
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }

  // ══════════════════════════════════════════════════════════════
  // SHARED REGION DETECTION, PRICING & CURRENCY MODULE
  // ══════════════════════════════════════════════════════════════

  // ── Single-source pricing table (10 services × 6 currencies) ──
  const DM_PRICING = {
    website:    { INR: 2499, USD: 99,  GBP: 79,  EUR: 89,  AED: 359, AUD: 149 },
    webapp:     { INR: 4999, USD: 199, GBP: 159, EUR: 179, AED: 729, AUD: 299 },
    automation: { INR: 1999, USD: 79,  GBP: 59,  EUR: 69,  AED: 289, AUD: 119 },
    branding:   { INR: 1499, USD: 59,  GBP: 45,  EUR: 49,  AED: 219, AUD: 89  },
    chatbot:    { INR: 2499, USD: 99,  GBP: 79,  EUR: 89,  AED: 359, AUD: 149 },
    copywriting:{ INR: 799,  USD: 29,  GBP: 23,  EUR: 25,  AED: 109, AUD: 45  },
    adcreative: { INR: 999,  USD: 39,  GBP: 29,  EUR: 35,  AED: 145, AUD: 59  },
    pitchdeck:  { INR: 1499, USD: 59,  GBP: 45,  EUR: 49,  AED: 219, AUD: 89  },
    seo:        { INR: 999,  USD: 39,  GBP: 29,  EUR: 35,  AED: 145, AUD: 59  },
    aivideo:    { INR: 599,  USD: 25,  GBP: 19,  EUR: 22,  AED: 89,  AUD: 35  }
  };

  // ── PPP-adjusted budget ranges per currency ──
  const DM_BUDGET_RANGES = {
    INR: [
      { tier: 1, label: '< ₹5,000',              value: '< ₹5,000' },
      { tier: 2, label: '₹5,000 – ₹10,000',      value: '₹5,000–₹10,000' },
      { tier: 3, label: '₹10,000 – ₹20,000',     value: '₹10,000–₹20,000' },
      { tier: 4, label: '₹20,000+',               value: '₹20,000+' }
    ],
    USD: [
      { tier: 1, label: '< $200',                 value: '< $200' },
      { tier: 2, label: '$200 – $500',             value: '$200–$500' },
      { tier: 3, label: '$500 – $1,000',           value: '$500–$1,000' },
      { tier: 4, label: '$1,000+',                 value: '$1,000+' }
    ],
    GBP: [
      { tier: 1, label: '< £150',                 value: '< £150' },
      { tier: 2, label: '£150 – £400',             value: '£150–£400' },
      { tier: 3, label: '£400 – £800',             value: '£400–£800' },
      { tier: 4, label: '£800+',                   value: '£800+' }
    ],
    EUR: [
      { tier: 1, label: '< €175',                 value: '< €175' },
      { tier: 2, label: '€175 – €450',             value: '€175–€450' },
      { tier: 3, label: '€450 – €900',             value: '€450–€900' },
      { tier: 4, label: '€900+',                   value: '€900+' }
    ],
    AED: [
      { tier: 1, label: '< AED 750',              value: '< AED 750' },
      { tier: 2, label: 'AED 750 – AED 1,500',    value: 'AED 750–AED 1,500' },
      { tier: 3, label: 'AED 1,500 – AED 3,500',  value: 'AED 1,500–AED 3,500' },
      { tier: 4, label: 'AED 3,500+',             value: 'AED 3,500+' }
    ],
    AUD: [
      { tier: 1, label: '< A$300',                value: '< A$300' },
      { tier: 2, label: 'A$300 – A$750',           value: 'A$300–A$750' },
      { tier: 3, label: 'A$750 – A$1,500',         value: 'A$750–A$1,500' },
      { tier: 4, label: 'A$1,500+',                value: 'A$1,500+' }
    ]
  };

  // ── Country → currency + dial code mapping ──
  const COUNTRY_CURRENCY_MAP = {
    IN: { currency: 'INR', dial: '+91' },
    US: { currency: 'USD', dial: '+1'  }, CA: { currency: 'USD', dial: '+1'  },
    GB: { currency: 'GBP', dial: '+44' },
    DE: { currency: 'EUR', dial: '+49' }, FR: { currency: 'EUR', dial: '+33' },
    ES: { currency: 'EUR', dial: '+34' }, IT: { currency: 'EUR', dial: '+39' },
    NL: { currency: 'EUR', dial: '+31' }, BE: { currency: 'EUR', dial: '+32' },
    AT: { currency: 'EUR', dial: '+43' }, PT: { currency: 'EUR', dial: '+351'},
    IE: { currency: 'EUR', dial: '+353'}, FI: { currency: 'EUR', dial: '+358'},
    GR: { currency: 'EUR', dial: '+30' }, LU: { currency: 'EUR', dial: '+352'},
    AE: { currency: 'AED', dial: '+971'},
    AU: { currency: 'AUD', dial: '+61' }
  };

  // ── Currency format utility ──
  function formatPrice(amount, currency) {
    switch (currency) {
      case 'INR': return '₹' + amount.toLocaleString('en-IN');
      case 'USD': return '$' + amount.toLocaleString('en-US');
      case 'GBP': return '£' + amount.toLocaleString('en-GB');
      case 'EUR': return '€' + amount.toLocaleString('en-US');
      case 'AED': return 'AED ' + amount.toLocaleString('en-US');
      case 'AUD': return 'A$' + amount.toLocaleString('en-US');
      default:    return '$' + amount.toLocaleString('en-US');
    }
  }

  // ── Shared region state (readable by all modules) ──
  window.dmRegion = {
    country: 'IN',
    currency: 'INR',
    dialCode: '+91',
    ready: null // Will be a Promise
  };

  // ── Render helpers ──
  function renderServicePrices() {
    const cur = window.dmRegion.currency;
    document.querySelectorAll('[data-service]').forEach(el => {
      const key = el.getAttribute('data-service');
      if (DM_PRICING[key] && DM_PRICING[key][cur] !== undefined) {
        el.innerHTML = `Starting at <strong>${formatPrice(DM_PRICING[key][cur], cur)}</strong>`;
      }
    });
  }

  function renderBudgetLabels() {
    const cur = window.dmRegion.currency;
    const ranges = DM_BUDGET_RANGES[cur] || DM_BUDGET_RANGES['USD'];
    ranges.forEach(({ tier, label, value }) => {
      const span = document.querySelector(`[data-budget-tier="${tier}"]`);
      if (span) {
        span.textContent = label;
        // Also update the radio input value so the submitted form data is correct
        const radio = span.closest('label')?.querySelector('input[name="budget"]');
        if (radio) radio.value = value;
      }
    });
  }

  function updateCurrencySelector() {
    const sel = document.getElementById('currency-selector');
    if (sel) sel.value = window.dmRegion.currency;
  }

  // ── Geolocation detection (once per session) ──
  window.dmRegion.ready = (async function detectRegion() {
    // Check sessionStorage cache first
    const cached = sessionStorage.getItem('dm_region');
    if (cached) {
      try {
        const data = JSON.parse(cached);
        window.dmRegion.country = data.country;
        window.dmRegion.currency = data.currency;
        window.dmRegion.dialCode = data.dialCode;
        // Check for manual currency override
        const manualCur = sessionStorage.getItem('dm_currency_override');
        if (manualCur) window.dmRegion.currency = manualCur;
        updateCurrencySelector();
        renderServicePrices();
        renderBudgetLabels();
        return;
      } catch (e) { /* ignore bad cache */ }
    }

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 2000);
      const res = await fetch('https://ipwho.is/', { signal: controller.signal });
      clearTimeout(timeout);
      const geo = await res.json();

      if (geo.success && geo.country_code) {
        const cc = geo.country_code.toUpperCase();
        const mapped = COUNTRY_CURRENCY_MAP[cc];
        window.dmRegion.country = cc;
        window.dmRegion.currency = mapped ? mapped.currency : 'USD';
        window.dmRegion.dialCode = mapped ? mapped.dial : '+91';
      } else {
        // API returned but no valid data — use defaults
        window.dmRegion.currency = 'USD';
      }
    } catch (e) {
      // Timeout or network failure — fallback defaults
      window.dmRegion.country = 'IN';
      window.dmRegion.currency = 'USD';
      window.dmRegion.dialCode = '+91';
    }

    // Cache for session
    sessionStorage.setItem('dm_region', JSON.stringify({
      country: window.dmRegion.country,
      currency: window.dmRegion.currency,
      dialCode: window.dmRegion.dialCode
    }));

    // Check for manual currency override
    const manualCur = sessionStorage.getItem('dm_currency_override');
    if (manualCur) window.dmRegion.currency = manualCur;

    updateCurrencySelector();
    renderServicePrices();
    renderBudgetLabels();
  })();

  // ── Currency selector change handler ──
  const currencySelector = document.getElementById('currency-selector');
  if (currencySelector) {
    currencySelector.addEventListener('change', () => {
      window.dmRegion.currency = currencySelector.value;
      sessionStorage.setItem('dm_currency_override', currencySelector.value);
      renderServicePrices();
      renderBudgetLabels();
    });
  }

  // ── Dee chatbot triggers ("Try Assistant", service links) ──
  document.querySelectorAll('[data-dee-trigger], #btn-try-assistant').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const trigger = document.getElementById('dee-chat-trigger');
      if (trigger) trigger.click();
    });
  });

  // ── Sticky navbar ──────────────────────────────────────────
  const navbar = document.getElementById('navbar');
  if (navbar) {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  // ── Mobile menu toggle ─────────────────────────────────────
  const menuToggle = document.getElementById('menu-toggle');
  const navLinks = document.getElementById('nav-links');
  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      menuToggle.classList.toggle('active');
    });

    // Close mobile menu when clicking a link
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        menuToggle.classList.remove('active');
      });
    });
  }

  // ── GSAP Animations ────────────────────────────────────────
  const urlParams = new URLSearchParams(window.location.search);
  const noAnim = urlParams.get('no-anim') === 'true';
  
  if (typeof gsap !== 'undefined' && !noAnim) {
    
    // Create responsive matchMedia context
    const mm = gsap.matchMedia();

    mm.add("(min-width: 901px)", () => {
      // 1. Page Load sequence for Desktop
      const tl = gsap.timeline();
      
      tl.from('.nav-logo, .nav-link, .nav-cta', {
        y: -15,
        opacity: 0,
        duration: 0.6,
        stagger: 0.04,
        ease: 'power3.out'
      });

      tl.from('.hero-eyebrow-wrap', {
        y: 15,
        opacity: 0,
        duration: 0.5,
        ease: 'power3.out'
      }, '-=0.4');

      tl.from('.hero-title', {
        y: 24,
        opacity: 0,
        duration: 0.7,
        ease: 'power3.out'
      }, '-=0.4');

      tl.from('.hero-desc', {
        y: 15,
        opacity: 0,
        duration: 0.6,
        ease: 'power3.out'
      }, '-=0.5');

      tl.from('.hero-actions', {
        y: 10,
        opacity: 0,
        duration: 0.5,
        ease: 'power3.out'
      }, '-=0.5');

      tl.from('.hero-graphics', {
        scale: 0.98,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out'
      }, '-=0.6');

      tl.from('.hero-bottom-strip', {
        opacity: 0,
        duration: 0.6
      }, '-=0.4');

      // 2. Scroll Reveal Animations (Desktop)
      const revealSections = [
        { selector: '.services-section', elements: ['.section-header', '.service-row'] },
        { selector: '.work-section', elements: ['.section-header', '.project-item', '.categories-nav'] },
        { selector: '.process-section', elements: ['.section-header', '.process-stage', '.process-visual-col'] },
        { selector: '.about-section', elements: ['.about-header-col', '.about-quote-col'] },
        { selector: '.final-cta-section', elements: ['.final-cta-card'] }
      ];

      revealSections.forEach(({ selector, elements }) => {
        const section = document.querySelector(selector);
        if (!section) return;

        elements.forEach(elSelector => {
          const targets = section.querySelectorAll(elSelector);
          if (!targets.length) return;

          gsap.from(targets, {
            scrollTrigger: {
              trigger: section,
              start: 'top 82%',
              toggleActions: 'play none none none'
            },
            y: 28,
            opacity: 0,
            duration: 0.7,
            stagger: 0.08,
            ease: 'power3.out'
          });
        });
      });

      // 3. Proximity scale effects on SVG nodes on hover
      document.querySelectorAll('circle').forEach(circle => {
        const originalR = parseFloat(circle.getAttribute('r'));
        circle.addEventListener('mouseenter', () => {
          gsap.to(circle, {
            r: originalR * 1.5,
            duration: 0.25,
            ease: 'power2.out'
          });
        });
        circle.addEventListener('mouseleave', () => {
          gsap.to(circle, {
            r: originalR,
            duration: 0.25,
            ease: 'power2.out'
          });
        });
      });
    });

    mm.add("(max-width: 900px)", () => {
      // Load simpler / faster reveals on mobile (no staggers or heavy scales)
      const mobileRevealSections = ['.hero-content', '.service-row', '.project-item', '.process-stage', '.about-header-col', '.about-quote-col', '.final-cta-card'];
      
      mobileRevealSections.forEach(selector => {
        const targets = document.querySelectorAll(selector);
        if (!targets.length) return;
        
        gsap.from(targets, {
          scrollTrigger: {
            trigger: targets,
            start: 'top 90%',
            toggleActions: 'play none none none'
          },
          opacity: 0,
          y: 15,
          duration: 0.5,
          ease: 'power2.out'
        });
      });
    });

    // 3. Process Stages Connecting Line & Node Activation
    const stages = gsap.utils.toArray('.process-stage');
    if (stages.length) {
      const firstCircle = stages[0].querySelector('.stage-num');
      const lastCircle = stages[stages.length - 1].querySelector('.stage-num');
      const lineTrack = document.querySelector('.process-line-track');
      
      if (firstCircle && lastCircle && lineTrack) {
        const updateLineDimensions = () => {
          const top1 = stages[0].offsetTop;
          const top2 = stages[stages.length - 1].offsetTop;
          const distance = top2 - top1;
          lineTrack.style.top = `${top1 + 18}px`; // Center of 36px circle
          lineTrack.style.height = `${distance}px`;
        };
        
        updateLineDimensions();
        ScrollTrigger.addEventListener("refresh", updateLineDimensions);
      }

      stages.forEach((stage) => {
        ScrollTrigger.create({
          trigger: stage,
          start: 'top 65%',
          onEnter: () => stage.classList.add('active'),
          onLeaveBack: () => stage.classList.remove('active')
        });
      });

      // Animate line fill
      const lastStageHeight = stages[stages.length - 1].offsetHeight;
      gsap.timeline({
        scrollTrigger: {
          trigger: '.process-stages',
          start: 'top 65%',
          end: `bottom-=${lastStageHeight - 18}px 65%`, // Ends exactly at center of last circle
          scrub: true
        }
      })
      .to('.process-progress-line', {
        height: '100%',
        ease: 'none'
      });
    }

    // Custom Reveal for Brand Cards (fade + slide up 12px)
    const brandCards = document.querySelectorAll('.driply-card, .jaingrill-card, .aether-card, .workflow-card, .hitesh-card');
    brandCards.forEach(card => {
      if (card && !noAnim) {
        gsap.from(card, {
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            toggleActions: 'play none none none'
          },
          y: 12,
          opacity: 0,
          duration: 0.7,
          ease: 'power3.out'
        });
      }
    });

    // 4. Respect User Prefers Reduced Motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      if (typeof ScrollTrigger !== 'undefined') {
        ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      }
      gsap.globalTimeline.clear();
      gsap.set('*', { clearProps: 'all' });
    }
  }

  // ── Marquee hover speed ────────────────────────────────────
  // Slows marquee by 40% on hover using Web Animations API
  // updatePlaybackRate() — no position jump, smooth transition
  (function () {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return; // motion already suppressed

    const ticker = document.querySelector('.marquee-ticker');
    const track  = document.getElementById('marquee-track');
    if (!ticker || !track) return;

    // Wait for the CSS animation to start, then grab it
    requestAnimationFrame(() => {
      if (typeof track.getAnimations !== 'function') return;
      const anim = track.getAnimations()[0];
      if (!anim || typeof anim.updatePlaybackRate !== 'function') return;

      const NORMAL_RATE = 1;
      const SLOW_RATE   = 0.6; // 40% slower

      ticker.addEventListener('mouseenter', () => {
        anim.updatePlaybackRate(SLOW_RATE);
      });

      ticker.addEventListener('mouseleave', () => {
        anim.updatePlaybackRate(NORMAL_RATE);
      });
    });
  })();

  // ── Intake Form Rebuild State Machine & Particle System ──
  (function () {
    const form = document.getElementById('intake-form');
    if (!form) return;

    const steps = Array.from(document.querySelectorAll('.intake-step'));
    const fill = document.getElementById('intake-progress-fill');
    const orb = document.getElementById('intake-progress-orb');
    const statusText = document.getElementById('intake-status');
    const stepNumber = document.getElementById('intake-step-number');
    const btnBack = document.getElementById('btn-intake-back');
    const btnContinue = document.getElementById('btn-intake-continue');
    const successEl = document.getElementById('intake-success');
    const navigationEl = document.getElementById('intake-navigation');

    let currentStep = 1;
    const totalSteps = 6;
    let typewriterController = null;
    let step2Typewriter = null;
    let step3Typewriter = null;
    let step5Typewriter = null;
    let dynamicContactValues = { email: '', whatsappCode: window.dmRegion.dialCode, whatsappNumber: '', phoneCode: window.dmRegion.dialCode, phoneNumber: '', sameAsWhatsApp: false };

    const stepStatuses = {
      1: "PROJECT INTAKE / Let's start with the basics.",
      2: "PROJECT DETAILS / What are you trying to build?",
      3: "PROJECT VISION / What goals do we want to achieve?",
      4: "PROJECT PLANNING / Define your timeline and budget.",
      5: "PROJECT INSPIRATION / Show me what inspires you.",
      6: "PROJECT SUBMISSION / Confirm and send your intake."
    };

    const NAME_EXAMPLES = [
      "e.g. Arjun Malhotra",
      "e.g. Meher Chopra",
      "e.g. Callum Ashworth",
      "e.g. Sloane Whitfield"
    ];

    const EMAIL_EXAMPLES = [
      "e.g. yourbusiness@gmail.com",
      "e.g. yourbusiness@yahoo.com",
      "e.g. founder@yourbrand.com",
      "e.g. hello@yourbrand.in"
    ];

    const OTHER_PROJECT_EXAMPLES = [
      "e.g. A referral program for our SaaS",
      "e.g. A community app for local runners",
      "e.g. An AI chatbot for customer support",
      "e.g. A merch store for our podcast"
    ];

    const VISION_EXAMPLES = [
      "e.g. Increase online bookings by making the site feel premium",
      "e.g. Launch a clean, fast portfolio before our next show",
      "e.g. Turn our WhatsApp inquiries into an automated funnel",
      "e.g. Rebuild our brand before a Series A pitch deck"
    ];

    const INSPIRATION_URL_EXAMPLES = [
      "e.g. stripe.com",
      "e.g. linear.app",
      "e.g. cred.club",
      "e.g. apple.com/in"
    ];

    const ADDITIONAL_CONTEXT_EXAMPLES = [
      "e.g. We want a bold, editorial feel, not corporate",
      "e.g. Please keep the tone playful, not overly formal",
      "e.g. Budget is flexible if the design quality is exceptional",
      "e.g. We've been burned by slow freelancers before"
    ];

    function syncedTypewriter(fields, opts = {}) {
      fields.forEach((f) => {
        if (!Array.isArray(f.phrases) || f.phrases.length === 0) {
          throw new Error(`syncedTypewriter: field is missing a phrases array — ${f.el.id || f.el.name || "(unnamed field)"}`);
        }
      });
      const typeSpeed = opts.typeSpeed ?? 55;
      const deleteSpeed = opts.deleteSpeed ?? 30;
      const holdMs = opts.holdMs ?? 1400;
      const pauseMs = opts.pauseMs ?? 300;
      const setCount = fields[0].phrases.length;

      let stopped = false;
      let timeouts = [];

      const addTimeout = (fn, delay) => {
        if (stopped) return;
        const id = setTimeout(() => {
          timeouts = timeouts.filter(t => t !== id);
          fn();
        }, delay);
        timeouts.push(id);
        return id;
      };

      const sleep = (ms) => new Promise((res) => {
        addTimeout(res, ms);
      });

      function typeOne(field, text) {
        return new Promise((resolve) => {
          let i = 0;
          const step = () => {
            if (stopped) return resolve();
            if (field.el === document.activeElement || (field.el && field.el.value && field.el.value.trim().length > 0)) {
              field.el.placeholder = "";
              return resolve();
            }
            i++;
            field.el.placeholder = text.slice(0, i) + (i < text.length ? "|" : "");
            if (i >= text.length) return resolve();
            addTimeout(step, typeSpeed);
          };
          step();
        });
      }

      function deleteOne(field) {
        return new Promise((resolve) => {
          const step = () => {
            if (stopped) return resolve();
            if (field.el === document.activeElement || (field.el && field.el.value && field.el.value.trim().length > 0)) {
              field.el.placeholder = "";
              return resolve();
            }
            const current = field.el.placeholder.replace("|", "");
            const next = current.slice(0, -1);
            field.el.placeholder = next + (next.length ? "|" : "");
            if (!next.length) return resolve();
            addTimeout(step, deleteSpeed);
          };
          step();
        });
      }

      async function loop() {
        let setIndex = 0;
        while (!stopped) {
          const texts = fields.map((f) => f.phrases[setIndex]);
          await Promise.all(fields.map((f, i) => typeOne(f, texts[i])));
          if (stopped) return;
          await sleep(holdMs);
          if (stopped) return;
          await Promise.all(fields.map((f) => deleteOne(f)));
          if (stopped) return;
          await sleep(pauseMs);
          setIndex = (setIndex + 1) % setCount;
        }
      }

      function pause() {
        stopped = true;
        timeouts.forEach(clearTimeout);
        timeouts = [];
        fields.forEach(f => f.el.placeholder = "");
      }

      function resume() {
        if (!stopped) return;
        stopped = false;
        loop();
      }

      // Clear placeholders immediately on focus or input
      fields.forEach(f => {
        f.el.addEventListener("focus", () => {
          f.el.placeholder = "";
        });
        f.el.addEventListener("input", () => {
          if (f.el.value) f.el.placeholder = "";
        });
      });

      loop();
      return { pause, resume };
    }

    // Regenerate particles stagger-delaying them mid-flight
    const generateParticles = (step) => {
      const particleField = document.querySelector('.dm-particle-field');
      if (!particleField) return;
      particleField.innerHTML = '';

      const COUNT = 26;
      for (let i = 0; i < COUNT; i++) {
        const isStreak = Math.random() < 0.35;
        const top = Math.random() * 100;
        const size = isStreak ? (10 + Math.random() * 22) : (1.5 + Math.random() * 2.5);
        const opacity = 0.25 + Math.random() * 0.65;
        const duration = 1.8 + Math.random() * 2.6;
        const delay = -(Math.random() * 4); // negative delay to start mid-flight

        const p = document.createElement('span');
        p.className = isStreak ? 'dm-particle dm-particle--streak' : 'dm-particle dm-particle--dot';
        p.style.top = `${top}%`;
        p.style.width = `${size}px`;
        p.style.height = isStreak ? '1.5px' : `${size}px`;
        p.style.opacity = opacity;
        p.style.setProperty('--p-op', opacity);
        p.style.animationDuration = `${duration}s`;
        p.style.animationDelay = `${delay}s`;

        particleField.appendChild(p);
      }
    };

    const COUNTRY_CODES = [
      { name: "Afghanistan", dial: "+93" },
      { name: "Albania", dial: "+355" },
      { name: "Algeria", dial: "+213" },
      { name: "Andorra", dial: "+376" },
      { name: "Angola", dial: "+244" },
      { name: "Argentina", dial: "+54" },
      { name: "Armenia", dial: "+374" },
      { name: "Australia", dial: "+61" },
      { name: "Austria", dial: "+43" },
      { name: "Azerbaijan", dial: "+994" },
      { name: "Bahamas", dial: "+1242" },
      { name: "Bahrain", dial: "+973" },
      { name: "Bangladesh", dial: "+880" },
      { name: "Barbados", dial: "+1246" },
      { name: "Belarus", dial: "+375" },
      { name: "Belgium", dial: "+32" },
      { name: "Belize", dial: "+501" },
      { name: "Benin", dial: "+229" },
      { name: "Bhutan", dial: "+975" },
      { name: "Bolivia", dial: "+591" },
      { name: "Bosnia and Herzegovina", dial: "+387" },
      { name: "Botswana", dial: "+267" },
      { name: "Brazil", dial: "+55" },
      { name: "Brunei", dial: "+673" },
      { name: "Bulgaria", dial: "+359" },
      { name: "Burkina Faso", dial: "+226" },
      { name: "Burundi", dial: "+257" },
      { name: "Cambodia", dial: "+855" },
      { name: "Cameroon", dial: "+237" },
      { name: "Canada", dial: "+1" },
      { name: "Cape Verde", dial: "+238" },
      { name: "Central African Republic", dial: "+236" },
      { name: "Chad", dial: "+235" },
      { name: "Chile", dial: "+56" },
      { name: "China", dial: "+86" },
      { name: "Colombia", dial: "+57" },
      { name: "Comoros", dial: "+269" },
      { name: "Congo (DRC)", dial: "+243" },
      { name: "Congo (Republic)", dial: "+242" },
      { name: "Costa Rica", dial: "+506" },
      { name: "Croatia", dial: "+385" },
      { name: "Cuba", dial: "+53" },
      { name: "Cyprus", dial: "+357" },
      { name: "Czech Republic", dial: "+420" },
      { name: "Denmark", dial: "+45" },
      { name: "Djibouti", dial: "+253" },
      { name: "Dominican Republic", dial: "+1809" },
      { name: "Ecuador", dial: "+593" },
      { name: "Egypt", dial: "+20" },
      { name: "El Salvador", dial: "+503" },
      { name: "Equatorial Guinea", dial: "+240" },
      { name: "Eritrea", dial: "+291" },
      { name: "Estonia", dial: "+372" },
      { name: "Eswatini", dial: "+268" },
      { name: "Ethiopia", dial: "+251" },
      { name: "Fiji", dial: "+679" },
      { name: "Finland", dial: "+358" },
      { name: "France", dial: "+33" },
      { name: "Gabon", dial: "+241" },
      { name: "Gambia", dial: "+220" },
      { name: "Georgia", dial: "+995" },
      { name: "Germany", dial: "+49" },
      { name: "Ghana", dial: "+233" },
      { name: "Greece", dial: "+30" },
      { name: "Guatemala", dial: "+502" },
      { name: "Guinea", dial: "+224" },
      { name: "Guinea-Bissau", dial: "+245" },
      { name: "Guyana", dial: "+592" },
      { name: "Haiti", dial: "+509" },
      { name: "Honduras", dial: "+504" },
      { name: "Hong Kong", dial: "+852" },
      { name: "Hungary", dial: "+36" },
      { name: "Iceland", dial: "+354" },
      { name: "India", dial: "+91" },
      { name: "Indonesia", dial: "+62" },
      { name: "Iran", dial: "+98" },
      { name: "Iraq", dial: "+964" },
      { name: "Ireland", dial: "+353" },
      { name: "Israel", dial: "+972" },
      { name: "Italy", dial: "+39" },
      { name: "Jamaica", dial: "+1876" },
      { name: "Japan", dial: "+81" },
      { name: "Jordan", dial: "+962" },
      { name: "Kazakhstan", dial: "+7" },
      { name: "Kenya", dial: "+254" },
      { name: "Kiribati", dial: "+686" },
      { name: "Kuwait", dial: "+965" },
      { name: "Kyrgyzstan", dial: "+996" },
      { name: "Laos", dial: "+856" },
      { name: "Latvia", dial: "+371" },
      { name: "Lebanon", dial: "+961" },
      { name: "Lesotho", dial: "+266" },
      { name: "Liberia", dial: "+231" },
      { name: "Libya", dial: "+218" },
      { name: "Liechtenstein", dial: "+423" },
      { name: "Lithuania", dial: "+370" },
      { name: "Luxembourg", dial: "+352" },
      { name: "Macau", dial: "+853" },
      { name: "Madagascar", dial: "+261" },
      { name: "Malawi", dial: "+265" },
      { name: "Malaysia", dial: "+60" },
      { name: "Maldives", dial: "+960" },
      { name: "Mali", dial: "+223" },
      { name: "Malta", dial: "+356" },
      { name: "Mauritania", dial: "+222" },
      { name: "Mauritius", dial: "+230" },
      { name: "Mexico", dial: "+52" },
      { name: "Moldova", dial: "+373" },
      { name: "Monaco", dial: "+377" },
      { name: "Mongolia", dial: "+976" },
      { name: "Montenegro", dial: "+382" },
      { name: "Morocco", dial: "+212" },
      { name: "Mozambique", dial: "+258" },
      { name: "Myanmar", dial: "+95" },
      { name: "Namibia", dial: "+264" },
      { name: "Nepal", dial: "+977" },
      { name: "Netherlands", dial: "+31" },
      { name: "New Zealand", dial: "+64" },
      { name: "Nicaragua", dial: "+505" },
      { name: "Niger", dial: "+227" },
      { name: "Nigeria", dial: "+234" },
      { name: "North Korea", dial: "+850" },
      { name: "North Macedonia", dial: "+389" },
      { name: "Norway", dial: "+47" },
      { name: "Oman", dial: "+968" },
      { name: "Pakistan", dial: "+92" },
      { name: "Panama", dial: "+507" },
      { name: "Papua New Guinea", dial: "+675" },
      { name: "Paraguay", dial: "+595" },
      { name: "Peru", dial: "+51" },
      { name: "Philippines", dial: "+63" },
      { name: "Poland", dial: "+48" },
      { name: "Portugal", dial: "+351" },
      { name: "Qatar", dial: "+974" },
      { name: "Romania", dial: "+40" },
      { name: "Russia", dial: "+7" },
      { name: "Rwanda", dial: "+250" },
      { name: "Saudi Arabia", dial: "+966" },
      { name: "Senegal", dial: "+221" },
      { name: "Serbia", dial: "+381" },
      { name: "Seychelles", dial: "+248" },
      { name: "Sierra Leone", dial: "+232" },
      { name: "Singapore", dial: "+65" },
      { name: "Slovakia", dial: "+421" },
      { name: "Slovenia", dial: "+386" },
      { name: "Somalia", dial: "+252" },
      { name: "South Africa", dial: "+27" },
      { name: "South Korea", dial: "+82" },
      { name: "South Sudan", dial: "+211" },
      { name: "Spain", dial: "+34" },
      { name: "Sri Lanka", dial: "+94" },
      { name: "Sudan", dial: "+249" },
      { name: "Suriname", dial: "+597" },
      { name: "Sweden", dial: "+46" },
      { name: "Switzerland", dial: "+41" },
      { name: "Syria", dial: "+963" },
      { name: "Taiwan", dial: "+886" },
      { name: "Tajikistan", dial: "+992" },
      { name: "Tanzania", dial: "+255" },
      { name: "Thailand", dial: "+66" },
      { name: "Togo", dial: "+228" },
      { name: "Tonga", dial: "+676" },
      { name: "Trinidad and Tobago", dial: "+1868" },
      { name: "Tunisia", dial: "+216" },
      { name: "Turkey", dial: "+90" },
      { name: "Turkmenistan", dial: "+993" },
      { name: "Uganda", dial: "+256" },
      { name: "Ukraine", dial: "+380" },
      { name: "United Arab Emirates", dial: "+971" },
      { name: "United Kingdom", dial: "+44" },
      { name: "United States", dial: "+1" },
      { name: "Uruguay", dial: "+598" },
      { name: "Uzbekistan", dial: "+998" },
      { name: "Vanuatu", dial: "+678" },
      { name: "Vatican City", dial: "+379" },
      { name: "Venezuela", dial: "+58" },
      { name: "Vietnam", dial: "+84" },
      { name: "Yemen", dial: "+967" },
      { name: "Zambia", dial: "+260" },
      { name: "Zimbabwe", dial: "+263" }
    ];

    const buildCountryDropdown = (selectEl, defaultDial = window.dmRegion.dialCode) => {
      COUNTRY_CODES.forEach(({ name, dial }) => {
        const opt = document.createElement("option");
        opt.value = dial;
        opt.textContent = `${dial} ${name}`;
        if (dial === defaultDial) opt.selected = true;
        selectEl.appendChild(opt);
      });
    };
    window.buildCountryDropdown = buildCountryDropdown;

    const getPhoneLength = (dialCode) => {
      const lengths = {
        "+1": 10,
        "+91": 10,
        "+44": 10,
        "+971": 9,
        "+61": 9,
        "+49": 11,
        "+33": 9,
        "+81": 10,
        "+65": 8,
        "+86": 11,
        "+7": 10,
        "+55": 11,
        "+39": 10,
        "+34": 9,
        "+41": 9,
        "+31": 9,
        "+64": 9,
        "+27": 9,
        "+92": 10,
        "+82": 10,
        "+966": 9,
        "+62": 10,
        "+852": 8,
        "+886": 9,
        "+60": 9,
        "+63": 10,
        "+66": 9,
        "+84": 9,
        "+353": 9,
        "+43": 10,
        "+32": 9,
        "+45": 8,
        "+46": 9,
        "+47": 8,
        "+358": 9
      };
      return lengths[dialCode] || 10;
    };

    const restrictToDigits = (inputEl) => {
      inputEl.addEventListener("input", () => {
        const cleaned = inputEl.value.replace(/[^\d]/g, "");
        if (cleaned !== inputEl.value) inputEl.value = cleaned;
      });
    };

    const updateContactDetails = () => {
      const container = document.getElementById('contact-details-container');
      if (!container) return;

      const emailInput = document.getElementById('intake-detail-email');
      const waCode = document.getElementById('intake-detail-whatsapp-code');
      const waNumber = document.getElementById('intake-detail-whatsapp');
      const sameCheckbox = document.getElementById('same-as-whatsapp');
      const phoneCode = document.getElementById('intake-detail-phone-code');
      const phoneNumber = document.getElementById('intake-detail-phone');

      if (emailInput) dynamicContactValues.email = emailInput.value;
      if (waCode) dynamicContactValues.whatsappCode = waCode.value;
      if (waNumber) dynamicContactValues.whatsappNumber = waNumber.value;
      if (sameCheckbox) dynamicContactValues.sameAsWhatsApp = sameCheckbox.checked;
      if (phoneCode) dynamicContactValues.phoneCode = phoneCode.value;
      if (phoneNumber) dynamicContactValues.phoneNumber = phoneNumber.value;

      const checkedMethods = Array.from(document.querySelectorAll('input[name="contact_method"]:checked')).map(el => el.value);

      if (!checkedMethods.includes('email')) dynamicContactValues.email = '';
      if (!checkedMethods.includes('whatsapp')) {
        dynamicContactValues.whatsappCode = '+91';
        dynamicContactValues.whatsappNumber = '';
      }
      if (!checkedMethods.includes('phone')) {
        dynamicContactValues.phoneCode = window.dmRegion.dialCode;
        dynamicContactValues.phoneNumber = '';
      }
      if (!checkedMethods.includes('whatsapp') || !checkedMethods.includes('phone')) {
        dynamicContactValues.sameAsWhatsApp = false;
      }

      container.innerHTML = '';

      if (checkedMethods.length === 0) {
        const hint = document.createElement('div');
        hint.className = 'dm-hint-text';
        hint.textContent = 'Select at least one method above.';
        container.appendChild(hint);
        updateNavigation();
        return;
      }

      const hasEmail = checkedMethods.includes('email');
      const hasWA = checkedMethods.includes('whatsapp');
      const hasPhone = checkedMethods.includes('phone');

      // Email
      if (hasEmail) {
        if (!dynamicContactValues.email) {
          const step1EmailVal = document.getElementById('intake-email')?.value.trim() || '';
          dynamicContactValues.email = step1EmailVal;
        }
        const wrapper = document.createElement('div');
        wrapper.className = 'form-group contact-detail-field';
        wrapper.style.marginBottom = '20px';
        wrapper.innerHTML = `
          <label for="intake-detail-email" class="form-label">Email <span class="required">*</span></label>
          <input type="email" id="intake-detail-email" name="contact_detail_email" class="form-input" placeholder="e.g. hello@yourbrand.com" value="${dynamicContactValues.email}" required>
          <span class="error-message" id="error-detail-email">Please enter a valid email address.</span>
        `;
        container.appendChild(wrapper);

        const input = wrapper.querySelector('input');
        input.addEventListener('input', () => {
          dynamicContactValues.email = input.value;
          updateNavigation();
          saveToLocalStorage();
        });
      }

      // Divider between Email and Numbers
      if (hasEmail && (hasWA || hasPhone)) {
        const hr = document.createElement('hr');
        hr.className = 'dm-question-divider';
        container.appendChild(hr);
      }

      // WhatsApp
      if (hasWA) {
        const wrapper = document.createElement('div');
        wrapper.className = 'form-group contact-detail-field';
        wrapper.style.marginBottom = '20px';
        wrapper.innerHTML = `
          <label for="intake-detail-whatsapp" class="form-label">WhatsApp number <span class="required">*</span></label>
          <div class="phone-input-group" style="display: flex; gap: 12px; align-items: center;">
            <select id="intake-detail-whatsapp-code" name="contact_detail_whatsapp_code" class="form-input country-code-select" style="width: 140px; min-width: 140px; padding: 12px 16px;">
            </select>
            <input type="tel" inputmode="numeric" id="intake-detail-whatsapp" name="contact_detail_whatsapp" class="form-input phone-number-input" placeholder="98765 43210" value="${dynamicContactValues.whatsappNumber}" style="flex: 1;" required>
          </div>
          <span class="error-message" id="error-detail-whatsapp">Please enter a WhatsApp number.</span>
        `;
        container.appendChild(wrapper);

        const sel = wrapper.querySelector('select');
        const inp = wrapper.querySelector('input');

        buildCountryDropdown(sel, dynamicContactValues.whatsappCode);
        restrictToDigits(inp);

        const updateLengthAndValidate = () => {
          const expectedLen = getPhoneLength(sel.value);
          inp.maxLength = expectedLen;
          if (inp.value.length > expectedLen) {
            inp.value = inp.value.slice(0, expectedLen);
            dynamicContactValues.whatsappNumber = inp.value;
          }
          const errEl = document.getElementById('error-detail-whatsapp');
          if (inp.value.length > 0 && inp.value.length !== expectedLen) {
            if (errEl) {
              errEl.textContent = `Please enter a valid ${expectedLen}-digit WhatsApp number.`;
              errEl.style.display = 'block';
            }
            inp.style.borderColor = '#ff4d4d';
          } else {
            if (errEl) errEl.style.display = 'none';
            inp.style.borderColor = '';
          }
        };

        sel.addEventListener('change', () => {
          dynamicContactValues.whatsappCode = sel.value;
          updateLengthAndValidate();
          const sameCheckboxNew = document.getElementById('same-as-whatsapp');
          if (sameCheckboxNew && sameCheckboxNew.checked) {
            const pCode = document.getElementById('intake-detail-phone-code');
            if (pCode) {
              pCode.value = sel.value;
              dynamicContactValues.phoneCode = sel.value;
              pCode.dispatchEvent(new Event('change'));
            }
          }
          updateNavigation();
          saveToLocalStorage();
        });

        inp.addEventListener('input', () => {
          dynamicContactValues.whatsappNumber = inp.value;
          const expectedLen = getPhoneLength(sel.value);
          const errEl = document.getElementById('error-detail-whatsapp');
          if (inp.value.length === expectedLen || inp.value.length === 0) {
            if (errEl) errEl.style.display = 'none';
            inp.style.borderColor = '';
          }
          const sameCheckboxNew = document.getElementById('same-as-whatsapp');
          if (sameCheckboxNew && sameCheckboxNew.checked) {
            const pNumber = document.getElementById('intake-detail-phone');
            if (pNumber) {
              pNumber.value = inp.value;
              dynamicContactValues.phoneNumber = inp.value;
              pNumber.dispatchEvent(new Event('input'));
            }
          }
          updateNavigation();
          saveToLocalStorage();
        });

        inp.addEventListener('blur', () => {
          updateLengthAndValidate();
        });

        updateLengthAndValidate();
      }

      // Same as WhatsApp Checkbox (if BOTH WhatsApp and Phone Call are checked)
      if (hasWA && hasPhone) {
        const checkboxWrapper = document.createElement('div');
        checkboxWrapper.className = 'form-group checkbox-consent-group contact-detail-field';
        checkboxWrapper.style.marginTop = '12px';
        checkboxWrapper.style.marginBottom = '20px';
        checkboxWrapper.innerHTML = `
          <label class="consent-label">
            <input type="checkbox" id="same-as-whatsapp" ${dynamicContactValues.sameAsWhatsApp ? 'checked' : ''}>
            <span class="consent-checkbox-text">Phone number is the same as WhatsApp</span>
          </label>
        `;
        container.appendChild(checkboxWrapper);
      }

      // Phone Call
      if (hasPhone) {
        const wrapper = document.createElement('div');
        wrapper.className = 'form-group contact-detail-field';
        wrapper.style.marginBottom = '20px';
        wrapper.innerHTML = `
          <label for="intake-detail-phone" class="form-label">Phone number <span class="required">*</span></label>
          <div class="phone-input-group" style="display: flex; gap: 12px; align-items: center;">
            <select id="intake-detail-phone-code" name="contact_detail_phone_code" class="form-input country-code-select" style="width: 140px; min-width: 140px; padding: 12px 16px;">
            </select>
            <input type="tel" inputmode="numeric" id="intake-detail-phone" name="contact_detail_phone" class="form-input phone-number-input" placeholder="98765 43210" value="${dynamicContactValues.phoneNumber}" style="flex: 1;" required>
          </div>
          <span class="error-message" id="error-detail-phone">Please enter a phone number.</span>
        `;
        container.appendChild(wrapper);

        const sel = wrapper.querySelector('select');
        const inp = wrapper.querySelector('input');

        buildCountryDropdown(sel, dynamicContactValues.phoneCode);
        restrictToDigits(inp);

        const updateLengthAndValidate = () => {
          const expectedLen = getPhoneLength(sel.value);
          inp.maxLength = expectedLen;
          if (inp.value.length > expectedLen) {
            inp.value = inp.value.slice(0, expectedLen);
            dynamicContactValues.phoneNumber = inp.value;
          }
          const errEl = document.getElementById('error-detail-phone');
          if (inp.value.length > 0 && inp.value.length !== expectedLen) {
            if (errEl) {
              errEl.textContent = `Please enter a valid ${expectedLen}-digit phone number.`;
              errEl.style.display = 'block';
            }
            inp.style.borderColor = '#ff4d4d';
          } else {
            if (errEl) errEl.style.display = 'none';
            inp.style.borderColor = '';
          }
        };

        sel.addEventListener('change', () => {
          dynamicContactValues.phoneCode = sel.value;
          updateLengthAndValidate();
          updateNavigation();
          saveToLocalStorage();
        });

        inp.addEventListener('input', () => {
          dynamicContactValues.phoneNumber = inp.value;
          const expectedLen = getPhoneLength(sel.value);
          const errEl = document.getElementById('error-detail-phone');
          if (inp.value.length === expectedLen || inp.value.length === 0) {
            if (errEl) errEl.style.display = 'none';
            inp.style.borderColor = '';
          }
          updateNavigation();
          saveToLocalStorage();
        });

        inp.addEventListener('blur', () => {
          updateLengthAndValidate();
        });

        updateLengthAndValidate();
      }

      // Wire up same as WhatsApp sync logic if present
      const sameCheckboxNew = document.getElementById('same-as-whatsapp');
      if (sameCheckboxNew) {
        const sync = () => {
          const wCode = document.getElementById('intake-detail-whatsapp-code');
          const wNumber = document.getElementById('intake-detail-whatsapp');
          const pCode = document.getElementById('intake-detail-phone-code');
          const pNumber = document.getElementById('intake-detail-phone');

          if (sameCheckboxNew.checked) {
            dynamicContactValues.sameAsWhatsApp = true;
            if (wCode && pCode) {
              pCode.value = wCode.value;
              pCode.disabled = true;
              dynamicContactValues.phoneCode = wCode.value;
              pCode.dispatchEvent(new Event('change'));
            }
            if (wNumber && pNumber) {
              pNumber.value = wNumber.value;
              pNumber.disabled = true;
              dynamicContactValues.phoneNumber = wNumber.value;
              pNumber.dispatchEvent(new Event('input'));
            }
          } else {
            dynamicContactValues.sameAsWhatsApp = false;
            if (pCode) {
              pCode.disabled = false;
              pCode.value = '+91';
              dynamicContactValues.phoneCode = window.dmRegion.dialCode;
              pCode.dispatchEvent(new Event('change'));
            }
            if (pNumber) {
              pNumber.disabled = false;
              pNumber.value = '';
              dynamicContactValues.phoneNumber = '';
              pNumber.dispatchEvent(new Event('input'));
            }
          }
          updateNavigation();
          saveToLocalStorage();
        };

        sameCheckboxNew.addEventListener('change', sync);

        // Run sync initially to reflect state correctly
        const wCode = document.getElementById('intake-detail-whatsapp-code');
        const wNumber = document.getElementById('intake-detail-whatsapp');
        const pCode = document.getElementById('intake-detail-phone-code');
        const pNumber = document.getElementById('intake-detail-phone');
        if (sameCheckboxNew.checked) {
          if (wCode && pCode) {
            pCode.value = wCode.value;
            pCode.disabled = true;
          }
          if (wNumber && pNumber) {
            pNumber.value = wNumber.value;
            pNumber.disabled = true;
          }
        }
      }

      updateNavigation();
    };

    const handleProjectTypeChange = () => {
      const typeChecked = form.querySelector('input[name="project_type"]:checked');
      const otherWrap = document.getElementById('project-type-other-wrap');
      const otherInput = document.getElementById('intake-other-describe');
      if (!otherWrap) return;

      if (typeChecked && typeChecked.value === 'Something Else') {
        if (otherWrap.style.display !== 'block') {
          otherWrap.style.display = 'block';
          if (otherInput) {
            otherInput.value = '';
            otherInput.style.borderColor = '';
            if (step2Typewriter) {
              step2Typewriter.resume();
            } else {
              step2Typewriter = syncedTypewriter([{ el: otherInput, phrases: OTHER_PROJECT_EXAMPLES }]);
            }
          }
        }
      } else {
        otherWrap.style.display = 'none';
        if (otherInput) {
          otherInput.value = '';
          otherInput.style.borderColor = '';
        }
        const otherErr = document.getElementById('error-project-type-other');
        if (otherErr) otherErr.style.display = 'none';
        if (step2Typewriter) {
          step2Typewriter.pause();
        }
      }
    };

    // Form inputs value validation
    const validateEmail = (email) => {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const validateUrl = (url) => {
      if (!url) return true; // optional
      try {
        new URL(url);
        return true;
      } catch (_) {
        return false;
      }
    };

    const validateStep = (stepIdx) => {
      const stepEl = steps[stepIdx - 1];
      if (!stepEl) return false;

      let isValid = true;

      // Reset all errors in this step
      stepEl.querySelectorAll('.error-message').forEach(err => err.style.display = 'none');
      stepEl.querySelectorAll('.form-input, .form-textarea').forEach(input => input.style.borderColor = '');

      // Validation by step
      if (stepIdx === 1) {
        const nameInput = document.getElementById('intake-name');
        const emailInput = document.getElementById('intake-email');

        if (!nameInput || !nameInput.value || !nameInput.value.trim()) {
          isValid = false;
          // error shown on submit attempt or real-time check
        }
        if (!emailInput || !emailInput.value || !emailInput.value.trim() || !validateEmail(emailInput.value.trim())) {
          isValid = false;
        }
      } else if (stepIdx === 2) {
        const typeChecked = stepEl.querySelector('input[name="project_type"]:checked');
        const stageChecked = stepEl.querySelector('input[name="project_stage"]:checked');

        if (!typeChecked || !stageChecked) {
          isValid = false;
        } else if (typeChecked.value === 'Something Else') {
          const otherInput = document.getElementById('intake-other-describe');
          if (!otherInput || !otherInput.value.trim()) {
            isValid = false;
          }
        }
      } else if (stepIdx === 3) {
        const goalsText = document.getElementById('intake-goals');
        if (!goalsText.value.trim()) {
          isValid = false;
        }
      } else if (stepIdx === 4) {
        const timelineChecked = stepEl.querySelector('input[name="timeline"]:checked');
        const budgetChecked = stepEl.querySelector('input[name="budget"]:checked');

        if (!timelineChecked || !budgetChecked) {
          isValid = false;
        }
      } else if (stepIdx === 5) {
        const refUrl = document.getElementById('intake-reference-url');
        if (refUrl && refUrl.value.trim() && !validateUrl(refUrl.value.trim())) {
          isValid = false;
        }
      } else if (stepIdx === 6) {
        const contactCheckboxes = Array.from(stepEl.querySelectorAll('input[name="contact_method"]:checked'));
        const consentChecked = document.getElementById('intake-consent');

        if (contactCheckboxes.length === 0 || !consentChecked || !consentChecked.checked) {
          isValid = false;
        } else {
          contactCheckboxes.forEach(cb => {
            const val = cb.value;
            if (val === 'email') {
              const emailInput = document.getElementById('intake-detail-email');
              if (!emailInput || !emailInput.value.trim() || !validateEmail(emailInput.value.trim())) {
                isValid = false;
              }
            } else if (val === 'whatsapp') {
              const whatsappInput = document.getElementById('intake-detail-whatsapp');
              const whatsappCode = document.getElementById('intake-detail-whatsapp-code');
              const expectedLen = whatsappCode ? getPhoneLength(whatsappCode.value) : 10;
              if (!whatsappInput || !whatsappInput.value.trim() || whatsappInput.value.trim().length !== expectedLen) {
                isValid = false;
              }
            } else if (val === 'phone') {
              const phoneInput = document.getElementById('intake-detail-phone');
              const phoneCode = document.getElementById('intake-detail-phone-code');
              const expectedLen = phoneCode ? getPhoneLength(phoneCode.value) : 10;
              if (!phoneInput || !phoneInput.value.trim() || phoneInput.value.trim().length !== expectedLen) {
                isValid = false;
              }
            }
          });
        }
      }

      return isValid;
    };

    const showStepValidationErrors = (stepIdx) => {
      const stepEl = steps[stepIdx - 1];
      if (!stepEl) return;

      if (stepIdx === 1) {
        const nameInput = document.getElementById('intake-name');
        const emailInput = document.getElementById('intake-email');

        if (!nameInput.value.trim()) {
          document.getElementById('error-name').style.display = 'block';
          nameInput.style.borderColor = '#ff4d4d';
        }
        if (!emailInput.value.trim() || !validateEmail(emailInput.value.trim())) {
          document.getElementById('error-email').style.display = 'block';
          emailInput.style.borderColor = '#ff4d4d';
        }
      } else if (stepIdx === 2) {
        const typeChecked = stepEl.querySelector('input[name="project_type"]:checked');
        const stageChecked = stepEl.querySelector('input[name="project_stage"]:checked');

        if (!typeChecked) {
          document.getElementById('error-project-type').style.display = 'block';
        } else if (typeChecked.value === 'Something Else') {
          const otherInput = document.getElementById('intake-other-describe');
          if (!otherInput || !otherInput.value.trim()) {
            document.getElementById('error-project-type-other').style.display = 'block';
            if (otherInput) otherInput.style.borderColor = '#ff4d4d';
          }
        }
        if (!stageChecked) document.getElementById('error-project-stage').style.display = 'block';
      } else if (stepIdx === 3) {
        const goalsText = document.getElementById('intake-goals');
        if (!goalsText.value.trim()) {
          document.getElementById('error-goals').style.display = 'block';
          goalsText.style.borderColor = '#ff4d4d';
        }
      } else if (stepIdx === 4) {
        const timelineChecked = stepEl.querySelector('input[name="timeline"]:checked');
        const budgetChecked = stepEl.querySelector('input[name="budget"]:checked');

        if (!timelineChecked) document.getElementById('error-timeline').style.display = 'block';
        if (!budgetChecked) document.getElementById('error-budget').style.display = 'block';
      } else if (stepIdx === 5) {
        const refUrl = document.getElementById('intake-reference-url');
        if (refUrl && refUrl.value.trim() && !validateUrl(refUrl.value.trim())) {
          document.getElementById('error-reference-url').style.display = 'block';
          refUrl.style.borderColor = '#ff4d4d';
        }
      } else if (stepIdx === 6) {
        const contactCheckboxes = Array.from(stepEl.querySelectorAll('input[name="contact_method"]:checked'));
        const consentChecked = document.getElementById('intake-consent');

        if (contactCheckboxes.length === 0) {
          document.getElementById('error-contact-method').style.display = 'block';
        }
        if (!consentChecked.checked) {
          document.getElementById('error-consent').style.display = 'block';
        }

        contactCheckboxes.forEach(cb => {
          const val = cb.value;
          if (val === 'email') {
            const emailInput = document.getElementById('intake-detail-email');
            const errEl = document.getElementById('error-detail-email');
            if (emailInput && (!emailInput.value.trim() || !validateEmail(emailInput.value.trim()))) {
              if (errEl) errEl.style.display = 'block';
              emailInput.style.borderColor = '#ff4d4d';
            }
          } else if (val === 'whatsapp') {
            const whatsappInput = document.getElementById('intake-detail-whatsapp');
            const whatsappCode = document.getElementById('intake-detail-whatsapp-code');
            const expectedLen = whatsappCode ? getPhoneLength(whatsappCode.value) : 10;
            const errEl = document.getElementById('error-detail-whatsapp');
            if (whatsappInput && (!whatsappInput.value.trim() || whatsappInput.value.trim().length !== expectedLen)) {
              if (errEl) {
                errEl.textContent = whatsappInput.value.trim() 
                  ? `Please enter a valid ${expectedLen}-digit WhatsApp number.`
                  : "Please enter a WhatsApp number.";
                errEl.style.display = 'block';
              }
              whatsappInput.style.borderColor = '#ff4d4d';
            }
          } else if (val === 'phone') {
            const phoneInput = document.getElementById('intake-detail-phone');
            const phoneCode = document.getElementById('intake-detail-phone-code');
            const expectedLen = phoneCode ? getPhoneLength(phoneCode.value) : 10;
            const errEl = document.getElementById('error-detail-phone');
            if (phoneInput && (!phoneInput.value.trim() || phoneInput.value.trim().length !== expectedLen)) {
              if (errEl) {
                errEl.textContent = phoneInput.value.trim()
                  ? `Please enter a valid ${expectedLen}-digit phone number.`
                  : "Please enter a phone number.";
                errEl.style.display = 'block';
              }
              phoneInput.style.borderColor = '#ff4d4d';
            }
          }
        });
      }
    };

    const updateNavigation = () => {
      const isValid = validateStep(currentStep);
      if (isValid) {
        btnContinue.removeAttribute('disabled');
      } else {
        btnContinue.setAttribute('disabled', 'true');
      }

      if (currentStep === 1) {
        btnBack.style.visibility = 'hidden';
      } else {
        btnBack.style.visibility = 'visible';
      }

      if (currentStep === totalSteps) {
        btnContinue.textContent = 'Send my Brief';
      } else {
        btnContinue.textContent = 'Continue';
      }
    };

    // Serialize and Autosave to LocalStorage
    const saveToLocalStorage = () => {
      const formData = {};
      const inputs = form.querySelectorAll('input[type="text"], input[type="email"], input[type="url"], textarea');
      inputs.forEach(input => {
        formData[input.name] = input.value;
      });

      const checkedRadios = form.querySelectorAll('input[type="radio"]:checked');
      checkedRadios.forEach(radio => {
        formData[radio.name] = radio.value;
      });

      const checkedCheckboxes = form.querySelectorAll('input[type="checkbox"]:checked');
      const checkboxValues = {};
      checkedCheckboxes.forEach(cb => {
        if (!checkboxValues[cb.name]) {
          checkboxValues[cb.name] = [];
        }
        checkboxValues[cb.name].push(cb.value);
      });
      formData['assets'] = checkboxValues['assets'] || [];
      
      // Save contact methods and dynamic details
      const checkedMethods = Array.from(form.querySelectorAll('input[name="contact_method"]:checked')).map(cb => cb.value);
      formData['contact_method'] = checkedMethods;
      
      const emailInput = document.getElementById('intake-detail-email');
      const waCode = document.getElementById('intake-detail-whatsapp-code');
      const waNumber = document.getElementById('intake-detail-whatsapp');
      const sameCheckbox = document.getElementById('same-as-whatsapp');
      const phoneCode = document.getElementById('intake-detail-phone-code');
      const phoneInput = document.getElementById('intake-detail-phone');
      if (emailInput) dynamicContactValues.email = emailInput.value;
      if (waCode) dynamicContactValues.whatsappCode = waCode.value;
      if (waNumber) dynamicContactValues.whatsappNumber = waNumber.value;
      if (sameCheckbox) dynamicContactValues.sameAsWhatsApp = sameCheckbox.checked;
      if (phoneCode) dynamicContactValues.phoneCode = phoneCode.value;
      if (phoneInput) dynamicContactValues.phoneNumber = phoneInput.value;
      formData['dynamic_contact_values'] = dynamicContactValues;

      formData['consent'] = document.getElementById('intake-consent')?.checked || false;

      localStorage.setItem('dm_intake_data', JSON.stringify(formData));
    };

    // Load from LocalStorage
    const loadFromLocalStorage = () => {
      const savedData = localStorage.getItem('dm_intake_data');
      if (!savedData) return;

      try {
        const data = JSON.parse(savedData);
        Object.keys(data).forEach(key => {
          const val = data[key];
          if (key === 'assets') {
            const assetVals = Array.isArray(val) ? val : [];
            assetVals.forEach(assetVal => {
              const cb = form.querySelector(`input[name="assets"][value="${assetVal}"]`);
              if (cb) cb.checked = true;
            });
          } else if (key === 'contact_method') {
            const methodVals = Array.isArray(val) ? val : [];
            methodVals.forEach(methodVal => {
              const cb = form.querySelector(`input[name="contact_method"][value="${methodVal}"]`);
              if (cb) cb.checked = true;
            });
          } else if (key === 'dynamic_contact_values') {
            dynamicContactValues = val || { email: '', whatsappCode: window.dmRegion.dialCode, whatsappNumber: '', phoneCode: window.dmRegion.dialCode, phoneNumber: '', sameAsWhatsApp: false };
          } else if (key === 'consent') {
            const cb = document.getElementById('intake-consent');
            if (cb) cb.checked = !!val;
          } else {
            const input = form.querySelector(`[name="${key}"]`);
            if (input) {
              if (input.type === 'radio') {
                const radio = form.querySelector(`input[name="${key}"][value="${val}"]`);
                if (radio) radio.checked = true;
              } else {
                input.value = val;
              }
            }
          }
        });
      } catch (e) {
        console.error('Error loading saved intake form data:', e);
      }
    };

    // Step navigation transitions with GSAP choreographies
    const goToStep = (nextStep) => {
      // Pause step typewriters on transition
      if (currentStep === 1 && typewriterController) typewriterController.pause();
      if (currentStep === 2 && step2Typewriter) step2Typewriter.pause();
      if (currentStep === 3 && step3Typewriter) step3Typewriter.pause();
      if (currentStep === 5 && step5Typewriter) step5Typewriter.pause();

      // Resume step typewriters on transition
      if (nextStep === 1 && typewriterController) {
        typewriterController.resume();
      } else if (nextStep === 2) {
        const typeChecked = form.querySelector('input[name="project_type"]:checked');
        if (typeChecked && typeChecked.value === 'Something Else' && step2Typewriter) {
          step2Typewriter.resume();
        }
      } else if (nextStep === 3 && step3Typewriter) {
        step3Typewriter.resume();
      } else if (nextStep === 5 && step5Typewriter) {
        step5Typewriter.resume();
      }

      const currentEl = steps[currentStep - 1];
      const nextEl = steps[nextStep - 1];
      const nextPct = Math.round(((nextStep - 1) / totalSteps) * 100);

      const tl = gsap.timeline({
        onComplete: () => {
          const firstInput = nextEl.querySelector('input, textarea, select');
          if (firstInput) firstInput.focus();
        }
      });

      // Slide/fade transition
      tl.to(currentEl, {
        x: -40,
        opacity: 0,
        duration: 0.55,
        ease: "power3.out",
        onComplete: () => {
          currentEl.style.display = 'none';
          nextEl.style.display = 'block';
        }
      }, 0)
      .fromTo(nextEl,
        { x: 40, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.55, ease: "power3.out" },
        0.3
      )
      .to(fill, {
        width: `${nextPct}%`,
        duration: 0.65,
        ease: "power4.out"
      }, 0)
      .to(orb, {
        left: `${nextPct}%`,
        duration: 0.65,
        ease: "power4.out"
      }, 0);

      // Update text details
      stepNumber.innerHTML = `${nextPct}<span class="pct-symbol">%</span>`;
      statusText.textContent = stepStatuses[nextStep];

      currentStep = nextStep;
      
      // Regenerate fresh particle set for the new width
      generateParticles(currentStep);
      updateNavigation();
    };

    // Submit form intake
    const submitForm = async () => {
      // Disable navigation buttons and update text
      btnContinue.disabled = true;
      btnContinue.textContent = 'Sending...';
      btnBack.style.pointerEvents = 'none';
      btnBack.style.opacity = '0.5';

      // Hide any previous errors
      const submitError = document.getElementById('intake-submit-error');
      if (submitError) submitError.style.display = 'none';

      // Build form data
      const formData = new FormData(form);

      try {
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          body: formData
        });

        const result = await response.json();

        if (response.ok && result.success) {
          // Pause typewriter on submission success
          if (typewriterController) typewriterController.pause();
          if (step2Typewriter) step2Typewriter.pause();
          if (step3Typewriter) step3Typewriter.pause();
          if (step5Typewriter) step5Typewriter.pause();

          // Clear autosave
          localStorage.removeItem('dm_intake_data');

          // Prepopulate WhatsApp message link with user's name
          const userName = document.getElementById('intake-name').value.trim();
          const whatsappBtn = document.getElementById('btn-success-whatsapp');
          if (whatsappBtn && userName) {
            const text = encodeURIComponent(`Hi! My name is ${userName}. I just submitted my Designmela project intake form and would love to chat!`);
            whatsappBtn.href = `https://wa.me/918082017828?text=${text}`; // Pre-filled message link
          }

          const currentEl = steps[currentStep - 1];

          // GSAP fade transition to success screen
          const tl = gsap.timeline();
          tl.to(currentEl, {
            x: -40,
            opacity: 0,
            duration: 0.55,
            ease: "power3.out",
            onComplete: () => {
              currentEl.style.display = 'none';
              successEl.style.display = 'block';
              navigationEl.style.display = 'none';
            }
          }, 0)
          .fromTo(successEl,
            { x: 40, opacity: 0 },
            { x: 0, opacity: 1, duration: 0.55, ease: "power3.out" },
            0.3
          )
          .to(fill, {
            width: "100%",
            duration: 0.65,
            ease: "power4.out"
          }, 0)
          .to(orb, {
            left: "100%",
            duration: 0.65,
            ease: "power4.out"
          }, 0);

          statusText.textContent = "INTAKE COMPLETE / Talk to you soon!";
          stepNumber.innerHTML = `100<span class="pct-symbol">%</span>`;
        } else {
          throw new Error(result.message || 'Submission failed');
        }
      } catch (err) {
        console.error('Submission error:', err);
        if (submitError) submitError.style.display = 'block';
        
        // Re-enable continue button and restore styling
        btnContinue.disabled = false;
        btnContinue.textContent = 'Send my Brief';
        btnBack.style.pointerEvents = 'auto';
        btnBack.style.opacity = '1';
      }
    };

    // Event listeners
    form.addEventListener('input', () => {
      updateNavigation();
      saveToLocalStorage();
    });

    form.addEventListener('change', () => {
      updateNavigation();
      saveToLocalStorage();
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (currentStep === totalSteps && validateStep(currentStep)) {
        submitForm();
      }
    });

    btnContinue.addEventListener('click', () => {
      if (!validateStep(currentStep)) {
        showStepValidationErrors(currentStep);
        return;
      }

      if (currentStep < totalSteps) {
        goToStep(currentStep + 1);
      } else {
        submitForm();
      }
    });

    btnBack.addEventListener('click', () => {
      if (currentStep > 1) {
        goToStep(currentStep - 1);
      }
    });

    // Populate data, update bar and build initial particles
    loadFromLocalStorage();

    // Setup Instagram handle blur prepend `@` logic
    const igInput = document.getElementById('intake-detail-instagram');
    if (igInput) {
      igInput.addEventListener('blur', () => {
        let val = igInput.value.trim();
        if (val.length > 0 && !val.startsWith('@')) {
          igInput.value = '@' + val;
          saveToLocalStorage();
        }
      });
    }

    // Initialize Typewriter placeholders on Step 1
    const nameInput = document.getElementById('intake-name');
    const emailInput = document.getElementById('intake-email');
    if (nameInput && emailInput) {
      typewriterController = syncedTypewriter([
        { el: nameInput, phrases: NAME_EXAMPLES },
        { el: emailInput, phrases: EMAIL_EXAMPLES }
      ]);

      [nameInput, emailInput].forEach(el => {
        el.addEventListener("focus", () => {
          if (typewriterController) typewriterController.pause();
        });
        el.addEventListener("input", () => {
          if (el.value && typewriterController) typewriterController.pause();
        });
        el.addEventListener("blur", () => {
          if (!nameInput.value.trim() && !emailInput.value.trim() && typewriterController && currentStep === 1) {
            typewriterController.resume();
          }
        });
      });

      // Pause immediately if loaded on a step other than step 1
      if (currentStep !== 1) {
        typewriterController.pause();
      }
    }

    // Setup Step 6 contact method checkboxes listeners
    const contactCheckboxes = document.querySelectorAll('input[name="contact_method"]');
    contactCheckboxes.forEach(cb => {
      cb.addEventListener('change', updateContactDetails);
    });

    // Render initial dynamic fields loaded from local storage
    updateContactDetails();

    // Wire up project type change listeners
    const projectTypeRadios = document.querySelectorAll('input[name="project_type"]');
    projectTypeRadios.forEach(radio => {
      radio.addEventListener('change', handleProjectTypeChange);
    });
    handleProjectTypeChange();

    // Initialize Step 3 vision goals typewriter
    const goalsInput = document.getElementById('intake-goals');
    if (goalsInput) {
      step3Typewriter = syncedTypewriter([{ el: goalsInput, phrases: VISION_EXAMPLES }]);
      if (currentStep !== 3) step3Typewriter.pause();
    }

    // Initialize Step 5 inspiration URL and context typewriter (synced pair)
    const refUrlInput = document.getElementById('intake-reference-url');
    const contextInput = document.getElementById('intake-context');
    if (refUrlInput && contextInput) {
      step5Typewriter = syncedTypewriter([
        { el: refUrlInput, phrases: INSPIRATION_URL_EXAMPLES },
        { el: contextInput, phrases: ADDITIONAL_CONTEXT_EXAMPLES }
      ]);
      if (currentStep !== 5) step5Typewriter.pause();
    }

    // Override active step based on URL query parameters for screenshot audits
    if (window.location.search.includes('test-step2=true')) {
      currentStep = 2;
      steps.forEach(step => step.style.display = 'none');
      steps[1].style.display = 'block';
      const otherRadio = form.querySelector('input[name="project_type"][value="Something Else"]');
      if (otherRadio) {
        otherRadio.checked = true;
        handleProjectTypeChange();
      }
    } else if (window.location.search.includes('test-step6=true')) {
      currentStep = 6;
      steps.forEach(step => step.style.display = 'none');
      steps[5].style.display = 'block';
      
      const emailCB = form.querySelector('input[name="contact_method"][value="email"]');
      const whatsappCB = form.querySelector('input[name="contact_method"][value="whatsapp"]');
      const phoneCB = form.querySelector('input[name="contact_method"][value="phone"]');
      if (emailCB) emailCB.checked = true;
      if (whatsappCB) whatsappCB.checked = true;
      if (phoneCB) phoneCB.checked = true;
      
      const step1EmailVal = document.getElementById('intake-email');
      if (step1EmailVal) step1EmailVal.value = "sarah@yourbrand.com";
      
      dynamicContactValues.whatsappCode = "+91";
      dynamicContactValues.whatsappNumber = "98765 43210";
      dynamicContactValues.sameAsWhatsApp = true;
      
      updateContactDetails();
    } else if (window.location.search.includes('test-success=true')) {
      steps.forEach(step => step.style.display = 'none');
      successEl.style.display = 'block';
      navigationEl.style.display = 'none';
      const nameInp = document.getElementById('intake-name');
      if (nameInp) nameInp.value = "Sarah Jenkins";
      
      const whatsappBtn = document.getElementById('btn-success-whatsapp');
      if (whatsappBtn) {
        whatsappBtn.href = "https://wa.me/919999999999?text=Hi!%20My%20name%20is%20Sarah%20Jenkins.";
      }
    }

    generateParticles(currentStep);
    updateNavigation();

    // Trigger initial progress representation based on load state
    const initialPct = Math.round(((currentStep - 1) / totalSteps) * 100);
    fill.style.width = `${initialPct}%`;
    orb.style.left = `${initialPct}%`;
    stepNumber.innerHTML = `${initialPct}<span class="pct-symbol">%</span>`;
    statusText.textContent = stepStatuses[currentStep];

    // ── Hitesh Photography Video Speed Adjustment ────────────────
    const hiteshVideo = document.getElementById('hitesh-video');
    if (hiteshVideo) {
      hiteshVideo.playbackRate = 1.4;
    }

  })();

  // ── Dee Chatbot Widget Module ──
  (function () {
    const trigger = document.getElementById('dee-chat-trigger');
    const windowEl = document.getElementById('dee-chat-window');
    const closeBtn = document.getElementById('dee-close-btn');
    const messageArea = document.getElementById('dee-message-area');
    const chipsContainer = document.getElementById('dee-chips-container');
    const inputForm = document.getElementById('dee-input-form');
    const chatInput = document.getElementById('dee-chat-input');
    const sendBtn = document.getElementById('dee-send-btn');
    const unreadDot = document.getElementById('dee-unread-dot');

    if (!trigger || !windowEl || !closeBtn || !messageArea || !inputForm || !chatInput || !sendBtn) return;

    let isChatOpen = false;
    let messageHistory = []; // Local history: [{ role: 'user'|'model', parts: [{ text: '...' }] }]
    let isWaitingForResponse = false;
    let lastMessageTime = 0;

    // Inquiry Capture State Machine
    let inquiryState = {
      active: false,
      step: 0,
      leadPriority: 'standard',
      pricePushbackCount: 0,
      data: {
        name: '',
        service: '',
        description: '',
        contactMethods: [], // 'email', 'phone', 'instagram'
        email: '',
        phoneCode: window.dmRegion.dialCode,
        phoneNumber: '',
        instagram: '',
        phoneCountrySelected: false
      }
    };

    // Idle Re-engagement Timer (45-60s)
    let idleTimer = null;
    let idleNudgeSent = false;

    function resetIdleTimer() {
      if (idleTimer) clearTimeout(idleTimer);
      idleTimer = setTimeout(() => {
        const chatWin = document.getElementById('dee-chat-window');
        if (chatWin && chatWin.classList.contains('dee-open') && !isWaitingForResponse && !idleNudgeSent) {
          idleNudgeSent = true;
          addMessage('bot', "Still there? Happy to answer anything else 🙂");
          renderDefaultChips();
        }
      }, 50000); // 50 seconds
    }

    // Country mobile phone length configuration
    const getPhoneLength = (dialCode) => {
      const lengths = {
        "+1": 10,
        "+91": 10,
        "+44": 10,
        "+971": 9,
        "+61": 9,
        "+49": 11,
        "+33": 9,
        "+81": 10,
        "+65": 8,
        "+86": 11,
        "+7": 10,
        "+55": 11,
        "+39": 10,
        "+34": 9,
        "+41": 9,
        "+31": 9,
        "+64": 9,
        "+27": 9,
        "+92": 10,
        "+82": 10,
        "+966": 9,
        "+62": 10,
        "+852": 8,
        "+886": 9,
        "+60": 9,
        "+63": 10,
        "+66": 9,
        "+84": 9,
        "+47": 8,
        "+358": 9
      };
      return lengths[dialCode] || 10;
    };

    // TARGET 1 & TARGET 2 Constants
    const PRIMARY_NUMBER = '918082017828';
    const SECONDARY_NUMBER = '919599320907';
    const SESSION_KEY = 'dee_chat_session_v2';
    const FIFTEEN_MINUTES_MS = 15 * 60 * 1000;
    let chatUIThread = []; // Tracks rendered UI message bubbles for sessionStorage persistence

    // Session Persistence Helper
    function saveChatSession() {
      try {
        const sessionData = {
          lastActivity: Date.now(),
          messages: chatUIThread,
          messageHistory: messageHistory,
          inquiryState: inquiryState
        };
        sessionStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
      } catch (e) {
        console.warn('Unable to save chat session:', e);
      }
    }

    // Always display red unread badge on fresh page load until user clicks trigger
    if (unreadDot) {
      unreadDot.style.opacity = '1';
      unreadDot.style.visibility = 'visible';
      unreadDot.style.display = 'inline-flex';
    }
    trigger.classList.add('dee-pulsing');

    // Quick-Reply Drawer Visibility & Expand State
    let hasSentFirstMessage = false;
    let isQuickHelpExpanded = false;

    // Smooth height collapse of quick-reply drawer row
    function collapseQuickHelpPermanently() {
      hasSentFirstMessage = true;
      isQuickHelpExpanded = false;
      if (chipsContainer && chipsContainer.style.display !== 'none' && !chipsContainer.classList.contains('dee-chips-collapsed')) {
        chipsContainer.classList.add('dee-chips-collapsed');
        setTimeout(() => {
          if (chipsContainer.classList.contains('dee-chips-collapsed')) {
            chipsContainer.style.display = 'none';
          }
        }, 350); // Matches smooth CSS max-height collapse duration
      }
    }

    // Render Collapsible "Quick help ▾" Drawer Pill
    function renderQuickHelpDrawer() {
      if (hasSentFirstMessage) {
        if (chipsContainer) {
          chipsContainer.style.display = 'none';
          chipsContainer.classList.add('dee-chips-collapsed');
        }
        return;
      }

      chipsContainer.innerHTML = '';
      chipsContainer.classList.remove('dee-chips-collapsed');
      chipsContainer.style.display = 'flex';

      const wrapper = document.createElement('div');
      wrapper.className = 'dee-quick-help-wrapper';
      wrapper.innerHTML = `
        <button type="button" class="dee-quick-help-toggle" id="dee-quick-help-toggle" aria-expanded="false">
          <span>Quick help</span>
          <span class="dee-quick-help-arrow">▾</span>
        </button>
        <div class="dee-quick-help-drawer" id="dee-quick-help-drawer"></div>
      `;

      const toggleBtn = wrapper.querySelector('#dee-quick-help-toggle');
      const arrowEl = wrapper.querySelector('.dee-quick-help-arrow');
      const drawerEl = wrapper.querySelector('#dee-quick-help-drawer');

      const defaultOptions = [
        "Tell me about your services 📁",
        "What are your start prices? 🏷️",
        "Get a Free Audit 📋",
        "Let's start a project brief! 🚀"
      ];

      defaultOptions.forEach(chipText => {
        const btn = document.createElement('button');
        btn.className = 'dee-chip';
        btn.type = 'button';
        btn.textContent = chipText;
        btn.addEventListener('click', () => {
          // Collapse drawer AND permanently hide quick help on first message
          collapseQuickHelpPermanently();
          addMessage('user', chipText);
          messageHistory.push({ role: 'user', parts: [{ text: chipText }] });
          
          if (chipText.includes("Get a Free Audit")) {
            const auditReply = "I can't pull up live details in chat, but I can set you up with a full digital presence audit — takes 6-12 hours and covers your website, socials, and Maps presence. Want me to get that started?";
            addMessage('bot', auditReply);
            messageHistory.push({ role: 'model', parts: [{ text: auditReply }] });
            renderChips([
              "Open Audit Form 📋",
              "Let's start a project brief! 🚀"
            ], (auditChoice) => {
              if (auditChoice.includes("Audit")) {
                openAuditModal();
              } else {
                startInquiryFlow();
              }
            });
          } else if (chipText.includes("Let's start a project brief!")) {
            startInquiryFlow();
          } else {
            handleIncomingMessage(chipText);
          }
        });
        drawerEl.appendChild(btn);
      });

      // Toggle pill click listener (Expands / Collapses drawer)
      toggleBtn.addEventListener('click', () => {
        isQuickHelpExpanded = !isQuickHelpExpanded;
        if (isQuickHelpExpanded) {
          drawerEl.classList.add('dee-drawer-open');
          toggleBtn.setAttribute('aria-expanded', 'true');
          arrowEl.textContent = '▴';
        } else {
          drawerEl.classList.remove('dee-drawer-open');
          toggleBtn.setAttribute('aria-expanded', 'false');
          arrowEl.textContent = '▾';
        }
        messageArea.scrollTop = messageArea.scrollHeight;
      });

      chipsContainer.appendChild(wrapper);
      messageArea.scrollTop = messageArea.scrollHeight;
    }

    // Dynamic Suggestion Chips Row Manager (Used for escalation fallback or form triggers)
    function renderChips(chips, onSelect, secondaryHtml = null) {
      if (hasSentFirstMessage && !secondaryHtml) {
        if (chipsContainer) {
          chipsContainer.style.display = 'none';
          chipsContainer.classList.add('dee-chips-collapsed');
        }
        return;
      }

      chipsContainer.innerHTML = '';
      if ((!chips || chips.length === 0) && !secondaryHtml) {
        chipsContainer.style.display = 'none';
        chipsContainer.classList.add('dee-chips-collapsed');
        return;
      }
      
      chipsContainer.classList.remove('dee-chips-collapsed');
      chipsContainer.style.display = 'flex';

      if (chips && chips.length > 0) {
        chips.forEach(chipText => {
          const btn = document.createElement('button');
          btn.className = 'dee-chip';
          btn.type = 'button';
          btn.textContent = chipText;
          btn.addEventListener('click', () => {
            collapseQuickHelpPermanently();
            onSelect(chipText);
          });
          chipsContainer.appendChild(btn);
        });
      }

      if (secondaryHtml) {
        const secWrap = document.createElement('div');
        secWrap.innerHTML = secondaryHtml;
        chipsContainer.appendChild(secWrap.firstElementChild || secWrap);
      }

      messageArea.scrollTop = messageArea.scrollHeight;
    }

    // Session Restore & Greeting Logic (15-Minute Expiry Check)
    function initDeeSession() {
      try {
        const rawData = sessionStorage.getItem(SESSION_KEY);
        if (rawData) {
          const sessionData = JSON.parse(rawData);
          const now = Date.now();
          if (sessionData && sessionData.lastActivity && (now - sessionData.lastActivity <= FIFTEEN_MINUTES_MS)) {
            // Restore active session thread!
            messageArea.innerHTML = '';
            chatUIThread = [];
            if (Array.isArray(sessionData.messages) && sessionData.messages.length > 0) {
              const hasUserMsg = sessionData.messages.some(m => m.sender === 'user');
              if (hasUserMsg) {
                hasSentFirstMessage = true;
                if (chipsContainer) {
                  chipsContainer.style.display = 'none';
                  chipsContainer.classList.add('dee-chips-collapsed');
                }
              }

              sessionData.messages.forEach(m => {
                addMessage(m.sender, m.text, m.isHtml, false);
              });
              if (Array.isArray(sessionData.messageHistory)) {
                messageHistory = sessionData.messageHistory;
              }
              if (sessionData.inquiryState) {
                inquiryState = sessionData.inquiryState;
              }
              if (!hasSentFirstMessage) {
                renderQuickHelpDrawer();
              }
              return;
            }
          }
        }
      } catch (e) {
        console.warn('Failed to restore Dee chat session:', e);
      }

      // Expired (>15 mins) or new tab — clear storage and show fresh greeting
      sessionStorage.removeItem(SESSION_KEY);
      chatUIThread = [];
      hasSentFirstMessage = false;
      showGreeting();
    }

    // Greeting Message
    function showGreeting() {
      showTypingIndicator();
      setTimeout(() => {
        removeTypingIndicator();
        addMessage('bot', "Hey! 👋 I'm Dee — I can help you figure out what Designmela can build for you. What are you working on?");
        if (!hasSentFirstMessage) {
          renderQuickHelpDrawer();
        }
      }, 800);
    }

    function renderDefaultChips() {
      if (hasSentFirstMessage) {
        if (chipsContainer) {
          chipsContainer.style.display = 'none';
          chipsContainer.classList.add('dee-chips-collapsed');
        }
        return;
      }
      renderChips([
        "Tell me about your services 📁",
        "What are your start prices? 🏷️",
        "Get a Free Audit 📋",
        "Let's start a project brief! 🚀"
      ], (choice) => {
        collapseChips();
        addMessage('user', choice);
        messageHistory.push({ role: 'user', parts: [{ text: choice }] });
        if (choice.includes("Get a Free Audit")) {
          const auditReply = "I can't pull up live details in chat, but I can set you up with a full digital presence audit — takes 6-12 hours and covers your website, socials, and Maps presence. Want me to get that started?";
          addMessage('bot', auditReply);
          messageHistory.push({ role: 'model', parts: [{ text: auditReply }] });
          renderChips([
            "Open Audit Form 📋",
            "Let's start a project brief! 🚀"
          ], (auditChoice) => {
            if (auditChoice.includes("Audit")) {
              openAuditModal();
            } else {
              startInquiryFlow();
            }
          });
        } else if (choice.includes("Let's start a project brief!")) {
          startInquiryFlow();
        } else {
          handleIncomingMessage(choice);
        }
      });
    }

    // Structured Inquiry Flow controller
    function startInquiryFlow() {
      inquiryState.active = true;
      inquiryState.step = 1;
      showTypingIndicator();
      setTimeout(() => {
        removeTypingIndicator();
        addMessage('bot', "Awesome! Let's put together a quick project brief for the team. First, what is your name?");
      }, 700);
    }

    function handleInquiryStep(input) {
      // 1. Name Step
      if (inquiryState.step === 1) {
        inquiryState.data.name = input.trim();
        inquiryState.step = 2;
        showTypingIndicator();
        setTimeout(() => {
          removeTypingIndicator();
          addMessage('bot', `Nice to meet you, ${inquiryState.data.name}! What service are you interested in?`);
          renderChips(["Website", "Web App", "Automation", "Branding", "AI Chatbot", "Copywriting", "Ad Creatives", "Pitch Deck", "SEO", "AI Image/Video", "Something else"], (choice) => {
            addMessage('user', choice);
            handleInquiryStep(choice);
          });
        }, 600);
        return;
      }

      // 2. Service Type Step
      if (inquiryState.step === 2) {
        inquiryState.data.service = input.trim();
        inquiryState.step = 3;
        showTypingIndicator();
        setTimeout(() => {
          removeTypingIndicator();
          addMessage('bot', "Got it. Could you share a brief description of what you are trying to build? (e.g. goals, features, or target audience)");
        }, 600);
        return;
      }

      // 3. Project Description Step
      if (inquiryState.step === 3) {
        inquiryState.data.description = input.trim();
        inquiryState.step = 4;
        showTypingIndicator();
        setTimeout(() => {
          removeTypingIndicator();
          addMessage('bot', "Perfect. How would you prefer us to get in touch with you?");
          renderChips([
            "Email",
            "Phone/WhatsApp",
            "Email + Phone",
            "Instagram + Email",
            "Instagram + Phone"
          ], (choice) => {
            addMessage('user', choice);
            
            // Map contact selection
            const val = choice.toLowerCase();
            let methods = [];
            if (val.includes('email')) methods.push('email');
            if (val.includes('phone') || val.includes('whatsapp')) methods.push('phone');
            if (val.includes('instagram')) methods.push('instagram');
            
            inquiryState.data.contactMethods = methods;
            
            // Handle edge case: Instagram only
            if (methods.length === 1 && methods[0] === 'instagram') {
              showTypingIndicator();
              setTimeout(() => {
                removeTypingIndicator();
                addMessage('bot', "Got it! Since DMs can get buried sometimes, mind also sharing a phone/WhatsApp number just so we can reach you if we don't hear back on Insta?");
                inquiryState.data.contactMethods.push('phone');
                askNextInquiryDetail();
              }, 700);
            } else {
              askNextInquiryDetail();
            }
          });
        }, 600);
        return;
      }

      // 5. Collecting Specific Contact Info
      if (inquiryState.step === 5) {
        const methods = inquiryState.data.contactMethods;
        
        // Collect Email
        if (methods.includes('email') && !inquiryState.data.email) {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(input.trim())) {
            showTypingIndicator();
            setTimeout(() => {
              removeTypingIndicator();
              addMessage('bot', "Oops! That email doesn't look quite right. Can you double check and share it again?");
            }, 600);
            return;
          }
          inquiryState.data.email = input.trim();
          askNextInquiryDetail();
          return;
        }

        // Collect Phone
        if (methods.includes('phone') && !inquiryState.data.phoneNumber) {
          // If they need to select country code
          if (!inquiryState.data.phoneCountrySelected) {
            inquiryState.data.phoneCountrySelected = true;
            // Let them click country code chips
            showTypingIndicator();
            setTimeout(() => {
              removeTypingIndicator();
              addMessage('bot', "What is your country code?");
              renderChips(["India (+91)", "USA/Canada (+1)", "UK (+44)", "UAE (+971)", "Australia (+61)"], (countryChoice) => {
                addMessage('user', countryChoice);
                const codeMatch = countryChoice.match(/\(([^)]+)\)/);
                inquiryState.data.phoneCode = codeMatch ? codeMatch[1] : '+91';
                
                const expectedLen = getPhoneLength(inquiryState.data.phoneCode);
                showTypingIndicator();
                setTimeout(() => {
                  removeTypingIndicator();
                  addMessage('bot', `Please enter your mobile number (exactly ${expectedLen} digits, numbers only):`);
                }, 600);
              });
            }, 600);
            return;
          }
          
          // Clean phone digits
          const cleanedPhone = input.replace(/[^\d]/g, "");
          const expectedLen = getPhoneLength(inquiryState.data.phoneCode);
          if (cleanedPhone.length !== expectedLen) {
            showTypingIndicator();
            setTimeout(() => {
              removeTypingIndicator();
              addMessage('bot', `Oops! Standard mobile numbers for ${inquiryState.data.phoneCode} must be exactly ${expectedLen} digits. Please enter a valid number:`);
            }, 600);
            return;
          }
          
          inquiryState.data.phoneNumber = cleanedPhone;
          askNextInquiryDetail();
          return;
        }

        // Collect Instagram
        if (methods.includes('instagram') && !inquiryState.data.instagram) {
          let ig = input.trim();
          if (ig.length > 0 && !ig.startsWith('@')) {
            ig = '@' + ig;
          }
          inquiryState.data.instagram = ig;
          askNextInquiryDetail();
          return;
        }
      }
    }

    // Loop through missing contact details
    function askNextInquiryDetail() {
      inquiryState.step = 5;
      const methods = inquiryState.data.contactMethods;
      
      // Check for Email
      if (methods.includes('email') && !inquiryState.data.email) {
        showTypingIndicator();
        setTimeout(() => {
          removeTypingIndicator();
          addMessage('bot', "Could you share your email address?");
        }, 700);
        return;
      }
      
      // Check for Phone
      if (methods.includes('phone') && !inquiryState.data.phoneNumber) {
        inquiryState.data.phoneCountrySelected = false; // Reset selection flag
        handleInquiryStep(""); // Trigger country code selection
        return;
      }
      
      // Check for Instagram
      if (methods.includes('instagram') && !inquiryState.data.instagram) {
        showTypingIndicator();
        setTimeout(() => {
          removeTypingIndicator();
          addMessage('bot', "What is your Instagram handle?");
        }, 700);
        return;
      }

      // If all collected, show Recap
      showRecapAndConfirmation();
    }

    // Recap and Confirmation step
    function showRecapAndConfirmation() {
      inquiryState.step = 6;
      
      let contactStr = '';
      if (inquiryState.data.email) contactStr += `Email: ${inquiryState.data.email}`;
      if (inquiryState.data.phoneNumber) {
        if (contactStr) contactStr += ' · ';
        contactStr += `Phone: ${inquiryState.data.phoneCode} ${inquiryState.data.phoneNumber}`;
      }
      if (inquiryState.data.instagram) {
        if (contactStr) contactStr += ' · ';
        contactStr += `Instagram: ${inquiryState.data.instagram}`;
      }

      showTypingIndicator();
      setTimeout(() => {
        removeTypingIndicator();
        addMessage('bot', `Just to confirm — ${inquiryState.data.name}, interested in ${inquiryState.data.service}, reachable at ${contactStr}. Should I send this over?`);
        renderChips(["Yes, send it!", "No, let's correct something"], (choice) => {
          addMessage('user', choice);
          if (choice.includes("Yes, send it!")) {
            submitInquiryToWeb3Forms();
          } else {
            // Correct logic - reset contact details and ask again
            showTypingIndicator();
            setTimeout(() => {
              removeTypingIndicator();
              addMessage('bot', "No worries! Let's start the contact details capture again. Who should I say this is for?");
              inquiryState.step = 1;
              inquiryState.data.email = '';
              inquiryState.data.phoneNumber = '';
              inquiryState.data.instagram = '';
              inquiryState.data.phoneCountrySelected = false;
            }, 600);
          }
        });
      }, 700);
    }

    // AJAX submit to Web3Forms
    async function submitInquiryToWeb3Forms() {
      showTypingIndicator();
      isWaitingForResponse = true;
      chatInput.disabled = true;
      sendBtn.disabled = true;

      // Construct payload
      const payload = {
        access_key: "a742e68f-d427-4708-acc7-5e8c1eae6136",
        subject: "New inquiry from Designmela AI Chat (Dee)",
        name: inquiryState.data.name,
        service_type: inquiryState.data.service,
        project_description: inquiryState.data.description,
        email: inquiryState.data.email || "",
        phone: inquiryState.data.phoneNumber ? `${inquiryState.data.phoneCode} ${inquiryState.data.phoneNumber}` : "",
        instagram_handle: inquiryState.data.instagram || "",
        lead_priority: inquiryState.leadPriority || "standard",
        source: "AI Chatbot"
      };

      try {
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });

        const result = await response.json();
        removeTypingIndicator();

        if (response.ok && result.success) {
          // Success checkmark animation inside bot bubble
          const checkmarkHtml = `
            <div>Sent! I'll make sure the team gets back to you soon 🎉</div>
            <svg class="dee-success-checkmark" viewBox="0 0 52 52">
              <circle class="dee-checkmark-circle" cx="26" cy="26" r="25" fill="none"/>
              <path class="dee-checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
            </svg>
          `;
          addMessage('bot', checkmarkHtml, true);
          
          // Reset state
          inquiryState.active = false;
          inquiryState.step = 0;
          
          // Reset default chips
          setTimeout(() => {
            renderDefaultChips();
          }, 2000);
        } else {
          throw new Error(result.message || 'Submission failed');
        }
      } catch (err) {
        console.error('Chatbot submission failed:', err);
        removeTypingIndicator();
        addMessage('bot', "Oops! Sending failed. Please try again, or click 'Prefer email' below to use the main contact form. I've saved your details.");
        renderChips(["Retry submission 🔄"], () => {
          submitInquiryToWeb3Forms();
        });
      } finally {
        isWaitingForResponse = false;
        chatInput.disabled = false;
        chatInput.value = '';
        sendBtn.disabled = true;
      }
    }

    // General chat request handler (Gemini API proxy)
    async function handleIncomingMessage(userText) {
      if (isWaitingForResponse) return;
      
      collapseChips(); // Permanently collapse quick-reply chips on first user message!
      resetIdleTimer();

      // Rate limit check
      const now = Date.now();
      if (now - lastMessageTime < 1000) {
        addMessage('bot', "Please hold on for a moment, I'm thinking!");
        return;
      }
      lastMessageTime = now;

      // Handle inquiry capture steps
      if (inquiryState.active) {
        handleInquiryStep(userText);
        return;
      }

      const cleanText = userText.toLowerCase().trim();

      // Track price pushback
      if (cleanText.includes('expensive') || cleanText.includes('cheaper') || cleanText.includes('discount') || cleanText.includes('high price') || cleanText.includes('too much') || cleanText.includes('lower price')) {
        inquiryState.pricePushbackCount++;
      }

      // Hot lead triggers
      const isAskForOwner = cleanText.includes('owner') || cleanText.includes('founder') || cleanText.includes('speak to human') || cleanText.includes('real person') || cleanText.includes('talk to boss') || cleanText.includes('human');
      const isHotLead = isAskForOwner || inquiryState.pricePushbackCount > 1 || cleanText.includes('referral') || cleanText.includes('bundle') || cleanText.includes('ready to start') || cleanText.includes('asap') || cleanText.includes('urgent') || cleanText.includes('need this soon');
      if (isHotLead) {
        inquiryState.leadPriority = 'high';
      }

      // Check if user manually triggered intake flow
      if (cleanText.includes('brief') || cleanText.includes('start project') || cleanText.includes('hire') || cleanText.includes('work with you')) {
        startInquiryFlow();
        return;
      }

      // Check if user manually requested Digital Audit
      if (cleanText.includes('audit') || cleanText.includes('analyze') || cleanText.includes('review my')) {
        addMessage('bot', "I can't pull up live details in chat, but I can set you up with a full digital presence audit — takes 6-12 hours and covers your website, socials, and Maps presence. Want me to get that started?");
        renderChips([
          "Open Audit Form 📋",
          "Let's start a project brief! 🚀"
        ], (choice) => {
          if (choice.includes("Audit")) {
            openAuditModal();
          } else {
            startInquiryFlow();
          }
        });
        return;
      }

      // Normal chat flow - invoke Google Gemini proxy
      showTypingIndicator();
      isWaitingForResponse = true;
      chatInput.disabled = true;
      sendBtn.disabled = true;

      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ history: messageHistory, currency: window.dmRegion.currency, countryCode: window.dmRegion.country })
        });

        const data = await response.json();
        removeTypingIndicator();

        if (response.ok && data.reply) {
          const replyText = data.reply.trim();
          addMessage('bot', replyText);
          messageHistory.push({ role: 'model', parts: [{ text: replyText }] });
          
          const lowerReply = replyText.toLowerCase();
          
          // Render WhatsApp button if requested owner/human or escalation link returned
          const hasWaLink = lowerReply.includes('wa.me') || lowerReply.includes('whatsapp') || isAskForOwner;
          
          if (hasWaLink) {
            const serviceContext = inquiryState.data.service || "a project";
            const dynamicMsgText = `Hi Designmela! I'd like to discuss ${serviceContext}.`;
            const encodedWaMsg = encodeURIComponent(dynamicMsgText);

            const primaryUrl = `https://wa.me/${PRIMARY_NUMBER}?text=${encodedWaMsg}`;
            const secondaryUrl = `https://wa.me/${SECONDARY_NUMBER}?text=${encodedWaMsg}`;

            const secondaryHtml = `<div class="dee-secondary-wa-wrap"><a href="${secondaryUrl}" target="_blank" rel="noopener noreferrer" class="dee-secondary-wa-link">No response? Message secondary line instead →</a></div>`;

            renderChips([
              "Continue on WhatsApp →",
              "Let's start a project brief! 🚀"
            ], (choice) => {
              if (choice.includes("Continue on WhatsApp")) {
                window.open(primaryUrl, '_blank');
              } else {
                startInquiryFlow();
              }
            }, secondaryHtml);
          } else if (lowerReply.includes('audit') || cleanText.includes('analyze') || cleanText.includes('review my')) {
            renderChips([
              "Open Audit Form 📋",
              "Let's start a project brief! 🚀"
            ], (choice) => {
              if (choice.includes("Audit")) {
                openAuditModal();
              } else {
                startInquiryFlow();
              }
            });
          } else if (lowerReply.includes('brief') || lowerReply.includes('your name') || lowerReply.includes('what is your name')) {
            setTimeout(() => {
              startInquiryFlow();
            }, 1000);
          } else {
            renderDefaultChips();
          }
        } else {
          throw new Error(data.error || 'Invalid API response');
        }
      } catch (err) {
        console.error('Chat bot error:', err);
        removeTypingIndicator();
        const errReply = "I'm having trouble connecting right now. Feel free to use the email link below to fill out the contact form directly!";
        addMessage('bot', errReply);
        messageHistory.push({ role: 'model', parts: [{ text: errReply }] });
        renderDefaultChips();
      } finally {
        isWaitingForResponse = false;
        chatInput.disabled = false;
        chatInput.value = '';
        sendBtn.disabled = true;
      }
    }

    // ============================================================
    // SECTION 03 — PROCESS SEQUENTIAL STEP & IMAGE TIMER CONTROLLER
    // ============================================================
    const processSection = document.getElementById('process');
    if (processSection) {
      const stages = processSection.querySelectorAll('.process-stage[data-stage]');
      const frameImages = processSection.querySelectorAll('.process-frame-img[data-stage]');
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      let currentStage = 1;
      const totalStages = 4;
      let timerInterval = null;

      function updateProcessState(stageNum) {
        currentStage = stageNum;

        // 1. Update Left Step Circles (Progressive Accumulation - Number Circles Fill Green)
        stages.forEach(stage => {
          const sNum = parseInt(stage.getAttribute('data-stage'), 10);

          if (sNum < stageNum) {
            // Completed steps stay filled green
            stage.classList.add('filled');
            stage.classList.remove('active');
          } else if (sNum === stageNum) {
            // Current step is active and filled green
            stage.classList.add('filled', 'active');
          } else {
            // Future steps remain unfilled
            stage.classList.remove('filled', 'active');
          }
        });

        // 2. Update Right Frame Image (Crossfade on exact same tick)
        frameImages.forEach(img => {
          if (parseInt(img.getAttribute('data-stage'), 10) === stageNum) {
            img.classList.add('active');
          } else {
            img.classList.remove('active');
          }
        });
      }

      function resetAllProcessSteps() {
        stages.forEach(stage => {
          stage.classList.remove('filled', 'active');
        });
      }

      // Initialize Step 1
      updateProcessState(1);

      // Unified 2-Second Shared Timer Loop
      if (!prefersReducedMotion) {
        function startCycle() {
          if (timerInterval) clearInterval(timerInterval);
          timerInterval = setInterval(() => {
            if (currentStage < totalStages) {
              updateProcessState(currentStage + 1);
            } else {
              // Step 4 complete: brief pause with all green, then reset to Step 1
              clearInterval(timerInterval);
              setTimeout(() => {
                resetAllProcessSteps();
                updateProcessState(1);
                startCycle();
              }, 1200);
            }
          }, 2000);
        }

        startCycle();
      }

      // Allow clicking any step to jump to it directly & continue cycle
      stages.forEach(stage => {
        stage.addEventListener('click', () => {
          const sNum = parseInt(stage.getAttribute('data-stage'), 10);
          if (sNum) {
            if (timerInterval) clearInterval(timerInterval);
            updateProcessState(sNum);
            if (!prefersReducedMotion) {
              startCycle();
            }
          }
        });
      });
    }

    // Digital Presence Audit Modal Controller
    const auditModalOverlay = document.getElementById('audit-modal-overlay');
    const auditModalClose = document.getElementById('audit-modal-close');
    const auditBannerBtn = document.getElementById('btn-open-audit-banner');
    const auditForm = document.getElementById('audit-form');
    const auditPhoneCode = document.getElementById('audit-phone-code');
    const auditPhone = document.getElementById('audit-phone');

    const validateEmailFormat = (emailStr) => {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailStr);
    };

    const validateUrlFormat = (urlStr) => {
      if (!urlStr) return true;
      const cleaned = urlStr.trim().toLowerCase();
      return /^https?:\/\//.test(cleaned) || /^[\w-]+\.[\w-]+/.test(cleaned) || /^instagram\.com\//.test(cleaned) || /^maps\.google\.com\//.test(cleaned);
    };

    if (auditPhoneCode) {
      if (typeof window.buildCountryDropdown === 'function') {
        window.buildCountryDropdown(auditPhoneCode, window.dmRegion.dialCode);
      }
    }

    if (auditPhone) {
      auditPhone.addEventListener('input', () => {
        const cleaned = auditPhone.value.replace(/[^\d]/g, '');
        if (cleaned !== auditPhone.value) auditPhone.value = cleaned;
      });
    }

    // Auto-expanding textarea for Anything Else box
    const auditContextInput = document.getElementById('audit-context');
    if (auditContextInput) {
      auditContextInput.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = Math.max(85, this.scrollHeight) + 'px';
      });
    }

    // Typewriter placeholders for Business Name & Business URL
    const auditNameInput = document.getElementById('audit-business-name');
    const auditUrlInput = document.getElementById('audit-business-url');
    if (auditNameInput && auditUrlInput && typeof syncedTypewriter === 'function') {
      syncedTypewriter([
        {
          el: auditNameInput,
          phrases: [
            "e.g. Apex Coffee Roasters",
            "e.g. Bloom Floral Studio",
            "e.g. Sharma Family Dental",
            "e.g. Nova Fitness Club"
          ]
        },
        {
          el: auditUrlInput,
          phrases: [
            "www.yourbusiness.com",
            "instagram.com/yourbusiness",
            "maps.google.com/yourbusiness",
            "yourbusiness.com"
          ]
        }
      ], { typeSpeed: 45, holdMs: 1600, deleteSpeed: 25 });
    }

    function resetAuditModalView() {
      const formEl = document.getElementById('audit-form');
      const headerEl = document.getElementById('audit-modal-header');
      const successEl = document.getElementById('audit-success-state');
      const errorMsg = document.getElementById('audit-error-message');

      if (formEl) formEl.style.display = 'block';
      if (headerEl) headerEl.style.display = 'block';
      if (successEl) successEl.style.display = 'none';
      if (errorMsg) errorMsg.style.display = 'none';

      // Hide individual error spans
      ['error-audit-business-name', 'error-audit-industry', 'error-audit-business-url', 'error-audit-email', 'error-audit-phone', 'error-audit-consent'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = 'none';
      });
    }

    function openAuditModal() {
      if (isChatOpen) {
        closeChat();
      }
      if (auditModalOverlay) {
        auditModalOverlay.style.display = 'flex';
        auditModalOverlay.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
      }
    }

    function closeAuditModal() {
      if (auditModalOverlay) {
        auditModalOverlay.style.display = 'none';
        auditModalOverlay.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
      }
    }

    if (auditBannerBtn) {
      auditBannerBtn.addEventListener('click', openAuditModal);
    }
    const auditStripBtn = document.getElementById('btn-open-audit-strip');
    if (auditStripBtn) {
      auditStripBtn.addEventListener('click', openAuditModal);
    }
    if (auditModalClose) {
      auditModalClose.addEventListener('click', closeAuditModal);
    }
    if (auditModalOverlay) {
      auditModalOverlay.addEventListener('click', (e) => {
        if (e.target === auditModalOverlay) closeAuditModal();
      });
    }

    const btnCloseSuccess = document.getElementById('btn-close-audit-success');
    if (btnCloseSuccess) {
      btnCloseSuccess.addEventListener('click', () => {
        closeAuditModal();
        setTimeout(resetAuditModalView, 300);
      });
    }

    // Audit Form Submission
    if (auditForm) {
      auditForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const bName = document.getElementById('audit-business-name');
        const ind = document.getElementById('audit-industry');
        const bUrl = document.getElementById('audit-business-url');
        const email = document.getElementById('audit-email');
        const phone = document.getElementById('audit-phone');
        const phoneCode = document.getElementById('audit-phone-code');
        const consent = document.getElementById('audit-consent');
        
        let isValid = true;
        
        // 1. Business Name *
        if (!bName.value.trim()) {
          isValid = false;
          document.getElementById('error-audit-business-name').style.display = 'block';
        } else {
          document.getElementById('error-audit-business-name').style.display = 'none';
        }

        // 2. Industry *
        if (!ind.value.trim()) {
          isValid = false;
          document.getElementById('error-audit-industry').style.display = 'block';
        } else {
          document.getElementById('error-audit-industry').style.display = 'none';
        }

        // 3. Business URL (optional)
        if (bUrl && bUrl.value.trim()) {
          if (!validateUrlFormat(bUrl.value.trim())) {
            isValid = false;
            document.getElementById('error-audit-business-url').style.display = 'block';
          } else {
            document.getElementById('error-audit-business-url').style.display = 'none';
          }
        } else {
          const errUrl = document.getElementById('error-audit-business-url');
          if (errUrl) errUrl.style.display = 'none';
        }

        // 4. Email (optional)
        if (email && email.value.trim()) {
          if (!validateEmailFormat(email.value.trim())) {
            isValid = false;
            document.getElementById('error-audit-email').style.display = 'block';
          } else {
            document.getElementById('error-audit-email').style.display = 'none';
          }
        } else {
          const errEmail = document.getElementById('error-audit-email');
          if (errEmail) errEmail.style.display = 'none';
        }

        // 5. Phone / WhatsApp * (REQUIRED)
        const expectedPhoneLen = phoneCode ? getPhoneLength(phoneCode.value) : 10;
        const cleanDigits = phone.value.replace(/[^\d]/g, '');
        if (!cleanDigits || cleanDigits.length !== expectedPhoneLen) {
          isValid = false;
          const phoneErr = document.getElementById('error-audit-phone');
          if (phoneErr) {
            phoneErr.textContent = cleanDigits 
              ? `Please enter a valid ${expectedPhoneLen}-digit phone number.` 
              : "Please enter your phone number.";
            phoneErr.style.display = 'block';
          }
        } else {
          document.getElementById('error-audit-phone').style.display = 'none';
        }

        // 7. Consent Checkbox * (REQUIRED)
        if (!consent || !consent.checked) {
          isValid = false;
          document.getElementById('error-audit-consent').style.display = 'block';
        } else {
          document.getElementById('error-audit-consent').style.display = 'none';
        }

        if (!isValid) return;

        const submitBtn = document.getElementById('btn-submit-audit');
        const errorMsg = document.getElementById('audit-error-message');
        
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>Submitting Request...</span>';
        if (errorMsg) errorMsg.style.display = 'none';

        const formData = new FormData(auditForm);
        formData.append('phone_full', `${phoneCode ? phoneCode.value : '+91'} ${cleanDigits}`);

        // Function to render post-submission success state
        const showAuditSuccess = () => {
          const headerEl = document.getElementById('audit-modal-header');
          const formEl = document.getElementById('audit-form');
          const successEl = document.getElementById('audit-success-state');
          const confirmTextEl = document.getElementById('audit-success-contact-confirm');

          const fullPhone = `${phoneCode ? phoneCode.value : ''} ${cleanDigits}`.trim();
          const userEmail = email ? email.value.trim() : '';

          if (confirmTextEl) {
            if (userEmail) {
              confirmTextEl.textContent = `We'll send your full audit to ${userEmail} and reach out on WhatsApp / phone at ${fullPhone}.`;
            } else {
              confirmTextEl.textContent = `We'll reach out with your full audit on WhatsApp / phone at ${fullPhone}.`;
            }
          }

          if (headerEl) headerEl.style.display = 'none';
          if (formEl) formEl.style.display = 'none';
          if (successEl) successEl.style.display = 'block';

          auditForm.reset();
        };

        try {
          const res = await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            body: formData
          });

          let resData = null;
          try {
            resData = await res.json();
          } catch (parseErr) {
            resData = { success: true };
          }

          if (res.ok || (resData && resData.success)) {
            showAuditSuccess();
          } else {
            showAuditSuccess();
          }
        } catch (err) {
          console.warn('Audit submit network fallback:', err);
          showAuditSuccess();
        } finally {
          submitBtn.disabled = false;
          submitBtn.innerHTML = '<span>Submit Audit Request <span class="arrow">→</span></span>';
        }
      });
    }

    // Toggle Chat window opening and closing
    function openChat() {
      windowEl.style.display = 'flex';
      trigger.setAttribute('aria-expanded', 'true');
      isChatOpen = true;

      // Clear unread indicator and pulse animations
      if (unreadDot) {
        unreadDot.style.opacity = '0';
        unreadDot.style.visibility = 'hidden';
        unreadDot.style.display = 'none';
      }
      trigger.classList.remove('dee-pulsing');
      sessionStorage.setItem('dee_chat_opened', 'true');

      // GSAP animate open
      gsap.fromTo(windowEl, 
        { scale: 0.3, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.25, ease: "power2.out" }
      );

      // Restore ongoing 15-min session or trigger greeting on first load
      if (messageHistory.length === 0 && chatUIThread.length === 0) {
        initDeeSession();
      }
    }

    function closeChat() {
      isChatOpen = false;
      gsap.to(windowEl, {
        scale: 0.3,
        opacity: 0,
        duration: 0.25,
        ease: "power2.in",
        onComplete: () => {
          windowEl.style.display = 'none';
          trigger.setAttribute('aria-expanded', 'false');
        }
      });
    }

    // Event Listeners
    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      if (isChatOpen) {
        closeChat();
      } else {
        openChat();
      }
    });

    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeChat();
    });

    // Input submit handling
    inputForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const text = chatInput.value.trim();
      if (!text || isWaitingForResponse) return;

      addMessage('user', text);
      messageHistory.push({ role: 'user', parts: [{ text: text }] });
      chatInput.value = '';
      sendBtn.disabled = true;

      handleIncomingMessage(text);
    });

    // Close on click outside chatbot
    document.addEventListener('click', (e) => {
      if (isChatOpen && !windowEl.contains(e.target) && !trigger.contains(e.target)) {
        closeChat();
      }
    });

    // Handle ESC key to close
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isChatOpen) {
        closeChat();
      }
    });

    // Setup Prefer Email link smooth scroll & close
    const emailLink = document.getElementById('dee-prefer-email-link');
    if (emailLink) {
      emailLink.addEventListener('click', (e) => {
        closeChat();
        // Allow smooth scroll to contact section
        const targetSec = document.querySelector('#contact');
        if (targetSec) {
          e.preventDefault();
          targetSec.scrollIntoView({ behavior: 'smooth' });
        }
      });
    }

  })();

  // ============================================================
  // FAQ ACCORDION TOGGLE CONTROLLER (INDEPENDENT MODULE)
  // ============================================================
  function initFAQAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    if (!faqItems.length) return;

    faqItems.forEach(item => {
      const trigger = item.querySelector('.faq-trigger');
      if (trigger) {
        trigger.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          const isCurrentlyActive = item.classList.contains('active');

          // Close all accordion items
          faqItems.forEach(other => {
            other.classList.remove('active');
            const otherTrigger = other.querySelector('.faq-trigger');
            if (otherTrigger) otherTrigger.setAttribute('aria-expanded', 'false');
          });

          // Open clicked item if it wasn't active
          if (!isCurrentlyActive) {
            item.classList.add('active');
            trigger.setAttribute('aria-expanded', 'true');
          }
        });
      }
    });
  }

  // ============================================================
  // HERO BROWSER CARD ROTATING PREVIEW & SPRING HOVER MODULE
  // ============================================================
  function initHeroBrowserCarousel() {
    const card = document.querySelector('.hero-browser-card');
    const wrapper = document.querySelector('.hero-browser-wrapper');
    const slides = document.querySelectorAll('.hero-browser-slides .hero-slide');
    if (!slides || slides.length === 0) return;

    // 1. Continuous crossfade carousel loop (4s per slide)
    let currentIndex = 0;
    setInterval(() => {
      slides[currentIndex].classList.remove('active');
      currentIndex = (currentIndex + 1) % slides.length;
      slides[currentIndex].classList.add('active');
    }, 4000);

    if (!card) return;

    // 2. Spring Physics Hover Controller (Tactile press & spring settle)
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const restingRotateY = -8;
    const restingRotateX = 4;
    const pressedRotateY = -2;
    const pressedRotateX = 1;
    const pressedScale = 0.97;

    const idleShadow = '0 24px 50px -12px rgba(23, 23, 23, 0.22), 0 10px 20px -6px rgba(23, 23, 23, 0.12), 5px 5px 0 #171717';
    const pressedShadow = '0 10px 22px -6px rgba(23, 23, 23, 0.16), 0 4px 8px -2px rgba(23, 23, 23, 0.10), 2.5px 2.5px 0 #171717';

    let floatTween = null;
    if (!prefersReducedMotion && typeof gsap !== 'undefined') {
      floatTween = gsap.to(card, {
        y: -10,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut'
      });
    }

    const hoverTarget = wrapper || card;

    hoverTarget.addEventListener('mouseenter', () => {
      if (floatTween) floatTween.pause();
      if (typeof gsap !== 'undefined') {
        gsap.to(card, {
          rotateY: pressedRotateY,
          rotateX: pressedRotateX,
          scale: pressedScale,
          y: 0,
          boxShadow: pressedShadow,
          duration: prefersReducedMotion ? 0.08 : 0.35,
          ease: prefersReducedMotion ? 'power1.out' : 'back.out(1.5)',
          overwrite: 'auto'
        });
      }
    });

    hoverTarget.addEventListener('mouseleave', () => {
      if (typeof gsap !== 'undefined') {
        gsap.to(card, {
          rotateY: restingRotateY,
          rotateX: restingRotateX,
          scale: 1,
          boxShadow: idleShadow,
          duration: prefersReducedMotion ? 0.08 : 0.35,
          ease: prefersReducedMotion ? 'power1.out' : 'back.out(1.5)',
          overwrite: 'auto',
          onComplete: () => {
            if (floatTween && !prefersReducedMotion) {
              floatTween.resume();
            }
          }
        });
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initFAQAccordion();
      initHeroBrowserCarousel();
    });
  } else {
    initFAQAccordion();
    initHeroBrowserCarousel();
  }

})();

