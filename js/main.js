// Minimal i18n system with RTL/LTR and localStorage persistence
const LANG_KEY = 'preferred_lang';
const DEFAULT_LANG = 'en';

const translations = {
  en: {
    meta_title: 'Lawyer Abdulrahman Al-Rahman — Rukaz Legal Group',
    meta_description: 'Premium legal services in Kuwait. Justice begins with understanding. Book a consultation today.',
    // Page meta overrides
    about_title: 'About — Rukaz Legal Group',
    about_description: 'Biography, education, experience, and values of Lawyer Abdulrahman Al-Rahman.',
    nav_home: 'Home',
    nav_about: 'About',
    nav_practice: 'Practice Areas',
    nav_contact: 'Contact',
    nav_book: 'Book',
    contact_title: 'Contact Us',
    contact_desc: 'Send a message or book a consultation. We respond promptly.',
    form_name: 'Full Name',
    form_phone: 'Phone',
    form_email: 'Email',
    form_message: 'Message',
    form_submit: 'Send Message',
    svc_criminal: 'Criminal Law',
    svc_civil: 'Civil Law',
    svc_corporate: 'Corporate Law',
    svc_realestate: 'Real Estate',
    svc_family: 'Family Law',
    svc_contracts: 'Contracts',
    svc_desc_criminal: 'Defense strategies, bail, appeals, and client rights protection.',
    svc_desc_civil: 'Litigation and mediation in tort, debt, and personal disputes.',
    svc_desc_corporate: 'Entity formation, governance, compliance, M&A advisory.',
    svc_desc_realestate: 'Transactions, leases, disputes, and property due diligence.',
    svc_desc_family: 'Marriage, divorce, custody, and inheritance matters.',
    svc_desc_contracts: 'Drafting, negotiation, and enforcement of commercial agreements.',
    hero_badge: 'Founder of Rukaz Legal Group',
    hero_title: 'Lawyer Abdulrahman Al-Rahman',
    hero_sub: '“Justice begins with understanding.”',
    hero_cta_book: 'Book a Consultation',
    hero_cta_contact: 'Contact Us',
    location_label: 'Kuwait – Mirgab Street, Abdullaziz Saqar Al-Toujar Tower, Floor 5, Office 13',
    footer_rights: 'All Rights Reserved',
    lang_toggle: 'العربية',
  },
  ar: {
    meta_title: 'المحامي عبد الرحمن الرحمن — مجموعة ركاز القانونية',
    meta_description: 'خدمات قانونية متميزة في الكويت. العدالة تبدأ بالفهم. احجز استشارة اليوم.',
    about_title: 'من نحن — مجموعة ركاز القانونية',
    about_description: 'السيرة، التعليم، الخبرات، والقيم للمحامي عبد الرحمن الرحمن.',
    nav_home: 'الرئيسية',
    nav_about: 'من نحن',
    nav_practice: 'مجالات الممارسة',
    nav_contact: 'تواصل',
    nav_book: 'احجز',
    contact_title: 'اتصل بنا',
    contact_desc: 'أرسل رسالة أو احجز استشارة. نرد بسرعة.',
    form_name: 'الاسم الكامل',
    form_phone: 'الهاتف',
    form_email: 'البريد الإلكتروني',
    form_message: 'الرسالة',
    form_submit: 'إرسال',
    svc_criminal: 'القانون الجنائي',
    svc_civil: 'القانون المدني',
    svc_corporate: 'القانون التجاري',
    svc_realestate: 'العقارات',
    svc_family: 'الأحوال الشخصية',
    svc_contracts: 'العقود',
    svc_desc_criminal: 'استراتيجيات الدفاع، الكفالة، الاستئناف، وحماية حقوق العميل.',
    svc_desc_civil: 'التقاضي والوساطة في المسؤولية، الديون، والنزاعات الشخصية.',
    svc_desc_corporate: 'تأسيس الشركات، الحوكمة، الامتثال، والاستشارات في الاستحواذات.',
    svc_desc_realestate: 'الصفقات، الإيجارات، النزاعات، وفحص الملكيات.',
    svc_desc_family: 'الزواج، الطلاق، الحضانة، وقضايا الميراث.',
    svc_desc_contracts: 'صياغة العقود، التفاوض، وتنفيذ الاتفاقيات التجارية.',
    hero_badge: 'المؤسس – مجموعة ركاز القانونية',
    hero_title: 'المحامي عبد الرحمن الرحمن',
    hero_sub: '«العدالة تبدأ بالفهم.»',
    hero_cta_book: 'احجز استشارة',
    hero_cta_contact: 'اتصل بنا',
    location_label: 'الكويت – شارع المرقاب، برج عبدالعزيز صقر التجار، الدور 5، مكتب 13',
    footer_rights: 'جميع الحقوق محفوظة',
    lang_toggle: 'EN',
  }
};

function getSavedLang() {
  try { return localStorage.getItem(LANG_KEY) || DEFAULT_LANG; } catch { return DEFAULT_LANG; }
}

function saveLang(lang) {
  try { localStorage.setItem(LANG_KEY, lang); } catch {}
}

function isRTL(lang) { return lang === 'ar'; }

function applyDirection(lang) {
  const html = document.documentElement;
  html.lang = lang;
  html.dir = isRTL(lang) ? 'rtl' : 'ltr';
}

function translatePage(lang) {
  const t = translations[lang] || translations[DEFAULT_LANG];
  // Meta
  document.title = t.meta_title;
  const desc = document.querySelector('meta[name="description"]');
  if (desc) desc.setAttribute('content', t.meta_description);
  // Text bindings
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (t[key] !== undefined) {
      el.textContent = t[key];
    }
  });
}

function setActiveLang(lang) {
  saveLang(lang);
  applyDirection(lang);
  translatePage(lang);
}

function initLanguage() {
  const current = getSavedLang();
  setActiveLang(current);
  // Toggle button(s)
  document.querySelectorAll('[data-lang-toggle]')?.forEach(btn => {
    btn.addEventListener('click', () => {
      const next = (getSavedLang() === 'en') ? 'ar' : 'en';
      setActiveLang(next);
      // Update toggle labels live
      document.querySelectorAll('[data-i18n="lang_toggle"]').forEach(el => {
        el.textContent = translations[next].lang_toggle;
      });
    });
  });
}

// Intersection-based entrance animations
function initAnimations() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-up');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });

  document.querySelectorAll('[data-animate]')
    .forEach(el => observer.observe(el));
}

// Init
document.addEventListener('DOMContentLoaded', () => {
  initLanguage();
  initAnimations();
  initExpanders();
  initContactForm();
});

// Expanders for services
function initExpanders() {
  document.querySelectorAll('[data-expander]')?.forEach(card => {
    const panel = card.querySelector('.expand-panel');
    card.addEventListener('click', (e) => {
      const expanded = card.getAttribute('aria-expanded') === 'true';
      const next = !expanded;
      card.setAttribute('aria-expanded', String(next));
      if (panel) {
        panel.classList.toggle('open', next);
      }
    });
  });
}

// Contact form validation and submission handler
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = form.querySelector('[name="name"]').value.trim();
    const phone = form.querySelector('[name="phone"]').value.trim();
    const email = form.querySelector('[name="email"]').value.trim();
    const message = form.querySelector('[name="message"]').value.trim();

    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const phoneOk = /[0-9]{6,}/.test(phone);
    if (!name || !(emailOk || phoneOk) || message.length < 10) {
      alert('Please provide a valid name, contact (email or phone), and a message of at least 10 characters.');
      return;
    }
    // Simulate submission
    form.reset();
    alert('Thank you, your message has been sent.');
  });
}


