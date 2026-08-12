/* ============================================================
   GNDLF Technologies — site interactions
   ============================================================ */
(function () {
  'use strict';

  /* ---------- Inline icon set (stroke = currentColor) ---------- */
  const S = (p) =>
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${p}</svg>`;

  const ICONS = {
    ENTERPRISE: S('<rect x="3" y="4" width="18" height="13" rx="2"/><path d="M7 21h10"/><path d="M12 17v4"/><path d="M7 12l3-3 2 2 4-4"/>'),
    SHIELD:     S('<path d="M12 3l7 3v5c0 4.5-3 7.6-7 9-4-1.4-7-4.5-7-9V6z"/><path d="M9.2 12l2 2 3.6-3.6"/>'),
    INNOVATE:   S('<path d="M9 18h6"/><path d="M10 21h4"/><path d="M12 3a6 6 0 0 0-4 10.5c.7.7 1 1.3 1 2.5h6c0-1.2.3-1.8 1-2.5A6 6 0 0 0 12 3z"/>'),
    TEAM:       S('<circle cx="9" cy="8" r="3"/><path d="M3 20a6 6 0 0 1 12 0"/><path d="M16 6.2a3 3 0 0 1 0 5.6"/><path d="M17 14.5a6 6 0 0 1 4 5.5"/>'),
    GLOBE:      S('<circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3c2.6 2.6 2.6 15.4 0 18M12 3c-2.6 2.6-2.6 15.4 0 18"/>'),
    AI:         S('<rect x="7" y="7" width="10" height="10" rx="2.5"/><path d="M9.5 3.5V6M14.5 3.5V6M9.5 18v2.5M14.5 18v2.5M3.5 9.5H6M3.5 14.5H6M18 9.5h2.5M18 14.5h2.5"/><circle cx="12" cy="12" r="1.6"/>'),
    ANALYTICS:  S('<path d="M4 20V10M9 20V4M14 20v-7M19 20V8"/>'),
    LEARN:      S('<path d="M12 4L2 9l10 5 8-4v6"/><path d="M6 11.5V16c0 1.1 2.7 3 6 3s6-1.9 6-3v-4.5"/>'),
    FAST:       S('<path d="M13 2L4 14h7l-1 8 9-12h-7z"/>'),
    SCALE:      S('<rect x="3" y="3" width="8" height="8" rx="1.5"/><rect x="13" y="3" width="8" height="8" rx="1.5"/><rect x="3" y="13" width="8" height="8" rx="1.5"/><rect x="13" y="13" width="8" height="8" rx="1.5"/>'),
    MAIL:       S('<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M4 7l8 6 8-6"/>')
  };

  function injectIcons() {
    document.querySelectorAll('.value__icon, .card__icon, .why__icon, .sap-badge span, .cta__link')
      .forEach((el) => {
        el.innerHTML = el.innerHTML.replace(/\$\{ICON_(\w+)\}/g, (m, k) => ICONS[k] || '');
      });
    // Fallback: catch any stragglers elsewhere
    document.querySelectorAll('*').forEach((el) => {
      if (el.children.length === 0 && /\$\{ICON_\w+\}/.test(el.textContent)) {
        el.innerHTML = el.textContent.replace(/\$\{ICON_(\w+)\}/g, (m, k) => ICONS[k] || '');
      }
    });
  }

  /* ---------- Header on scroll ---------- */
  function initHeader() {
    const header = document.getElementById('siteHeader');
    const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---------- Mobile menu ---------- */
  function initMenu() {
    const toggle = document.getElementById('navToggle');
    const links = document.getElementById('navLinks');
    if (!toggle || !links) return;
    const close = () => { toggle.classList.remove('open'); links.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false'); };
    toggle.addEventListener('click', () => {
      const open = toggle.classList.toggle('open');
      links.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', String(open));
    });
    links.querySelectorAll('a').forEach((a) => a.addEventListener('click', close));
  }

  /* ---------- Reveal on scroll ---------- */
  function initReveal() {
    const els = Array.from(document.querySelectorAll('.reveal'));
    if (!('IntersectionObserver' in window)) { els.forEach((e) => e.classList.add('in')); return; }

    const io = new IntersectionObserver((entries) => {
      entries.forEach((e, i) => {
        if (e.isIntersecting) {
          setTimeout(() => e.target.classList.add('in'), (i % 6) * 60);
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    els.forEach((e) => io.observe(e));

    // Safety net: reveal anything already within view (covers deep links to
    // a fragment and environments where IO callbacks lag).
    const sweep = () => {
      const vh = window.innerHeight || document.documentElement.clientHeight;
      for (const e of els) {
        if (e.classList.contains('in')) continue;
        const r = e.getBoundingClientRect();
        if (r.top < vh * 0.92 && r.bottom > 0) { e.classList.add('in'); io.unobserve(e); }
      }
    };
    requestAnimationFrame(sweep);
    window.addEventListener('load', sweep);
    window.addEventListener('scroll', sweep, { passive: true });
  }

  /* ---------- Active nav link (scroll spy) ---------- */
  function initScrollSpy() {
    const sections = ['cozumler', 'sap', 'neden', 'iletisim']
      .map((id) => document.getElementById(id)).filter(Boolean);
    const links = new Map();
    document.querySelectorAll('.nav__links a[href^="#"]').forEach((a) => links.set(a.getAttribute('href').slice(1), a));
    if (!('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          links.forEach((a) => a.classList.remove('active'));
          const a = links.get(e.target.id);
          if (a) a.classList.add('active');
        }
      });
    }, { threshold: 0.5 });
    sections.forEach((s) => io.observe(s));
  }

  /* ---------- Hero network canvas ---------- */
  function initNetwork() {
    const canvas = document.getElementById('networkCanvas');
    if (!canvas || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const ctx = canvas.getContext('2d');
    let w, h, dpr, nodes = [], raf;

    const GOLD = 'rgba(212,175,55,';

    function size() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.max(28, Math.min(72, Math.floor((w * h) / 22000)));
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35,
        r: Math.random() * 1.6 + 0.6
      }));
    }

    function frame() {
      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;
        for (let j = i + 1; j < nodes.length; j++) {
          const m = nodes[j], dx = n.x - m.x, dy = n.y - m.y, d = Math.hypot(dx, dy);
          if (d < 130) {
            ctx.strokeStyle = GOLD + (0.16 * (1 - d / 130)) + ')';
            ctx.lineWidth = 0.6;
            ctx.beginPath(); ctx.moveTo(n.x, n.y); ctx.lineTo(m.x, m.y); ctx.stroke();
          }
        }
      }
      for (const n of nodes) {
        ctx.fillStyle = GOLD + '0.55)';
        ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2); ctx.fill();
      }
      raf = requestAnimationFrame(frame);
    }

    size();
    frame();
    let t;
    window.addEventListener('resize', () => { clearTimeout(t); t = setTimeout(size, 180); });
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) { cancelAnimationFrame(raf); }
      else { raf = requestAnimationFrame(frame); }
    });
  }

  /* ---------- i18n ---------- */
  const I18N = {
    tr: {
      'nav.solutions': 'Çözümler', 'nav.why': 'Neden GNDLF', 'nav.contact': 'İletişim', 'nav.cta': 'Bize Ulaşın',
      'hero.lead': 'Teknoloji, güvenlik ve yapay zeka odaklı çözümlerimizle iş süreçlerinizi dönüştürüyor, verimliliğinizi artırıyor ve sürdürülebilir bir gelecek inşa ediyoruz.',
      'hero.cta1': 'Çözümlerimizi Keşfedin', 'hero.cta2': 'Bize Ulaşın',
      'val.1': 'Kurumsal ihtiyaçlara özel çözümler.',
      'val.2': 'Güvenli, ölçeklenebilir ve yüksek erişilebilir.',
      'val.3': 'Yapay zeka ve otomasyon destekli uygulamalar.',
      'val.4': 'Deneyimli ve uzman kadromuzla yanınızdayız.',
      'val.5': 'Dünya standartlarında çözümler.',
      'sol.kicker': 'ÇÖZÜMLERİMİZ', 'sol.h2': 'Uçtan uca dijital çözüm ailesi',
      'sol.p': 'İşletmenizin her katmanı için tasarlanmış, yapay zeka ile güçlendirilmiş ürün ve hizmetler.',
      'sol.d1': 'İş süreçlerinizi izleyin, maliyetlerinizi kontrol edin, projelerinizi yönetin ve test süreçlerinizi yapay zeka ile otomatikleştirin.',
      'sol.d2': 'Sistemlerinizi test edin, zafiyetleri belirleyin ve verilerinizi koruyarak mevzuata uyumu sağlayın.',
      'sol.d3': 'Yapay zeka destekli çözümlerimizle yetenek yönetimini, mülakatları ve bilgi yönetimini dönüştürün.',
      'sol.d4': 'Verilerinizi analiz edin, performansınızı artırın ve stratejik kararlarınızı güçlendirin.',
      'sol.d5': 'Teknoloji ve iş dünyasına yönelik uzmanlık eğitimleri ile ekibinizi güçlendirin.',
      'sap.kicker': 'SAP ÇÖZÜMLERİMİZ', 'sap.h2': 'SAP ERP altyapınızı uçtan uca dijitalleştirin',
      'sap.p': 'GNDLF, SAP ERP altyapınızı daha verimli, güvenli ve uyumlu hale getirir; iş süreçlerinizi uçtan uca dijitalleştirerek rekabette öne geçmenizi sağlar.',
      'sap.t1': 'E-Dönüşüm Paketleri', 'sap.t2': 'Finansal Çözümler', 'sap.t3': 'Veri & Risk Yönetimi',
      'sap.t4': 'Tedarik & Dış Ticaret', 'sap.t5': 'Finansal Operasyonlar & Raporlama',
      'sap.b1': 'Hızlı Entegrasyon', 'sap.b2': 'Mevzuata Uyumlu', 'sap.b3': 'Yüksek Performans', 'sap.b4': 'Ölçeklenebilir Yapı',
      'why.kicker': 'NEDEN GNDLF?', 'why.h2': 'Geleceğe birlikte taşıyalım',
      'why.t1': 'Güvenilir', 'why.d1': 'Veri güvenliği ve sürekliliği odaklı çözümler sunarız.',
      'why.t2': 'Yenilikçi', 'why.d2': 'AI ve otomasyon teknolojileri ile işinizi geleceğe taşırız.',
      'why.t3': 'Uzman Kadro', 'why.d3': 'Deneyimli ekibimizle projelerinize değer katarız.',
      'why.t4': 'Sonuç Odaklı', 'why.d4': 'Ölçülebilir sonuçlar ve ROI odaklı çalışırız.',
      'why.t5': 'Küresel Yaklaşım', 'why.d5': 'Yerel ihtiyaçları global standartlarla buluştururuz.',
      'cta.h2': 'İşinizi birlikte geleceğe taşıyalım',
      'cta.p': 'Daha akıllı, daha güvenli ve daha verimli bir gelecek için yanınızdayız. Projelerinizi konuşmak için bize ulaşın.',
      'form.name': 'Ad Soyad', 'form.email': 'E-posta', 'form.msg': 'Mesajınız', 'form.send': 'Gönder',
      'form.ph_name': 'Adınız', 'form.ph_email': 'ornek@sirket.com', 'form.ph_msg': 'Nasıl yardımcı olabiliriz?',
      'form.thanks': 'Teşekkürler{name}! Mesajınızı aldık, en kısa sürede info@gndlf.io üzerinden dönüş yapacağız.',
      'foot.col1': 'Çözümler', 'foot.col2': 'Kurumsal', 'foot.col3': 'İletişim',
      'foot.sap': 'SAP Çözümleri', 'foot.why': 'Neden GNDLF', 'foot.contact': 'İletişim',
      'foot.rights': 'Tüm hakları saklıdır.'
    },
    en: {
      'nav.solutions': 'Solutions', 'nav.why': 'Why GNDLF', 'nav.contact': 'Contact', 'nav.cta': 'Get in Touch',
      'hero.lead': 'With our technology, security and AI-focused solutions, we transform your business processes, boost your efficiency and build a sustainable future.',
      'hero.cta1': 'Explore Our Solutions', 'hero.cta2': 'Get in Touch',
      'val.1': 'Tailored solutions for enterprise needs.',
      'val.2': 'Secure, scalable and highly available.',
      'val.3': 'AI and automation-powered applications.',
      'val.4': 'By your side with our experienced expert team.',
      'val.5': 'World-class solutions.',
      'sol.kicker': 'OUR SOLUTIONS', 'sol.h2': 'An end-to-end digital solution family',
      'sol.p': 'AI-powered products and services designed for every layer of your business.',
      'sol.d1': 'Monitor your business processes, control costs, manage projects and automate testing with artificial intelligence.',
      'sol.d2': 'Test your systems, identify vulnerabilities and ensure regulatory compliance by protecting your data.',
      'sol.d3': 'Transform talent management, interviews and knowledge management with our AI-powered solutions.',
      'sol.d4': 'Analyze your data, improve performance and strengthen your strategic decisions.',
      'sol.d5': 'Empower your team with expert training tailored to technology and business.',
      'sap.kicker': 'OUR SAP SOLUTIONS', 'sap.h2': 'Digitalize your SAP ERP end-to-end',
      'sap.p': 'GNDLF makes your SAP ERP infrastructure more efficient, secure and compliant; by digitalizing your processes end-to-end, it helps you get ahead of the competition.',
      'sap.t1': 'E-Transformation Packages', 'sap.t2': 'Financial Solutions', 'sap.t3': 'Data & Risk Management',
      'sap.t4': 'Procurement & Foreign Trade', 'sap.t5': 'Financial Operations & Reporting',
      'sap.b1': 'Fast Integration', 'sap.b2': 'Regulatory Compliant', 'sap.b3': 'High Performance', 'sap.b4': 'Scalable Architecture',
      'why.kicker': 'WHY GNDLF?', 'why.h2': "Let's move into the future together",
      'why.t1': 'Reliable', 'why.d1': 'We deliver solutions focused on data security and continuity.',
      'why.t2': 'Innovative', 'why.d2': 'We carry your business into the future with AI and automation.',
      'why.t3': 'Expert Team', 'why.d3': 'We add value to your projects with our experienced team.',
      'why.t4': 'Results-Driven', 'why.d4': 'We work with measurable results and ROI in focus.',
      'why.t5': 'Global Approach', 'why.d5': 'We meet local needs with global standards.',
      'cta.h2': "Let's move your business into the future together",
      'cta.p': "We're by your side for a smarter, safer and more efficient future. Get in touch to discuss your projects.",
      'form.name': 'Full Name', 'form.email': 'Email', 'form.msg': 'Your Message', 'form.send': 'Send',
      'form.ph_name': 'Your name', 'form.ph_email': 'you@company.com', 'form.ph_msg': 'How can we help?',
      'form.thanks': 'Thank you{name}! We received your message and will get back to you shortly at info@gndlf.io.',
      'foot.col1': 'Solutions', 'foot.col2': 'Company', 'foot.col3': 'Contact',
      'foot.sap': 'SAP Solutions', 'foot.why': 'Why GNDLF', 'foot.contact': 'Contact',
      'foot.rights': 'All rights reserved.'
    }
  };

  let currentLang = 'tr';

  function applyLang(lang) {
    const dict = I18N[lang] || I18N.tr;
    currentLang = I18N[lang] ? lang : 'tr';
    document.documentElement.lang = currentLang;

    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const v = dict[el.getAttribute('data-i18n')];
      if (v != null) el.textContent = v;
    });
    document.querySelectorAll('[data-ph]').forEach((el) => {
      const v = dict[el.getAttribute('data-ph')];
      if (v != null) el.setAttribute('placeholder', v);
    });
    document.querySelectorAll('.lang__btn').forEach((b) => {
      b.classList.toggle('is-active', b.getAttribute('data-set-lang') === currentLang);
    });
    try { localStorage.setItem('gndlf-lang', currentLang); } catch (e) {}
  }

  function initLang() {
    let saved = null;
    try { saved = localStorage.getItem('gndlf-lang'); } catch (e) {}
    const start = saved || ((navigator.language || '').toLowerCase().startsWith('tr') ? 'tr' : 'en');
    applyLang(start);
    document.querySelectorAll('.lang__btn').forEach((b) => {
      b.addEventListener('click', () => applyLang(b.getAttribute('data-set-lang')));
    });
  }

  /* ---------- Contact form (front-end only) ---------- */
  window.handleContact = function (e) {
    e.preventDefault();
    const form = e.target;
    const note = document.getElementById('ctaNote');
    const name = (form.name.value || '').trim();
    const tpl = (I18N[currentLang] || I18N.tr)['form.thanks'];
    note.hidden = false;
    note.textContent = tpl.replace('{name}', name ? ' ' + name : '');
    form.reset();
    return false;
  };

  /* ---------- Boot ---------- */
  function boot() {
    document.documentElement.classList.add('js');
    injectIcons();
    initLang();
    initHeader();
    initMenu();
    initReveal();
    initScrollSpy();
    initNetwork();
    const y = document.getElementById('year');
    if (y) y.textContent = new Date().getFullYear();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
