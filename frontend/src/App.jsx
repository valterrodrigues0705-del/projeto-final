import { useMemo, useState } from 'react'
import './App.css'

const PHOTOS = {
  left: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=400&q=80',
  center: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=500&q=80',
  right: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=400&q=80',
}

function Logo() {
  return (
    <svg className="brand-logo" viewBox="0 0 48 48" aria-hidden="true">
      <defs>
        <linearGradient id="logoGradient" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stopColor="#f9ce34" />
          <stop offset="45%" stopColor="#ee2a7b" />
          <stop offset="100%" stopColor="#6228d7" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="44" height="44" rx="12" fill="url(#logoGradient)" />
      <rect x="14" y="14" width="20" height="20" rx="6" fill="none" stroke="#fff" strokeWidth="2.4" />
      <circle cx="24" cy="24" r="5" fill="none" stroke="#fff" strokeWidth="2.4" />
      <circle cx="32.8" cy="15.4" r="1.6" fill="#fff" />
    </svg>
  )
}

function App() {
  const [mode, setMode] = useState('login')
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const canSubmit = useMemo(() => {
    if (mode === 'signup' && name.trim().length < 2) return false
    return identifier.trim().length > 3 && password.length >= 6
  }, [identifier, password, name, mode])

  function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setMessage('')

    if (!canSubmit) {
      setError('Preencha os campos corretamente. A senha precisa ter pelo menos 6 caracteres.')
      return
    }

    if (mode === 'login') {
      setMessage('Login pronto no frontend. A API entra na próxima etapa.')
      return
    }

    setMessage('Conta montada no frontend. Vamos gravar isso no backend depois.')
  }

  return (
    <main className="login-page">
      <section className="login-hero" aria-label="Apresentação">
        <Logo />
        <h1>
          Veja momentos do dia a dia dos
          <br />
          seus <span>amigos próximos</span>.
        </h1>

        <div className="photo-stack" aria-hidden="true">
          <article className="photo-card photo-card--left">
            <img src={PHOTOS.left} alt="" />
          </article>
          <article className="photo-card photo-card--center">
            <img src={PHOTOS.center} alt="" />
            <div className="photo-bar">
              <span />
              <span>♡</span>
            </div>
          </article>
          <article className="photo-card photo-card--right">
            <img src={PHOTOS.right} alt="" />
          </article>
          <span className="sticker sticker--heart">❤️</span>
          <span className="sticker sticker--chat">💬😊</span>
          <span className="sticker sticker--star">⭐</span>
          <span className="sticker sticker--planet">🟢</span>
        </div>
      </section>

      <section className="login-panel">
        <h2>{mode === 'login' ? 'Entrar' : 'Criar nova conta'}</h2>

        <form className="login-form" onSubmit={handleSubmit}>
          {mode === 'signup' && (
            <div className="field">
              <input
                id="name"
                type="text"
                value={name}
                placeholder=" "
                autoComplete="name"
                onChange={(event) => setName(event.target.value)}
              />
              <label htmlFor="name">Nome completo</label>
            </div>
          )}

          <div className="field">
            <input
              id="identifier"
              type="text"
              value={identifier}
              placeholder=" "
              autoComplete="username"
              onChange={(event) => setIdentifier(event.target.value)}
            />
            <label htmlFor="identifier">Número de celular, nome de usuário ou email</label>
          </div>

          <div className="field">
            <input
              id="password"
              type="password"
              value={password}
              placeholder=" "
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              onChange={(event) => setPassword(event.target.value)}
            />
            <label htmlFor="password">Senha</label>
          </div>

          {error && <p className="login-error">{error}</p>}
          {message && <p className="login-error" style={{ color: '#7dcea0' }}>{message}</p>}

          <button className="btn btn-primary" type="submit" disabled={!canSubmit}>
            {mode === 'login' ? 'Entrar' : 'Cadastrar'}
          </button>

          {mode === 'login' && (
            <button className="forgot" type="button" onClick={() => setMessage('Recuperação de senha entra depois, com o backend.')}>
              Esqueceu a senha?
            </button>
          )}

          <div className="divider" />

          <button className="btn btn-ghost" type="button">
            <span className="facebook-mark">f</span>
            Entrar com Facebook
          </button>

          <button
            className="btn btn-outline"
            type="button"
            onClick={() => {
              setError('')
              setMessage('')
              setMode(mode === 'login' ? 'signup' : 'login')
            }}
          >
            {mode === 'login' ? 'Criar nova conta' : 'Já tenho uma conta'}
          </button>
        </form>

        <p className="meta-mark">∞ Momentos</p>
      </section>

      <footer className="login-footer">
        <a href="#sobre">Sobre</a>
        <a href="#ajuda">Ajuda</a>
        <a href="#api">API</a>
        <a href="#privacidade">Privacidade</a>
        <a href="#termos">Termos</a>
        <a href="#localizacoes">Localizações</a>
        <span>© {new Date().getFullYear()} Projeto final</span>
      </footer>
    </main>
  )
}

export default App
