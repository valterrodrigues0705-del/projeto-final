import { useEffect, useState } from 'react'
import Sidebar, { Icon } from '../../components/Menu/Menu.jsx'
import { Stories, CardFotosFeed } from '../../components/CardFotosFeed/CardFotosFeed.jsx'
import AsideFeed from '../../components/AsideFeed/AsideFeed.jsx'
import Logo from '../../components/Logo/Logo.jsx'
import CriarConteudo from '../../components/CriarConteudo/CriarConteudo.jsx'
import { apiRequest } from '../../services/api.js'
import './Feed.css'

// Página Feed: coordena o menu, os stories, publicações e estados compartilhados.
export default function Feed({ token, user, onLogout, onProfile }) {
  const [following, setFollowing] = useState({})
  const [activeStory, setActiveStory] = useState(null)
  const [notice, setNotice] = useState('')
  const [feed, setFeed] = useState({ stories: [], posts: [] })
  const [loadingError, setLoadingError] = useState('')
  const [isComposerOpen, setIsComposerOpen] = useState(false)
  const [isDeletingStory, setIsDeletingStory] = useState(false)
  const [creationType, setCreationType] = useState('post')

  // Abre primeiro o story mais recente, que vem no início da lista do backend.
  function openStories(accountStories) {
    setActiveStory({ stories: accountStories, index: 0 })
  }

  // Avança para o próximo story e fecha o visualizador quando a sequência termina.
  function nextStory() {
    setActiveStory(current => {
      if (!current || current.index >= current.stories.length - 1) return null
      return { ...current, index: current.index + 1 }
    })
  }

  // Volta para o story anterior da sequência aberta.
  function previousStory() {
    setActiveStory(current => current && current.index > 0
      ? { ...current, index: current.index - 1 }
      : current)
  }

  // Remove o story aberto da conta atual e atualiza a lista persistida no backend.
  async function deleteStory() {
    if (!currentStory || currentStory.usuario !== user?.usuario) return
    setIsDeletingStory(true)
    try {
      await apiRequest(`/stories/${currentStory.id}`, { method: 'DELETE', token })
      setFeed(await apiRequest('/feed', { token }))
      setActiveStory(null)
      toast('Story excluído.')
    } catch (error) {
      toast(error.message)
    } finally {
      setIsDeletingStory(false)
    }
  }

  const currentStory = activeStory?.stories[activeStory.index]

  useEffect(() => {
    apiRequest('/feed', { token }).then(setFeed).catch(error => setLoadingError(error.message))
  }, [token])

  // Fecha o formulário compartilhado de publicação.
  function closeComposer() {
    setIsComposerOpen(false)
  }

  // Inclui o novo conteúdo no feed sem precisar buscar a lista inteira outra vez.
  function handlePublished(conteudo, tipo) {
    setFeed(atual => ({
      ...atual,
      posts: tipo === 'post' ? [conteudo, ...atual.posts] : atual.posts,
      stories: tipo === 'story' ? [conteudo, ...atual.stories] : atual.stories,
    }))
    closeComposer()
    toast(tipo === 'story' ? 'Story publicado!' : 'Publicação criada!')
  }

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
    <Sidebar user={user} onLogout={onLogout} onNotice={toast} onProfile={onProfile} onCreate={() => { setCreationType('post'); setIsComposerOpen(true) }}/>
    <main className="feed-main" id="inicio">
      <div className="mobile-feed-header">
      <a className="feed-wordmark" href="#inicio" aria-label="Projeto final"><Logo className="feed-logo" /></a>
      <button onClick={() => toast('Você está em dia com as novidades.')} aria-label="Notificações">
      <Icon name="heart"/></button></div>
      <Stories user={user} stories={feed.stories} onOpen={openStories} onCreate={() => { setCreationType('story'); setIsComposerOpen(true) }}/>
      {loadingError ? <p role="alert">{loadingError}</p> : <CardFotosFeed posts={feed.posts} onNotice={toast} token={token} user={user}/>}
    </main>
    <AsideFeed user={user} onLogout={onLogout} following={following} onToggleFollowing={toggleFollowing} onNotice={toast}/>
    {currentStory && <div className="story-modal" role="dialog" aria-modal="true" aria-label={`Story de ${currentStory.usuario}`} onClick={() => setActiveStory(null)}>
    <button className="story-close" aria-label="Fechar story">×</button>
    <div className="story-viewer" onClick={event => event.stopPropagation()}>
    <div className="story-progress">
    {activeStory.stories.map((story, index) => <span key={story.id || index} className={index <= activeStory.index ? 'story-progress-seen' : ''}/>)}</div>
    <div className="story-viewer-user">
    <img src={currentStory.avatar || user?.imagem} alt=""/>
    <strong>{currentStory.usuario}</strong>
    <span>agora</span></div>
    {currentStory.usuario === user?.usuario && <button className="story-delete" type="button" disabled={isDeletingStory} onClick={deleteStory}>
      {isDeletingStory ? 'Excluindo...' : 'Excluir story'}
    </button>}
    <img className="story-viewer-image" src={currentStory.imagem || currentStory.image} alt={`Story de ${currentStory.usuario}`}/>
    <button className="story-step story-step-previous" aria-label="Story anterior" onClick={previousStory}>‹</button>
    <button className="story-step story-step-next" aria-label="Próximo story" onClick={nextStory}>›</button>
    <div className="story-reply">
    <input placeholder="Responder ao story..."/>
    <button onClick={() => setActiveStory(null)}>♡</button></div></div></div>}
    {isComposerOpen && <CriarConteudo token={token} tipoInicial={creationType} onClose={closeComposer} onPublished={handlePublished}/>}
    {notice && <div className="feed-toast" role="status">{notice}</div>}
  </div>
}
