import { useState } from 'react';
import Button from './Button';

const DEFAULT_FORM = {
  name: '',
  type: 'TABLE',
  quantity: '',
  imageUrl: '',
};

const ITEM_TYPES = ['TABLE', 'CHAIR', 'LINEN', 'DECOR', 'OTHER'];

const inputClass =
  'w-full rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-600 outline-none transition-all border border-[var(--color-border-input)] focus:border-[var(--color-border-focus)]';
const inputStyle = {
  backgroundColor: 'var(--color-bg-input)',
};

function FieldLabel({ htmlFor, children }) {
  return (
    <label htmlFor={htmlFor} className="text-xs font-medium" style={{ color: 'var(--color-text-label)' }}>
      {children}
    </label>
  );
}

function FieldError({ message }) {
  if (!message) return null;
  return <p className="text-xs mt-1" style={{ color: 'var(--color-error)' }}>{message}</p>;
}

export default function InventoryForm({ onSubmit, onCancel, loading = false }) {
  const [form, setForm] = useState(DEFAULT_FORM);
  const [errors, setErrors] = useState({});

  function setField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  function validate() {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = 'Item name is required.';
    if (!form.type) newErrors.type = 'Type is required.';
    if (form.quantity === '' || isNaN(form.quantity) || parseInt(form.quantity, 10) < 1) {
      newErrors.quantity = 'Quantity must be at least 1.';
    }
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
      name: form.name.trim(),
      type: form.type,
      quantity: parseInt(form.quantity, 10),
      imageUrl: form.imageUrl.trim() || null,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Item Name — full width */}
        <div className="flex flex-col gap-1 sm:col-span-2">
          <FieldLabel htmlFor="itemName">Item Name</FieldLabel>
          <input
            id="itemName"
            type="text"
            placeholder="e.g. 60 Inch Round Table"
            value={form.name}
            onChange={(e) => setField('name', e.target.value)}
            className={inputClass}
            style={inputStyle}

          />
          <FieldError message={errors.name} />
        </div>

        {/* Type */}
        <div className="flex flex-col gap-1">
          <FieldLabel htmlFor="itemType">Type</FieldLabel>
          <select
            id="itemType"
            value={form.type}
            onChange={(e) => setField('type', e.target.value)}
            className={inputClass}
            style={inputStyle}

          >
            {ITEM_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          <FieldError message={errors.type} />
        </div>

        {/* Quantity */}
        <div className="flex flex-col gap-1">
          <FieldLabel htmlFor="itemQuantity">Quantity</FieldLabel>
          <input
            id="itemQuantity"
            type="number"
            min="1"
            placeholder="0"
            value={form.quantity}
            onChange={(e) => setField('quantity', e.target.value)}
            className={inputClass}
            style={inputStyle}

          />
          <FieldError message={errors.quantity} />
        </div>

        {/* Image URL — full width, optional */}
        <div className="flex flex-col gap-1 sm:col-span-2">
          <FieldLabel htmlFor="itemImageUrl">Image URL <span style={{ color: 'var(--color-text-faint)' }}>(optional)</span></FieldLabel>
          <input
            id="itemImageUrl"
            type="text"
            placeholder="https://..."
            value={form.imageUrl}
            onChange={(e) => setField('imageUrl', e.target.value)}
            className={inputClass}
            style={inputStyle}

          />
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
          {loading ? 'Saving…' : 'Save Item'}
        </Button>
      </div>
    </form>
  );
}
