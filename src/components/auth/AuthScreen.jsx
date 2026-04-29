import { useState } from 'react'
import { Wallet, Eye, EyeOff, User, Mail, Lock } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const inputStyle = {
  width: '100%',
  background: '#faf5ff',
  border: '1px solid #ddd6fe',
  color: '#3b0764',
  borderRadius: '12px',
  padding: '12px 14px 12px 42px',
  fontSize: '14px',
  outline: 'none',
  transition: 'border-color 0.15s',
}

function Field({ icon: Icon, label, type = 'text', value, onChange, placeholder, rightEl }) {
  return (
    <div>
      <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: '#a78bfa' }}>{label}</label>
      <div className="relative">
        <Icon size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#c4b5fd' }} />
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required
          style={inputStyle}
          onFocus={e => e.target.style.borderColor = '#8b5cf6'}
          onBlur={e => e.target.style.borderColor = '#ddd6fe'}
        />
        {rightEl && <div className="absolute right-3 top-1/2 -translate-y-1/2">{rightEl}</div>}
      </div>
    </div>
  )
}

function PasswordField({ label, value, onChange, placeholder = 'Enter password' }) {
  const [show, setShow] = useState(false)
  const toggle = (
    <button type="button" onClick={() => setShow(v => !v)} style={{ color: '#c4b5fd', background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }}>
      {show ? <EyeOff size={15} /> : <Eye size={15} />}
    </button>
  )
  return <Field icon={Lock} label={label} type={show ? 'text' : 'password'} value={value} onChange={onChange} placeholder={placeholder} rightEl={toggle} />
}

function LoginForm({ onSwitch }) {
  const { login } = useAuth()
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const result = login(email, password)
    setLoading(false)
    if (result.error) setError(result.error)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Field icon={Mail} label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" />
      <PasswordField label="Password" value={password} onChange={e => setPassword(e.target.value)} />

      {error && (
        <div className="px-4 py-3 rounded-xl text-sm" style={{ background: '#fce7f3', color: '#be185d', border: '1px solid #fbcfe8' }}>
          {error}
        </div>
      )}

      <button type="submit" disabled={loading}
        className="w-full py-3 rounded-xl text-sm font-semibold transition-all"
        style={{ background: '#8b5cf6', color: '#fff', boxShadow: '0 4px 14px rgba(139,92,246,0.35)', opacity: loading ? 0.7 : 1 }}>
        {loading ? 'Signing in…' : 'Sign In'}
      </button>

      <p className="text-center text-sm" style={{ color: '#9ca3af' }}>
        Don't have an account?{' '}
        <button type="button" onClick={onSwitch} className="font-semibold" style={{ color: '#7c3aed', background: 'none', border: 'none', cursor: 'pointer' }}>
          Create one
        </button>
      </p>
    </form>
  )
}

function RegisterForm({ onSwitch }) {
  const { register } = useAuth()
  const [name,     setName]     = useState('')
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [confirm,  setConfirm]  = useState('')
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    if (name.trim().length < 2)            return setError('Please enter your full name.')
    if (password.length < 6)               return setError('Password must be at least 6 characters.')
    if (password !== confirm)              return setError('Passwords do not match.')
    setLoading(true)
    const result = register(name, email, password)
    setLoading(false)
    if (result.error) setError(result.error)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Field icon={User} label="Full Name" value={name} onChange={e => setName(e.target.value)} placeholder="John Smith" />
      <Field icon={Mail} label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" />
      <PasswordField label="Password" value={password} onChange={e => setPassword(e.target.value)} placeholder="At least 6 characters" />
      <PasswordField label="Confirm Password" value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="Repeat your password" />

      {error && (
        <div className="px-4 py-3 rounded-xl text-sm" style={{ background: '#fce7f3', color: '#be185d', border: '1px solid #fbcfe8' }}>
          {error}
        </div>
      )}

      <button type="submit" disabled={loading}
        className="w-full py-3 rounded-xl text-sm font-semibold transition-all"
        style={{ background: '#8b5cf6', color: '#fff', boxShadow: '0 4px 14px rgba(139,92,246,0.35)', opacity: loading ? 0.7 : 1 }}>
        {loading ? 'Creating account…' : 'Create Account'}
      </button>

      <p className="text-center text-sm" style={{ color: '#9ca3af' }}>
        Already have an account?{' '}
        <button type="button" onClick={onSwitch} className="font-semibold" style={{ color: '#7c3aed', background: 'none', border: 'none', cursor: 'pointer' }}>
          Sign in
        </button>
      </p>
    </form>
  )
}

export default function AuthScreen() {
  const [mode, setMode] = useState('login')

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'linear-gradient(135deg, #f5f3ff 0%, #ede9fe 50%, #faf5ff 100%)' }}>
      {/* Decorative blobs */}
      <div style={{ position: 'fixed', top: '-10%', right: '-5%', width: '400px', height: '400px', borderRadius: '50%', background: 'rgba(139,92,246,0.08)', pointerEvents: 'none' }} />
      <div style={{ position: 'fixed', bottom: '-10%', left: '-5%', width: '350px', height: '350px', borderRadius: '50%', background: 'rgba(167,139,250,0.07)', pointerEvents: 'none' }} />

      <div className="w-full" style={{ maxWidth: '420px', position: 'relative', zIndex: 1 }}>
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4"
            style={{ background: '#8b5cf6', boxShadow: '0 8px 24px rgba(139,92,246,0.35)' }}>
            <Wallet size={30} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold" style={{ color: '#3b0764' }}>BudgetIQ</h1>
          <p className="text-sm mt-1" style={{ color: '#a78bfa' }}>Smart personal finance tracking</p>
        </div>

        {/* Tab toggle */}
        <div className="flex p-1 rounded-2xl mb-6" style={{ background: '#ede9fe' }}>
          {['login', 'register'].map(m => (
            <button key={m} type="button" onClick={() => setMode(m)}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold capitalize transition-all"
              style={mode === m
                ? { background: '#fff', color: '#6d28d9', boxShadow: '0 1px 6px rgba(139,92,246,0.15)' }
                : { color: '#a78bfa', background: 'transparent' }
              }>
              {m === 'login' ? 'Sign In' : 'Register'}
            </button>
          ))}
        </div>

        {/* Card */}
        <div style={{ background: '#fff', borderRadius: '20px', border: '1px solid #ede9fe', padding: '28px', boxShadow: '0 4px 24px rgba(139,92,246,0.1)' }}>
          {mode === 'login'
            ? <LoginForm    onSwitch={() => setMode('register')} />
            : <RegisterForm onSwitch={() => setMode('login')} />
          }
        </div>

        <p className="text-center text-xs mt-6" style={{ color: '#c4b5fd' }}>
          Your data is stored locally in your browser
        </p>
      </div>
    </div>
  )
}
