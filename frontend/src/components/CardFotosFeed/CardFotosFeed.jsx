import { useEffect, useRef, useState } from 'react'
import { Icon } from '../Menu/Menu.jsx'
import { STORIES, POSTS } from '../../routes/Feed/data.js'
import { apiRequest } from '../../services/api.js'

// Faixa horizontal de stories; a rota informa qual story foi selecionado.
export function Stories({ user, onOpen, onCreate, stories = STORIES }) {
  const storiesRef = useRef(null)
  const trackRef = useRef(null)
  const [hasMoreStories, setHasMoreStories] = useState(false)
  // Junta os stories por conta para que um círculo abra a sequência completa daquela pessoa.
  const storiesByUser = new Map()
  stories.forEach(story => {
    if (!storiesByUser.has(story.usuario)) storiesByUser.set(story.usuario, [])
    storiesByUser.get(story.usuario).push(story)
  })
  const ownStories = storiesByUser.get(user?.usuario) || []
  const otherStories = [...storiesByUser.entries()].filter(([usuario]) => usuario !== user?.usuario)
  const items = [
    { name: 'Seu story', image: ownStories[0]?.imagem || ownStories[0]?.image || ownStories[0]?.avatar || user?.imagem, own: true, stories: ownStories },
    ...otherStories.map(([usuario, accountStories]) => ({
      name: usuario,
      image: accountStories[0]?.imagem || accountStories[0]?.image || accountStories[0]?.avatar,
      stories: accountStories,
    })),
  ]

  // Verifica se a faixa ultrapassa a largura disponível e precisa da seta.
  useEffect(() => {
    const container = storiesRef.current
    const track = trackRef.current
    if (!container || !track) return

    const updateOverflow = () => setHasMoreStories(track.scrollWidth > container.clientWidth + 1)
    updateOverflow()
    const observer = new ResizeObserver(updateOverflow)
    observer.observe(container)
    observer.observe(track)
    window.addEventListener('resize', updateOverflow)
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', updateOverflow)
    }
  }, [items.length])

  // Avança uma parte da faixa e volta ao início quando chega ao final.
  function showNextStories() {
    const container = storiesRef.current
    if (!container) return
    const atEnd = container.scrollLeft + container.clientWidth >= container.scrollWidth - 2
    container.scrollTo({ left: atEnd ? 0 : container.scrollLeft + container.clientWidth * 0.8, behavior: 'smooth' })
  }

  return <section className={`stories${hasMoreStories ? ' stories-overflow' : ''}`} aria-label="Stories" ref={storiesRef}>
    <div className="stories-track" ref={trackRef}>
      {items.map((story, index) => <button className="story" key={`${story.name}-${index}`} onClick={() => story.own && !story.stories.length ? onCreate() : onOpen(story.stories)}>
        <span className={`story-ring ${story.own && !story.stories.length ? 'story-ring-own' : ''}`}>
          <img src={story.image} alt=""/>
        </span>
        <span className="story-name">{story.name}</span>
      </button>)}
    </div>
    {hasMoreStories && <button className="story-next" aria-label="Ver mais stories" onClick={showNextStories}>›</button>}
  </section>
}

