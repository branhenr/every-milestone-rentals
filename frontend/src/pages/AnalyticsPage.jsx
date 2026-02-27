import { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import mockAnalytics from '../mock/mockAnalytics';
import Modal from '../components/Modal';
import ExpenseForm from '../components/ExpenseForm';
import StatCard from '../components/StatCard';
import Button from '../components/Button';

// ── helpers ────────────────────────────────────────────────────────────────────

function formatDate(dateStr) {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatCurrency(value) {
  return '$' + value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function matchesFilter(dateStr, year, month) {
  const [y, m] = dateStr.split('-');
  if (year !== 'All' && y !== year) return false;
  if (month !== 'All' && m !== month) return false;
  return true;
}

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const MONTHS = [
  { label: 'All Months', value: 'All' },
  { label: 'January',   value: '01' },
  { label: 'February',  value: '02' },
  { label: 'March',     value: '03' },
  { label: 'April',     value: '04' },
  { label: 'May',       value: '05' },
  { label: 'June',      value: '06' },
  { label: 'July',      value: '07' },
  { label: 'August',    value: '08' },
  { label: 'September', value: '09' },
  { label: 'October',   value: '10' },
  { label: 'November',  value: '11' },
  { label: 'December',  value: '12' },
];

const filterSelectStyle = {
  backgroundColor: 'var(--color-bg-input)',
  border: '1px solid var(--color-border-input)',
  borderRadius: '8px',
  color: 'white',
  fontSize: '13px',
  padding: '6px 12px',
  outline: 'none',
};

const chartCardStyle = {
  backgroundColor: 'var(--color-bg-card)',
  border: '1px solid var(--color-border-subtle)',
};

const tooltipContentStyle = {
  backgroundColor: 'var(--color-bg-card)',
  border: '1px solid var(--color-border-subtle)',
  borderRadius: '8px',
  color: 'white',
};

// ── component ──────────────────────────────────────────────────────────────────

export default function AnalyticsPage() {
  const revenueEntries = mockAnalytics.revenueEntries;
  const [expenseEntries, setExpenseEntries] = useState(mockAnalytics.expenseEntries);

  const [filterYear,  setFilterYear]  = useState('2026');
  const [filterMonth, setFilterMonth] = useState('All');
  const [logTab,      setLogTab]      = useState('Expenses');
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);

  // ── derived: available years ─────────────────────────────────────────────────
  const availableYears = [
    'All',
    ...Array.from(
      new Set([...revenueEntries, ...expenseEntries].map((e) => e.date.slice(0, 4)))
    ).sort(),
  ];

  // ── derived: filtered entries ────────────────────────────────────────────────
  const filteredRevenue  = revenueEntries.filter((e) => matchesFilter(e.date, filterYear, filterMonth));
  const filteredExpenses = expenseEntries.filter((e) => matchesFilter(e.date, filterYear, filterMonth));

  // ── derived: stat totals ─────────────────────────────────────────────────────
  const totalRevenue  = filteredRevenue.reduce((s, e) => s + e.amount, 0);
  const totalExpenses = filteredExpenses.reduce((s, e) => s + e.amount, 0);
  const netProfit     = totalRevenue - totalExpenses;

  // ── derived: bar chart data (year-scoped only, not month) ────────────────────
  const barData =
    filterYear === 'All'
      ? (() => {
          const map = {};
          revenueEntries.forEach((e) => {
            const y = e.date.slice(0, 4);
            map[y] = (map[y] ?? 0) + e.amount;
          });
          return Object.entries(map)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([y, revenue]) => ({ label: y, revenue }));
        })()
      : (() => {
          const map = {};
          MONTH_LABELS.forEach((_, i) => {
            map[String(i + 1).padStart(2, '0')] = 0;
          });
          revenueEntries
            .filter((e) => e.date.startsWith(filterYear))
            .forEach((e) => {
              const m = e.date.slice(5, 7);
              map[m] += e.amount;
            });
          return Object.entries(map).map(([m, revenue]) => ({
            label: MONTH_LABELS[parseInt(m, 10) - 1],
            revenue,
          }));
        })();

  const barChartTitle = filterYear === 'All' ? 'Yearly Revenue' : `${filterYear} Monthly Revenue`;

  // ── derived: donut chart data ────────────────────────────────────────────────
  const donutData = [
    { name: 'Revenue',  value: totalRevenue,  fill: '#22c55e' },
    { name: 'Expenses', value: totalExpenses, fill: '#ef4444' },
  ];

  // ── derived: sorted log entries ──────────────────────────────────────────────
  const logEntries = (logTab === 'Expenses' ? filteredExpenses : filteredRevenue)
    .slice()
    .sort((a, b) => b.date.localeCompare(a.date));

  // ── handlers ─────────────────────────────────────────────────────────────────
  function handleYearChange(year) {
    setFilterYear(year);
    if (year === 'All') setFilterMonth('All');
  }

  function handleExpenseSubmit(formData) {
    setExpenseEntries((prev) => [{ ...formData, id: Date.now() }, ...prev]);
    setIsExpenseModalOpen(false);
  }

  // ── render ────────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col gap-6">

      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Analytics</h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Year filter */}
          <select
            value={filterYear}
            onChange={(e) => handleYearChange(e.target.value)}
            style={filterSelectStyle}
          >
            {availableYears.map((y) => (
              <option key={y} value={y}>{y === 'All' ? 'All Years' : y}</option>
            ))}
          </select>

          {/* Month filter */}
          <select
            value={filterMonth}
            onChange={(e) => setFilterMonth(e.target.value)}
            disabled={filterYear === 'All'}
            style={{
              ...filterSelectStyle,
              opacity: filterYear === 'All' ? 0.4 : 1,
              cursor:  filterYear === 'All' ? 'not-allowed' : 'pointer',
            }}
          >
            {MONTHS.map(({ label, value }) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>

          <Button onClick={() => setIsExpenseModalOpen(true)} className="px-5">
            + Add Expense
          </Button>
        </div>
      </div>

      {/* ── Stat Cards ──────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Total Revenue"  value={formatCurrency(totalRevenue)}  color="#22c55e" />
        <StatCard label="Total Expenses" value={formatCurrency(totalExpenses)} color="#ef4444" />
        <StatCard label="Net Profit"     value={formatCurrency(netProfit)}     color="#d946ef" />
      </div>

      {/* ── Charts ──────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Bar Chart */}
        <div className="rounded-xl p-5" style={chartCardStyle}>
          <h2 className="text-sm font-semibold text-white mb-4">{barChartTitle}</h2>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={barData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <XAxis
                dataKey="label"
                tick={{ fill: 'var(--color-text-muted)', fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: 'var(--color-text-muted)', fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `$${v.toLocaleString()}`}
                width={64}
              />
              <Tooltip
                cursor={{ fill: '#2e1a3a' }}
                contentStyle={tooltipContentStyle}
                formatter={(v) => [`$${v.toLocaleString()}`, 'Revenue']}
              />
              <Bar dataKey="revenue" fill="#994896" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Donut Chart */}
        <div className="rounded-xl p-5" style={chartCardStyle}>
          <h2 className="text-sm font-semibold text-white mb-4">Revenue vs Expenses</h2>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={donutData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={3}
                dataKey="value"
              >
                {donutData.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={tooltipContentStyle}
                itemStyle={{ color: 'white' }}
                labelStyle={{ color: 'white' }}
                formatter={(v) => [formatCurrency(v)]}
              />
              <Legend
                iconType="circle"
                iconSize={8}
                wrapperStyle={{ color: 'var(--color-text-muted)', fontSize: '12px' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── Log Table ───────────────────────────────────────────────────────── */}
      <div className="rounded-xl overflow-hidden" style={chartCardStyle}>

        {/* Log Header */}
        <div
          className="flex items-center justify-between px-5 py-4"
          style={{ borderBottom: '1px solid var(--color-border-subtle)' }}
        >
          {/* Tab toggle */}
          <div
            className="flex items-center gap-1 rounded-lg p-1"
            style={{
              backgroundColor: 'var(--color-bg-input)',
              border: '1px solid var(--color-border-subtle)',
            }}
          >
            {['Expenses', 'Revenue'].map((tab) => (
              <button
                key={tab}
                onClick={() => setLogTab(tab)}
                className="rounded-md px-4 py-1.5 text-xs font-semibold transition-colors"
                style={{
                  backgroundColor: logTab === tab ? '#2e1a3a' : 'transparent',
                  color: logTab === tab ? 'white' : 'var(--color-text-muted)',
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          <span className="text-xs" style={{ color: 'var(--color-text-faint)' }}>
            {logEntries.length} {logEntries.length === 1 ? 'entry' : 'entries'}
          </span>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block">
        <table className="w-full text-sm">
          <thead>
            <tr style={{ backgroundColor: '#111111' }}>
              {(logTab === 'Expenses'
                ? ['Date', 'Category', 'Description', 'Amount']
                : ['Date', 'Description', 'Amount']
              ).map((col) => (
                <th
                  key={col}
                  className={`px-5 py-3 text-xs font-medium uppercase tracking-wider ${
                    col === 'Amount' ? 'text-right' : 'text-left'
                  }`}
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {logEntries.length === 0 ? (
              <tr>
                <td
                  colSpan={logTab === 'Expenses' ? 4 : 3}
                  className="py-12 text-center"
                  style={{ color: 'var(--color-text-faint)' }}
                >
                  No {logTab.toLowerCase()} for the selected period.
                </td>
              </tr>
            ) : logTab === 'Expenses' ? (
              logEntries.map((e) => (
                <tr
                  key={e.id}
                  className="transition-colors hover:bg-[#222222]"
                  style={{ borderTop: '1px solid var(--color-border-subtle)' }}
                >
                  <td className="px-5 py-4 whitespace-nowrap" style={{ color: 'var(--color-text-muted)' }}>
                    {formatDate(e.date)}
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
                      style={{
                        color: 'var(--color-brand)',
                        backgroundColor: '#2e1a3a',
                        border: '1px solid var(--color-border-subtle)',
                      }}
                    >
                      {e.category}
                    </span>
                  </td>
                  <td className="px-5 py-4 max-w-[240px]">
                    <p className="truncate" style={{ color: 'var(--color-text-muted)' }}>
                      {e.description}
                    </p>
                  </td>
                  <td className="px-5 py-4 text-right font-medium" style={{ color: '#ef4444' }}>
                    ${e.amount.toFixed(2)}
                  </td>
                </tr>
              ))
            ) : (
              logEntries.map((e) => (
                <tr
                  key={e.id}
                  className="transition-colors hover:bg-[#222222]"
                  style={{ borderTop: '1px solid var(--color-border-subtle)' }}
                >
                  <td className="px-5 py-4 whitespace-nowrap" style={{ color: 'var(--color-text-muted)' }}>
                    {formatDate(e.date)}
                  </td>
                  <td className="px-5 py-4 max-w-[320px]">
                    <p className="truncate" style={{ color: 'var(--color-text-muted)' }}>
                      {e.description}
                    </p>
                  </td>
                  <td className="px-5 py-4 text-right font-medium" style={{ color: '#22c55e' }}>
                    ${e.amount.toFixed(2)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        </div>

        {/* Mobile Cards */}
        <div className="flex flex-col gap-0 md:hidden">
          {logEntries.length === 0 ? (
            <div className="py-12 text-center" style={{ color: 'var(--color-text-faint)' }}>
              No {logTab.toLowerCase()} for the selected period.
            </div>
          ) : logTab === 'Expenses' ? (
            logEntries.map((e) => (
              <div
                key={e.id}
                className="flex flex-col gap-2 px-5 py-4"
                style={{ borderTop: '1px solid var(--color-border-subtle)' }}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs" style={{ color: 'var(--color-text-faint)' }}>
                    {formatDate(e.date)}
                  </span>
                  <span className="text-sm font-medium" style={{ color: '#ef4444' }}>
                    ${e.amount.toFixed(2)}
                  </span>
                </div>
                <div>
                  <span
                    className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
                    style={{
                      color: 'var(--color-brand)',
                      backgroundColor: '#2e1a3a',
                      border: '1px solid var(--color-border-subtle)',
                    }}
                  >
                    {e.category}
                  </span>
                </div>
                <p className="text-sm truncate" style={{ color: 'var(--color-text-muted)' }}>
                  {e.description}
                </p>
              </div>
            ))
          ) : (
            logEntries.map((e) => (
              <div
                key={e.id}
                className="flex flex-col gap-2 px-5 py-4"
                style={{ borderTop: '1px solid var(--color-border-subtle)' }}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs" style={{ color: 'var(--color-text-faint)' }}>
                    {formatDate(e.date)}
                  </span>
                  <span className="text-sm font-medium" style={{ color: '#22c55e' }}>
                    ${e.amount.toFixed(2)}
                  </span>
                </div>
                <p className="text-sm truncate" style={{ color: 'var(--color-text-muted)' }}>
                  {e.description}
                </p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ── Modal ───────────────────────────────────────────────────────────── */}
      <Modal
        isOpen={isExpenseModalOpen}
        onClose={() => setIsExpenseModalOpen(false)}
        title="Add Expense"
      >
        <ExpenseForm
          key={isExpenseModalOpen ? 'open' : 'closed'}
          onSubmit={handleExpenseSubmit}
          onCancel={() => setIsExpenseModalOpen(false)}
        />
      </Modal>
    </div>
  );
}
