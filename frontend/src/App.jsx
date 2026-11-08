import { useCallback, useEffect, useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes, useNavigate, useSearchParams } from 'react-router-dom'
import Feed from './routes/Feed/Feed.jsx'
import Login from './routes/Login/Login.jsx'
import Perfil from './routes/Perfil/Perfil.jsx'
import Configuracoes from './routes/Configuracoes/Configuracoes.jsx'
import { apiRequest } from './services/api.js'

const TOKEN_KEY = 'projeto-final-token'
const USER_KEY = 'projeto-final-user'

// Declara as URLs das telas e conecta os eventos dos componentes à navegação.
function AppRoutes() {
  // navigate altera a rota sem recarregar o site.
  const navigate = useNavigate()
  // A seção de configurações fica na URL para permitir voltar/avançar no navegador.
  const [searchParams, setSearchParams] = useSearchParams()
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || '')
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(USER_KEY) || 'null')
    } catch {
      return null
    }
  })
  const [checkingSession, setCheckingSession] = useState(Boolean(localStorage.getItem(TOKEN_KEY)))

  // Confirma no backend que uma sessão salva ainda pertence a uma conta válida.
  useEffect(() => {
    const savedToken = localStorage.getItem(TOKEN_KEY)
    if (!savedToken) return

    async function checkSavedSession() {
      try {
        const usuario = await apiRequest('/usuario', { token: savedToken })
        setUser(usuario)
        localStorage.setItem(USER_KEY, JSON.stringify(usuario))
      } catch {
        localStorage.removeItem(TOKEN_KEY)
        localStorage.removeItem(USER_KEY)
        setToken('')
        setUser(null)
      } finally {
        setCheckingSession(false)
      }
    }

    checkSavedSession()
  }, [])

  function saveSession(session) {
    localStorage.setItem(TOKEN_KEY, session.token)
    localStorage.setItem(USER_KEY, JSON.stringify(session.usuario))
    setToken(session.token)
    setUser(session.usuario)
  }

  async function login(email, password) {
    const dadosLogin = {
      email: email,
      senha: password,
    }
    const opcoesLogin = {
      method: 'POST',
      body: dadosLogin,
    }

    const session = await apiRequest('/login', opcoesLogin)
    saveSession(session)
    navigate('/feed')
  }

  async function register(dadosCadastro) {
    const dadosUsuario = {
      nome: dadosCadastro.name,
      usuario: dadosCadastro.username,
      email: dadosCadastro.email,
      senha: dadosCadastro.password,
    }
    const opcoesCadastro = {
      method: 'POST',
      body: dadosUsuario,
    }

    await apiRequest('/usuario', opcoesCadastro)
    navigate('/', { replace: true })
  }

  function logout() {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    setToken('')
    setUser(null)
    navigate('/')
  }

  const updateUser = useCallback((updatedUser) => {
    localStorage.setItem(USER_KEY, JSON.stringify(updatedUser))
    setUser(updatedUser)
  }, [])

  // Funções pequenas deixam claro para onde cada botão de navegação leva.
  function goToFeed() {
    navigate('/feed')
  }

  function goToProfile() {
    navigate('/perfil')
  }

  function goToSettings(section) {
    navigate(`/configuracoes?section=${section}`)
  }

  function changeSettingsSection(section) {
    setSearchParams({ section: section })
  }

  function goBackToProfile() {
    navigate('/perfil')
  }

  // Cada Route associa um endereço a uma página. Os callbacks passam a navegação às telas.
  if (checkingSession) return <main className="session-loading">Verificando sua conta...</main>

  return (
    <Routes>
      <Route
        path="/"
        element={<Login onLogin={login} onRegister={register} />}
      />

      <Route
        path="/feed"
        element={
          token ? (
            <Feed
              token={token}
              user={user}
              onLogout={logout}
              onProfile={goToProfile}
            />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />

      <Route
        path="/perfil"
        element={
          token ? (
            <Perfil
              token={token}
              user={user}
              onUserUpdate={updateUser}
              onHome={goToFeed}
              onLogout={logout}
              onSettings={goToSettings}
            />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />

      <Route
        path="/configuracoes"
        element={
          token ? (
            <Configuracoes
              token={token}
              user={user}
              onUserUpdate={updateUser}
              section={searchParams.get('section') || 'editProfile'}
              onSectionChange={changeSettingsSection}
              onBack={goBackToProfile}
              onLogout={logout}
            />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  // BrowserRouter habilita a navegação por endereço e o histórico do navegador.
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}
