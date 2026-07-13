/* ==========================================================================
   PEXXORAA — Main JS (vanilla ES6+, modular, no dependencies)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initLoader();
  initNavbar();
  initThemeSwitcher();
  initMobileNav();
  initRevealOnScroll();
  initCounters();
  initFAQ();
  initTestimonialCarousel();
  initPortfolioFilter();
  initBlogSearch();
  initContactForm();
  initBackToTop();
  initCookieBanner();
  initModals();
  renderDynamicSections();
});

/* ---------- Loader ---------- */
function initLoader(){
  const loader = document.querySelector('.loader');
  if(!loader) return;
  window.addEventListener('load', () => {
    setTimeout(() => loader.classList.add('hidden'), 250);
  });
}

/* ---------- Navbar ---------- */
function initNavbar(){
  const nav = document.querySelector('.navbar');
  if(!nav) return;
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 12);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive:true });
}

function initMobileNav(){
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if(!toggle || !links) return;
  toggle.addEventListener('click', () => {
    links.classList.toggle('open');
    toggle.classList.toggle('active');
  });
  links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    links.classList.remove('open');
  }));
}

/* ---------- Theme switcher ---------- */
function initThemeSwitcher(){
  const btn = document.querySelector('[data-theme-toggle]');
  const root = document.documentElement;
  const stored = window.__pexTheme || null;
  if(stored) root.setAttribute('data-theme', stored);
  if(!btn) return;
  btn.addEventListener('click', () => {
    const isDark = root.getAttribute('data-theme') === 'dark';
    root.setAttribute('data-theme', isDark ? 'light' : 'dark');
    window.__pexTheme = isDark ? 'light' : 'dark';
  });
}

/* ---------- Scroll reveal ---------- */
function initRevealOnScroll(){
  const items = document.querySelectorAll('.reveal');
  if(!items.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold:0.15 });
  items.forEach((el,i) => { el.style.setProperty('--i', i % 8); io.observe(el); });
}

/* ---------- Animated counters ---------- */
function initCounters(){
  const counters = document.querySelectorAll('[data-count]');
  if(!counters.length) return;
  const animate = (el) => {
    const target = parseInt(el.getAttribute('data-count'), 10);
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = 1400;
    const start = performance.now();
    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target) + suffix;
      if(progress < 1) requestAnimationFrame(step);
      else el.textContent = target + suffix;
    };
    requestAnimationFrame(step);
  };
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){ animate(entry.target); io.unobserve(entry.target); }
    });
  }, { threshold:0.6 });
  counters.forEach(c => io.observe(c));
}

/* ---------- FAQ accordion ---------- */
function initFAQ(){
  document.querySelectorAll('.faq-item').forEach(item => {
    const q = item.querySelector('.faq-q');
    const a = item.querySelector('.faq-a');
    if(!q || !a) return;
    q.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      item.closest('.faq-list').querySelectorAll('.faq-item.open').forEach(other => {
        other.classList.remove('open');
        other.querySelector('.faq-a').style.maxHeight = null;
      });
      if(!isOpen){
        item.classList.add('open');
        a.style.maxHeight = a.scrollHeight + 'px';
      }
    });
  });
}

/* ---------- Testimonial carousel ---------- */
function initTestimonialCarousel(){
  const track = document.querySelector('.testimonial-track');
  if(!track) return;
  let index = 0;
  const slides = () => track.querySelectorAll('.testimonial-slide');
  const dots = () => document.querySelectorAll('.t-dot');
  const show = (i) => {
    const s = slides(), d = dots();
    s.forEach((el,idx) => el.classList.toggle('active', idx === i));
    d.forEach((el,idx) => el.classList.toggle('active', idx === i));
    index = i;
  };
  document.addEventListener('click', (e) => {
    if(e.target.matches('.t-dot')){
      show([...dots()].indexOf(e.target));
    }
  });
  setInterval(() => {
    const total = slides().length;
    if(total) show((index + 1) % total);
  }, 6000);
}

/* ---------- Portfolio filter ---------- */
function initPortfolioFilter(){
  const bar = document.querySelector('.filter-bar');
  if(!bar) return;
  bar.addEventListener('click', (e) => {
    const btn = e.target.closest('.filter-btn');
    if(!btn) return;
    bar.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.getAttribute('data-filter');
    document.querySelectorAll('.portfolio-card').forEach(card => {
      const match = filter === 'all' || card.getAttribute('data-tags').includes(filter);
      card.style.display = match ? '' : 'none';
    });
  });
}

/* ---------- Blog search ---------- */
function initBlogSearch(){
  const input = document.querySelector('.blog-search input');
  if(!input) return;
  input.addEventListener('input', () => {
    const term = input.value.toLowerCase().trim();
    document.querySelectorAll('.blog-card').forEach(card => {
      const text = card.textContent.toLowerCase();
      card.style.display = text.includes(term) ? '' : 'none';
    });
  });
}

/* ---------- EmailJS setup ----------
   Credentials below were imported directly from the client-provided
   reference file. They are not invented — but this code has no way to
   confirm they're still active on the EmailJS account, since that
   requires a live test against the account dashboard. If sending fails
   in production, check https://www.emailjs.com dashboard for the
   service/template status first. */
