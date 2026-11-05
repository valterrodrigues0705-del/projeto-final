// Conteúdo principal do perfil, separado para manter a rota curta e legível.
const TABS = [
  { id: 'posts', label: 'Publicações', icon: '▦' },
  { id: 'saved', label: 'Salvos', icon: '♧' },
  { id: 'reposts', label: 'Reposts', icon: '⟳' },
  { id: 'tagged', label: 'Marcados', icon: '♙' },
]

export default function ProfileCard({ profile, tab, setTab, setModal, showSettingsMenu, setShowSettingsMenu, onSettings, onLogout }) {
  const { username, displayName, bio, image } = profile

  return <main className="profile-main">
    <header className="profile-mobile-header">
      <span className="profile-mobile-name">{username}</span>
      <button onClick={() => onSettings('privacy')} aria-label="Configurações"><span className="profile-gear">⚙</span></button>
    </header>
    <section className="profile-summary">
      <div className="profile-avatar-wrap">
        <div className="profile-note">Nota...</div>
        <img className="profile-avatar" src={image} alt={`Foto de perfil de ${username}`}/>
      </div>
      <div className="profile-info">
        <div className="profile-title">
          <h1>{username}</h1>
          <div className="profile-settings-control">
            <button className="profile-settings" aria-label="Abrir menu de configurações" aria-expanded={showSettingsMenu} onClick={() => setShowSettingsMenu(value => !value)}>⚙</button>
            {showSettingsMenu && <div className="profile-settings-menu" role="menu">
              <button role="menuitem" onClick={() => onSettings('apps')}>Apps e sites</button>
              <button role="menuitem" onClick={() => onSettings('qr')}>QR code</button>
              <button role="menuitem" onClick={() => onSettings('notifications')}>Notificações</button>
              <button role="menuitem" onClick={() => onSettings('privacy')}>Configurações e privacidade</button>
              <button role="menuitem" onClick={() => onSettings('supervision')}>Supervisão</button>
              <button role="menuitem" onClick={() => onSettings('login')}>Atividade de login</button>
              <button role="menuitem" onClick={onLogout}>Sair</button>
            </div>}
          </div>
        </div>
        <p className="profile-display-name">{displayName}</p>
        <div className="profile-stats">
          <span><strong>0</strong> posts</span>
          <button onClick={() => setModal('followers')}><strong>19</strong> seguidores</button>
          <button onClick={() => setModal('following')}><strong>1.420</strong> seguindo</button>
        </div>
        {bio && <p className="profile-bio">{bio}</p>}
      </div>
    </section>
    <div className="profile-actions">
      <button onClick={() => onSettings('editProfile')}>Editar perfil</button>
      <button onClick={() => setModal('archive')}>Ver itens arquivados</button>
    </div>
    <section className="profile-highlights" aria-label="Destaques">
      <button className="highlight-add" onClick={() => setModal('highlight')}><span>+</span><strong>Novo</strong></button>
    </section>
    <nav className="profile-tabs" aria-label="Conteúdo do perfil">
      {TABS.map(item => <button key={item.id} className={tab === item.id ? 'selected' : ''} onClick={() => setTab(item.id)} aria-label={item.label}>
        <span>{item.icon}</span><small>{item.label}</small>
      </button>)}
    </nav>
    <section className="profile-empty">
      <div className="empty-camera"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="5"/><path d="m10 8 6 4-6 4z"/></svg></div>
      <h2>{tab === 'posts' ? 'Compartilhar fotos' : tab === 'saved' ? 'Itens salvos' : tab === 'reposts' ? 'Seus reposts' : 'Fotos com você'}</h2>
      <p>{tab === 'posts' ? 'Quando você compartilhar fotos, elas aparecerão no seu perfil.' : 'O conteúdo aparecerá aqui quando estiver disponível.'}</p>
      {tab === 'posts' && <button onClick={() => setModal('new-post')}>Compartilhar sua primeira foto</button>}
    </section>
  </main>
}
