/* ============================================
   BUDGETWISE — APP BOOTSTRAP
   ============================================ */

const App = (() => {
  let currentMonth;
  let currentYear;

  function init() {
    const now = new Date();
    currentMonth = now.getMonth();
    currentYear  = now.getFullYear();

    // Render all components
    HeaderComponent.render();
    DashboardComponent.render(currentMonth, currentYear);
    IncomeComponent.render(currentMonth, currentYear);
    ExpenseComponent.render(currentMonth, currentYear);
    ChartsComponent.render(currentMonth, currentYear);
    SummaryComponent.render(currentMonth, currentYear);
    CalculatorComponent.render();

    // Subscribe to state changes — re-render reactive components
    Store.subscribe(() => {
      DashboardComponent.render(currentMonth, currentYear);
      ChartsComponent.render(currentMonth, currentYear);
      SummaryComponent.render(currentMonth, currentYear);
      IncomeComponent.renderList(currentMonth, currentYear);
      ExpenseComponent.renderList(currentMonth, currentYear);
    });

    console.log('%c BudgetWise Ready ✓', 'color:#63d9b4;font-weight:bold;font-size:14px');
  }

  function setMonth(month, year) {
    currentMonth = month;
    currentYear  = year;
    Store.subscribe(() => {})(); // trigger re-render
    DashboardComponent.render(currentMonth, currentYear);
    ChartsComponent.render(currentMonth, currentYear);
    SummaryComponent.render(currentMonth, currentYear);
    IncomeComponent.renderList(currentMonth, currentYear);
    ExpenseComponent.renderList(currentMonth, currentYear);
  }

  return { init, setMonth, getCurrentMonth: () => currentMonth, getCurrentYear: () => currentYear };
})();
