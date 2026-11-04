import { useState } from 'react'
const PROFILE_IMAGE = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80'
import './ProfilePage.css'

const TABS = [
  { id: 'posts', label: 'Publicações', icon: '▦' },
  { id: 'saved', label: 'Salvos', icon: '♧' },
  { id: 'reposts', label: 'Reposts', icon: '⟳' },
  { id: 'tagged', label: 'Marcados', icon: '♙' },
]

export default function ProfilePage({ onHome, onLogout }) {
  const [username, setUsername] = useState('abion_lorran')
  const [displayName, setDisplayName] = useState('Jess7x')
  const [bio, setBio] = useState('')
  const [tab, setTab] = useState('posts')
  const [modal, setModal] = useState('')
  const [draftName, setDraftName] = useState(displayName)
  const [draftUsername, setDraftUsername] = useState(username)
  const [draftBio, setDraftBio] = useState(bio)
  const [notice, setNotice] = useState('')

  function saveProfile(event) {
    event.preventDefault()
    setDisplayName(draftName.trim() || displayName)
    setUsername(draftUsername.trim().replace(/^@/, '') || username)
    setBio(draftBio.trim())
    setModal('')
    setNotice('Perfil atualizado')
    window.setTimeout(() => setNotice(''), 2200)
  }

  return <div className="profile-app">
    <aside className="feed-sidebar">
      <a className="feed-wordmark" href="#perfil" aria-label="Momentos">momentos<span>✳</span></a>
      <nav className="feed-nav" aria-label="Navegação principal">
        <button className="feed-nav-item" onClick={onHome}><span className="profile-side-icon">⌂</span><span>Início</span></button>
        <button className="feed-nav-item" onClick={() => setNotice('A busca estará disponível em breve.')}><span className="profile-side-icon">⌕</span><span>Pesquisar</span></button>
        <button className="feed-nav-item" onClick={() => setNotice('Explore novas publicações em breve.')}><span className="profile-side-icon">◇</span><span>Explorar</span></button>
        <button className="feed-nav-item" onClick={() => setNotice('Seus vídeos aparecerão aqui.')}><span className="profile-side-icon">▷</span><span>Reels</span></button>
        <button className="feed-nav-item" onClick={() => setNotice('Sua caixa de mensagens está vazia.')}><span className="profile-side-icon">➤</span><span>Mensagens</span></button>
        <button className="feed-nav-item" onClick={() => setNotice('Você está em dia com as novidades.')}><span className="profile-side-icon">♡</span><span>Notificações</span></button>
        <button className="feed-nav-item" onClick={() => setNotice('A criação de publicação estará disponível em breve.')}><span className="profile-side-icon">＋</span><span>Criar</span></button>
        <button className="feed-nav-item profile-nav active" onClick={() => setNotice('Você já está no seu perfil.')}><img src={PROFILE_IMAGE} alt=""/><span>Perfil</span></button>
      </nav>
      <button className="feed-nav-item sidebar-more" onClick={onLogout}><span className="profile-side-icon">☰</span><span>Sair / Mais</span></button>
    </aside>
    <main className="profile-main">
      <header className="profile-mobile-header"><span className="profile-mobile-name">{username}</span><button onClick={() => setModal('settings')} aria-label="Configurações"><span className="profile-gear">⚙</span></button></header>
      <section className="profile-summary">
        <div className="profile-avatar-wrap"><div className="profile-note">Nota...</div><img className="profile-avatar" src={PROFILE_IMAGE} alt={`Foto de perfil de ${username}`}/></div>
        <div className="profile-info">
          <div className="profile-title"><h1>{username}</h1><button className="profile-settings" aria-label="Configurações" onClick={() => setModal('settings')}>⚙</button></div>
          <p className="profile-display-name">{displayName}</p>
          <div className="profile-stats"><span><strong>0</strong> posts</span><button onClick={() => setModal('followers')}><strong>19</strong> seguidores</button><button onClick={() => setModal('following')}><strong>1.420</strong> seguindo</button></div>
          {bio && <p className="profile-bio">{bio}</p>}
        </div>
      </section>

      <div className="profile-actions"><button onClick={() => { setDraftName(displayName); setDraftUsername(username); setDraftBio(bio); setModal('edit') }}>Editar perfil</button><button onClick={() => setModal('archive')}>Ver itens arquivados</button></div>

      <section className="profile-highlights" aria-label="Destaques"><button className="highlight-add" onClick={() => setModal('highlight')}><span>+</span><strong>Novo</strong></button></section>

      <nav className="profile-tabs" aria-label="Conteúdo do perfil">{TABS.map(item => <button key={item.id} className={tab === item.id ? 'selected' : ''} onClick={() => setTab(item.id)} aria-label={item.label}><span>{item.icon}</span><small>{item.label}</small></button>)}</nav>

      <section className="profile-empty">
        <div className="empty-camera"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="5"/><path d="m10 8 6 4-6 4z"/></svg></div>
        <h2>{tab === 'posts' ? 'Compartilhar fotos' : tab === 'saved' ? 'Itens salvos' : tab === 'reposts' ? 'Seus reposts' : 'Fotos com você'}</h2>
        <p>{tab === 'posts' ? 'Quando você compartilhar fotos, elas aparecerão no seu perfil.' : 'O conteúdo aparecerá aqui quando estiver disponível.'}</p>
        {tab === 'posts' && <button onClick={() => setModal('new-post')}>Compartilhar sua primeira foto</button>}
      </section>
    </main>

    {modal && <div className="profile-modal-backdrop" role="presentation" onMouseDown={event => { if (event.target === event.currentTarget) setModal('') }}>
      {modal === 'edit' ? <form className="profile-modal edit-profile-modal" onSubmit={saveProfile}><button type="button" className="modal-close" onClick={() => setModal('')}>×</button><h2>Editar perfil</h2><label>Nome<input value={draftName} onChange={event => setDraftName(event.target.value)}/></label><label>Nome de usuário<input value={draftUsername} onChange={event => setDraftUsername(event.target.value)}/></label><label>Biografia<textarea rows="3" maxLength="150" value={draftBio} onChange={event => setDraftBio(event.target.value)} placeholder="Conte um pouco sobre você"/></label><button className="modal-primary" type="submit">Salvar</button></form> : <div className="profile-modal info-modal"><button type="button" className="modal-close" onClick={() => setModal('')}>×</button><h2>{({ settings: 'Configurações', archive: 'Itens arquivados', highlight: 'Novo destaque', followers: 'Seguidores', following: 'Seguindo', 'new-post': 'Nova publicação' })[modal]}</h2><p>{modal === 'highlight' ? 'Adicione stories aos seus destaques quando publicar.' : modal === 'new-post' ? 'A publicação de fotos estará disponível em breve.' : modal === 'settings' ? 'As configurações da conta estarão disponíveis em breve.' : modal === 'archive' ? 'Suas publicações arquivadas aparecerão aqui.' : 'Esta lista será carregada quando a conta estiver conectada.'}</p><button className="modal-primary" onClick={() => setModal('')}>Entendi</button></div>}
    </div>}
    {notice && <div className="profile-toast" role="status">{notice}</div>}
  </div>
}
