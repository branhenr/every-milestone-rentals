import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.svg';
import Button from '../components/Button';

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please enter your email and password.');
      return;
    }

    setLoading(true);

    // Mock authentication — always succeeds after a short delay
    setTimeout(() => {
      setLoading(false);
      navigate('/admin/analytics');
    }, 1000);
  }

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center px-4 py-10"
      style={{ backgroundColor: 'var(--color-bg-page)' }}
    >
      {/* Card */}
      <div
        className="w-full max-w-sm rounded-2xl shadow-2xl px-8 py-10 flex flex-col items-center gap-6"
        style={{ backgroundColor: 'var(--color-bg-card)', border: '1px solid var(--color-border-subtle)' }}
      >
        {/* Logo */}
        <div className="flex flex-col items-center gap-3">
          <div
            className="w-100 h-32 rounded-full flex items-center justify-center overflow-hidden"
          >
            <img
              src={logo}
              alt="Every Milestone Rentals logo"
              className="w-100 h-100 object-contain"
            />
          </div>

          <div className="text-center">
            <h1
              className="text-xl font-bold leading-tight tracking-tight"
              style={{ color: 'var(--color-brand)' }}
            >
              Every 
            </h1>
            <h1
              className="text-xl font-bold leading-tight tracking-tight"
              style={{ color: 'var(--color-brand)' }}
            >
              Milestone
            </h1>
            <p
              className="text-4xl font-black"
              style={{
                color: 'var(--color-brand)',
                letterSpacing: '0.6em',
                lineHeight: 1,
              }}
            >
              RENTALS
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-px" style={{ backgroundColor: 'var(--color-border-subtle)' }} />

        {/* Heading */}
        <div className="text-center">
          <h2 className="text-lg font-semibold text-white">Admin Sign In</h2>
          <p className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>
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
              style={{ color: 'var(--color-text-label)' }}
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
                backgroundColor: 'var(--color-bg-input)',
                border: '1px solid var(--color-border-input)',
                focusRingColor: '#d946ef',
              }}
              onFocus={(e) => (e.target.style.borderColor = 'var(--color-border-focus)')}
              onBlur={(e) => (e.target.style.borderColor = 'var(--color-border-input)')}
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1">
            <label
              htmlFor="password"
              className="text-xs font-medium"
              style={{ color: 'var(--color-text-label)' }}
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
              style={{
                backgroundColor: 'var(--color-bg-input)',
                border: '1px solid var(--color-border-input)',
              }}
              onFocus={(e) => (e.target.style.borderColor = 'var(--color-border-focus)')}
              onBlur={(e) => (e.target.style.borderColor = 'var(--color-border-input)')}
            />
          </div>

          {/* Error message */}
          {error && (
            <p className="text-xs text-center" style={{ color: 'var(--color-error)' }}>
              {error}
            </p>
          )}

          {/* Submit */}
          <Button type="submit" loading={loading} className="w-full mt-1">
            {loading ? 'Signing in…' : 'Sign In'}
          </Button>
        </form>

        {/* Footer note */}
        <p className="text-xs text-center" style={{ color: 'var(--color-text-faint)' }}>
          Authorized personnel only
        </p>
      </div>
    </div>
  );
}
