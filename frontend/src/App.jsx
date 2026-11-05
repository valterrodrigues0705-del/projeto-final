import { useEffect } from 'react'
import { BrowserRouter, Navigate, Route, Routes, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import Feed from './routes/Feed/Feed.jsx'
import Login from './routes/Login/Login.jsx'
import Perfil from './routes/Perfil/Perfil.jsx'
import Configuracoes from './routes/Configuracoes/Configuracoes.jsx'

// Declara as URLs das telas e conecta os eventos dos componentes à navegação.
function AppRoutes() {
  // navigate altera a rota sem recarregar o site; location informa a rota atual.
  const navigate = useNavigate()
  // Declara “location”, valor usado pela lógica ou pela interface.
  const location = useLocation()
  // A seção de configurações fica na URL para permitir voltar/avançar no navegador.
  const [searchParams, setSearchParams] = useSearchParams()

  // Mantém compatibilidade com os endereços antigos que usavam ?page=feed.
  useEffect(() => {
    // Verifica a condição entre parênteses e executa o bloco seguinte quando ela é verdadeira.
    if (location.pathname !== '/') return
    // Declara “legacyPage”, valor usado pela lógica ou pela interface.
    const legacyPage = new URLSearchParams(location.search).get('page')
    // Declara “paths”, valor usado pela lógica ou pela interface.
    const paths = { feed: '/feed', profile: '/perfil', settings: '/configuracoes' }
    // Verifica a condição entre parênteses e executa o bloco seguinte quando ela é verdadeira.
    if (paths[legacyPage]) navigate(`${paths[legacyPage]}${location.search}`, { replace: true })
  }, [location, navigate])

  // Cada Route associa um endereço a uma página. Os callbacks passam a navegação às telas.
  return <Routes>
    <Route path="/" element={<Login onLogin={() => navigate('/feed')}/>}/>
    <Route path="/feed" element={<Feed onLogout={() => navigate('/')} onProfile={() => navigate('/perfil')}/>}/>
    <Route path="/perfil" element={<Perfil onHome={() => navigate('/feed')} onLogout={() => navigate('/')} onSettings={section => navigate(`/configuracoes?section=${section}`)}/>}/>
    <Route path="/configuracoes" element={<Configuracoes section={searchParams.get('section') || 'privacy'} onSectionChange={section => setSearchParams({ section })} onBack={() => navigate('/perfil')} onLogout={() => navigate('/')}/>}/>
    <Route path="*" element={<Navigate to="/" replace/>}/>
  </Routes>
}

export default function App() {
  // BrowserRouter habilita a navegação por endereço e o histórico do navegador.
  return <BrowserRouter>
  <AppRoutes/></BrowserRouter>
}
