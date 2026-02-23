import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import placeholderLogo from '../assets/placeholder.svg'

export default function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (!email || !password) {
      setError('Please enter your email and password.')
      return
    }

    setLoading(true)

    // Mock authentication — always succeeds after a short delay
    setTimeout(() => {
      setLoading(false)
      navigate('/admin/analytics')
    }, 1000)
  }

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center px-4 py-10"
      style={{ backgroundColor: '#0d0d0d' }}
    >
      {/* Card */}
      <div
        className="w-full max-w-sm rounded-2xl shadow-2xl px-8 py-10 flex flex-col items-center gap-6"
        style={{ backgroundColor: '#1a1a1a', border: '1px solid #2e1a3a' }}
      >
        {/* Logo */}
        <div className="flex flex-col items-center gap-3">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #6b21a8 0%, #d946ef 100%)' }}
          >
            <img
              src={placeholderLogo}
              alt="Every Milestone Rentals logo"
              className="w-12 h-12 object-contain"
            />
          </div>

          <div className="text-center">
            <h1
              className="text-xl font-bold leading-tight tracking-tight"
              style={{ color: '#e879f9' }}
            >
              Every Milestone
            </h1>
            <p
              className="text-4xl font-black"
              style={{ color: '#a78bfa', letterSpacing: '0.6em', lineHeight: 1 }}
            >
              RENTALS
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-px" style={{ backgroundColor: '#2e1a3a' }} />

        {/* Heading */}
        <div className="text-center">
          <h2 className="text-lg font-semibold text-white">Admin Sign In</h2>
          <p className="text-xs mt-1" style={{ color: '#9ca3af' }}>
            Enter your credentials to continue
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
          {/* Email */}
          <div className="flex flex-col gap-1">
            <label
              htmlFor="email"
              className="text-xs font-medium"
              style={{ color: '#c4b5fd' }}
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="admin@everymilestone.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-600 outline-none transition-all focus:ring-2"
              style={{
                backgroundColor: '#111111',
                border: '1px solid #3b1f52',
                focusRingColor: '#d946ef',
              }}
              onFocus={(e) => (e.target.style.borderColor = '#d946ef')}
              onBlur={(e) => (e.target.style.borderColor = '#3b1f52')}
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1">
            <label
              htmlFor="password"
              className="text-xs font-medium"
              style={{ color: '#c4b5fd' }}
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-600 outline-none transition-all"
              style={{ backgroundColor: '#111111', border: '1px solid #3b1f52' }}
              onFocus={(e) => (e.target.style.borderColor = '#d946ef')}
              onBlur={(e) => (e.target.style.borderColor = '#3b1f52')}
            />
          </div>

          {/* Error message */}
          {error && (
            <p className="text-xs text-center" style={{ color: '#f87171' }}>
              {error}
            </p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg py-2.5 text-sm font-semibold text-white transition-opacity mt-1"
            style={{
              background: loading
                ? '#4a1269'
                : 'linear-gradient(135deg, #7e22ce 0%, #d946ef 100%)',
              opacity: loading ? 0.7 : 1,
              cursor: loading ? 'not-allowed' : 'pointer',
              border: 'none',
            }}
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        {/* Footer note */}
        <p className="text-xs text-center" style={{ color: '#4b5563' }}>
          Authorized personnel only
        </p>
      </div>
    </div>
  )
}
