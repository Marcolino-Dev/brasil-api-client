// Brasil API Dashboard — Frontend Application
(function() {
  'use strict';

  // ============================================
  // Configuration & State
  // ============================================
  const API_BASE = '/api';
  const state = {
    currentCategory: 'cep'
  };

  // Category configurations (only remaining 7 categories)
  const CATEGORIES = {
    cep: { icon: 'location', color: 'var(--cep-color)' },
    cnpj: { icon: 'building', color: 'var(--cnpj-color)' },
    banks: { icon: 'bank', color: 'var(--banks-color)' },
    ddd: { icon: 'phone', color: 'var(--ddd-color)' },
    holidays: { icon: 'calendar', color: 'var(--holidays-color)' },
    cpf: { icon: 'user', color: 'var(--cpf-color)' },
    status: { icon: 'activity', color: 'var(--status-color)' }
  };

  // ============================================
  // Utility Functions
  // ============================================
  const $ = (selector, context = document) => context.querySelector(selector);
  const $$ = (selector, context = document) => Array.from(context.querySelectorAll(selector));

  function formatCep(value) {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length > 5) {
      return numbers.slice(0, 5) + '-' + numbers.slice(5, 8);
    }
    return numbers;
  }

  function formatCnpj(value) {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length > 12) {
      return numbers.slice(0, 2) + '.' + numbers.slice(2, 5) + '.' + numbers.slice(5, 8) + '/' + numbers.slice(8, 12) + '-' + numbers.slice(12, 14);
    } else if (numbers.length > 8) {
      return numbers.slice(0, 2) + '.' + numbers.slice(2, 5) + '.' + numbers.slice(5, 8) + '/' + numbers.slice(8, 12);
    } else if (numbers.length > 5) {
      return numbers.slice(0, 2) + '.' + numbers.slice(2, 5) + '.' + numbers.slice(5, 8);
    } else if (numbers.length > 2) {
      return numbers.slice(0, 2) + '.' + numbers.slice(2, 5);
    }
    return numbers;
  }

  function formatCpf(value) {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length > 9) {
      return numbers.slice(0, 3) + '.' + numbers.slice(3, 6) + '.' + numbers.slice(6, 9) + '-' + numbers.slice(9, 11);
    } else if (numbers.length > 6) {
      return numbers.slice(0, 3) + '.' + numbers.slice(3, 6) + '.' + numbers.slice(6, 9);
    } else if (numbers.length > 3) {
      return numbers.slice(0, 3) + '.' + numbers.slice(3, 6);
    }
    return numbers;
  }

  function showToast(message, type = 'info') {
    const container = $('#toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    const icons = {
      success: '<polyline points="20 6 9 17 4 12"/>',
      error: '<circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>',
      warning: '<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>',
      info: '<circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>'
    };
    toast.innerHTML = `
      <svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
        ${icons[type] || icons.info}
      </svg>
      <span class="toast-message">${message}</span>
      <button class="toast-close" aria-label="Fechar">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
    `;
    toast.querySelector('.toast-close').addEventListener('click', () => toast.remove());
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 5000);
  }

  function setLoading(button, loading = true) {
    if (loading) {
      button.disabled = true;
      button.classList.add('loading');
      button.dataset.originalText = button.innerHTML;
    } else {
      button.disabled = false;
      button.classList.remove('loading');
    }
  }

  async function apiRequest(endpoint) {
    try {
      const response = await fetch(`${API_BASE}${endpoint}`);
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || `Erro ${response.status}`);
      }
      return data;
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Erro de conexão. Verifique se o servidor está rodando.');
      }
      throw error;
    }
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // ============================================
  // Render Functions
  // ============================================
  function renderCepResult(data, version) {
    const panel = $('#result-cep');
    const versionLabels = { v1: 'Básico', v2: 'Com Geolocalização', v3: 'Detalhado' };
    panel.innerHTML = `
      <div class="result-header">
        <h3 class="result-title">CEP ${escapeHtml(data.cepa || data.cep)} <span class="result-badge badge-info">${versionLabels[version]}</span></h3>
      </div>
      <div class="result-content">
        <div class="result-grid">
          <div class="result-item">
            <span class="result-label">Logradouro</span>
            <span class="result-value">${escapeHtml(data.street || '-')}</span>
          </div>
          <div class="result-item">
            <span class="result-label">Bairro</span>
            <span class="result-value">${escapeHtml(data.neighborhood || '-')}</span>
          </div>
          <div class="result-item">
            <span class="result-label">Cidade</span>
            <span class="result-value">${escapeHtml(data.city || '-')}</span>
          </div>
          <div class="result-item">
            <span class="result-label">Estado</span>
            <span class="result-value">${escapeHtml(data.state || '-')}</span>
          </div>
          ${data.location ? `
          <div class="result-item">
            <span class="result-label">Latitude</span>
            <span class="result-value">${escapeHtml(data.location.coordinates?.latitude || '-')}</span>
          </div>
          <div class="result-item">
            <span class="result-label">Longitude</span>
            <span class="result-value">${escapeHtml(data.location.coordinates?.longitude || '-')}</span>
          </div>
          ` : ''}
          ${data.timezoneName ? `
          <div class="result-item">
            <span class="result-label">Fuso Horário</span>
            <span class="result-value">${escapeHtml(data.timezoneName)}</span>
          </div>
          ` : ''}
          ${data.ibge ? `
          <div class="result-item">
            <span class="result-label">IBGE Cidade</span>
            <span class="result-value">${escapeHtml(data.ibge.city || '-')}</span>
          </div>
          <div class="result-item">
            <span class="result-label">IBGE Estado</span>
            <span class="result-value">${escapeHtml(data.ibge.state || '-')}</span>
          </div>
          ` : ''}
          <div class="result-item">
            <span class="result-label">Fonte</span>
            <span class="result-value">${escapeHtml(data.service || '-')}</span>
          </div>
        </div>
      </div>
    `;
    panel.classList.remove('hidden');
  }

  function renderCnpjResult(data) {
    const panel = $('#result-cnpj');
    panel.innerHTML = `
      <div class="result-header">
        <h3 class="result-title">${escapeHtml(data.razao_social || data.nome || 'CNPJ Consultado')}</h3>
        <span class="result-badge badge-success">${escapeHtml(data.cnpj)}</span>
      </div>
      <div class="result-content">
        <div class="result-grid">
          <div class="result-item" style="grid-column: 1 / -1;">
            <span class="result-label">Razão Social</span>
            <span class="result-value">${escapeHtml(data.razao_social || '-')}</span>
          </div>
          ${data.nome_fantasia ? `
          <div class="result-item" style="grid-column: 1 / -1;">
            <span class="result-label">Nome Fantasia</span>
            <span class="result-value">${escapeHtml(data.nome_fantasia)}</span>
          </div>
          ` : ''}
          <div class="result-item">
            <span class="result-label">Situação</span>
            <span class="result-value">${escapeHtml(data.descricao_situacao_cadastral || data.situacao || '-')}</span>
          </div>
          <div class="result-item">
            <span class="result-label">Data Abertura</span>
            <span class="result-value">${escapeHtml(data.data_inicio_atividade || '-')}</span>
          </div>
          <div class="result-item">
            <span class="result-label">Capital Social</span>
            <span class="result-value">${data.capital_social ? 'R$ ' + Number(data.capital_social).toLocaleString('pt-BR', {minimumFractionDigits: 2}) : '-'}</span>
          </div>
          <div class="result-item">
            <span class="result-label">Porte</span>
            <span class="result-value">${escapeHtml(data.porte || '-')}</span>
          </div>
          <div class="result-item" style="grid-column: 1 / -1;">
            <span class="result-label">Endereço</span>
            <span class="result-value">
              ${escapeHtml(data.logradouro || '')} ${escapeHtml(data.numero || '')}${data.complemento ? ', ' + escapeHtml(data.complemento) : ''}<br>
              ${escapeHtml(data.bairro || '')} - ${escapeHtml(data.municipio || '')}/${escapeHtml(data.uf || '')}<br>
              CEP: ${escapeHtml(data.cep || '-')}
            </span>
          </div>
          ${data.cnae_fiscal_descricao ? `
          <div class="result-item" style="grid-column: 1 / -1;">
            <span class="result-label">Atividade Principal</span>
            <span class="result-value">${escapeHtml(data.cnae_fiscal_descricao)}</span>
          </div>
          ` : ''}
          ${data.cnaes_secundarios && data.cnaes_secundarios.length ? `
          <div class="result-item" style="grid-column: 1 / -1;">
            <span class="result-label">Atividades Secundárias</span>
            <span class="result-value">${data.cnaes_secundarios.map(c => escapeHtml(c.descricao)).join('<br>')}</span>
          </div>
          ` : ''}
          ${data.qsa && data.qsa.length ? `
          <div class="result-item" style="grid-column: 1 / -1;">
            <span class="result-label">Quadro Societário</span>
            <span class="result-value">${data.qsa.map(s => `${escapeHtml(s.nome)} (${escapeHtml(s.qual)})`).join('<br>')}</span>
          </div>
          ` : ''}
        </div>
      </div>
    `;
    panel.classList.remove('hidden');
  }

  function renderBanksList(data) {
    const panel = $('#result-banks');
    panel.innerHTML = `
      <div class="result-header">
        <h3 class="result-title">Bancos Brasileiros</h3>
        <span class="result-badge badge-info">${data.length} bancos</span>
      </div>
      <div class="result-content">
        <div class="banks-list">
          ${data.map(bank => `
            <div class="bank-card">
              <div class="bank-card-header">
                ${bank.logo_url ? `<img src="${escapeHtml(bank.logo_url)}" alt="" class="bank-card-logo" loading="lazy">` : '<div class="bank-card-logo" style="display:flex;align-items:center;justify-content:center;color:var(--text-muted);"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/><path d="M6 5v14"/><path d="M18 5v14"/></svg></div>'}
                <span class="bank-card-code">${escapeHtml(bank.code || '—')}</span>
                <span class="bank-card-name">${escapeHtml(bank.name)}</span>
              </div>
              <div class="bank-card-ispb">ISPB: ${escapeHtml(bank.ispb || '-')}</div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
    panel.classList.remove('hidden');
  }

  function renderBankByCode(data) {
    const panel = $('#result-banks');
    panel.innerHTML = `
      <div class="result-header">
        <h3 class="result-title">${escapeHtml(data.name)}</h3>
        <span class="result-badge badge-success">Código: ${escapeHtml(data.code)}</span>
      </div>
      <div class="result-content">
        <div class="result-grid">
          <div class="result-item">
            <span class="result-label">ISPB</span>
            <span class="result-value">${escapeHtml(data.ispb || '-')}</span>
          </div>
          <div class="result-item">
            <span class="result-label">Nome Completo</span>
            <span class="result-value">${escapeHtml(data.fullName || '-')}</span>
          </div>
        </div>
      </div>
    `;
    panel.classList.remove('hidden');
  }

  function renderDddResult(data) {
    const panel = $('#result-ddd');
    panel.innerHTML = `
      <div class="result-header">
        <h3 class="result-title">DDD ${escapeHtml(data.ddd)}</h3>
        <span class="result-badge badge-info">${escapeHtml(data.state)}</span>
      </div>
      <div class="result-content">
        <div class="result-grid">
          <div class="result-item" style="grid-column: 1 / -1;">
            <span class="result-label">Cidades (${data.cities.length})</span>
            <span class="result-value">
              ${data.cities.map(city => `<span style="display:inline-block;margin:2px 8px 2px 0;padding:6px 12px;background:var(--brand-blue-light);color:var(--brand-blue);border-radius:var(--radius-sm);font-size:var(--fs-sm);">${escapeHtml(city)}</span>`).join('')}
            </span>
          </div>
        </div>
      </div>
    `;
    panel.classList.remove('hidden');
  }

  function renderHolidaysResult(data, year) {
    const panel = $('#result-holidays');
    const today = new Date().toISOString().split('T')[0];
    panel.innerHTML = `
      <div class="result-header">
        <h3 class="result-title">Feriados Nacionais - ${year}</h3>
        <span class="result-badge badge-info">${data.length} feriados</span>
      </div>
      <div class="result-content">
        <div class="result-table">
          <table>
            <thead>
              <tr>
                <th>Data</th>
                <th>Nome</th>
                <th>Tipo</th>
              </tr>
            </thead>
            <tbody>
              ${data.map(holiday => {
                const isPast = holiday.date < today;
                return `
                <tr style="${isPast ? 'opacity:0.55;' : ''}">
                  <td>${new Date(holiday.date + 'T00:00:00').toLocaleDateString('pt-BR')}</td>
                  <td>${escapeHtml(holiday.name)}</td>
                  <td>${escapeHtml(holiday.type)}</td>
                </tr>
              `}).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
    panel.classList.remove('hidden');
  }

  function renderCpfResult(data) {
    const panel = $('#result-cpf');
    const isValid = data.valid === true || data.valido === true;
    panel.innerHTML = `
      <div class="result-header">
        <h3 class="result-title">Validação de CPF</h3>
        <span class="result-badge ${isValid ? 'badge-success' : 'badge-danger'}">${isValid ? 'VÁLIDO' : 'INVÁLIDO'}</span>
      </div>
      <div class="result-content">
        <div class="result-grid">
          <div class="result-item">
            <span class="result-label">CPF</span>
            <span class="result-value">${escapeHtml(data.cpf || '-')}</span>
          </div>
          <div class="result-item">
            <span class="result-label">Formato</span>
            <span class="result-value">${escapeHtml(data.formatado || data.cpf_formatado || '-')}</span>
          </div>
          <div class="result-item" style="grid-column: 1 / -1;">
            <span class="result-label">Observação</span>
            <span class="result-value">
              ${isValid
                ? 'O CPF possui dígitos verificadores válidos. <strong>Nota:</strong> Esta é apenas uma validação algorítmica, não consulta bases oficiais da Receita Federal.'
                : 'O CPF não passou na validação dos dígitos verificadores.'}
            </span>
          </div>
        </div>
      </div>
    `;
    panel.classList.remove('hidden');
  }

  function renderStatusResult(data) {
    const panel = $('#result-status');
    const isOk = data.status === 'ok';
    panel.innerHTML = `
      <div class="result-header">
        <h3 class="result-title">Status da Brasil API</h3>
        <span class="result-badge ${isOk ? 'badge-success' : 'badge-danger'}">${isOk ? 'OPERACIONAL' : 'INDISPONÍVEL'}</span>
      </div>
      <div class="result-content">
        <div class="result-grid">
          <div class="result-item">
            <span class="result-label">Status</span>
            <span class="result-value">${escapeHtml(data.status || '-')}</span>
          </div>
          <div class="result-item">
            <span class="result-label">Ambiente</span>
            <span class="result-value">${escapeHtml(data.environment || '-')}</span>
          </div>
          <div class="result-item">
            <span class="result-label">Data</span>
            <span class="result-value">${data.date ? new Date(data.date).toLocaleString('pt-BR') : '-'}</span>
          </div>
          <div class="result-item">
            <span class="result-label">Região AWS</span>
            <span class="result-value">${escapeHtml(data.aws?.region || '-')}</span>
          </div>
          ${data.aws?.function_version ? `
          <div class="result-item">
            <span class="result-label">Versão</span>
            <span class="result-value">${escapeHtml(data.aws.function_version)}</span>
          </div>
          ` : ''}
        </div>
      </div>
    `;
    panel.classList.remove('hidden');
  }

  function renderError(panelId, message) {
    const panel = $(`#${panelId}`);
    panel.innerHTML = `
      <div class="result-header">
        <h3 class="result-title">Erro</h3>
        <span class="result-badge badge-danger">Falha na consulta</span>
      </div>
      <div class="result-content">
        <div class="result-grid">
          <div class="result-item" style="grid-column: 1 / -1;">
            <span class="result-value" style="color:var(--color-danger);">${escapeHtml(message)}</span>
          </div>
        </div>
      </div>
    `;
    panel.classList.remove('hidden');
  }

  function renderEmpty(panelId, message) {
    const panel = $(`#${panelId}`);
    panel.innerHTML = `
      <div class="empty-state">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
          <circle cx="11" cy="11" r="8"/>
          <line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <p>${escapeHtml(message)}</p>
      </div>
    `;
    panel.classList.remove('hidden');
  }

  // ============================================
  // Category Navigation
  // ============================================
  function switchCategory(category) {
    // Update nav buttons
    $$('.category-btn').forEach(btn => {
      const isActive = btn.dataset.category === category;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-selected', isActive);
    });

    // Update panels
    $$('.panel').forEach(panel => {
      panel.classList.toggle('active', panel.id === `panel-${category}`);
    });

    state.currentCategory = category;
  }

  // ============================================
  // Event Handlers
  // ============================================
  async function handleCepSearch(e) {
    e.preventDefault();
    const input = $('#cep-input');
    const version = $('#cep-version').value;
    const cep = input.value.replace(/\D/g, '');

    if (!cep || cep.length !== 8) {
      showToast('Digite um CEP válido (8 dígitos)', 'warning');
      input.focus();
      return;
    }

    const btn = $('#btn-cep');
    setLoading(btn, true);
    $('#result-cep').classList.add('hidden');

    try {
      const data = await apiRequest(`/cep/${version}/${cep}`);
      renderCepResult(data, version);
      showToast('CEP encontrado!', 'success');
    } catch (error) {
      renderError('result-cep', error.message);
      showToast(error.message, 'error');
    } finally {
      setLoading(btn, false);
    }
  }

  async function handleCnpjSearch(e) {
    e.preventDefault();
    const input = $('#cnpj-input');
    const cnpj = input.value.replace(/\D/g, '');

    if (!cnpj || cnpj.length !== 14) {
      showToast('Digite um CNPJ válido (14 dígitos)', 'warning');
      input.focus();
      return;
    }

    const btn = $('#btn-cnpj');
    setLoading(btn, true);
    $('#result-cnpj').classList.add('hidden');

    try {
      const data = await apiRequest(`/cnpj/${cnpj}`);
      renderCnpjResult(data);
      showToast('CNPJ encontrado!', 'success');
    } catch (error) {
      renderError('result-cnpj', error.message);
      showToast(error.message, 'error');
    } finally {
      setLoading(btn, false);
    }
  }

  async function handleBanksList() {
    const btn = $('#btn-banks-list');
    setLoading(btn, true);
    $('#result-banks').classList.add('hidden');

    try {
      const data = await apiRequest('/banks');
      renderBanksList(data);
      showToast(`${data.length} bancos carregados`, 'success');
    } catch (error) {
      renderError('result-banks', error.message);
      showToast(error.message, 'error');
    } finally {
      setLoading(btn, false);
    }
  }

  async function handleBankByCode(e) {
    e.preventDefault();
    const input = $('#bank-code-input');
    const code = input.value;

    if (!code) {
      showToast('Digite um código de banco', 'warning');
      input.focus();
      return;
    }

    const btn = $('#btn-bank-by-code');
    setLoading(btn, true);
    $('#result-banks').classList.add('hidden');

    try {
      const data = await apiRequest(`/banks/${code}`);
      renderBankByCode(data);
      showToast('Banco encontrado!', 'success');
    } catch (error) {
      renderError('result-banks', error.message);
      showToast(error.message, 'error');
    } finally {
      setLoading(btn, false);
    }
  }

  async function handleDddSearch(e) {
    e.preventDefault();
    const input = $('#ddd-input');
    const ddd = input.value.replace(/\D/g, '');

    if (!ddd || ddd.length !== 2) {
      showToast('Digite um DDD válido (2 dígitos)', 'warning');
      input.focus();
      return;
    }

    const btn = $('#btn-ddd');
    setLoading(btn, true);
    $('#result-ddd').classList.add('hidden');

    try {
      const data = await apiRequest(`/ddd/${ddd}`);
      renderDddResult(data);
      showToast(`${data.cities.length} cidades encontradas`, 'success');
    } catch (error) {
      renderError('result-ddd', error.message);
      showToast(error.message, 'error');
    } finally {
      setLoading(btn, false);
    }
  }

  async function handleHolidaysSearch(e) {
    e.preventDefault();
    const input = $('#holidays-year');
    const year = input.value;

    if (!year || year < 2000 || year > 2050) {
      showToast('Digite um ano válido entre 2000 e 2050', 'warning');
      input.focus();
      return;
    }

    const btn = $('#btn-holidays');
    setLoading(btn, true);
    $('#result-holidays').classList.add('hidden');

    try {
      const data = await apiRequest(`/holidays/${year}`);
      renderHolidaysResult(data, year);
      showToast(`${data.length} feriados carregados`, 'success');
    } catch (error) {
      renderError('result-holidays', error.message);
      showToast(error.message, 'error');
    } finally {
      setLoading(btn, false);
    }
  }

  async function handleCpfSearch(e) {
    e.preventDefault();
    const input = $('#cpf-input');
    const cpf = input.value.replace(/\D/g, '');

    if (!cpf || cpf.length !== 11) {
      showToast('Digite um CPF válido (11 dígitos)', 'warning');
      input.focus();
      return;
    }

    const btn = $('#btn-cpf');
    setLoading(btn, true);
    $('#result-cpf').classList.add('hidden');

    try {
      const data = await apiRequest(`/cpf/${cpf}`);
      renderCpfResult(data);
      showToast(data.valid ? 'CPF válido!' : 'CPF inválido', data.valid ? 'success' : 'warning');
    } catch (error) {
      renderError('result-cpf', error.message);
      showToast(error.message, 'error');
    } finally {
      setLoading(btn, false);
    }
  }

  async function handleStatusCheck() {
    const btn = $('#btn-status');
    setLoading(btn, true);
    $('#result-status').classList.add('hidden');

    try {
      const data = await apiRequest('/status');
      renderStatusResult(data);
      showToast(data.status === 'ok' ? 'API operacional' : 'API indisponível', data.status === 'ok' ? 'success' : 'error');
    } catch (error) {
      renderError('result-status', error.message);
      showToast(error.message, 'error');
    } finally {
      setLoading(btn, false);
    }
  }

  // ============================================
  // Input Formatters
  // ============================================
  function setupInputFormatters() {
    $('#cep-input').addEventListener('input', (e) => {
      e.target.value = formatCep(e.target.value);
    });

    $('#cnpj-input').addEventListener('input', (e) => {
      e.target.value = formatCnpj(e.target.value);
    });

    $('#cpf-input').addEventListener('input', (e) => {
      e.target.value = formatCpf(e.target.value);
    });

    $('#ddd-input').addEventListener('input', (e) => {
      e.target.value = e.target.value.replace(/\D/g, '').slice(0, 2);
    });

    $('#bank-code-input').addEventListener('input', (e) => {
      e.target.value = e.target.value.replace(/\D/g, '');
    });
  }

  // ============================================
  // Event Listeners Setup
  // ============================================
  function setupEventListeners() {
    // Theme toggle
    const themeToggle = $('#theme-toggle');
    const savedTheme = localStorage.getItem('theme');

    function applyTheme(theme) {
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('theme', theme);
    }

    // Initialize theme
    if (savedTheme) {
      applyTheme(savedTheme);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      applyTheme('dark');
    }

    themeToggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      applyTheme(current === 'dark' ? 'light' : 'dark');
    });

    // Category navigation
    $$('.category-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        switchCategory(btn.dataset.category);
      });
    });

    // CEP
    $('#form-cep').addEventListener('submit', handleCepSearch);

    // CNPJ
    $('#form-cnpj').addEventListener('submit', handleCnpjSearch);

    // Banks
    $('#btn-banks-list').addEventListener('click', handleBanksList);
    $('#form-bank-code').addEventListener('submit', handleBankByCode);

    // DDD
    $('#form-ddd').addEventListener('submit', handleDddSearch);

    // Holidays
    $('#form-holidays').addEventListener('submit', handleHolidaysSearch);

    // CPF
    $('#form-cpf').addEventListener('submit', handleCpfSearch);

    // Status
    $('#btn-status').addEventListener('click', handleStatusCheck);
  }

  // ============================================
  // Initialization
  // ============================================
  function init() {
    // Set current year
    const currentYear = new Date().getFullYear();
    $('#current-year').textContent = currentYear;
    $('#holidays-year').value = currentYear;

    setupInputFormatters();
    setupEventListeners();

    // Check server health on load
    fetch('/health')
      .then(r => r.json())
      .then(data => {
        const indicator = $('#status-indicator');
        if (data.status === 'ok') {
          indicator.classList.add('connected');
          indicator.classList.remove('error');
          indicator.querySelector('.status-text').textContent = 'Conectado ao servidor local';
          showToast('Conectado ao servidor local', 'success');
        } else {
          indicator.classList.add('error');
          indicator.classList.remove('connected');
          indicator.querySelector('.status-text').textContent = 'Servidor indisponível';
        }
      })
      .catch(() => {
        const indicator = $('#status-indicator');
        indicator.classList.add('error');
        indicator.classList.remove('connected');
        indicator.querySelector('.status-text').textContent = 'Erro ao conectar ao servidor';
        showToast('Erro ao conectar ao servidor. Verifique se está rodando na porta 3000.', 'error');
      });

    console.log('Brasil API Dashboard initialized');
  }

  // Start when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();