import { useState } from 'react'
import './FeedPage.css'

const STORIES = [
  { name: 'Seu story', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80', own: true },
  { name: 'marina.luz', image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=160&q=80' },
  { name: 'pedro.silva', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&q=80' },
  { name: 'annaluiza', image: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=160&q=80' },
  { name: 'cafecomarte', image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=160&q=80' },
  { name: 'gui.viagens', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=160&q=80' },
]

const POSTS = [
  { user: 'marina.luz', location: 'Praia do Rosa, SC', avatar: STORIES[1].image, image: 'https://images.unsplash.com/photo-1473116763249-2faaef81ccda?auto=format&fit=crop&w=1000&q=85', caption: 'Um respiro no meio da correria 🌊', likes: '2.438' },
  { user: 'pedro.silva', location: 'São Paulo, Brasil', avatar: STORIES[2].image, image: 'https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=1000&q=85', caption: 'A cidade também sabe desacelerar.', likes: '816' },
  { user: 'annaluiza', location: 'Jardim botânico', avatar: STORIES[3].image, image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1000&q=85', caption: 'Colecionando cantinhos verdes 🌿', likes: '1.204' },
]

const SUGGESTIONS = [
  { name: 'avril.lavigne', label: 'Seguido(a) por carol_m', image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=100&q=80' },
  { name: 'cafecomarte', label: 'Sugestão para você', image: STORIES[4].image },
  { name: 'gui.viagens', label: 'Seguido(a) por marina.luz', image: STORIES[5].image },
  { name: 'fotografia.diaria', label: 'Novo no Momentos', image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=100&q=80' },
]

const PROFILE_IMAGE = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80'

function Icon({ name, size = 24, filled = false }) {
  const common = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true }
  const shapes = {
    home: <path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z" fill={filled ? 'currentColor' : 'none'} />,
    search: <><circle cx="10.8" cy="10.8" r="6.8"/><path d="m16 16 5 5"/></>,
    explore: <><rect x="3" y="3" width="18" height="18" rx="5"/><path d="m15.8 8.2-2.2 5.4-5.4 2.2 2.2-5.4z"/></>,
    video: <><rect x="3" y="4" width="18" height="16" rx="5"/><path d="m10 8 6 4-6 4z"/></>,
    message: <><path d="m21 3-7.5 18-3.8-7.7L2 9.5z"/><path d="M9.7 13.3 21 3"/></>,
    heart: <path d="M20.8 8.8c0 5.2-8.8 10.3-8.8 10.3S3.2 14 3.2 8.8a4.6 4.6 0 0 1 8.8-1.9 4.6 4.6 0 0 1 8.8 1.9Z" fill={filled ? 'currentColor' : 'none'} />,
    plus: <><path d="M12 5v14M5 12h14"/></>,
    menu: <><path d="M4 7h16M4 12h16M4 17h16"/></>,
    comment: <path d="M20 11.5a7.5 7.5 0 0 1-8 7.5 8.6 8.6 0 0 1-3.7-.8L4 20l1.2-3.4A7.1 7.1 0 0 1 4 12c0-4.2 3.6-7.5 8-7.5s8 2.8 8 7Z"/>,
    send: <><path d="m21 3-7.5 18-3.8-7.7L2 9.5z"/><path d="M9.7 13.3 21 3"/></>,
    bookmark: <path d="M6 4.5A1.5 1.5 0 0 1 7.5 3h9A1.5 1.5 0 0 1 18 4.5V21l-6-4-6 4z"/>,
  }
  return <svg {...common}>{shapes[name]}</svg>
}

function Sidebar({ onLogout, onNotice, onProfile, onHome, active = 'home' }) {
  return <aside className="feed-sidebar">
    <a className="feed-wordmark" href="#inicio" aria-label="Momentos">momentos<span>✳</span></a>
    <nav className="feed-nav" aria-label="Navegação principal">
      <button className={`feed-nav-item ${active === 'home' ? 'active' : ''}`} onClick={onHome || (() => window.scrollTo({ top: 0, behavior: 'smooth' }))}><Icon name="home" filled={active === 'home'}/><span>Início</span></button>
      <button className="feed-nav-item" onClick={() => onNotice('A busca estará disponível em breve.')}><Icon name="search"/><span>Pesquisar</span></button>
      <button className="feed-nav-item" onClick={() => onNotice('Explore novas publicações em breve.')}><Icon name="explore"/><span>Explorar</span></button>
      <button className="feed-nav-item" onClick={() => onNotice('Seus vídeos aparecerão aqui.')}><Icon name="video"/><span>Reels</span></button>
      <button className="feed-nav-item" onClick={() => onNotice('Sua caixa de mensagens está vazia.')}><Icon name="message"/><span>Mensagens</span></button>
      <button className="feed-nav-item" onClick={() => onNotice('Você está em dia com as novidades.')}><Icon name="heart"/><span>Notificações</span></button>
      <button className="feed-nav-item" onClick={() => onNotice('A criação de publicação estará disponível em breve.')}><Icon name="plus"/><span>Criar</span></button>
      <button className={`feed-nav-item profile-nav ${active === 'profile' ? 'active' : ''}`} onClick={onProfile || onLogout}><img src={PROFILE_IMAGE} alt=""/><span>Perfil</span></button>
    </nav>
    <button className="feed-nav-item sidebar-more" onClick={onLogout}><Icon name="menu"/><span>Sair / Mais</span></button>
  </aside>
}

function Stories({ onOpen }) {
  return <section className="stories" aria-label="Stories">
    {STORIES.map((story, index) => <button className="story" key={story.name} onClick={() => onOpen(index)}>
      <span className={`story-ring ${story.own ? 'story-ring-own' : ''}`}><img src={story.image} alt=""/>{story.own && <i>+</i>}</span>
      <span className="story-name">{story.name}</span>
    </button>)}
    <button className="story-next" aria-label="Ver mais stories" onClick={() => document.querySelector('.stories')?.scrollBy({ left: 240, behavior: 'smooth' })}>›</button>
  </section>
}

function PostCard({ post, index, onNotice }) {
  const [liked, setLiked] = useState(false)
  const [comment, setComment] = useState('')
  const likes = Number(post.likes.replaceAll('.', '')) + (liked ? 1 : 0)

  return <article className="post">
    <header className="post-header"><img className="avatar" src={post.avatar} alt=""/><div className="post-author"><strong>{post.user}</strong><span>{post.location}</span></div><span className="post-age">{index === 0 ? '2 h' : `${index + 1} h`}</span><button className="icon-button post-more" aria-label="Mais opções" onClick={() => onNotice('Opções da publicação')}>•••</button></header>
    <img className="post-image" src={post.image} alt={`Publicação de ${post.user}: ${post.caption}`}/>
    <div className="post-actions"><button className={liked ? 'is-liked' : ''} aria-label={liked ? 'Descurtir' : 'Curtir'} onClick={() => setLiked(!liked)}><Icon name="heart" filled={liked}/></button><button aria-label="Comentar" onClick={() => document.getElementById(`comment-${index}`)?.focus()}><Icon name="comment"/></button><button aria-label="Compartilhar" onClick={() => onNotice('Link da publicação copiado!')}><Icon name="send"/></button><button className="save-action" aria-label="Salvar publicação" onClick={() => onNotice('Publicação salva')}><Icon name="bookmark"/></button></div>
    <p className="post-likes">{likes.toLocaleString('pt-BR')} curtidas</p>
    <p className="post-caption"><strong>{post.user}</strong> {post.caption}</p>
    <p className="post-comments" onClick={() => document.getElementById(`comment-${index}`)?.focus()}>Ver todos os comentários</p>
    {comment && <p className="post-caption new-comment"><strong>voce</strong> {comment}</p>}
    <form className="comment-form" onSubmit={event => { event.preventDefault(); const value = event.currentTarget.elements.comment.value.trim(); if (value) { setComment(value); event.currentTarget.reset() } }}><input id={`comment-${index}`} name="comment" placeholder="Adicione um comentário..." aria-label="Adicione um comentário"/><button type="submit">Publicar</button></form>
  </article>
}

function PostsList({ onNotice }) {
  return <section className="post-list" aria-label="Feed de publicações">
    {POSTS.map((post, index) => <PostCard key={post.user} post={post} index={index} onNotice={onNotice}/ >)}
    <p className="feed-end">Você viu todas as publicações por enquanto <span>✳</span></p>
  </section>
}

function Suggestions({ onLogout, following, onToggleFollowing, onNotice }) {
  return <aside className="feed-right">
    <div className="signed-in"><img className="avatar avatar-large" src={PROFILE_IMAGE} alt=""/><div><strong>voce</strong><span>Seu perfil</span></div><button onClick={onLogout}>Sair</button></div>
    <div className="suggestion-heading"><strong>Sugestões para você</strong><button onClick={() => onNotice('Estas são as sugestões disponíveis.')}>Ver tudo</button></div>
    <div className="suggestion-list">{SUGGESTIONS.map(person => <div className="suggestion" key={person.name}><img className="avatar" src={person.image} alt=""/><div className="suggestion-copy"><strong>{person.name}</strong><span>{following[person.name] ? 'Seguindo' : person.label}</span></div><button className={following[person.name] ? 'following' : ''} onClick={() => onToggleFollowing(person.name)}>{following[person.name] ? 'Seguindo' : 'Seguir'}</button></div>)}</div>
    <footer className="feed-footer"><p>Sobre · Ajuda · Imprensa · API · Carreiras<br/>Privacidade · Termos · Localizações · Idioma</p><span>© 2026 MOMENTOS</span></footer>
  </aside>
}

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