const PEX_EMAILJS_PUBLIC_KEY = 'RxvX8NhHlqFaSSVj1';
const PEX_EMAILJS_SERVICE_ID = 'service_ti3emgb';
const PEX_EMAILJS_TEMPLATE_ID = 'template_c9s2s3u';
const PEX_FALLBACK_EMAIL = 'pexxoraa@gmail.com';

let emailjsReady = false;
let emailjsLoadFailed = false;

function initEmailJS(){
  if(typeof emailjs === 'undefined'){
    // SDK script may still be loading (it's included async on the page);
    // poll briefly before concluding it failed outright.
    let attempts = 0;
    const check = setInterval(() => {
      attempts++;
      if(typeof emailjs !== 'undefined'){
        clearInterval(check);
        try{
          emailjs.init({ publicKey: PEX_EMAILJS_PUBLIC_KEY });
          emailjsReady = true;
        }catch(err){
          console.error('EmailJS init failed:', err);
          emailjsLoadFailed = true;
        }
      } else if(attempts > 25){ // ~5s
        clearInterval(check);
        emailjsLoadFailed = true;
      }
    }, 200);
    return;
  }
  try{
    emailjs.init({ publicKey: PEX_EMAILJS_PUBLIC_KEY });
    emailjsReady = true;
  }catch(err){
    console.error('EmailJS init failed:', err);
    emailjsLoadFailed = true;
  }
}

/* ---------- Contact form validation + EmailJS send ---------- */
function initContactForm(){
  const form = document.querySelector('#contact-form');
  if(!form) return;
  initEmailJS();

  const validators = {
    first_name: v => v.trim().length >= 1 || 'Please enter your first name.',
    last_name: v => v.trim().length >= 1 || 'Please enter your last name.',
    email: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'Enter a valid email address.',
    phone: v => /^[\d\s()+-]{7,}$/.test(v) || 'Please enter a valid phone number.',
    message: v => v.trim().length >= 10 || 'Message should be at least 10 characters.'
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // honeypot spam protection
    const honey = form.querySelector('[name="company_website"]');
    if(honey && honey.value !== ''){ return; }

    let valid = true;
    Object.keys(validators).forEach(name => {
      const input = form.querySelector(`[name="${name}"]`);
      if(!input) return;
      const field = input.closest('.field');
      const result = validators[name](input.value);
      if(result !== true){
        field.classList.add('invalid');
        field.querySelector('.error-msg').textContent = result;
        valid = false;
      } else {
        field.classList.remove('invalid');
      }
    });

    if(!valid){
      showToast('Please fix the highlighted fields.', 'error');
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalLabel = submitBtn.textContent;

    if(emailjsLoadFailed || (typeof emailjs === 'undefined' && !emailjsReady)){
      // Give it one more short window in case the SDK is just slow.
      if(!emailjsLoadFailed){
        submitBtn.textContent = 'Connecting…';
        submitBtn.disabled = true;
        setTimeout(() => {
          submitBtn.textContent = originalLabel;
          submitBtn.disabled = false;
          form.requestSubmit ? form.requestSubmit() : form.dispatchEvent(new Event('submit', { cancelable:true }));
        }, 1500);
        return;
      }
      showToast(`Failed to send. Please email us directly at ${PEX_FALLBACK_EMAIL}`, 'error');
      return;
    }

    // Fold non-template fields (company, budget) into the message body so
    // nothing entered by the visitor is lost, since the EmailJS template
    // only defines {{first_name}} {{last_name}} {{email}} {{phone}}
    // {{service}} {{message}}.
    const companyInput = form.querySelector('[name="company"]');
    const budgetInput = form.querySelector('[name="budget"]');
    let fullMessage = form.querySelector('[name="message"]').value.trim();
    if(companyInput && companyInput.value.trim()) fullMessage += `\n\nCompany: ${companyInput.value.trim()}`;
    if(budgetInput && budgetInput.value) fullMessage += `\nBudget: ${budgetInput.value}`;

    const templateParams = {
      first_name: form.querySelector('[name="first_name"]').value.trim(),
      last_name: form.querySelector('[name="last_name"]').value.trim(),
      email: form.querySelector('[name="email"]').value.trim(),
      phone: form.querySelector('[name="phone"]').value.trim(),
      service: form.querySelector('[name="service"]') ? form.querySelector('[name="service"]').value : '',
      message: fullMessage
    };

    submitBtn.textContent = 'Sending…';
    submitBtn.disabled = true;

    emailjs.send(PEX_EMAILJS_SERVICE_ID, PEX_EMAILJS_TEMPLATE_ID, templateParams)
      .then(() => {
        showToast('Message sent — we\'ll reply within 24 hours.');
        form.reset();
        submitBtn.textContent = originalLabel;
        submitBtn.disabled = false;
      })
      .catch((err) => {
        console.error('EmailJS error:', err);
        showToast(`Failed to send. Please email us directly at ${PEX_FALLBACK_EMAIL}`, 'error');
        submitBtn.textContent = originalLabel;
        submitBtn.disabled = false;
      });
  });
}

