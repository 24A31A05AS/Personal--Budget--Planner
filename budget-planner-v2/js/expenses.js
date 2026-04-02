/* ============================================
   BUDGETWISE — EXPENSES COMPONENT
   ============================================ */

const ExpenseComponent = (() => {
  let activeMonth, activeYear;

  function render(month, year) {
    activeMonth = month;
    activeYear  = year;
    const root = document.getElementById('expenses-root');

    root.innerHTML = `
      <div class="card">
        <div class="section-header">
          <div class="section-title">
            <div class="icon expense-section-icon">💸</div>
            Expense Entries
          </div>
          <span class="badge badge-expense">{getMonthExpenses().length} records</span>
        </div>

        <!-- Add Expense Form -->
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Category</label>
            <select class="form-select" id="expense-category">
              {Object.entries(Utils.categoryMeta).map(([k,v]) =>
                `<option value="{k}">{v.icon} {v.label}</option>`
              ).join('')}
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Amount </label>
            <input type="number" class="form-input" id="expense-amount"
              placeholder="0.00" min="0" step="0.01" />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Description</label>
            <input type="text" class="form-input" id="expense-desc"
              placeholder="e.g. Grocery run" maxlength="40" />
          </div>
          <div class="form-group">
            <label class="form-label">Date</label>
            <input type="date" class="form-input" id="expense-date"
              value="{todayString()}" />
          </div>
        </div>

        <button class="btn btn-primary btn-full" id="expense-add-btn"
          style="background: var(--color-danger); color: #fff;">
          + Add Expense
        </button>

        <!-- Expense List -->
        <div style="margin-top: var(--space-lg);">
          <div class="expense-list" id="expense-list"></div>
        </div>
      </div>
    `;

    renderList(month, year);
    attachEvents();
  }

  function renderList(month, year) {
    activeMonth = month;
    activeYear  = year;
    const list = document.getElementById('expense-list');
    if (!list) return;

    const expenses = getMonthExpenses();
    if (!expenses.length) {
      list.innerHTML = `<div class="expense-empty">No expenses for this month.<br>Add your first expense above ☝️</div>`;
      return;
    }

    list.innerHTML = expenses
      .slice().reverse()
      .map(item => {
        const meta = Utils.categoryMeta[item.category] || { icon: '📌', label: item.category, color: '#b2bec3' };
        return `
          <div class="expense-item">
            <div class="expense-item-left">
              <div class="expense-item-icon" style="background: {meta.color}20;">
                {meta.icon}
              </div>
              <div class="expense-item-info">
                <div class="expense-item-desc">{escapeHtml(item.description || meta.label)}</div>
                <div class="expense-item-meta">{meta.label} · {Utils.formatDate(item.date)}</div>
              </div>
            </div>
            <div class="expense-item-right">
              <span class="expense-amount">-{Utils.formatCurrency(item.amount)}</span>
              <button class="btn btn-danger" onclick="ExpenseComponent.deleteItem({item.id})">✕</button>
            </div>
          </div>
        `;
      }).join('');
  }

  function attachEvents() {
    document.getElementById('expense-add-btn').addEventListener('click', addExpense);
    document.getElementById('expense-amount').addEventListener('keydown', e => {
      if (e.key === 'Enter') addExpense();
    });
  }

  function addExpense() {
    const category = document.getElementById('expense-category').value;
    const amount   = parseFloat(document.getElementById('expense-amount').value);
    const desc     = document.getElementById('expense-desc').value.trim();
    const date     = document.getElementById('expense-date').value;

    if (!amount || amount <= 0) {
      flash('expense-amount', 'Enter a valid amount');
      return;
    }

    Store.addExpense({ category, amount, description: desc || Utils.categoryMeta[category]?.label, date });

    document.getElementById('expense-amount').value = '';
    document.getElementById('expense-desc').value   = '';
    document.getElementById('expense-date').value   = todayString();
  }

  function deleteItem(id) {
    Store.deleteExpense(id);
  }

  function getMonthExpenses() {
    return Store.getState().expenses.filter(e => {
      if (!e.date) return true;
      const d = new Date(e.date);
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
    const original = el.placeholder;
    el.placeholder = msg;
    setTimeout(() => {
      el.style.borderColor = '';
      el.style.boxShadow   = '';
      el.placeholder = original;
    }, 2000);
  }

  function escapeHtml(str) {
    return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }

  return { render, renderList, deleteItem };
})();