// Publicação individual, com curtida e comentário guardados no próprio cartão.
function PostCard({ post, index, onNotice, token, user: currentUser }) {
  const [liked, setLiked] = useState(() => (post.curtidoPor || []).includes(currentUser?.id))
  const [likesCount, setLikesCount] = useState(Number(post.curtidas ?? post.likes ?? 0))
  const [comments, setComments] = useState(post.comentarios || [])
  const [isSavingLike, setIsSavingLike] = useState(false)
  const [isSavingComment, setIsSavingComment] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [showAllComments, setShowAllComments] = useState(false)
  const user = post.user || post.usuario
  const caption = post.caption || post.legenda || ''
  const image = post.image || post.imagem
  const avatar = post.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80'
  const location = post.location || post.local

  async function toggleLike() {
    if (!post.id || !token || isSavingLike) return
    setIsSavingLike(true)
    try {
      const result = await apiRequest(`/posts/${post.id}/curtidas`, { method: 'POST', token })
      setLiked(result.curtidoPor.includes(currentUser?.id))
      setLikesCount(result.curtidas)
    } catch (error) {
      onNotice(error.message)
    } finally {
      setIsSavingLike(false)
    }
  }

  async function submitComment(event) {
    event.preventDefault()
    const form = event.currentTarget
    const texto = form.elements.comment.value.trim()
    if (!texto) return
    if (!post.id || !token || isSavingComment) return
    setIsSavingComment(true)
    try {
      const result = await apiRequest(`/posts/${post.id}/comentarios`, { method: 'POST', token, body: { texto } })
      setComments(result.comentarios)
      form.reset()
    } catch (error) {
      onNotice(error.message)
    } finally {
      setIsSavingComment(false)
    }
  }

  return <article className="post">
    <header className="post-header">
      <img className="avatar" src={avatar} alt=""/>
      <div className="post-author"><strong>{user}</strong><span>{location}</span></div>
      <span className="post-age">{index === 0 ? '2 h' : `${index + 1} h`}</span>
      <button className="icon-button post-more" aria-label="Mais opções" onClick={() => onNotice('Opções da publicação')}>•••</button>
    </header>
    <button className="post-image-trigger" type="button" onClick={() => setIsExpanded(true)} aria-label={`Ampliar publicação de ${user}`}>
      <img className="post-image" src={image} alt={`Publicação de ${user}: ${caption}`}/>
    </button>
    <div className="post-actions">
      <button className={liked ? 'is-liked' : ''} aria-label={liked ? 'Descurtir' : 'Curtir'} disabled={isSavingLike} onClick={toggleLike}><Icon name="heart" filled={liked}/></button>
      <button aria-label="Comentar" onClick={() => document.getElementById(`comment-${index}`)?.focus()}><Icon name="comment"/></button>
      <button aria-label="Compartilhar" onClick={() => onNotice('Link da publicação copiado!')}><Icon name="send"/></button>
      <button className="save-action" aria-label="Salvar publicação" onClick={() => onNotice('Publicação salva')}><Icon name="bookmark"/></button>
    </div>
    <p className="post-likes">{likesCount.toLocaleString('pt-BR')} curtidas</p>
    <p className="post-caption"><strong>{user}</strong> {caption}</p>
    {(showAllComments ? comments : comments.slice(-2)).map(item => <p className="post-caption new-comment" key={item.id}><strong>{item.usuario}</strong> {item.texto}</p>)}
    {comments.length > 0
      ? <button className="post-comments" type="button" onClick={() => setShowAllComments(value => !value)}>
          {showAllComments ? 'Ocultar comentários' : `Ver todos os ${comments.length} comentários`}
        </button>
      : <p className="post-comments">Ainda não há comentários</p>}
    <form className="comment-form" onSubmit={submitComment}>
      <input id={`comment-${index}`} name="comment" placeholder="Adicione um comentário..." aria-label="Adicione um comentário"/>
      <button type="submit" disabled={isSavingComment}>{isSavingComment ? 'Enviando...' : 'Publicar'}</button>
    </form>
    {isExpanded && <div className="post-viewer-backdrop" role="presentation" onMouseDown={event => {
      if (event.target === event.currentTarget) setIsExpanded(false)
    }}>
      <section className="post-viewer" role="dialog" aria-modal="true" aria-label={`Publicação de ${user}`}>
        <button className="post-viewer-close" type="button" aria-label="Fechar publicação" onClick={() => setIsExpanded(false)}>×</button>
        <img className="post-viewer-image" src={image} alt={`Publicação ampliada de ${user}`}/>
        <div className="post-viewer-details">
          <header className="post-viewer-header">
            <img className="avatar" src={avatar} alt=""/>
            <strong>{user}</strong>
            {location && <span>· {location}</span>}
          </header>
          <div className="post-viewer-caption"><img className="avatar" src={avatar} alt=""/><p><strong>{user}</strong> {caption}</p></div>
          <div className="post-viewer-comments">
            {comments.map(item => <p className="post-viewer-comment" key={item.id}><strong>{item.usuario}</strong> {item.texto}</p>)}
          </div>
          <div className="post-viewer-actions">
            <button className={liked ? 'is-liked' : ''} type="button" disabled={isSavingLike} aria-label={liked ? 'Descurtir' : 'Curtir'} onClick={toggleLike}><Icon name="heart" filled={liked}/></button>
            <button type="button" aria-label="Comentar" onClick={() => document.getElementById(`comment-${index}`)?.focus()}><Icon name="comment"/></button>
            <button type="button" aria-label="Compartilhar" onClick={() => onNotice('Link da publicação copiado!')}><Icon name="send"/></button>
            <span>{likesCount.toLocaleString('pt-BR')} curtidas</span>
          </div>
          <form className="post-viewer-comment-form" onSubmit={submitComment}>
            <input name="comment" placeholder="Adicione um comentário..." aria-label="Adicione um comentário"/>
            <button type="submit" disabled={isSavingComment}>{isSavingComment ? 'Enviando...' : 'Publicar'}</button>
          </form>
        </div>
      </section>
    </div>}
  </article>
}

// Lista de cartões de publicação exibida na página Feed.
export function CardFotosFeed({ onNotice, posts = POSTS, token, user }) {
  return <section className="post-list" aria-label="Feed de publicações">
    {posts.map((post, index) => <PostCard key={post.id || post.user || post.usuario} post={post} index={index} onNotice={onNotice} token={token} user={user}/ >)}
    <p className="feed-end">Você viu todas as publicações por enquanto <span>✳</span></p>
  </section>
}
