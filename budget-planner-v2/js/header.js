/* ============================================
   BUDGETWISE — HEADER COMPONENT
   ============================================ */

const HeaderComponent = (() => {
  let navMonth;
  let navYear;

  function render() {
    const now = new Date();
    navMonth = now.getMonth();
    navYear  = now.getFullYear();

    const root = document.getElementById('header-root');
    root.innerHTML = buildHTML();
    attachEvents();
  }

  function buildHTML() {
    return `
      <header class="app-header">
        <div class="header-brand">
          <div class="brand-logo">💰</div>
          <div>
            <div class="brand-name">Budget<span>Wise</span></div>
            <div class="brand-tagline">Personal Finance Tracker</div>
          </div>
        </div>

        <div class="header-month-nav">
          <button class="month-nav-btn" id="prev-month-btn" title="Previous Month">&#8249;</button>
          <span class="month-nav-label" id="month-nav-label">
            {Utils.formatMonthYear(navMonth, navYear)}
          </span>
          <button class="month-nav-btn" id="next-month-btn" title="Next Month">&#8250;</button>
        </div>

        <div class="header-actions">
          <button class="header-clear-btn" id="clear-all-btn">🗑 Clear All Data</button>
        </div>
      </header>
    `;
  }

  function attachEvents() {
    document.getElementById('prev-month-btn').addEventListener('click', () => {
      navMonth--;
      if (navMonth < 0) { navMonth = 11; navYear--; }
      updateNav();
    });

    document.getElementById('next-month-btn').addEventListener('click', () => {
      navMonth++;
      if (navMonth > 11) { navMonth = 0; navYear++; }
      updateNav();
    });

    document.getElementById('clear-all-btn').addEventListener('click', () => {
      if (confirm('Clear all budget data? This cannot be undone.')) {
        Store.clearAll();
      }
    });
  }

  function updateNav() {
    document.getElementById('month-nav-label').textContent =
      Utils.formatMonthYear(navMonth, navYear);
    App.setMonth(navMonth, navYear);
  }

  return { render };
})();
