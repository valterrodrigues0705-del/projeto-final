import { useState } from 'react'
import Sidebar, { Icon } from '../../components/Menu/Menu.jsx'
import { Stories, CardFotosFeed } from '../../components/CardFotosFeed/CardFotosFeed.jsx'
import AsideFeed from '../../components/AsideFeed/AsideFeed.jsx'
import { STORIES } from './data.js'
import './Feed.css'

// Página Feed: coordena o menu, os stories, publicações e estados compartilhados.
export default function Feed({ onLogout, onProfile }) {
  // Guarda quem o usuário decidiu seguir, o story aberto e avisos temporários.
  const [following, setFollowing] = useState({})
  // Guarda qual story está aberto; null significa que nenhum está selecionado.
  const [activeStory, setActiveStory] = useState(null)
  // Guarda o texto do aviso temporário exibido na tela.
  const [notice, setNotice] = useState('')

  // Mostra uma mensagem curta na tela e a remove após alguns segundos.
  function toast(text) {
    // Atualiza o texto do aviso mostrado na tela.
    setNotice(text)
    // Agenda a limpeza do aviso depois do intervalo informado.
    window.setTimeout(() => setNotice(''), 2200)
  }

  // Inverte o estado de seguir para a conta selecionada.
  function toggleFollowing(name) {
    // Atualiza a lista de contas seguidas.
    setFollowing(current => ({ ...current, [name]: !current[name] }))
  }

  // Monta a página e passa funções para os componentes filhos em vez de navegar por conta própria.
  return <div className="feed-app">
    <Sidebar onLogout={onLogout} onNotice={toast} onProfile={onProfile}/>
    <main className="feed-main" id="inicio">
      <div className="mobile-feed-header">
      <a className="feed-wordmark" href="#inicio">momentos
      <span>✳</span></a>
      <button onClick={() => toast('Você está em dia com as novidades.')} aria-label="Notificações">
      <Icon name="heart"/></button></div>
      <Stories onOpen={setActiveStory}/>
      <CardFotosFeed onNotice={toast}/>
    </main>
    <AsideFeed onLogout={onLogout} following={following} onToggleFollowing={toggleFollowing} onNotice={toast}/>
    {activeStory !== null && <div className="story-modal" role="dialog" aria-modal="true" aria-label={`Story de ${STORIES[activeStory].name}`} onClick={() => setActiveStory(null)}>
    <button className="story-close" aria-label="Fechar story">×</button>
    <div className="story-viewer" onClick={event => event.stopPropagation()}>
    <div className="story-progress">
    <span/></div>
    <div className="story-viewer-user">
    <img src={STORIES[activeStory].image} alt=""/>
    <strong>{STORIES[activeStory].name}</strong>
    <span>há 2 h</span></div>
    <img className="story-viewer-image" src={STORIES[activeStory].image} alt={`Story de ${STORIES[activeStory].name}`}/>
    <div className="story-reply">
    <input placeholder="Responder ao story..."/>
    <button onClick={() => setActiveStory(null)}>♡</button></div></div></div>}
    {notice && <div className="feed-toast" role="status">{notice}</div>}
  </div>
}
