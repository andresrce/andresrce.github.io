// /assets/contact.js  (versión ES5, sin arrow functions)
(function () {
  'use strict';

  // Elementos
  var form     = document.getElementById('contact-form');
  var statusEl = document.getElementById('form-status');
  var btn      = document.getElementById('c-submit');
  var modal    = document.getElementById('thanks-modal');

  if (!form) { 
    if (window.console && console.warn) console.warn('[contact] No se encontró #contact-form');
    return; 
  }

  // Modal (opcional)
  var hasModal  = !!modal;
  var modalCard = hasModal ? modal.querySelector('.modal-card') : null;
  var closeEls  = hasModal ? modal.querySelectorAll('[data-close]') : [];

  function openModal() {
    if (!hasModal) return;
    modal.hidden = false;
    document.body.classList.add('modal-open');
    var ok = modal.querySelector('.modal-ok');
    if (ok && ok.focus) ok.focus();
    document.addEventListener('keydown', onEsc);
    modal.addEventListener('click', onBackdropClick);
    document.addEventListener('focus', trapFocus, true);
  }
  function closeModal() {
    if (!hasModal) return;
    modal.hidden = true;
    document.body.classList.remove('modal-open');
    document.removeEventListener('keydown', onEsc);
    modal.removeEventListener('click', onBackdropClick);
    document.removeEventListener('focus', trapFocus, true);
    if (btn && btn.focus) btn.focus();
  }
  function onEsc(e) { if (e.key === 'Escape') closeModal(); }
  function onBackdropClick(e) { if (e.target && e.target.getAttribute('data-close') === 'true') closeModal(); }
  function trapFocus(e) {
    if (hasModal && !modal.hidden && !modal.contains(e.target)) {
      e.stopPropagation();
      if (modalCard && modalCard.focus) modalCard.focus();
    }
  }
  for (var i = 0; i < closeEls.length; i++) {
    closeEls[i].addEventListener('click', closeModal);
  }

  // Estado bajo botón
  function setStatus(msg, type) {
    if (!statusEl) return;
    statusEl.textContent = msg;
    statusEl.hidden = false;
    statusEl.setAttribute('data-type', type || 'info');
  }

  // Envío
  form.addEventListener('submit', function (e) {
    e.preventDefault();

    if (form.reportValidity && !form.reportValidity()) return;

    var hp = form.querySelector('input[name="website"]');
    if (hp && hp.value && hp.value.trim() !== '') return;

    var action = form.getAttribute('action');
    if (!action || action.indexOf('ACTION_URL') !== -1) {
      setStatus('Falta configurar el endpoint de Formspree.', 'error');
      if (window.console && console.error) console.error('[contact] ACTION_URL no reemplazado en <form action="">');
      return;
    }

    var fd = new FormData(form);
    if (btn) btn.disabled = true;
    setStatus('Enviando…', 'info');

    // fetch (ES5: presente en navegadores modernos; si necesitas IE, habría que usar XHR)
    fetch(action, {
      method: 'POST',
      body: fd,
      headers: { 'Accept': 'application/json' }
    }).then(function (res) {
      if (res.ok) {
        form.reset();
        if (statusEl) statusEl.hidden = true;
        openModal();
      } else {
        var msg = 'Hubo un problema al enviar. Inténtalo nuevamente.';
        res.json().then(function (data) {
          if (data && data.errors && data.errors.length) {
            msg = data.errors.map(function (e) { return e.message; }).join(' ');
          }
          setStatus(msg, 'error');
        }).catch(function () {
          setStatus(msg, 'error');
        });
      }
    }).catch(function (err) {
      if (window.console && console.error) console.error('[contact] Error de red:', err);
      setStatus('Error de red. Revisa tu conexión e inténtalo otra vez.', 'error');
    }).finally(function () {
      if (btn) btn.disabled = false;
    });
  });

  // Helper de depuración
  window.CONTACT_DEBUG = function () {
    var required = {
      '#contact-form': !!document.getElementById('contact-form'),
      '#c-submit': !!document.getElementById('c-submit'),
      '#form-status': !!document.getElementById('form-status'),
      '#thanks-modal (opcional)': !!document.getElementById('thanks-modal')
    };
    var action = form.getAttribute('action');
    if (console && console.table) console.table(required);
    if (console && console.log) {
      console.log('Action URL:', action);
      console.log('Script cargado:', true);
    }
  };
})();

