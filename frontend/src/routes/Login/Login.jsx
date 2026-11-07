import { useState } from 'react'
import CardForms from '../../components/CardForms/CardForms.jsx'
import Footer from '../../components/Footer/Footer.jsx'
import Logo from '../../components/Logo/Logo.jsx'
import './Login.css'

// Imagens decorativas usadas na composição visual da tela de entrada.
const PHOTOS = {
  left: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=400&q=80',
  center: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=500&q=80',
  right: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=400&q=80',
}

// Tela inicial que autentica ou cadastra a conta usando o backend.
function LoginPage({ onLogin, onRegister }) {
  const [mode, setMode] = useState('login')
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [username, setUsername] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const canSubmit = identifier.trim().length > 3 && password.length >= 6 &&
    (mode !== 'signup' || (name.trim().length >= 2 && username.trim().length >= 3))

  // Valida o formulário e envia os dados de login ou cadastro ao backend.
  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setMessage('')

    if (!canSubmit) {
      setError('Preencha os campos corretamente. A senha precisa ter pelo menos 6 caracteres.')
      return
    }

    if (mode === 'login') {
      try {
        await onLogin(identifier, password)
      } catch (requestError) {
        setError(requestError.message)
      }
      return
    }

    try {
      await onRegister({ name, username, email: identifier, password })
      setMode('login')
      setPassword('')
      setMessage('Conta criada com sucesso. Entre com seu email e senha.')
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  return (
    <main className="login-page">
      {/* Apresentação visual da marca e do propósito do aplicativo. */}
      <section className="login-hero" aria-label="Apresentação">
        <Logo className="brand-logo" />
        <h1>
          Veja momentos do dia a dia dos
          <br />
          seus 
          <span>amigos próximos</span>.
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

      {/* Formulário e ações da conta ficam no painel lateral. */}
      <section className="login-panel">
        <CardForms mode={mode} setMode={setMode} identifier={identifier} setIdentifier={setIdentifier}
          username={username} setUsername={setUsername}
          password={password} setPassword={setPassword} name={name} setName={setName} error={error}
          message={message} canSubmit={canSubmit} handleSubmit={handleSubmit}
          setError={setError} setMessage={setMessage}/>

        <p className="meta-mark">∞ Projeto final</p>
      </section>

      {/* Links informativos e identificação do projeto. */}
      <Footer/>
    </main>
  )
}


export default LoginPage
