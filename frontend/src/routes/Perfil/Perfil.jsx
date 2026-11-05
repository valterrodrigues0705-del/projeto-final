import { useState } from 'react'
import Sidebar from '../../components/Menu/Menu.jsx'
import ProfileCard from '../../components/ProfileCard/ProfileCard.jsx'
import { readProfile } from '../profileData.js'
import './Perfil.css'

// Rota do perfil: mantém estados da página e reúne navegação e componentes.
export default function ProfilePage({ onHome, onLogout, onSettings }) {
  const [profile] = useState(readProfile)
  const [tab, setTab] = useState('posts')
  const [modal, setModal] = useState('')
  const [notice, setNotice] = useState('')
  const [showSettingsMenu, setShowSettingsMenu] = useState(false)

  return <div className="profile-app">
    <Sidebar active="profile" onLogout={onLogout} onHome={onHome} onNotice={setNotice}/>
    <ProfileCard profile={profile} tab={tab} setTab={setTab} setModal={setModal}
      showSettingsMenu={showSettingsMenu} setShowSettingsMenu={setShowSettingsMenu}
      onSettings={onSettings} onLogout={onLogout}/>
    {modal && <div className="profile-modal-backdrop" role="presentation" onMouseDown={event => {
      if (event.target === event.currentTarget) setModal('')
    }}>
      <div className="profile-modal info-modal">
        <button type="button" className="modal-close" onClick={() => setModal('')}>×</button>
        <h2>{({ settings: 'Configurações', archive: 'Itens arquivados', highlight: 'Novo destaque', followers: 'Seguidores', following: 'Seguindo', 'new-post': 'Nova publicação' })[modal]}</h2>
        <p>{modal === 'highlight' ? 'Adicione stories aos seus destaques quando publicar.' : modal === 'new-post' ? 'A publicação de fotos estará disponível em breve.' : modal === 'settings' ? 'As configurações da conta estarão disponíveis em breve.' : modal === 'archive' ? 'Suas publicações arquivadas aparecerão aqui.' : 'Esta lista será carregada quando a conta estiver conectada.'}</p>
        <button className="modal-primary" onClick={() => setModal('')}>Entendi</button>
      </div>
    </div>}
    {notice && <div className="profile-toast" role="status">{notice}</div>}
  </div>
}
