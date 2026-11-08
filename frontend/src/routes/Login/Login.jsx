import { useState } from 'react'
import CardForms from '../../components/CardForms/CardForms.jsx'
import Footer from '../../components/Footer/Footer.jsx'
import Logo from '../../components/Logo/Logo.jsx'
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

// Tela inicial que autentica ou cadastra a conta usando o backend.
function LoginPage({ onLogin, onRegister }) {
  // Guarda se o formulário está no modo de login ou cadastro.
  const [mode, setMode] = useState('login')
  // Guarda o email usado para entrar ou cadastrado na conta.
  const [identifier, setIdentifier] = useState('')
  // Guarda a senha digitada no formulário.
  const [password, setPassword] = useState('')
  // Guarda o nome digitado durante o cadastro.
  const [name, setName] = useState('')
  const [username, setUsername] = useState('')
  // Guarda a mensagem de validação que será mostrada.
  const [error, setError] = useState('')
  // Guarda uma confirmação ou informação para mostrar no formulário.
  const [message, setMessage] = useState('')

  // Verifica diretamente se os campos obrigatórios estão preenchidos corretamente.
  const canSubmit = identifier.trim().length > 3 && password.length >= 6 &&
    (mode !== 'signup' || (name.trim().length >= 2 && username.trim().length >= 3))

  // Valida o formulário e encaminha para o feed no modo de demonstração.
  async function handleSubmit(event) {
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
