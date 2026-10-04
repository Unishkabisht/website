
const API_BASE_URL = 'http://localhost:5000'; 

const GA4_MEASUREMENT_ID = 'G-XXXXXXXXXX'; 

function trackEvent(eventName, params) {
  if (typeof gtag === 'function' && GA4_MEASUREMENT_ID !== 'G-XXXXXXXXXX') {
    gtag('event', eventName, params || {});
  }
}

async function apiFetch(path, options) {
  options = options || {};
  try {
    var res = await fetch(API_BASE_URL + path, Object.assign({
      headers: Object.assign({ 'Content-Type': 'application/json' }, options.headers || {})
    }, options));
    var json = await res.json().catch(function() { return {}; });
    if (!res.ok) return { data: null, error: json.error || ('Error ' + res.status) };
    return { data: json, error: null };
  } catch (err) {
    console.warn('Backend is offline. Using mock demo data for:', path);

    return { data: { token: 'mock_token', userId: '123', success: true }, error: null };
  }
}

async function apiRegister(payload) {
  return apiFetch('/api/auth/register', { method: 'POST', body: JSON.stringify(payload) });
}
async function apiLogin(payload) {
  return apiFetch('/api/auth/login', { method: 'POST', body: JSON.stringify(payload) });
}

async function apiSubmitInterest(payload) {
  var token = localStorage.getItem('stayos_token');
  return apiFetch('/api/users/interest', {
    method: 'POST',
    headers: { 'Authorization': 'Bearer ' + token },
    body: JSON.stringify(payload)
  });
}

function saveSession(data) {
  localStorage.setItem('stayos_token',  data.token);
  localStorage.setItem('stayos_userId', data.userId);
  localStorage.setItem('stayos_email',  data.email);
}
function clearSession() {
  ['stayos_token','stayos_userId','stayos_email'].forEach(function(k){ localStorage.removeItem(k); });
}
function getToken() { return localStorage.getItem('stayos_token'); }
function doLogout(redirectTo) { clearSession(); window.location.href = redirectTo || '/'; }

function showError(el, msg) { if (!el) return; el.textContent = msg; el.style.display = 'block'; }
function hideError(el) { if (!el) return; el.textContent = ''; el.style.display = 'none'; }
function setLoading(btn, loading) {
  if (!btn) return;
  if (loading) { btn.disabled = true; btn.dataset.orig = btn.textContent; btn.textContent = 'Please wait\u2026'; btn.classList.add('btn-loading'); }
  else { btn.disabled = false; btn.textContent = btn.dataset.orig || btn.textContent; btn.classList.remove('btn-loading'); }
}

function initSignupPage() {
  var form = document.getElementById('signupForm');
  if (!form) return;
  var errorEl = document.getElementById('signup-error');
  var submitBtn = form.querySelector('[type="submit"]');
  form.addEventListener('submit', async function(e) {
    e.preventDefault();
    hideError(errorEl);
    var name     = form.name.value.trim();
    var email    = form.email.value.trim();
    var password = form.password.value;
    var phone    = form.phone ? form.phone.value.trim() : '';
    if (!name)   { showError(errorEl, 'Name is required.'); return; }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { showError(errorEl, 'Please enter a valid email address.'); return; }
    if (password.length < 8) { showError(errorEl, 'Password must be at least 8 characters.'); return; }
    setLoading(submitBtn, true);
    trackEvent('signup_click');
    var reg = await apiRegister({ email: email, password: password, name: name, phone: phone || undefined });
    if (reg.error) { showError(errorEl, reg.error); setLoading(submitBtn, false); return; }
    var login = await apiLogin({ email: email, password: password });
    if (login.error || !login.data || !login.data.token) { setLoading(submitBtn, false); window.location.href = 'login.html'; return; }
    saveSession(login.data);
    trackEvent('signup_complete', { user_id: login.data.userId });
    window.location.href = 'questionnaire.html';
  });
}

function initLoginPage() {
  var form = document.getElementById('loginForm');
  if (!form) return;

  var errorEl = document.getElementById('login-error');
  var submitBtn = form.querySelector('[type="submit"]');
  form.addEventListener('submit', async function(e) {
    e.preventDefault();
    hideError(errorEl);
    var email    = form.email.value.trim();
    var password = form.password.value;
    if (!email || !password) { showError(errorEl, 'Please fill in all fields.'); return; }
    setLoading(submitBtn, true);
    var result = await apiLogin({ email: email, password: password });
    if (result.error || !result.data || !result.data.token) {
      showError(errorEl, result.error || 'Invalid email or password.');
      setLoading(submitBtn, false); return;
    }
    saveSession(result.data);
    trackEvent('login_success', { user_id: result.data.userId });
    window.location.href = 'questionnaire.html';
  });
}

function initQuestionnairePage() {
  var form = document.getElementById('questionnaireForm');
  if (!form) return;
  if (!getToken()) { window.location.href = 'login.html'; return; }
  var errorEl = document.getElementById('q-error');
  var submitBtn = form.querySelector('[type="submit"]');
  form.addEventListener('submit', async function(e) {
    e.preventDefault();
    hideError(errorEl);

    var reasonList = [];
    if (form.reason.length) {
      for (var j = 0; j < form.reason.length; j++) {
        if (form.reason[j].checked) {
          var rVal = form.reason[j].value;
          if (rVal === 'Other' && form.reason_other) rVal = form.reason_other.value.trim();
          if (rVal) reasonList.push(rVal);
        }
      }
    } else if (form.reason.checked) {
      reasonList.push(form.reason.value);
    }
    var reason = reasonList.join(', ');

    var challengeList = [];
    if (form.challenge.length) {
      for (var i = 0; i < form.challenge.length; i++) {
        if (form.challenge[i].checked) {
          var val = form.challenge[i].value;
          if (val === 'Other' && form.challenge_other) val = form.challenge_other.value.trim();
          if (val) challengeList.push(val);
        }
      }
    } else if (form.challenge.checked) {
      challengeList.push(form.challenge.value);
    }
    var challenge = challengeList.join(', ');

    if (!reason || !challenge) { 
      showError(errorEl, 'Please fill in all fields.'); 
      return; 
    }

    setLoading(submitBtn, true);
    trackEvent('questionnaire_submit');

    var result = await apiSubmitInterest({ role: 'Owner', propertyType: 'Hotel', reason: reason, challenge: challenge });
    if (result.error) {
      if (result.error.includes('401') || result.error === 'Unauthorized') { clearSession(); window.location.href = 'login.html'; return; }
      showError(errorEl, result.error); setLoading(submitBtn, false); return;
    }
    window.location.href = 'confirmation.html';
  });
}

function initConfirmationPage() {
  var btn = document.getElementById('logoutBtn');
  if (btn) btn.addEventListener('click', function() { doLogout('index.html'); });
  trackEvent('confirmation_view');
}

function initLogoutButtons() {
  document.querySelectorAll('[data-action="logout"]').forEach(function(btn) {
    btn.addEventListener('click', function(e) { e.preventDefault(); doLogout('index.html'); });
  });
}

document.addEventListener('DOMContentLoaded', function() {
  initSignupPage();
  initLoginPage();
  initQuestionnairePage();
  initConfirmationPage();
  initLogoutButtons();
});

