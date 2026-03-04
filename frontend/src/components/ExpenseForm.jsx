import { useState } from 'react';
import Button from './Button';

const CATEGORIES = ['Fuel', 'Maintenance', 'Supplies', 'Other'];

const DEFAULT_FORM = {
  date: '',
  category: 'Fuel',
  amount: '',
  description: '',
};

const inputClass =
  'w-full rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-600 outline-none transition-all border border-[var(--color-border-input)] focus:border-[var(--color-border-focus)]';

const inputStyle = {
  backgroundColor: 'var(--color-bg-input)',
};

function FieldLabel({ htmlFor, children }) {
  return (
    <label
      htmlFor={htmlFor}
      className="text-xs font-medium"
      style={{ color: 'var(--color-text-label)' }}
    >
      {children}
    </label>
  );
}

function FieldError({ message }) {
  if (!message) return null;
  return (
    <p className="text-xs mt-1" style={{ color: 'var(--color-error)' }}>
      {message}
    </p>
  );
}

export default function ExpenseForm({ onSubmit, onCancel, loading = false }) {
  const [form, setForm] = useState(DEFAULT_FORM);
  const [errors, setErrors] = useState({});

  function setField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  function validate() {
    const newErrors = {};
    if (!form.date) newErrors.date = 'Date is required.';
    if (!form.category) newErrors.category = 'Category is required.';
    if (form.amount === '' || isNaN(form.amount) || parseFloat(form.amount) <= 0)
      newErrors.amount = 'Amount must be greater than 0.';
    if (!form.description.trim()) newErrors.description = 'Description is required.';
    return newErrors;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    onSubmit({
      ...form,
      amount: parseFloat(parseFloat(form.amount).toFixed(2)),
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

        {/* Date */}
        <div className="flex flex-col gap-1">
          <FieldLabel htmlFor="expenseDate">Date</FieldLabel>
          <input
            id="expenseDate"
            type="date"
            value={form.date}
            onChange={(e) => setField('date', e.target.value)}
            className={inputClass}
            style={{ ...inputStyle, colorScheme: 'dark' }}

          />
          <FieldError message={errors.date} />
        </div>

        {/* Category */}
        <div className="flex flex-col gap-1">
          <FieldLabel htmlFor="expenseCategory">Category</FieldLabel>
          <select
            id="expenseCategory"
            value={form.category}
            onChange={(e) => setField('category', e.target.value)}
            className={inputClass}
            style={inputStyle}

          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <FieldError message={errors.category} />
        </div>

        {/* Amount */}
        <div className="flex flex-col gap-1 sm:col-span-2">
          <FieldLabel htmlFor="expenseAmount">Amount ($)</FieldLabel>
          <input
            id="expenseAmount"
            type="number"
            min="0.01"
            step="0.01"
            placeholder="0.00"
            value={form.amount}
            onChange={(e) => setField('amount', e.target.value)}
            className={inputClass}
            style={inputStyle}

          />
          <FieldError message={errors.amount} />
        </div>

        {/* Description */}
        <div className="flex flex-col gap-1 sm:col-span-2">
          <FieldLabel htmlFor="expenseDescription">Description</FieldLabel>
          <input
            id="expenseDescription"
            type="text"
            placeholder="Brief description of the expense"
            value={form.description}
            onChange={(e) => setField('description', e.target.value)}
            className={inputClass}
            style={inputStyle}

          />
          <FieldError message={errors.description} />
        </div>

      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-1">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 rounded-lg py-2.5 text-sm font-semibold text-white transition-colors"
          style={{
            backgroundColor: 'transparent',
            border: '1px solid var(--color-border-input)',
          }}
        >
          Cancel
        </button>
        <Button type="submit" loading={loading} className="flex-1">
          {loading ? 'Saving…' : 'Save Expense'}
        </Button>
      </div>
    </form>
  );
}
