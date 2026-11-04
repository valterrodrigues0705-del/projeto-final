import Icon from './Icon.jsx'
import { PROFILE_IMAGE } from './feedData.js'

export default function Sidebar({ onLogout, onNotice, onProfile, onHome, active = 'home' }) {
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
