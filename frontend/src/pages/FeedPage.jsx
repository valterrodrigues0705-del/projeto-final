import { useState } from 'react'
import './FeedPage.css'
import Sidebar from '../components/feed/Sidebar.jsx'
import Stories from '../components/feed/Stories.jsx'
import PostsList from '../components/feed/PostsList.jsx'
import Suggestions from '../components/feed/Suggestions.jsx'
import Icon from '../components/feed/Icon.jsx'
import { STORIES } from '../components/feed/feedData.js'

export default function Feed({ onLogout, onProfile }) {
  const [following, setFollowing] = useState({})
  const [activeStory, setActiveStory] = useState(null)
  const [notice, setNotice] = useState('')

  function toast(text) {
    setNotice(text)
    window.setTimeout(() => setNotice(''), 2200)
  }

  function toggleFollowing(name) {
    setFollowing(current => ({ ...current, [name]: !current[name] }))
  }

  return <div className="feed-app">
    <Sidebar onLogout={onLogout} onNotice={toast} onProfile={onProfile}/>
    <main className="feed-main" id="inicio">
      <div className="mobile-feed-header"><a className="feed-wordmark" href="#inicio">momentos<span>✳</span></a><button onClick={() => toast('Você está em dia com as novidades.')} aria-label="Notificações"><Icon name="heart"/></button></div>
      <Stories onOpen={setActiveStory}/>
      <PostsList onNotice={toast}/>
    </main>
    <Suggestions onLogout={onLogout} following={following} onToggleFollowing={toggleFollowing} onNotice={toast}/>
    {activeStory !== null && <div className="story-modal" role="dialog" aria-modal="true" aria-label={`Story de ${STORIES[activeStory].name}`} onClick={() => setActiveStory(null)}><button className="story-close" aria-label="Fechar story">×</button><div className="story-viewer" onClick={event => event.stopPropagation()}><div className="story-progress"><span/></div><div className="story-viewer-user"><img src={STORIES[activeStory].image} alt=""/><strong>{STORIES[activeStory].name}</strong><span>há 2 h</span></div><img className="story-viewer-image" src={STORIES[activeStory].image} alt={`Story de ${STORIES[activeStory].name}`}/><div className="story-reply"><input placeholder="Responder ao story..."/><button onClick={() => setActiveStory(null)}>♡</button></div></div></div>}
    {notice && <div className="feed-toast" role="status">{notice}</div>}
  </div>
}
