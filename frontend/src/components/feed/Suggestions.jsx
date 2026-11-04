import { SUGGESTIONS, PROFILE_IMAGE } from './feedData.js'

export default function Suggestions({ onLogout, following, onToggleFollowing, onNotice }) {
  return <aside className="feed-right">
    <div className="signed-in"><img className="avatar avatar-large" src={PROFILE_IMAGE} alt=""/><div><strong>voce</strong><span>Seu perfil</span></div><button onClick={onLogout}>Sair</button></div>
    <div className="suggestion-heading"><strong>Sugestões para você</strong><button onClick={() => onNotice('Estas são as sugestões disponíveis.')}>Ver tudo</button></div>
    <div className="suggestion-list">{SUGGESTIONS.map(person => <div className="suggestion" key={person.name}><img className="avatar" src={person.image} alt=""/><div className="suggestion-copy"><strong>{person.name}</strong><span>{following[person.name] ? 'Seguindo' : person.label}</span></div><button className={following[person.name] ? 'following' : ''} onClick={() => onToggleFollowing(person.name)}>{following[person.name] ? 'Seguindo' : 'Seguir'}</button></div>)}</div>
    <footer className="feed-footer"><p>Sobre · Ajuda · Imprensa · API · Carreiras<br/>Privacidade · Termos · Localizações · Idioma</p><span>© 2026 MOMENTOS</span></footer>
  </aside>
}
