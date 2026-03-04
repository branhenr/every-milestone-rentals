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

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

export default function CalendarPage() {
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 640)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [pickerYear, setPickerYear] = useState(new Date().getFullYear())
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const calendarRef = useRef(null)
  const containerRef = useRef(null)
  const dropdownRef = useRef(null)

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth < 640)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    if (!containerRef.current) return
    const observer = new ResizeObserver(() => {
      calendarRef.current?.getApi().updateSize()
    })
    observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!dropdownOpen) return
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [dropdownOpen])

  function handleDatesSet({ start }) {
    const mid = new Date(start.getTime() + 15 * 24 * 60 * 60 * 1000)
    setCurrentDate(mid)
    setPickerYear(mid.getFullYear())
  }

  function openDropdown() {
    setPickerYear(currentDate.getFullYear())
    setDropdownOpen(true)
  }

  function goToMonth(monthIndex) {
    calendarRef.current?.getApi().gotoDate(new Date(pickerYear, monthIndex, 1))
    setDropdownOpen(false)
  }

  function handleEventClick({ event }) {
    setSelectedEvent({
      title: event.title,
      date: event.startStr,
      location: event.extendedProps.location,
      paymentStatus: event.extendedProps.paymentStatus,
    })
  }

  const navBtnClass = "px-2 py-1 rounded-md text-sm font-medium transition-colors hover:bg-[#2e1a3a]"
  const navBtnStyle = { color: 'var(--color-text-muted)', background: 'transparent', border: 'none', cursor: 'pointer' }

  return (
    <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
      <h1 className="text-2xl font-bold text-white">Calendar</h1>

      <div ref={containerRef} className="rounded-xl border border-white/10 bg-white/5 p-2 sm:p-4 space-y-3">
        {/* Custom toolbar */}
        <div className="flex items-center justify-between px-1">
          {/* Left: nav buttons */}
          <div className="flex items-center gap-1">
            <button className={navBtnClass} style={navBtnStyle} onClick={() => calendarRef.current?.getApi().prev()}>‹</button>
            <button className={navBtnClass} style={navBtnStyle} onClick={() => calendarRef.current?.getApi().next()}>›</button>
            {!isMobile && (
              <button className={navBtnClass} style={navBtnStyle} onClick={() => calendarRef.current?.getApi().today()}>Today</button>
            )}
          </div>

          {/* Center: clickable title with dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={openDropdown}
              className="flex items-center gap-1 px-3 py-1 rounded-md text-sm font-semibold text-white transition-colors hover:bg-[#2e1a3a]"
              style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
            >
              {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>▾</span>
            </button>

            {dropdownOpen && (
              <div
                className="absolute left-1/2 -translate-x-1/2 top-full mt-1 z-50 rounded-xl p-3 w-56"
                style={{ backgroundColor: 'var(--color-bg-card)', border: '1px solid var(--color-border-subtle)' }}
              >
                {/* Year row */}
                <div className="flex items-center justify-between mb-2 px-1">
                  <button className={navBtnClass} style={navBtnStyle} onClick={() => setPickerYear(y => y - 1)}>‹</button>
                  <span className="text-sm font-semibold text-white">{pickerYear}</span>
                  <button className={navBtnClass} style={navBtnStyle} onClick={() => setPickerYear(y => y + 1)}>›</button>
                </div>
                {/* Month grid */}
                <div className="grid grid-cols-3 gap-1">
                  {MONTHS.map((month, i) => {
                    const isActive = currentDate.getFullYear() === pickerYear && currentDate.getMonth() === i
                    return (
                      <button
                        key={month}
                        onClick={() => goToMonth(i)}
                        className="rounded-md py-1.5 text-xs font-semibold transition-colors"
                        style={{
                          backgroundColor: isActive ? '#2e1a3a' : 'transparent',
                          color: isActive ? 'white' : 'var(--color-text-muted)',
                          border: 'none',
                          cursor: 'pointer',
                        }}
                      >
                        {month}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Right: invisible spacer to keep title centered */}
          <div className="flex items-center gap-1 invisible" aria-hidden="true">
            <button className={navBtnClass}>‹</button>
            <button className={navBtnClass}>›</button>
            {!isMobile && <button className={navBtnClass}>Today</button>}
          </div>
        </div>

        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          events={calendarEvents}
          eventClick={handleEventClick}
          datesSet={handleDatesSet}
          height="auto"
          headerToolbar={false}
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
