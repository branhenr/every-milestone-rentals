import { useState } from 'react';
import mockBookings from '../mock/mockBookings';
import Modal from '../components/Modal';
import BookingForm from '../components/BookingForm';
import Button from '../components/Button';

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
  };

  const classNames = {
    UPCOMING: '',
    COMPLETED: 'text-green-400 bg-green-900/30 border border-green-800/40',
    DEPOSIT: 'text-yellow-400 bg-yellow-900/30 border border-yellow-800/40',
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

  function handleOpenNewBooking() {
    setEditingBooking(null);
    setIsModalOpen(true);
  }

  function handleCloseModal() {
    setIsModalOpen(false);
  }

  function handleBookingSubmit(formData) {
    const newBooking = {
      ...formData,
      id: Date.now(),
      status: 'UPCOMING',
    };
    setBookings((prev) => [newBooking, ...prev]);
    setIsModalOpen(false);
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Bookings</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>
            {bookings.length} booking{bookings.length !== 1 ? 's' : ''} total
          </p>
        </div>
        <Button onClick={handleOpenNewBooking} className="px-5">
          + New Booking
        </Button>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block rounded-xl overflow-hidden" style={{ border: '1px solid var(--color-border-subtle)', backgroundColor: 'var(--color-bg-card)' }}>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ backgroundColor: '#111111' }}>
              {['Contact', 'Event Date', 'Location', 'Items', 'Payment', 'Status'].map((col) => (
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
            {bookings.map((booking) => {
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
                </tr>
              );
            })}
          </tbody>
        </table>

        {bookings.length === 0 && (
          <div className="py-16 text-center" style={{ color: 'var(--color-text-faint)' }}>
            No bookings yet. Click &ldquo;+ New Booking&rdquo; to add one.
          </div>
        )}
      </div>

      {/* Mobile Cards */}
      <div className="flex flex-col gap-3 md:hidden">
        {bookings.length === 0 && (
          <div className="py-12 text-center rounded-xl" style={{ color: 'var(--color-text-faint)', border: '1px solid var(--color-border-subtle)' }}>
            No bookings yet.
          </div>
        )}

        {bookings.map((booking) => {
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
            </div>
          );
        })}
      </div>

      {/* New Booking Modal */}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title="New Booking">
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
