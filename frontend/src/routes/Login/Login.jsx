import { useMemo, useState } from 'react'
import CardForms from '../../components/CardForms/CardForms.jsx'
import Footer from '../../components/Footer/Footer.jsx'
import './Login.css'

// Imagens decorativas usadas na composição visual da tela de entrada.
const PHOTOS = {
  // Imagem decorativa colocada à esquerda da composição.
  left: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=400&q=80',
  // Imagem principal colocada no centro da composição.
  center: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=500&q=80',
  // Imagem decorativa colocada à direita da composição.
  right: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=400&q=80',
}

// Desenha a marca com SVG para não depender de uma imagem externa.
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

// Tela inicial: alterna entre entrar e criar conta; a autenticação real
// será conectada ao backend posteriormente.
function LoginPage({ onLogin }) {
  // Guarda se o formulário está no modo de login ou cadastro.
  const [mode, setMode] = useState('login')
  // Guarda o email, usuário ou telefone digitado.
  const [identifier, setIdentifier] = useState('')
  // Guarda a senha digitada no formulário.
  const [password, setPassword] = useState('')
  // Guarda o nome digitado durante o cadastro.
  const [name, setName] = useState('')
  // Guarda a mensagem de validação que será mostrada.
  const [error, setError] = useState('')
  // Guarda uma confirmação ou informação para mostrar no formulário.
  const [message, setMessage] = useState('')

  // Só habilita o envio depois que os campos básicos estiverem preenchidos.
  const canSubmit = useMemo(() => {
    // Verifica a condição entre parênteses e executa o bloco seguinte quando ela é verdadeira.
    if (mode === 'signup' && name.trim().length < 2) return false
    return identifier.trim().length > 3 && password.length >= 6
  }, [identifier, password, name, mode])

  // Valida o formulário e encaminha para o feed no modo de demonstração.
  function handleSubmit(event) {
    // Impede o comportamento padrão do navegador (como recarregar a página ao enviar um formulário).
    event.preventDefault()
    // Limpa ou define a mensagem de erro do formulário.
    setError('')
    // Limpa ou define a mensagem informativa do formulário.
    setMessage('')

    // Verifica a condição entre parênteses e executa o bloco seguinte quando ela é verdadeira.
    if (!canSubmit) {
      // Limpa ou define a mensagem de erro do formulário.
      setError('Preencha os campos corretamente. A senha precisa ter pelo menos 6 caracteres.')
      return
    }

    // Verifica a condição entre parênteses e executa o bloco seguinte quando ela é verdadeira.
    if (mode === 'login') {
      onLogin()
      return
    }

    // Limpa ou define a mensagem informativa do formulário.
    setMessage('Conta montada no frontend. Vamos gravar isso no backend depois.')
  }

  return (
    <main className="login-page">
      {/* Apresentação visual da marca e do propósito do aplicativo. */}
      <section className="login-hero" aria-label="Apresentação">
        <Logo />
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
          password={password} setPassword={setPassword} name={name} setName={setName} error={error}
          message={message} canSubmit={canSubmit} handleSubmit={handleSubmit}
          setError={setError} setMessage={setMessage}/>

        <p className="meta-mark">∞ Momentos</p>
      </section>

      {/* Links informativos e identificação do projeto. */}
      <Footer/>
    </main>
  )
}


export default LoginPage
