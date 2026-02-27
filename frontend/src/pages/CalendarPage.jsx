import { useState, useEffect, useRef } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import mockBookings from '../mock/mockBookings'

function paymentColor(status) {
  if (status === 'PAID') return '#16a34a'
  if (status === 'DEPOSIT') return '#d97706'
  return '#dc2626'
}

const calendarEvents = mockBookings.map((booking) => ({
  id: String(booking.id),
  title: booking.contactName,
  date: booking.eventDate,
  backgroundColor: paymentColor(booking.paymentStatus),
  borderColor: paymentColor(booking.paymentStatus),
  extendedProps: {
    location: booking.location,
    paymentStatus: booking.paymentStatus,
  },
}))

function PaymentBadge({ status }) {
  const styles = {
    PAID: 'text-green-400 bg-green-900/30 border border-green-800/40',
    DEPOSIT: 'text-yellow-400 bg-yellow-900/30 border border-yellow-800/40',
    UNPAID: 'text-red-400 bg-red-900/30 border border-red-800/40',
  }
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[status] ?? styles.UNPAID}`}>
      {status}
    </span>
  )
}

export default function CalendarPage() {
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 640)
  const calendarRef = useRef(null)

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth < 640)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  function handleEventClick({ event }) {
    setSelectedEvent({
      title: event.title,
      date: event.startStr,
      location: event.extendedProps.location,
      paymentStatus: event.extendedProps.paymentStatus,
    })
  }

  return (
    <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
      <h1 className="text-2xl font-bold text-white">Calendar</h1>

      <div className="rounded-xl border border-white/10 bg-white/5 p-2 sm:p-4">
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          events={calendarEvents}
          eventClick={handleEventClick}
          height="auto"
          headerToolbar={
            isMobile
              ? { left: 'prev,next', center: 'title', right: '' }
              : { left: 'prev,next today', center: 'title', right: '' }
          }
          dayMaxEvents={isMobile ? 1 : 3}
          fixedWeekCount={false}
        />
      </div>

      <div className="flex items-center gap-4 text-sm text-white/60">
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-3 w-3 rounded-full bg-green-600" /> Paid
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-3 w-3 rounded-full bg-amber-600" /> Deposit
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-3 w-3 rounded-full bg-red-600" /> Unpaid
        </span>
      </div>

      {selectedEvent && (
        <div className="rounded-xl border border-white/10 bg-white/5 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">{selectedEvent.title}</h2>
            <button
              onClick={() => setSelectedEvent(null)}
              className="text-white/40 hover:text-white/70 text-sm cursor-pointer"
              style={{ background: 'none', border: 'none', padding: 0 }}
            >
              ✕
            </button>
          </div>
          <div className="space-y-1 text-sm text-white/70">
            <p>
              <span className="text-white/40">Date: </span>
              {new Date(selectedEvent.date + 'T00:00:00').toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </p>
            <p>
              <span className="text-white/40">Location: </span>
              {selectedEvent.location}
            </p>
            <p className="flex items-center gap-2">
              <span className="text-white/40">Payment: </span>
              <PaymentBadge status={selectedEvent.paymentStatus} />
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
