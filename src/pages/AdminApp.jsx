
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import './Admin.css'
import ProjectManager from '../components/ProjectManager'

export default function AdminApp() {
  const [user, setUser] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  // Check authentication and admin permission.
  useEffect(() => {
    let active = true

    async function checkAdmin() {
      setLoading(true)

      const {
        data: { user: currentUser },
        error: authError,
      } = await supabase.auth.getUser()

      if (!active) return

      if (authError || !currentUser) {
        setUser(null)
        setIsAdmin(false)
        setLoading(false)
        return
      }

      const { data, error } = await supabase
        .from('portfolio_admins')
        .select('user_id')
        .eq('user_id', currentUser.id)
        .maybeSingle()

      if (!active) return

      setUser(currentUser)
      setIsAdmin(!error && !!data)

      if (error) {
        setErrorMessage('Unable to verify admin access.')
      }

      setLoading(false)
    }

    checkAdmin()

    return () => {
      active = false
    }
  }, [])

  async function handleLogin(event) {
    event.preventDefault()
    setErrorMessage('')
    setSubmitting(true)

    const { data, error } =
      await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      })

    if (error || !data.user) {
      setErrorMessage(
        error?.message || 'Unable to sign in.'
      )
      setSubmitting(false)
      return
    }

    // Verify that this user is a registered admin.
    const { data: admin, error: adminError } =
      await supabase
        .from('portfolio_admins')
        .select('user_id')
        .eq('user_id', data.user.id)
        .maybeSingle()

    if (adminError || !admin) {
      await supabase.auth.signOut()
      setUser(null)
      setIsAdmin(false)

      setErrorMessage(
        'This account does not have administrator access.'
      )

      setSubmitting(false)
      return
    }

    setUser(data.user)
    setIsAdmin(true)
    setPassword('')
    setSubmitting(false)
  }

  async function handleLogout() {
    setSubmitting(true)

    const { error } = await supabase.auth.signOut()

    if (error) {
      setErrorMessage(error.message)
    } else {
      setUser(null)
      setIsAdmin(false)
      setPassword('')
      setErrorMessage('')
    }

    setSubmitting(false)
  }

  if (loading) {
    return (
      <div className="admin-page">
        <p className="admin-loading">
          Verifying your account...
        </p>
      </div>
    )
  }

  if (user && isAdmin) {
    return (
      <div className="admin-page">
        <div className="admin-dashboard">
          <header className="admin-dashboard-header">
            <a href="/" className="admin-brand">
              joy<span>.</span>dev
            </a>

            <button
              onClick={handleLogout}
              disabled={submitting}
              className="admin-logout"
            >
              Log out ↗
            </button>
          </header>

          <main className="admin-dashboard-main">
            <p className="admin-eyebrow">
              YOUR PRIVATE WORKSPACE
            </p>

            <h1>Welcome back, Joy.</h1>

            <p className="admin-description">
              You're successfully signed in to your
              portfolio dashboard.
            </p>

            <div className="admin-stat-grid">
              <div className="admin-stat">
                <span>ACCOUNT</span>
                <strong>Active</strong>
              </div>

              <div className="admin-stat">
                <span>ADMIN ACCESS</span>
                <strong>Verified</strong>
              </div>

              <div className="admin-stat">
                <span>PROJECT MANAGER</span>
                <strong>Coming next</strong>
              </div>
            </div>

            <ProjectManager />

            {errorMessage && (
              <p className="admin-error" role="alert">
                {errorMessage}
              </p>
            )}
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-page">
      <div className="admin-login-layout">
        <a href="/" className="admin-back">
          ← Back to portfolio
        </a>

        <div className="admin-login-card">
          <div className="admin-login-icon">✦</div>

          <p className="admin-eyebrow">
            PRIVATE ACCESS / JOY.DEV
          </p>

          <h1>
            Welcome
            <br />
            <em>back.</em>
          </h1>

          <p className="admin-description">
            Sign in to manage your portfolio projects.
          </p>

          <form
            onSubmit={handleLogin}
            className="admin-form"
          >
            <label htmlFor="admin-email">
              EMAIL ADDRESS
            </label>

            <input
              id="admin-email"
              type="email"
              autoComplete="username"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <label htmlFor="admin-password">
              PASSWORD
            </label>

            <input
              id="admin-password"
              type="password"
              autoComplete="current-password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {errorMessage && (
              <p className="admin-error" role="alert">
                {errorMessage}
              </p>
            )}

            <button
              type="submit"
              className="admin-submit"
              disabled={submitting}
            >
              {submitting
                ? 'Signing in...'
                : 'Sign in to dashboard →'}
            </button>
          </form>

          <p className="admin-footnote">
            Authorized access only · Protected by Supabase
          </p>
        </div>
      </div>
    </div>
  )
}
