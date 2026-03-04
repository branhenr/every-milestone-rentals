import { useState } from 'react';
import mockBookings from '../mock/mockBookings';
import Modal from '../components/Modal';
import BookingForm from '../components/BookingForm';
import Button from '../components/Button';

const filterSelectStyle = {
  backgroundColor: 'var(--color-bg-input)',
  border: '1px solid var(--color-border-input)',
  borderRadius: '8px',
  color: 'white',
  fontSize: '13px',
  padding: '6px 12px',
  outline: 'none',
};

function formatDate(dateStr) {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatItemsSummary(items) {
  const first2 = items.slice(0, 2).map((i) => `${i.quantity}x ${i.inventoryItem}`).join(', ');
  const extra = items.length > 2 ? ` +${items.length - 2} more` : '';
  return { summary: first2, extra };
}

function StatusBadge({ value }) {
  const styles = {
    UPCOMING: {
      color: 'var(--color-brand)',
      backgroundColor: '#2e1a3a',
      border: '1px solid var(--color-border-subtle)',
    },
    COMPLETED: null,
    DEPOSIT: null,
    PAID: null,
    UNPAID: null,
  };

  const classNames = {
    UPCOMING: '',
    COMPLETED: 'text-green-400 bg-green-900/30 border border-green-800/40',
    DEPOSIT: 'text-yellow-400 bg-yellow-900/30 border border-yellow-800/40',
    UNPAID: 'text-red-400 bg-red-900/30 border border-red-800/40',
    PAID: 'text-green-400 bg-green-900/30 border border-green-800/40',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${classNames[value] ?? ''}`}
      style={styles[value] ?? {}}
    >
      {value}
    </span>
  );
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState(mockBookings);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBooking, setEditingBooking] = useState(null);

  const [filterMonth,   setFilterMonth]   = useState('All');
  const [filterPayment, setFilterPayment] = useState('All');
  const [filterStatus,  setFilterStatus]  = useState('All');

  // ── derived: available month options ────────────────────────────────────────
  const availableMonths = [
    { label: 'All Months', value: 'All' },
    ...Array.from(new Set(bookings.map((b) => b.eventDate.slice(0, 7))))
      .sort()
      .map((ym) => ({
        label: new Date(`${ym}-01T00:00:00`).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        value: ym,
      })),
  ];

  // ── derived: filtered + sorted bookings ─────────────────────────────────────
  const displayedBookings = bookings
    .filter((b) => {
      if (filterMonth   !== 'All' && !b.eventDate.startsWith(filterMonth)) return false;
      if (filterPayment !== 'All' && b.paymentStatus !== filterPayment)    return false;
      if (filterStatus  !== 'All' && b.status        !== filterStatus)     return false;
      return true;
    })
    .sort((a, b) => a.eventDate.localeCompare(b.eventDate));

  const hasFilters = filterMonth !== 'All' || filterPayment !== 'All' || filterStatus !== 'All';

  function handleOpenNewBooking() {
    setEditingBooking(null);
    setIsModalOpen(true);
  }

  function handleCloseModal() {
    setIsModalOpen(false);
  }

  function handleEditBooking(booking) {
    setEditingBooking(booking);
    setIsModalOpen(true);
  }

  function handleCompleteJob(id) {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: 'COMPLETED' } : b))
    );
  }

  function handleBookingSubmit(formData) {
    if (editingBooking) {
      setBookings((prev) =>
        prev.map((b) => (b.id === editingBooking.id ? { ...b, ...formData } : b))
      );
    } else {
      const newBooking = {
        ...formData,
        id: Date.now(),
        status: 'UPCOMING',
      };
      setBookings((prev) => [newBooking, ...prev]);
    }
    setIsModalOpen(false);
  }

  return (
    <div className="flex flex-col gap-6">

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Bookings</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>
            {displayedBookings.length} of {bookings.length} booking{bookings.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Button onClick={handleOpenNewBooking} className="px-5">
          + New Booking
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <select
          value={filterMonth}
          onChange={(e) => setFilterMonth(e.target.value)}
          style={filterSelectStyle}
        >
          {availableMonths.map(({ label, value }) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>

        <select
          value={filterPayment}
          onChange={(e) => setFilterPayment(e.target.value)}
          style={filterSelectStyle}
        >
          <option value="All">All Payments</option>
          <option value="DEPOSIT">Deposit</option>
          <option value="PAID">Paid</option>
          <option value="UNPAID">Unpaid</option>
        </select>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          style={filterSelectStyle}
        >
          <option value="All">All Statuses</option>
          <option value="UPCOMING">Upcoming</option>
          <option value="COMPLETED">Completed</option>
        </select>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block rounded-xl overflow-hidden" style={{ border: '1px solid var(--color-border-subtle)', backgroundColor: 'var(--color-bg-card)' }}>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ backgroundColor: '#111111' }}>
              {['Contact', 'Event Date', 'Location', 'Items', 'Payment', 'Status', 'Actions'].map((col) => (
                <th
                  key={col}
                  className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {displayedBookings.map((booking) => {
              const { summary, extra } = formatItemsSummary(booking.items);
              return (
                <tr
                  key={booking.id}
                  className="transition-colors hover:bg-[#222222]"
                  style={{ borderTop: '1px solid var(--color-border-subtle)' }}
                >
                  {/* Contact */}
                  <td className="px-5 py-4">
                    <p className="font-medium text-white">{booking.contactName}</p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
                      {booking.phone}
                    </p>
                  </td>

                  {/* Event Date */}
                  <td className="px-5 py-4 whitespace-nowrap" style={{ color: 'var(--color-text-muted)' }}>
                    {formatDate(booking.eventDate)}
                  </td>

                  {/* Location */}
                  <td className="px-5 py-4 max-w-[200px]">
                    <p className="truncate" style={{ color: 'var(--color-text-muted)' }}>
                      {booking.location}
                    </p>
                  </td>

                  {/* Items */}
                  <td className="px-5 py-4 max-w-[180px]">
                    <p className="truncate text-xs" style={{ color: 'var(--color-text-muted)' }}>
                      {summary}
                    </p>
                    {extra && (
                      <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-faint)' }}>
                        {extra}
                      </p>
                    )}
                  </td>

                  {/* Payment Status */}
                  <td className="px-5 py-4">
                    <StatusBadge value={booking.paymentStatus} />
                  </td>

                  {/* Booking Status */}
                  <td className="px-5 py-4">
                    <StatusBadge value={booking.status} />
                  </td>

                  {/* Actions */}
                  <td className="px-5 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleEditBooking(booking)}
                        className="px-3 py-1 rounded-md text-xs font-semibold text-white transition-opacity hover:opacity-80"
                        style={{ background: 'var(--color-brand)' }}
                      >
                        Edit
                      </button>
                      {booking.status === 'UPCOMING' && (
                        <button
                          onClick={() => handleCompleteJob(booking.id)}
                          className="px-3 py-1 rounded-md text-xs font-semibold text-white transition-opacity hover:opacity-80"
                          style={{ background: '#16a34a' }}
                        >
                          Complete Job
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {displayedBookings.length === 0 && (
          <div className="py-16 text-center" style={{ color: 'var(--color-text-faint)' }}>
            {hasFilters
              ? 'No bookings match the selected filters.'
              : 'No bookings yet. Click \u201c+ New Booking\u201d to add one.'}
          </div>
        )}
      </div>

      {/* Mobile Cards */}
      <div className="flex flex-col gap-3 md:hidden">
        {displayedBookings.length === 0 && (
          <div className="py-12 text-center rounded-xl" style={{ color: 'var(--color-text-faint)', border: '1px solid var(--color-border-subtle)' }}>
            {hasFilters ? 'No bookings match the selected filters.' : 'No bookings yet.'}
          </div>
        )}

        {displayedBookings.map((booking) => {
          const { summary, extra } = formatItemsSummary(booking.items);
          return (
            <div
              key={booking.id}
              className="rounded-xl p-4 flex flex-col gap-3"
              style={{ backgroundColor: 'var(--color-bg-card)', border: '1px solid var(--color-border-subtle)' }}
            >
              {/* Row 1: Name + Booking Status */}
              <div className="flex items-start justify-between gap-2">
                <p className="font-semibold text-white">{booking.contactName}</p>
                <StatusBadge value={booking.status} />
              </div>

              {/* Row 2: Date + Payment Status */}
              <div className="flex items-center justify-between gap-2">
                <div>
                  <span className="text-xs mr-1" style={{ color: 'var(--color-text-faint)' }}>Date:</span>
                  <span className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                    {formatDate(booking.eventDate)}
                  </span>
                </div>
                <StatusBadge value={booking.paymentStatus} />
              </div>

              {/* Row 3: Location */}
              <div>
                <span className="text-xs mr-1" style={{ color: 'var(--color-text-faint)' }}>Location:</span>
                <span className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                  {booking.location}
                </span>
              </div>

              {/* Row 4: Items */}
              <div>
                <span className="text-xs mr-1" style={{ color: 'var(--color-text-faint)' }}>Items:</span>
                <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                  {summary}
                  {extra && (
                    <span style={{ color: 'var(--color-text-faint)' }}>{extra}</span>
                  )}
                </span>
              </div>

              {/* Row 5: Actions */}
              <div className="flex items-center gap-4 pt-1" style={{ borderTop: '1px solid var(--color-border-subtle)' }}>
                <button
                  onClick={() => handleEditBooking(booking)}
                  className="px-3 py-1 rounded-md text-xs font-semibold text-white transition-opacity hover:opacity-80"
                  style={{ background: 'var(--color-brand)' }}
                >
                  Edit
                </button>
                {booking.status === 'UPCOMING' && (
                  <button
                    onClick={() => handleCompleteJob(booking.id)}
                    className="px-3 py-1 rounded-md text-xs font-semibold text-white transition-opacity hover:opacity-80"
                    style={{ background: '#16a34a' }}
                  >
                    Complete Job
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* New Booking Modal */}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingBooking ? 'Edit Booking' : 'New Booking'}>
        <BookingForm
          key={editingBooking?.id ?? 'new'}
          initialValues={editingBooking}
          onSubmit={handleBookingSubmit}
          onCancel={handleCloseModal}
        />
      </Modal>
    </div>
  );
}
