/* ============================================
   BUDGETWISE — CHARTS COMPONENT
   ============================================ */

const ChartsComponent = (() => {

  function render(month, year) {
    const root = document.getElementById('charts-root');
    const categoryData = Store.getExpensesByCategory(month, year);
    const totalExpenses = Object.values(categoryData).reduce((s,v) => s+v, 0);

    root.innerHTML = `
      <div class="charts-grid">
        <div class="card">
          <div class="section-header">
            <div class="section-title">
              <div class="icon" style="background:var(--color-info-dim);color:var(--color-info);">📊</div>
              Spending by Category
            </div>
          </div>
          {totalExpenses > 0 ? buildDonut(categoryData, totalExpenses) : '<div class="chart-empty">No expense data yet</div>'}
        </div>

        <div class="card">
          <div class="section-header">
            <div class="section-title">
              <div class="icon" style="background:var(--color-warning-dim);color:var(--color-warning);">📈</div>
              6-Month Overview
            </div>
          </div>
          {buildBarChart(month, year)}
          <div class="chart-legend-row">
            <span class="chart-legend-dot income">Income</span>
            <span class="chart-legend-dot expense">Expenses</span>
          </div>
        </div>
      </div>
    `;
  }

  function buildDonut(categoryData, total) {
    const R   = 52;
    const cx  = 70;
    const cy  = 70;
    const circ = 2 * Math.PI * R;
    const SW  = 18;

    const entries = Object.entries(categoryData).sort((a,b) => b[1]-a[1]);
    let offset = 0;
    const segments = entries.map(([key, value]) => {
      const meta  = Utils.categoryMeta[key] || { color: '#b2bec3', label: key };
      const pct   = value / total;
      const dash  = pct * circ;
      const gap   = circ - dash;
      const seg   = { key, value, pct, dash, gap, offset, color: meta.color, label: meta.label };
      offset += dash;
      return seg;
    });

    const paths = segments.map(s => `
      <circle
        cx="{cx}" cy="{cy}" r="{R}"
        fill="none"
        stroke="{s.color}"
        stroke-width="{SW}"
        stroke-dasharray="{s.dash} {s.gap}"
        stroke-dashoffset="{-s.offset}"
        transform="rotate(-90 {cx} {cy})"
        style="transition: stroke-dasharray 600ms cubic-bezier(0.22,1,0.36,1);"
      />
    `).join('');

    const legendItems = entries.slice(0,6).map(([key, value]) => {
      const meta = Utils.categoryMeta[key] || { color: '#b2bec3', label: key };
      const pct  = Utils.percent(value, total);
      return `
        <div class="legend-item">
          <div class="legend-dot" style="background: {meta.color}"></div>
          <span class="legend-label">{meta.label}</span>
          <span class="legend-value">{pct}%</span>
        </div>
      `;
    }).join('');

    return `
      <div class="donut-wrapper">
        <svg class="donut-svg" width="140" height="140" viewBox="0 0 140 140">
          <circle cx="{cx}" cy="{cy}" r="{R}" fill="none"
            stroke="rgba(255,255,255,0.05)" stroke-width="{SW}" />
          {paths}
          <text x="{cx}" y="{cy - 6}" text-anchor="middle" class="donut-center-text" font-size="14">
            {Utils.formatCurrency(total).replace('.00','')}
          </text>
          <text x="{cx}" y="{cy + 12}" text-anchor="middle" class="donut-sub" font-size="9">
            Total Spent
          </text>
        </svg>
        <div class="donut-legend">{legendItems}</div>
      </div>
    `;
  }

  function buildBarChart(currentMonth, currentYear) {
    // Last 6 months
    const months = [];
    for (let i = 5; i >= 0; i--) {
      let m = currentMonth - i;
      let y = currentYear;
      if (m < 0) { m += 12; y--; }
      months.push({ m, y });
    }

    const incomes   = months.map(({m,y}) => Store.getTotalIncome(m, y));
    const expenses  = months.map(({m,y}) => Store.getTotalExpenses(m, y));
    const maxVal    = Math.max(...incomes, ...expenses, 1);
    const barHeight = 110;

    const bars = months.map(({m, y}, i) => {
      const iH = Math.round((incomes[i]  / maxVal) * barHeight);
      const eH = Math.round((expenses[i] / maxVal) * barHeight);
      const label = Utils.monthNames()[m].slice(0,3);
      const isCurrentMonth = m === currentMonth && y === currentYear;

      return `
        <div class="bar-group">
          <div class="bar-stack" style="height: {barHeight}px;">
            <div class="bar-fill income-bar"
              style="height: {iH}px; {isCurrentMonth ? 'opacity:1;' : ''}"></div>
          </div>
          <div class="bar-stack" style="height: {barHeight}px; margin-top: -{barHeight}px;">
            <div class="bar-fill expense-bar"
              style="height: {eH}px; {isCurrentMonth ? 'opacity:1;' : ''}"></div>
          </div>
          <span class="bar-label" style="{isCurrentMonth ? 'color:var(--text-primary);font-weight:600;' : ''}">
            {label}
          </span>
        </div>
      `;
    }).join('');

    return `<div class="bar-chart">{bars}</div>`;
  }

  return { render };
})();