/* ---------- Toast ---------- */
function showToast(text, type = 'success'){
  let wrap = document.querySelector('.toast-wrap');
  if(!wrap){
    wrap = document.createElement('div');
    wrap.className = 'toast-wrap';
    document.body.appendChild(wrap);
  }
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = text;
  wrap.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('show'));
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 400);
  }, 4200);
}

/* ---------- Back to top ---------- */
function initBackToTop(){
  const btn = document.querySelector('.back-to-top');
  if(!btn) return;
  window.addEventListener('scroll', () => {
    btn.classList.toggle('show', window.scrollY > 500);
  }, { passive:true });
  btn.addEventListener('click', () => window.scrollTo({ top:0, behavior:'smooth' }));
}

/* ---------- Cookie banner ---------- */
function initCookieBanner(){
  const banner = document.querySelector('.cookie-banner');
  if(!banner || window.__pexCookieAck) return;
  setTimeout(() => banner.classList.add('show'), 1200);
  banner.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', () => {
      banner.classList.remove('show');
      window.__pexCookieAck = true;
    });
  });
}

/* ---------- Modals ---------- */
function initModals(){
  document.querySelectorAll('[data-modal-target]').forEach(trigger => {
    trigger.addEventListener('click', () => {
      const modal = document.querySelector(trigger.getAttribute('data-modal-target'));
      if(modal) modal.classList.add('show');
    });
  });
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if(e.target === overlay || e.target.closest('.modal-close')) overlay.classList.remove('show');
    });
  });
}

/* ---------- Dynamic content rendering ---------- */
function renderDynamicSections(){
  if(typeof PEXXORAA_DATA === 'undefined') return;

  // Portfolio (home preview + full page)
  document.querySelectorAll('[data-render="portfolio"]').forEach(container => {
    const limit = parseInt(container.getAttribute('data-limit') || '999', 10);
    container.innerHTML = PEXXORAA_DATA.portfolio.slice(0, limit).map(p => `
      <div class="portfolio-card reveal" data-tags="${p.tags.join(',').toLowerCase()}">
        <div class="portfolio-thumb">
          <div class="ph" style="position:absolute;inset:0;background:${p.color}"></div>
          <div class="portfolio-overlay">
            <a href="#" class="btn btn-light btn-sm">Visit Project</a>
          </div>
        </div>
        <div class="portfolio-body">
          <span class="portfolio-cat">${p.category}</span>
          <h3>${p.title}</h3>
          <p class="text-muted">${p.desc}</p>
          <div class="tag-row">${p.tags.map(t => `<span class="tag">${t}</span>`).join('')}</div>
        </div>
      </div>
    `).join('');
  });

  // Blog
  document.querySelectorAll('[data-render="blog"]').forEach(container => {
    const limit = parseInt(container.getAttribute('data-limit') || '999', 10);
    container.innerHTML = PEXXORAA_DATA.blog.slice(0, limit).map(b => `
      <article class="blog-card reveal">
        <div class="blog-thumb" style="background:${b.color}"></div>
        <div class="blog-body">
          <div class="blog-meta"><span class="blog-cat">${b.category}</span><span>${b.date}</span></div>
          <h3>${b.title}</h3>
          <p class="text-muted">${b.excerpt}</p>
          <a href="#" class="btn btn-ghost btn-sm" style="margin-top:16px;">Read Article</a>
        </div>
      </article>
    `).join('');
  });

  // Testimonials
  const tTrack = document.querySelector('.testimonial-track');
  if(tTrack){
    tTrack.innerHTML = PEXXORAA_DATA.testimonials.map((t,i) => `
      <div class="testimonial-slide ${i===0 ? 'active':''}">
        <div class="testimonial-card">
          <div class="stars">${'★'.repeat(t.rating)}</div>
          <p class="quote">"${t.quote}"</p>
          <div class="testimonial-person">
            <div class="avatar">${t.name.charAt(0)}</div>
            <div style="text-align:left">
              <div style="font-weight:600">${t.name}</div>
              <div class="text-muted" style="font-size:0.85rem">${t.role}</div>
            </div>
          </div>
        </div>
      </div>
    `).join('');
    const dotsWrap = document.querySelector('.testimonial-dots');
    if(dotsWrap){
      dotsWrap.innerHTML = PEXXORAA_DATA.testimonials.map((_,i) => `<button class="t-dot ${i===0?'active':''}" aria-label="Slide ${i+1}"></button>`).join('');
    }
  }

  // FAQ
  const faqList = document.querySelector('[data-render="faq"]');
  if(faqList){
    faqList.innerHTML = PEXXORAA_DATA.faq.map(f => `
      <div class="faq-item">
        <div class="faq-q"><span>${f.q}</span><span class="plus"></span></div>
        <div class="faq-a"><p>${f.a}</p></div>
      </div>
    `).join('');
    initFAQ();
  }

  // Re-run reveal + filter binding for freshly injected nodes
  initRevealOnScroll();
}
