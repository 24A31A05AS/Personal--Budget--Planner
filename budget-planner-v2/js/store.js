/* ============================================
   BUDGETWISE — CENTRAL STATE STORE
   ============================================ */

const Store = (() => {
  const STORAGE_KEY = 'budgetwise_data';

  const defaultState = {
    incomes: [],
    expenses: [],
    monthlyBudgetLimit: 0,
    savingsGoal: 0,
  };

  let state = loadFromStorage();
  const listeners = [];

  function loadFromStorage() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? { ...defaultState, ...JSON.parse(raw) } : { ...defaultState };
    } catch {
      return { ...defaultState };
    }
  }

  function saveToStorage() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn('Storage save failed:', e);
    }
  }

  function notify() {
    listeners.forEach(fn => fn(state));
  }

  return {
    getState() {
      return { ...state };
    },

    subscribe(fn) {
      listeners.push(fn);
      return () => {
        const idx = listeners.indexOf(fn);
        if (idx > -1) listeners.splice(idx, 1);
      };
    },

    // --- Income ---
    addIncome(income) {
      state = {
        ...state,
        incomes: [...state.incomes, {
          id: Date.now(),
          ...income,
          createdAt: new Date().toISOString(),
        }]
      };
      saveToStorage();
      notify();
    },

    deleteIncome(id) {
      state = { ...state, incomes: state.incomes.filter(i => i.id !== id) };
      saveToStorage();
      notify();
    },

    // --- Expenses ---
    addExpense(expense) {
      state = {
        ...state,
        expenses: [...state.expenses, {
          id: Date.now(),
          ...expense,
          createdAt: new Date().toISOString(),
        }]
      };
      saveToStorage();
      notify();
    },

    deleteExpense(id) {
      state = { ...state, expenses: state.expenses.filter(e => e.id !== id) };
      saveToStorage();
      notify();
    },

    // --- Settings ---
    setBudgetLimit(amount) {
      state = { ...state, monthlyBudgetLimit: parseFloat(amount) || 0 };
      saveToStorage();
      notify();
    },

    setSavingsGoal(amount) {
      state = { ...state, savingsGoal: parseFloat(amount) || 0 };
      saveToStorage();
      notify();
    },

    // --- Computed ---
    getTotalIncome(month, year) {
      return state.incomes
        .filter(i => matchMonthYear(i.date, month, year))
        .reduce((sum, i) => sum + parseFloat(i.amount), 0);
    },

    getTotalExpenses(month, year) {
      return state.expenses
        .filter(e => matchMonthYear(e.date, month, year))
        .reduce((sum, e) => sum + parseFloat(e.amount), 0);
    },

    getBalance(month, year) {
      return this.getTotalIncome(month, year) - this.getTotalExpenses(month, year);
    },

    getExpensesByCategory(month, year) {
      const map = {};
      state.expenses
        .filter(e => matchMonthYear(e.date, month, year))
        .forEach(e => {
          map[e.category] = (map[e.category] || 0) + parseFloat(e.amount);
        });
      return map;
    },

    clearAll() {
      state = { ...defaultState };
      saveToStorage();
      notify();
    }
  };

  function matchMonthYear(dateStr, month, year) {
    if (!dateStr) return true;
    const d = new Date(dateStr);
    if (month === undefined || month === null) return true;
    return d.getMonth() === month && d.getFullYear() === year;
  }
})();
