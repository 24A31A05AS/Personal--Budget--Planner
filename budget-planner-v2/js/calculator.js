/* ============================================
   BUDGETWISE — SAVINGS CALCULATOR COMPONENT
   ============================================ */

const CalculatorComponent = (() => {

  function render() {
    const root = document.getElementById('calculator-root');
    const { savingsGoal } = Store.getState();
    const month = App.getCurrentMonth();
    const year  = App.getCurrentYear();
    const income   = Store.getTotalIncome(month, year);
    const expenses = Store.getTotalExpenses(month, year);

    root.innerHTML = `
      <div class="card">
        <div class="section-header">
          <div class="section-title">
            <div class="icon" style="background:var(--color-warning-dim);color:var(--color-warning);">🏦</div>
            Savings Calculator
          </div>
        </div>

        <div class="calc-grid">
          <div class="form-group">
            <label class="form-label">Monthly Income ($)</label>
            <input type="number" class="form-input" id="calc-income"
              placeholder="Auto-filled" min="0" step="100"
              value="${income || ''}" />
          </div>
          <div class="form-group">
            <label class="form-label">Monthly Expenses ($)</label>
            <input type="number" class="form-input" id="calc-expenses"
              placeholder="Auto-filled" min="0" step="100"
              value="${expenses || ''}" />
          </div>
          <div class="form-group">
            <label class="form-label">Savings Goal ($)</label>
            <input type="number" class="form-input" id="calc-goal"
              placeholder="e.g. 10000" min="0" step="500"
              value="${savingsGoal || ''}" />
          </div>
          <div class="form-group">
            <label class="form-label">Annual Return (%)</label>
            <input type="number" class="form-input" id="calc-rate"
              placeholder="e.g. 7" min="0" max="50" step="0.5"
              value="7" />
          </div>
        </div>

        <button class="btn btn-primary btn-full" id="calc-btn">
          Calculate Savings Plan
        </button>

        <div id="calc-results"></div>
      </div>
    `;

    attachEvents();
    // Auto calculate if data present
    if (income || expenses) calculate();
  }

  function attachEvents() {
    document.getElementById('calc-btn').addEventListener('click', calculate);
    ['calc-income','calc-expenses','calc-goal','calc-rate'].forEach(id => {
      document.getElementById(id).addEventListener('keydown', e => {
        if (e.key === 'Enter') calculate();
      });
    });

    // Save goal to store when changed
    document.getElementById('calc-goal').addEventListener('change', e => {
      Store.setSavingsGoal(e.target.value);
    });
  }

  function calculate() {
    const income   = parseFloat(document.getElementById('calc-income').value)   || 0;
    const expenses = parseFloat(document.getElementById('calc-expenses').value) || 0;
    const goal     = parseFloat(document.getElementById('calc-goal').value)     || 0;
    const rate     = parseFloat(document.getElementById('calc-rate').value)     || 0;

    const monthlySavings = income - expenses;
    const savingsRate    = income > 0 ? Utils.percent(monthlySavings, income) : 0;
    const annualSavings  = monthlySavings * 12;

    // Months to reach goal (simple)
    let monthsToGoal = null;
    if (goal > 0 && monthlySavings > 0) {
      if (rate > 0) {
        // FV = PMT * [(1+r)^n - 1] / r  → solve for n
        const r = (rate / 100) / 12;
        monthsToGoal = Math.ceil(Math.log(1 + (goal * r) / monthlySavings) / Math.log(1 + r));
      } else {
        monthsToGoal = Math.ceil(goal / monthlySavings);
      }
    }

    // 1-year compound projection
    let projected1yr = 0;
    if (monthlySavings > 0) {
      const r = (rate / 100) / 12;
      for (let i = 0; i < 12; i++) {
        projected1yr = (projected1yr + monthlySavings) * (1 + r);
      }
    }

    const rateClass  = savingsRate >= 20 ? 'insight-good'
                     : savingsRate >= 10 ? 'insight-warn'
                     : 'insight-bad';
    const balClass   = monthlySavings >= 0 ? 'insight-good' : 'insight-bad';

    const resultsEl = document.getElementById('calc-results');
    resultsEl.innerHTML = `
      <div class="calc-result-box">
        <div class="calc-result-label">Monthly Savings</div>
        <div class="calc-result-value" style="${monthlySavings < 0 ? 'color:var(--color-danger)' : ''}">
          ${Utils.formatCurrency(monthlySavings)}
        </div>
        <div class="calc-result-sub">
          ${annualSavings >= 0
            ? `${Utils.formatCurrency(annualSavings)} saved per year`
            : 'You are spending more than you earn'}
        </div>
      </div>

      <div class="calc-insights">
        <div class="calc-insight-item">
          <span class="calc-insight-label">💰 Savings Rate</span>
          <span class="calc-insight-value ${rateClass}">${savingsRate}%</span>
        </div>
        <div class="calc-insight-item">
          <span class="calc-insight-label">📈 1-Year Projection (${rate}% return)</span>
          <span class="calc-insight-value insight-good">${Utils.formatCurrency(projected1yr)}</span>
        </div>
        ${monthsToGoal !== null ? `
        <div class="calc-insight-item">
          <span class="calc-insight-label">🎯 Time to reach ${Utils.formatCurrency(goal)}</span>
          <span class="calc-insight-value insight-neutral">
            ${monthsToGoal >= 12
              ? `${Math.floor(monthsToGoal/12)}y ${monthsToGoal%12}m`
              : `${monthsToGoal} months`}
          </span>
        </div>
        ` : ''}
      </div>

      ${getTip(savingsRate, monthlySavings)}
    `;
  }

  function getTip(rate, monthly) {
    let tip = '';
    if (monthly < 0) {
      tip = '⚠️ <strong>Spending exceeds income.</strong> Review your expense categories and identify areas to cut back immediately.';
    } else if (rate < 10) {
      tip = '💡 <strong>Aim to save at least 20% of income.</strong> Try reducing your top spending category first — even small cuts compound over time.';
    } else if (rate < 20) {
      tip = '✅ <strong>Good progress!</strong> Increasing your savings rate to 20%+ will dramatically accelerate your goals.';
    } else {
      tip = '🌟 <strong>Excellent savings rate!</strong> You\'re on track. Consider investing in index funds to grow wealth faster.';
    }
    return `<div class="calc-tip">${tip}</div>`;
  }

  return { render };
})();
