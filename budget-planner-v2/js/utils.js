/* ============================================
   BUDGETWISE — UTILITY FUNCTIONS
   ============================================ */

const Utils = {
  /**
   * Format a number as currency
   */
  formatCurrency(amount, currency = 'USD') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  },

  /**
   * Format a date string to human-readable
   */
  formatDate(dateStr) {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  },

  /**
   * Format month-year for display
   */
  formatMonthYear(month, year) {
    return new Date(year, month, 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  },

  /**
   * Get month names array
   */
  monthNames() {
    return ['January','February','March','April','May','June',
            'July','August','September','October','November','December'];
  },

  /**
   * Clamp number between min/max
   */
  clamp(val, min, max) {
    return Math.min(Math.max(val, min), max);
  },

  /**
   * Calculate percentage (safe — avoids div/0)
   */
  percent(part, total) {
    if (!total) return 0;
    return Math.round((part / total) * 100);
  },

  /**
   * Debounce a function
   */
  debounce(fn, delay = 300) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), delay);
    };
  },

  /**
   * Category metadata (icon + color)
   */
  categoryMeta: {
    food:          { label: 'Food & Dining',    icon: '🍔', color: '#ff9f43' },
    transport:     { label: 'Transport',         icon: '🚗', color: '#6ca0ff' },
    housing:       { label: 'Housing & Rent',    icon: '🏠', color: '#a29bfe' },
    utilities:     { label: 'Utilities',         icon: '💡', color: '#ffca3a' },
    entertainment: { label: 'Entertainment',     icon: '🎬', color: '#fd79a8' },
    health:        { label: 'Health & Fitness',  icon: '❤️', color: '#55efc4' },
    shopping:      { label: 'Shopping',          icon: '🛍️', color: '#74b9ff' },
    education:     { label: 'Education',         icon: '📚', color: '#81ecec' },
    savings:       { label: 'Savings',           icon: '💰', color: '#63d9b4' },
    other:         { label: 'Other',             icon: '📌', color: '#b2bec3' },
  },

  /**
   * Income source metadata
   */
  incomeMeta: {
    salary:     { label: 'Salary',       icon: '💼' },
    freelance:  { label: 'Freelance',    icon: '💻' },
    business:   { label: 'Business',     icon: '🏢' },
    investment: { label: 'Investment',   icon: '📈' },
    gift:       { label: 'Gift',         icon: '🎁' },
    other:      { label: 'Other',        icon: '💵' },
  },

  /**
   * Generate SVG donut chart data
   */
  donutSegments(data, radius = 60, cx = 70, cy = 70, strokeWidth = 14) {
    const total = Object.values(data).reduce((s, v) => s + v, 0);
    if (!total) return [];

    let offset = 0;
    const circumference = 2 * Math.PI * radius;
    const segments = [];

    Object.entries(data).forEach(([key, value]) => {
      const pct = value / total;
      const dash = pct * circumference;
      const gap  = circumference - dash;
      const meta = Utils.categoryMeta[key] || { color: '#b2bec3', label: key };

      segments.push({ key, value, pct, dash, gap, offset, color: meta.color, label: meta.label });
      offset += dash;
    });

    return segments;
  },

  /**
   * Simple bar chart helper (returns normalized heights 0-100)
   */
  barHeights(values) {
    const max = Math.max(...values, 1);
    return values.map(v => Math.round((v / max) * 100));
  },
};
