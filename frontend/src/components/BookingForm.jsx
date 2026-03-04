import { useState } from 'react';
import Button from './Button';

const DEFAULT_FORM = {
  contactName: '',
  phone: '',
  email: '',
  eventDate: '',
  location: '',
  dropOffTime: '',
  pickUpTime: '',
  deliveryFee: '',
  depositAmount: '',
  paymentStatus: 'DEPOSIT',
  items: [{ inventoryItem: '', quantity: '', pricePerItem: '' }],
};

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

export default function BookingForm({ initialValues, onSubmit, onCancel, loading = false }) {
  const [form, setForm] = useState(() => initialValues ?? DEFAULT_FORM);
  const [errors, setErrors] = useState({});

  function setField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  function setItemField(index, key, value) {
    setForm((prev) => {
      const items = [...prev.items];
      items[index] = { ...items[index], [key]: value };
      return { ...prev, items };
    });
  }

  function addItem() {
    setForm((prev) => ({
      ...prev,
      items: [...prev.items, { inventoryItem: '', quantity: '', pricePerItem: '' }],
    }));
  }

  function removeItem(index) {
    setForm((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  }

  const computedTotal =
    form.items.reduce((sum, item) => {
      const qty = parseFloat(item.quantity) || 0;
      const price = parseFloat(item.pricePerItem) || 0;
      return sum + qty * price;
    }, 0) + (parseFloat(form.deliveryFee) || 0);

  function validate() {
    const newErrors = {};
    if (!form.contactName.trim()) newErrors.contactName = 'Name is required.';
    if (!form.phone.trim()) newErrors.phone = 'Phone is required.';
    if (!form.email.trim()) newErrors.email = 'Email is required.';
    if (!form.eventDate) newErrors.eventDate = 'Event date is required.';
    if (!form.location.trim()) newErrors.location = 'Location is required.';
    if (!form.dropOffTime) newErrors.dropOffTime = 'Drop-off time is required.';
    if (!form.pickUpTime) newErrors.pickUpTime = 'Pick-up time is required.';
    if (form.deliveryFee === '' || isNaN(form.deliveryFee)) newErrors.deliveryFee = 'Delivery fee is required.';
    if (form.depositAmount === '' || isNaN(form.depositAmount)) newErrors.depositAmount = 'Deposit amount is required.';
    const validItems = form.items.filter((i) => i.inventoryItem.trim());
    if (validItems.length === 0) newErrors.items = 'At least one item is required.';
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
      deliveryFee: parseFloat(form.deliveryFee),
      depositAmount: parseFloat(form.depositAmount),
      payAmount: computedTotal,
      items: form.items
        .filter((i) => i.inventoryItem.trim())
        .map((i) => ({
          inventoryItem: i.inventoryItem,
          quantity: parseInt(i.quantity, 10) || 0,
          pricePerItem: parseFloat(i.pricePerItem) || 0,
        })),
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {/* Contact Info Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Contact Name */}
        <div className="flex flex-col gap-1">
          <FieldLabel htmlFor="contactName">Contact Name</FieldLabel>
          <input
            id="contactName"
            type="text"
            placeholder="Full name"
            value={form.contactName}
            onChange={(e) => setField('contactName', e.target.value)}
            className={inputClass}
            style={inputStyle}

          />
          <FieldError message={errors.contactName} />
        </div>

        {/* Phone */}
        <div className="flex flex-col gap-1">
          <FieldLabel htmlFor="phone">Phone</FieldLabel>
          <input
            id="phone"
            type="tel"
            placeholder="(555) 000-0000"
            value={form.phone}
            onChange={(e) => setField('phone', e.target.value)}
            className={inputClass}
            style={inputStyle}

          />
          <FieldError message={errors.phone} />
        </div>

        {/* Email */}
        <div className="flex flex-col gap-1">
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <input
            id="email"
            type="email"
            placeholder="client@example.com"
            value={form.email}
            onChange={(e) => setField('email', e.target.value)}
            className={inputClass}
            style={inputStyle}

          />
          <FieldError message={errors.email} />
        </div>

        {/* Event Date */}
        <div className="flex flex-col gap-1">
          <FieldLabel htmlFor="eventDate">Event Date</FieldLabel>
          <input
            id="eventDate"
            type="date"
            value={form.eventDate}
            onChange={(e) => setField('eventDate', e.target.value)}
            className={inputClass}
            style={{ ...inputStyle, colorScheme: 'dark' }}

          />
          <FieldError message={errors.eventDate} />
        </div>

        {/* Location — full width */}
        <div className="flex flex-col gap-1 sm:col-span-2">
          <FieldLabel htmlFor="location">Location</FieldLabel>
          <input
            id="location"
            type="text"
            placeholder="Venue address"
            value={form.location}
            onChange={(e) => setField('location', e.target.value)}
            className={inputClass}
            style={inputStyle}

          />
          <FieldError message={errors.location} />
        </div>

        {/* Drop-Off Time */}
        <div className="flex flex-col gap-1">
          <FieldLabel htmlFor="dropOffTime">Drop-Off Time</FieldLabel>
          <input
            id="dropOffTime"
            type="time"
            value={form.dropOffTime}
            onChange={(e) => setField('dropOffTime', e.target.value)}
            className={inputClass}
            style={{ ...inputStyle, colorScheme: 'dark' }}

          />
          <FieldError message={errors.dropOffTime} />
        </div>

        {/* Pick-Up Time */}
        <div className="flex flex-col gap-1">
          <FieldLabel htmlFor="pickUpTime">Pick-Up Time</FieldLabel>
          <input
            id="pickUpTime"
            type="time"
            value={form.pickUpTime}
            onChange={(e) => setField('pickUpTime', e.target.value)}
            className={inputClass}
            style={{ ...inputStyle, colorScheme: 'dark' }}

          />
          <FieldError message={errors.pickUpTime} />
        </div>

        {/* Delivery Fee */}
        <div className="flex flex-col gap-1">
          <FieldLabel htmlFor="deliveryFee">Delivery Fee ($)</FieldLabel>
          <input
            id="deliveryFee"
            type="number"
            min="0"
            step="0.01"
            placeholder="0.00"
            value={form.deliveryFee}
            onChange={(e) => setField('deliveryFee', e.target.value)}
            className={inputClass}
            style={inputStyle}

          />
          <FieldError message={errors.deliveryFee} />
        </div>

        {/* Deposit Amount */}
        <div className="flex flex-col gap-1">
          <FieldLabel htmlFor="depositAmount">Deposit Amount ($)</FieldLabel>
          <input
            id="depositAmount"
            type="number"
            min="0"
            step="0.01"
            placeholder="0.00"
            value={form.depositAmount}
            onChange={(e) => setField('depositAmount', e.target.value)}
            className={inputClass}
            style={inputStyle}

          />
          <FieldError message={errors.depositAmount} />
        </div>

        {/* Payment Status */}
        <div className="flex flex-col gap-1 sm:col-span-2">
          <FieldLabel htmlFor="paymentStatus">Payment Status</FieldLabel>
          <select
            id="paymentStatus"
            value={form.paymentStatus}
            onChange={(e) => setField('paymentStatus', e.target.value)}
            className={inputClass}
            style={inputStyle}

          >
            <option value="DEPOSIT">DEPOSIT</option>
            <option value="PAID">PAID</option>
          </select>
        </div>
      </div>

      {/* Divider */}
      <div className="w-full h-px" style={{ backgroundColor: 'var(--color-border-subtle)' }} />

      {/* Items Section */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white">Items</h3>
          {errors.items && <FieldError message={errors.items} />}
        </div>

        {/* Items header labels */}
        <div className="grid grid-cols-[1fr_80px_100px_36px] gap-2">
          <span className="text-xs font-medium" style={{ color: 'var(--color-text-label)' }}>Item</span>
          <span className="text-xs font-medium" style={{ color: 'var(--color-text-label)' }}>Qty</span>
          <span className="text-xs font-medium" style={{ color: 'var(--color-text-label)' }}>$/Item</span>
          <span />
        </div>

        {form.items.map((item, index) => (
          <div key={index} className="grid grid-cols-[1fr_80px_100px_36px] gap-2 items-center">
            <input
              type="text"
              placeholder="Item name"
              value={item.inventoryItem}
              onChange={(e) => setItemField(index, 'inventoryItem', e.target.value)}
              className={inputClass}
              style={inputStyle}
              onFocus={focusOn}
              onBlur={focusOff}
            />
            <input
              type="number"
              min="1"
              placeholder="0"
              value={item.quantity}
              onChange={(e) => setItemField(index, 'quantity', e.target.value)}
              className={inputClass}
              style={inputStyle}
              onFocus={focusOn}
              onBlur={focusOff}
            />
            <input
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              value={item.pricePerItem}
              onChange={(e) => setItemField(index, 'pricePerItem', e.target.value)}
              className={inputClass}
              style={inputStyle}
              onFocus={focusOn}
              onBlur={focusOff}
            />
            <button
              type="button"
              onClick={() => removeItem(index)}
              disabled={form.items.length === 1}
              className="w-9 h-9 flex items-center justify-center rounded-lg text-sm font-bold transition-colors"
              style={{
                color: form.items.length === 1 ? 'var(--color-text-faint)' : '#ef4444',
                backgroundColor: 'var(--color-bg-input)',
                border: '1px solid var(--color-border-input)',
                cursor: form.items.length === 1 ? 'not-allowed' : 'pointer',
              }}
              aria-label="Remove item"
            >
              ✕
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={addItem}
          className="self-start text-xs font-medium px-3 py-1.5 rounded-lg transition-colors"
          style={{
            color: 'var(--color-brand)',
            backgroundColor: '#2e1a3a',
            border: '1px solid var(--color-border-subtle)',
          }}
        >
          + Add Item
        </button>
      </div>

      {/* Divider */}
      <div className="w-full h-px" style={{ backgroundColor: 'var(--color-border-subtle)' }} />

      {/* Total (read-only) */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium" style={{ color: 'var(--color-text-muted)' }}>
          Total (items + delivery)
        </span>
        <span className="text-lg font-bold text-white">
          ${computedTotal.toFixed(2)}
        </span>
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
          {loading ? 'Saving…' : 'Save Booking'}
        </Button>
      </div>
    </form>
  );
}
