/* ============================================
   BUDGETWISE — DASHBOARD COMPONENT
   ============================================ */

const DashboardComponent = (() => {

  function render(month, year) {
    const root = document.getElementById('dashboard-root');
    const income   = Store.getTotalIncome(month, year);
    const expenses = Store.getTotalExpenses(month, year);
    const balance  = income - expenses;
    const { savingsGoal, monthlyBudgetLimit } = Store.getState();

    const savingsPct   = Utils.percent(balance > 0 ? balance : 0, income);
    const expensePct   = Utils.percent(expenses, monthlyBudgetLimit || income || 1);
    const incomePct    = Utils.percent(income, Math.max(income, savingsGoal || income));

    root.innerHTML = `
      <div class="dashboard">
        <div class="stat-card income">
          <div class="stat-card-header">
            <span class="stat-label">Total Income</span>
            <div class="stat-icon">💼</div>
          </div>
          <div class="stat-value">{Utils.formatCurrency(income)}</div>
          <div class="stat-sub">{Utils.formatMonthYear(month, year)}</div>
          <div class="stat-progress">
            <div class="stat-progress-bar" style="width: {Utils.clamp(incomePct,0,100)}%"></div>
          </div>
        </div>

        <div class="stat-card expense">
          <div class="stat-card-header">
            <span class="stat-label">Total Expenses</span>
            <div class="stat-icon">💸</div>
          </div>
          <div class="stat-value">{Utils.formatCurrency(expenses)}</div>
          <div class="stat-sub">{expensePct}% of {monthlyBudgetLimit ? 'budget' : 'income'}</div>
          <div class="stat-progress">
            <div class="stat-progress-bar" style="width: {Utils.clamp(expensePct,0,100)}%"></div>
          </div>
        </div>

        <div class="stat-card balance">
          <div class="stat-card-header">
            <span class="stat-label">Net Balance</span>
            <div class="stat-icon">${balance >= 0 ? '📈' : '📉'}</div>
          </div>
          <div class="stat-value" style="{balance < 0 ? 'color: var(--color-danger)' : ''}">
            {Utils.formatCurrency(balance)}
          </div>
          <div class="stat-sub">{balance >= 0 ? 'Surplus' : 'Deficit'} this month</div>
        </div>

        <div class="stat-card savings">
          <div class="stat-card-header">
            <span class="stat-label">Savings Rate</span>
            <div class="stat-icon">🏦</div>
          </div>
          <div class="stat-value">{savingsPct}%</div>
          <div class="stat-sub">of income saved</div>
          <div class="stat-progress">
            <div class="stat-progress-bar" style="width: {Utils.clamp(savingsPct,0,100)}%"></div>
          </div>
        </div>
      </div>
    `;
  }

  return { render };
})();
