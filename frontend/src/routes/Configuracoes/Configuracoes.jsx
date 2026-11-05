import { useState } from 'react'
import './Configuracoes.css'
import { DEFAULT_PROFILE, PROFILE_STORAGE_KEY, readProfile } from '../profileData.js'

// Lista os nomes das áreas; por enquanto, somente Editar perfil tem conteúdo.
const OPTIONS = [
  { id: 'editProfile', label: 'Editar perfil' },
  { id: 'apps', label: 'Apps e sites' },
  { id: 'qr', label: 'QR code' },
  { id: 'notifications', label: 'Notificações' },
  { id: 'privacy', label: 'Configurações e privacidade' },
  { id: 'supervision', label: 'Supervisão' },
  { id: 'login', label: 'Atividade de login' },
]

// Área de configurações com formulário de perfil e nomes das outras opções.
export default function SettingsPage({ section, onSectionChange, onBack, onLogout }) {
  const [notice, setNotice] = useState('')
  const [profile, setProfile] = useState(readProfile)
  const activeOption = OPTIONS.find(option => option.id === section) || OPTIONS[0]

  // Salva as alterações do perfil somente no armazenamento deste navegador.
  function saveProfile(event) {
    event.preventDefault()
    const updatedProfile = {
      ...profile,
      username: profile.username.trim().replace(/^@/, '') || DEFAULT_PROFILE.username,
      displayName: profile.displayName.trim() || DEFAULT_PROFILE.displayName,
      bio: profile.bio.trim(),
      website: profile.website.trim(),
    }
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(updatedProfile))
    setProfile(updatedProfile)
    setNotice('Perfil atualizado')
    window.setTimeout(() => setNotice(''), 2200)
  }

  // Lê a foto escolhida e atualiza a prévia do perfil.
  function changePhoto(event) {
    const file = event.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setNotice('Escolha um arquivo de imagem')
      window.setTimeout(() => setNotice(''), 2200)
      return
    }
    const reader = new FileReader()
    reader.onload = () => setProfile(current => ({ ...current, image: reader.result }))
    reader.readAsDataURL(file)
  }

  return <div className="settings-page">
    <header className="settings-header">
      <a className="settings-wordmark" href="/?page=profile">momentos<span>✳</span></a>
      <button className="settings-back" onClick={onBack}>← <span>Voltar ao perfil</span></button>
    </header>
    <div className="settings-layout">
      <aside className="settings-nav">
        <h1>Configurações</h1>
        <nav aria-label="Seções das configurações">
          {OPTIONS.map(option => <button key={option.id}
            className={option.id === activeOption.id ? 'selected' : ''}
            onClick={() => onSectionChange(option.id)}>{option.label}</button>)}
          <button className="settings-logout" onClick={onLogout}>Sair</button>
        </nav>
      </aside>
      <main className="settings-content">
        <div className="settings-content-heading">
          <div><p>Configurações</p><h2>{activeOption.label}</h2></div>
        </div>
        {section === 'editProfile' && <form className="settings-section profile-edit-form" onSubmit={saveProfile}>
          <h3>Editar perfil</h3>
          <p>Atualize as informações que aparecem no seu perfil.</p>
          <div className="profile-edit-photo">
            <img src={profile.image} alt="Foto atual do perfil"/>
            <div><strong>{profile.username || DEFAULT_PROFILE.username}</strong><span>{profile.displayName || DEFAULT_PROFILE.displayName}</span></div>
            <label className="settings-primary">Mudar foto<input type="file" accept="image/*" onChange={changePhoto}/></label>
          </div>
          <label className="profile-edit-field">Nome
            <input value={profile.displayName} onChange={event => setProfile(current => ({ ...current, displayName: event.target.value }))} maxLength={40}/>
          </label>
          <label className="profile-edit-field">Nome de usuário
            <input value={profile.username} onChange={event => setProfile(current => ({ ...current, username: event.target.value }))} maxLength={30}/>
          </label>
          <label className="profile-edit-field">Biografia
            <textarea value={profile.bio} onChange={event => setProfile(current => ({ ...current, bio: event.target.value }))} maxLength={150} rows={4}/>
            <small>{profile.bio.length}/150</small>
          </label>
          <label className="profile-edit-field">Site
            <input value={profile.website} onChange={event => setProfile(current => ({ ...current, website: event.target.value }))} placeholder="https://"/>
          </label>
          <p className="profile-edit-note">As alterações ficam salvas neste navegador enquanto o projeto ainda não está conectado ao backend.</p>
          <button className="settings-primary profile-save-button" type="submit">Enviar</button>
        </form>}
      </main>
    </div>
    {notice && <div className="settings-toast" role="status">{notice}</div>}
  </div>
}
