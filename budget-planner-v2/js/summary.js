/* ============================================
   BUDGETWISE — MONTHLY SUMMARY COMPONENT
   ============================================ */

const SummaryComponent = (() => {

  function render(month, year) {
    const root = document.getElementById('summary-root');
    const categoryData = Store.getExpensesByCategory(month, year);
    const totalIncome   = Store.getTotalIncome(month, year);
    const totalExpenses = Store.getTotalExpenses(month, year);
    const balance       = totalIncome - totalExpenses;
    const { monthlyBudgetLimit } = Store.getState();

    const budgetPct = monthlyBudgetLimit
      ? Utils.percent(totalExpenses, monthlyBudgetLimit)
      : null;

    let budgetStatusClass = 'budget-ok';
    let budgetStatusText  = 'Within Budget';
    if (budgetPct !== null) {
      if (budgetPct >= 100) { budgetStatusClass = 'budget-danger';  budgetStatusText = 'Over Budget!'; }
      else if (budgetPct >= 80) { budgetStatusClass = 'budget-warning'; budgetStatusText = `${budgetPct}% Used`; }
      else { budgetStatusText = `${budgetPct}% Used`; }
    }

    const rows = Object.entries(categoryData)
      .sort((a, b) => b[1] - a[1])
      .map(([key, value]) => {
        const meta = Utils.categoryMeta[key] || { icon: '📌', label: key };
        const pct  = Utils.percent(value, totalExpenses);
        return `
          <tr>
            <td><span class="summary-cat-icon">${meta.icon}</span>${meta.label}</td>
            <td>${pct}%</td>
            <td style="color: var(--color-danger);">${Utils.formatCurrency(value)}</td>
          </tr>
        `;
      }).join('');

    root.innerHTML = `
      <div class="card">
        <div class="section-header">
          <div class="section-title">
            <div class="icon" style="background:var(--color-primary-dim);color:var(--color-primary);">📋</div>
            Monthly Summary
          </div>
          <span style="font-size:0.8rem;color:var(--text-muted);">${Utils.formatMonthYear(month, year)}</span>
        </div>

        ${rows ? `
          <table class="summary-table">
            <thead>
              <tr>
                <th>Category</th>
                <th>% Share</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              ${rows}
              <tr class="summary-total-row">
                <td>Total Expenses</td>
                <td>100%</td>
                <td style="color:var(--color-danger);">${Utils.formatCurrency(totalExpenses)}</td>
              </tr>
              <tr class="summary-total-row">
                <td>Total Income</td>
                <td></td>
                <td style="color:var(--color-primary);">${Utils.formatCurrency(totalIncome)}</td>
              </tr>
              <tr class="summary-total-row">
                <td>Net Balance</td>
                <td></td>
                <td style="color:${balance >= 0 ? 'var(--color-primary)' : 'var(--color-danger)'};">
                  ${Utils.formatCurrency(balance)}
                </td>
              </tr>
            </tbody>
          </table>
        ` : `<div class="summary-empty">No data for this month yet.<br>Add income and expenses to see your summary.</div>`}

        <!-- Budget Limit Setting -->
        <div class="summary-budget-row">
          <div style="display:flex;align-items:center;gap:8px;">
            <span style="font-size:0.82rem;color:var(--text-secondary);">Monthly Budget Limit:</span>
            <div class="budget-limit-input-wrap">
              <span style="color:var(--text-muted);font-size:0.9rem;">$</span>
              <input type="number" class="budget-limit-input" id="budget-limit-input"
                placeholder="Set limit"
                value="${monthlyBudgetLimit || ''}"
                min="0" step="100" />
            </div>
          </div>
          ${budgetPct !== null
            ? `<span class="budget-status ${budgetStatusClass}">${budgetStatusText}</span>`
            : `<span style="font-size:0.75rem;color:var(--text-muted);">No limit set</span>`
          }
        </div>
      </div>
    `;

    document.getElementById('budget-limit-input').addEventListener('change', e => {
      Store.setBudgetLimit(e.target.value);
    });
  }

  return { render };
})();
