import { useState } from 'react'
import './Configuracoes.css'
import Logo from '../../components/Logo/Logo.jsx'
import { apiRequest } from '../../services/api.js'

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
export default function SettingsPage({ token, user, onUserUpdate, section, onSectionChange, onBack, onLogout }) {
  const [notice, setNotice] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [profile, setProfile] = useState({ username: user?.usuario || '', displayName: user?.nome || '', bio: user?.bio || '', website: user?.site || '', image: user?.imagem || '' })
  const activeOption = OPTIONS.find(option => option.id === section) || OPTIONS[0]

  // Salva as alterações do perfil na API e atualiza o estado compartilhado da aplicação.
  async function saveProfile(event) {
    event.preventDefault()
    setIsSaving(true)
    try {
      const usuario = await apiRequest('/usuario', { method: 'PATCH', token, body: {
        usuario: profile.username.trim().replace(/^@/, ''), nome: profile.displayName.trim(),
        bio: profile.bio.trim(), site: profile.website.trim(), imagem: profile.image,
      } })
      onUserUpdate(usuario)
      setProfile({ username: usuario.usuario, displayName: usuario.nome, bio: usuario.bio, website: usuario.site, image: usuario.imagem })
      setNotice('Perfil atualizado')
    } catch (error) {
      setNotice(error.message)
    } finally {
      setIsSaving(false)
    }
    window.setTimeout(() => setNotice(''), 2200)
  }

  // Lê a foto escolhida e atualiza a prévia do perfil.
  function changePhoto(event) {
    const file = event.target.files?.[0]
    if (!file) return
    const formatosAceitos = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if (!formatosAceitos.includes(file.type) || file.size > 6 * 1024 * 1024) {
      setNotice('Escolha uma imagem JPG, PNG, WEBP ou GIF de até 6 MB.')
      window.setTimeout(() => setNotice(''), 2200)
      event.target.value = ''
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setProfile(current => ({ ...current, image: reader.result }))
      }
    }
    reader.onerror = () => {
      setNotice('Não foi possível ler a foto selecionada.')
      window.setTimeout(() => setNotice(''), 2200)
    }
    reader.readAsDataURL(file)
  }

  return <div className="settings-page">
    <header className="settings-header">
      <a className="settings-wordmark" href="/perfil" aria-label="Projeto final"><Logo className="settings-logo" /></a>
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
            <div><strong>{profile.username}</strong><span>{profile.displayName}</span></div>
            <label className="settings-primary">Mudar foto<input type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={changePhoto}/></label>
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
          <p className="profile-edit-note">As alterações serão salvas na sua conta.</p>
          <button className="settings-primary profile-save-button" type="submit" disabled={isSaving}>
            {isSaving ? 'Salvando...' : 'Enviar'}
          </button>
        </form>}
      </main>
    </div>
    {notice && <div className="settings-toast" role="status">{notice}</div>}
  </div>
}
