import { useEffect, useState } from 'react'
import LoginPage from './pages/LoginPage.jsx'
import FeedPage from './pages/FeedPage.jsx'
import ProfilePage from './pages/ProfilePage.jsx'
import SettingsPage from './pages/SettingsPage.jsx'

const PAGES = ['login', 'feed', 'profile', 'settings']

function getPageFromUrl() {
  const requestedPage = new URLSearchParams(window.location.search).get('page')
  return PAGES.includes(requestedPage) ? requestedPage : 'login'
}

export default function AppRouter() {
  const [page, setPage] = useState(getPageFromUrl)
  const [section, setSection] = useState(() => new URLSearchParams(window.location.search).get('section') || 'privacy')

  useEffect(() => {
    const handleBack = () => {
      setPage(getPageFromUrl())
      setSection(new URLSearchParams(window.location.search).get('section') || 'privacy')
    }
    window.addEventListener('popstate', handleBack)
    return () => window.removeEventListener('popstate', handleBack)
  }, [])

  function navigate(nextPage, nextSection = 'privacy') {
    setPage(nextPage)
    setSection(nextSection)
    const url = new URL(window.location.href)
    if (nextPage === 'login') url.searchParams.delete('page')
    else url.searchParams.set('page', nextPage)
    if (nextPage === 'settings') url.searchParams.set('section', nextSection)
    else url.searchParams.delete('section')
    window.history.pushState({}, '', url)
  }

  if (page === 'feed') {
    return <FeedPage onLogout={() => navigate('login')} onProfile={() => navigate('profile')} />
  }
  if (page === 'profile') {
    return <ProfilePage onHome={() => navigate('feed')} onLogout={() => navigate('login')} onSettings={nextSection => navigate('settings', nextSection)} />
  }
  if (page === 'settings') {
    return <SettingsPage section={section} onSectionChange={nextSection => navigate('settings', nextSection)} onBack={() => navigate('profile')} onLogout={() => navigate('login')} />
  }
  return <LoginPage onLogin={() => navigate('feed')} />
}

