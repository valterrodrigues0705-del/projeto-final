import { useEffect, useState } from 'react'
import LoginPage from './pages/LoginPage.jsx'
import FeedPage from './pages/FeedPage.jsx'
import ProfilePage from './pages/ProfilePage.jsx'

const PAGES = ['login', 'feed', 'profile']

function getPageFromUrl() {
  const requestedPage = new URLSearchParams(window.location.search).get('page')
  return PAGES.includes(requestedPage) ? requestedPage : 'login'
}

export default function AppRouter() {
  const [page, setPage] = useState(getPageFromUrl)

  useEffect(() => {
    const handleBack = () => setPage(getPageFromUrl())
    window.addEventListener('popstate', handleBack)
    return () => window.removeEventListener('popstate', handleBack)
  }, [])

  function navigate(nextPage) {
    setPage(nextPage)
    const url = new URL(window.location.href)
    if (nextPage === 'login') url.searchParams.delete('page')
    else url.searchParams.set('page', nextPage)
    window.history.pushState({}, '', url)
  }

  if (page === 'feed') {
    return <FeedPage onLogout={() => navigate('login')} onProfile={() => navigate('profile')} />
  }
  if (page === 'profile') {
    return <ProfilePage onHome={() => navigate('feed')} onLogout={() => navigate('login')} />
  }
  return <LoginPage onLogin={() => navigate('feed')} />
}

