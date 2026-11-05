import { readProfile } from '../../routes/profileData.js'

// Desenha um ícone SVG. O nome escolhe a forma e os parâmetros ajustam tamanho/preenchimento.
export function Icon({ name, size = 24, filled = false }) {
  // Declara “common”, valor usado pela lógica ou pela interface.
  const common = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true }
  // Cada chave contém o desenho SVG usado pelo menu e pelos botões do feed.
  const shapes = {
    home: <path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z" fill={filled ? 'currentColor' : 'none'} />,
    search: <>
    <circle cx="10.8" cy="10.8" r="6.8"/>
    <path d="m16 16 5 5"/></>,
    explore: <>
    <rect x="3" y="3" width="18" height="18" rx="5"/>
    <path d="m15.8 8.2-2.2 5.4-5.4 2.2 2.2-5.4z"/></>,
    video: <>
    <rect x="3" y="4" width="18" height="16" rx="5"/>
    <path d="m10 8 6 4-6 4z"/></>,
    message: <>
    <path d="m21 3-7.5 18-3.8-7.7L2 9.5z"/>
    <path d="M9.7 13.3 21 3"/></>,
    heart: <path d="M20.8 8.8c0 5.2-8.8 10.3-8.8 10.3S3.2 14 3.2 8.8a4.6 4.6 0 0 1 8.8-1.9 4.6 4.6 0 0 1 8.8 1.9Z" fill={filled ? 'currentColor' : 'none'} />,
    plus: <>
    <path d="M12 5v14M5 12h14"/></>,
    menu: <>
    <path d="M4 7h16M4 12h16M4 17h16"/></>,
    comment: <path d="M20 11.5a7.5 7.5 0 0 1-8 7.5 8.6 8.6 0 0 1-3.7-.8L4 20l1.2-3.4A7.1 7.1 0 0 1 4 12c0-4.2 3.6-7.5 8-7.5s8 2.8 8 7Z"/>,
    send: <>
    <path d="m21 3-7.5 18-3.8-7.7L2 9.5z"/>
    <path d="M9.7 13.3 21 3"/></>,
    bookmark: <path d="M6 4.5A1.5 1.5 0 0 1 7.5 3h9A1.5 1.5 0 0 1 18 4.5V21l-6-4-6 4z"/>,
  }
  return <svg {...common}>{shapes[name]}</svg>
}

export default function Sidebar({ onLogout, onNotice = () => {}, onProfile, onHome, active = 'home' }) {
  // Lê a foto do perfil salva localmente para mostrá-la também na navegação.
  const { image } = readProfile()
  // O menu é compartilhado entre Feed e Perfil; callbacks vêm da rota atual.
  return <aside className="feed-sidebar">
    <a className="feed-wordmark" href="/feed" aria-label="Momentos">momentos
    <span>✳</span></a>
    <nav className="feed-nav" aria-label="Navegação principal">
      <button className={`feed-nav-item ${active === 'home' ? 'active' : ''}`} onClick={onHome || (() => window.scrollTo({ top: 0, behavior: 'smooth' }))}>
      <Icon name="home" filled={active === 'home'}/>
      <span>Início</span></button>
      <button className="feed-nav-item" onClick={() => onNotice('A busca estará disponível em breve.')}>
      <Icon name="search"/>
      <span>Pesquisar</span></button>
      <button className="feed-nav-item" onClick={() => onNotice('Explore novas publicações em breve.')}>
      <Icon name="explore"/>
      <span>Explorar</span></button>
      <button className="feed-nav-item" onClick={() => onNotice('Seus vídeos aparecerão aqui.')}>
      <Icon name="video"/>
      <span>Reels</span></button>
      <button className="feed-nav-item" onClick={() => onNotice('Sua caixa de mensagens está vazia.')}>
      <Icon name="message"/>
      <span>Mensagens</span></button>
      <button className="feed-nav-item" onClick={() => onNotice('Você está em dia com as novidades.')}>
      <Icon name="heart"/>
      <span>Notificações</span></button>
      <button className="feed-nav-item" onClick={() => onNotice('A criação de publicação estará disponível em breve.')}>
      <Icon name="plus"/>
      <span>Criar</span></button>
      <button className={`feed-nav-item profile-nav ${active === 'profile' ? 'active' : ''}`} onClick={onProfile || onLogout}>
      <img src={image} alt=""/>
      <span>Perfil</span></button>
    </nav>
    <button className="feed-nav-item sidebar-more" onClick={onLogout}>
    <Icon name="menu"/>
    <span>Sair / Mais</span></button>
  </aside>
}
