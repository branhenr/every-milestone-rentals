import { useState, useEffect } from 'react'
import api from '../api'

const FONTS = [
  {
    id: 'inter',
    label: 'Inter',
    tag: 'Single font',
    headingFont: "'Inter', sans-serif",
    bodyFont: "'Inter', sans-serif",
  },
  {
    id: 'space-grotesk',
    label: 'Space Grotesk + Inter',
    tag: 'Current selection',
    headingFont: "'Space Grotesk', sans-serif",
    bodyFont: "'Inter', sans-serif",
    highlight: true,
  },
  {
    id: 'geist',
    label: 'Geist',
    tag: 'Single font',
    headingFont: "'Geist', sans-serif",
    bodyFont: "'Geist', sans-serif",
  },
  {
    id: 'syne-dm',
    label: 'Syne + DM Sans',
    tag: 'Paired fonts',
    headingFont: "'Syne', sans-serif",
    bodyFont: "'DM Sans', sans-serif",
  },
  {
    id: 'outfit',
    label: 'Outfit',
    tag: 'Single font',
    headingFont: "'Outfit', sans-serif",
    bodyFont: "'Outfit', sans-serif",
  },
]

function FontCard({ font }) {
  return (
    <div
      className="rounded-xl p-6 flex flex-col gap-5"
      style={{
        backgroundColor: 'var(--color-bg-card)',
        border: font.highlight
          ? '1px solid var(--color-brand)'
          : '1px solid var(--color-border-subtle)',
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <span
          className="text-xs font-medium"
          style={{ color: 'var(--color-text-muted)', fontFamily: "'Inter', sans-serif" }}
        >
          {font.label}
        </span>
        <span
          className="rounded-full px-2.5 py-0.5 text-xs font-medium"
          style={{
            color: font.highlight ? 'var(--color-brand)' : 'var(--color-text-faint)',
            backgroundColor: font.highlight ? '#2e1a3a' : '#1f1f1f',
            border: font.highlight
              ? '1px solid var(--color-border-subtle)'
              : '1px solid #2a2a2a',
            fontFamily: "'Inter', sans-serif",
          }}
        >
          {font.tag}
        </span>
      </div>

      {/* Heading sample */}
      <div>
        <p
          className="text-3xl font-bold leading-tight text-white"
          style={{ fontFamily: font.headingFont }}
        >
          Every Milestone
        </p>
        <p
          className="text-base font-medium mt-1"
          style={{ fontFamily: font.headingFont, color: 'var(--color-text-label)' }}
        >
          Property Rentals
        </p>
      </div>

      {/* Body sample */}
      <p
        className="text-sm leading-relaxed"
        style={{ fontFamily: font.bodyFont, color: 'var(--color-text-muted)' }}
      >
        Track bookings, manage expenses, and view revenue analytics across all your rental properties in one place.
      </p>

      {/* Stat + Badge row */}
      <div className="flex items-center gap-3">
        <span
          className="text-xl font-semibold"
          style={{ fontFamily: font.headingFont, color: '#22c55e' }}
        >
          $12,450.00
        </span>
        <span
          className="rounded-full px-2.5 py-0.5 text-xs font-medium"
          style={{
            color: 'var(--color-brand)',
            backgroundColor: '#2e1a3a',
            border: '1px solid var(--color-border-subtle)',
            fontFamily: font.bodyFont,
          }}
        >
          Maintenance
        </span>
      </div>

      {/* Button sample */}
      <button
        className="w-full rounded-lg py-2 text-sm font-semibold text-white"
        style={{
          background: 'linear-gradient(to right, #7e22ce, #d946ef)',
          border: 'none',
          fontFamily: font.bodyFont,
          cursor: 'default',
        }}
      >
        Select this font
      </button>
    </div>
  )
}

function CatalogPage() {
  const [status, setStatus] = useState('Checking connection...')

  useEffect(() => {
    api.get('/health')
      .then(response => setStatus(response.data))
      .catch(() => setStatus('Connection failed — is the backend running?'))
  }, [])

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Font Preview</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>
          Compare how each font pairing looks across headings, body text, stats, and UI elements.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {FONTS.map((font) => (
          <FontCard key={font.id} font={font} />
        ))}
      </div>

      <p className="text-xs" style={{ color: 'var(--color-text-faint)' }}>
        Backend: {status}
      </p>
    </div>
  )
}

export default CatalogPage
