/* ============================================
   BUDGETWISE — INCOME COMPONENT
   ============================================ */

const IncomeComponent = (() => {
  let activeMonth, activeYear;

  function render(month, year) {
    activeMonth = month;
    activeYear  = year;
    const root = document.getElementById('income-root');

    root.innerHTML = `
      <div class="card">
        <div class="section-header">
          <div class="section-title">
            <div class="icon income-section-icon">💼</div>
            Income Entries
          </div>
          <span class="badge badge-income">${getMonthIncomes().length} records</span>
        </div>

        <!-- Add Income Form -->
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Source</label>
            <select class="form-select" id="income-source">
              ${Object.entries(Utils.incomeMeta).map(([k,v]) =>
                `<option value="${k}">${v.icon} ${v.label}</option>`
              ).join('')}
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Amount ($)</label>
            <input type="number" class="form-input" id="income-amount"
              placeholder="0.00" min="0" step="0.01" />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Description</label>
            <input type="text" class="form-input" id="income-desc"
              placeholder="e.g. Monthly salary" maxlength="40" />
          </div>
          <div class="form-group">
            <label class="form-label">Date</label>
            <input type="date" class="form-input" id="income-date"
              value="${todayString()}" />
          </div>
        </div>

        <button class="btn btn-primary btn-full" id="income-add-btn">
          + Add Income
        </button>

        <!-- Income List -->
        <div style="margin-top: var(--space-lg);">
          <div class="income-list" id="income-list"></div>
        </div>
      </div>
    `;

    renderList(month, year);
    attachEvents();
  }

  function renderList(month, year) {
    activeMonth = month;
    activeYear  = year;
    const list = document.getElementById('income-list');
    if (!list) return;

    const incomes = getMonthIncomes();
    if (!incomes.length) {
      list.innerHTML = `<div class="income-empty">No income entries for this month.<br>Add your first income above ☝️</div>`;
      return;
    }

    list.innerHTML = incomes
      .slice().reverse()
      .map(item => {
        const meta = Utils.incomeMeta[item.source] || { icon: '💵', label: item.source };
        return `
          <div class="income-item">
            <div class="income-item-left">
              <div class="income-item-icon">${meta.icon}</div>
              <div class="income-item-info">
                <div class="income-item-desc">${escapeHtml(item.description || meta.label)}</div>
                <div class="income-item-meta">${meta.label} · ${Utils.formatDate(item.date)}</div>
              </div>
            </div>
            <div class="income-item-right">
              <span class="income-amount">${Utils.formatCurrency(item.amount)}</span>
              <button class="btn btn-danger" data-id="${item.id}" onclick="IncomeComponent.deleteItem(${item.id})">✕</button>
            </div>
          </div>
        `;
      }).join('');
  }

  function attachEvents() {
    document.getElementById('income-add-btn').addEventListener('click', addIncome);
    document.getElementById('income-amount').addEventListener('keydown', e => {
      if (e.key === 'Enter') addIncome();
    });
  }

  function addIncome() {
    const source = document.getElementById('income-source').value;
    const amount = parseFloat(document.getElementById('income-amount').value);
    const desc   = document.getElementById('income-desc').value.trim();
    const date   = document.getElementById('income-date').value;

    if (!amount || amount <= 0) {
      flash('income-amount', 'Please enter a valid amount');
      return;
    }

    Store.addIncome({ source, amount, description: desc || Utils.incomeMeta[source]?.label, date });

    // Reset fields
    document.getElementById('income-amount').value = '';
    document.getElementById('income-desc').value   = '';
    document.getElementById('income-date').value   = todayString();
  }

  function deleteItem(id) {
    Store.deleteIncome(id);
  }

  function getMonthIncomes() {
    return Store.getState().incomes.filter(i => {
      if (!i.date) return true;
      const d = new Date(i.date);
      return d.getMonth() === activeMonth && d.getFullYear() === activeYear;
    });
  }

  function todayString() {
    return new Date().toISOString().slice(0, 10);
  }

  function flash(id, msg) {
    const el = document.getElementById(id);
    if (!el) return;
    el.style.borderColor = 'var(--color-danger)';
    el.style.boxShadow   = '0 0 0 3px var(--color-danger-dim)';
    el.placeholder = msg;
    setTimeout(() => {
      el.style.borderColor = '';
      el.style.boxShadow   = '';
      el.placeholder = '0.00';
    }, 2000);
  }

  function escapeHtml(str) {
    return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }

  return { render, renderList, deleteItem };
})();
