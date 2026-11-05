import { useState } from 'react'
import './SettingsPage.css'

const OPTIONS = [
  { id: 'apps', label: 'Apps e sites', icon: '▧' },
  { id: 'qr', label: 'QR code', icon: '▦' },
  { id: 'notifications', label: 'Notificações', icon: '♧' },
  { id: 'privacy', label: 'Configurações e privacidade', icon: '⚙' },
  { id: 'supervision', label: 'Supervisão', icon: '♙' },
  { id: 'login', label: 'Atividade de login', icon: '↗' },
]

const INITIAL_TOGGLES = {
  likes: true,
  comments: true,
  follows: true,
  privateAccount: false,
  activityStatus: true,
  mentions: true,
  supervision: false,
}

function Toggle({ checked, onChange, label }) {
  return <button className={`settings-toggle ${checked ? 'on' : ''}`} role="switch" aria-checked={checked} aria-label={label} onClick={onChange}><span/></button>
}

export default function SettingsPage({ section, onSectionChange, onBack, onLogout }) {
  const [toggles, setToggles] = useState(INITIAL_TOGGLES)
  const [notice, setNotice] = useState('')
  const [sessionClosed, setSessionClosed] = useState(false)
  const activeOption = OPTIONS.find(option => option.id === section) || OPTIONS[3]

  function toggle(key) {
    setToggles(current => ({ ...current, [key]: !current[key] }))
  }

  function showNotice(message) {
    setNotice(message)
    window.setTimeout(() => setNotice(''), 2200)
  }

  return <div className="settings-page">
    <header className="settings-header">
      <a className="settings-wordmark" href="/?page=profile">momentos<span>✳</span></a>
      <button className="settings-back" onClick={onBack}>← <span>Voltar ao perfil</span></button>
    </header>
    <div className="settings-layout">
      <aside className="settings-nav">
        <h1>Configurações</h1>
        <p>Gerencie suas preferências e sua conta.</p>
        <nav aria-label="Seções das configurações">
          {OPTIONS.map(option => <button key={option.id} className={option.id === activeOption.id ? 'selected' : ''} onClick={() => onSectionChange(option.id)}><span className="settings-nav-icon">{option.icon}</span>{option.label}</button>)}
          <button className="settings-logout" onClick={onLogout}><span className="settings-nav-icon">↪</span>Sair</button>
        </nav>
      </aside>

      <main className="settings-content">
        <div className="settings-content-heading"><span>{activeOption.icon}</span><div><p>Configurações</p><h2>{activeOption.label}</h2></div></div>

        {section === 'apps' && <section className="settings-section">
          <h3>Aplicativos e sites conectados</h3><p>Veja os aplicativos que têm acesso à sua conta.</p>
          <div className="settings-empty"><span>▧</span><strong>Nenhum aplicativo conectado</strong><p>Quando você conectar um aplicativo, ele aparecerá aqui.</p></div>
          <div className="settings-segmented"><button className="active">Ativos</button><button>Expirados</button><button>Removidos</button></div>
        </section>}

        {section === 'qr' && <section className="settings-section qr-section">
          <h3>Seu QR code</h3><p>Compartilhe seu perfil com outras pessoas.</p>
          <div className="qr-card"><div className="qr-grid" aria-label="QR code ilustrativo">{Array.from({ length: 100 }, (_, index) => <i key={index} className={[0,1,2,3,10,13,20,23,30,31,32,33,6,7,8,9,16,19,26,29,36,37,38,39,60,61,62,63,70,73,80,83,90,91,92,93,66,67,68,69,76,79,86,89,96,97,98,99].includes(index) ? 'dark' : ''}/>)}</div><div className="qr-profile"><span className="qr-avatar">J</span><strong>@abion_lorran</strong><small>momentos</small></div></div>
          <button className="settings-primary" onClick={() => showNotice('Seu QR code está pronto para compartilhar.')}>Compartilhar perfil</button>
        </section>}

        {section === 'notifications' && <section className="settings-section">
          <h3>Notificações</h3><p>Escolha quais atividades você quer acompanhar nesta interface.</p>
          <SettingRow title="Curtidas" description="Quando alguém curtir suas publicações." checked={toggles.likes} onChange={() => toggle('likes')}/>
          <SettingRow title="Comentários" description="Quando alguém comentar em uma publicação sua." checked={toggles.comments} onChange={() => toggle('comments')}/>
          <SettingRow title="Novos seguidores" description="Quando alguém começar a seguir você." checked={toggles.follows} onChange={() => toggle('follows')}/>
        </section>}

        {section === 'privacy' && <section className="settings-section">
          <h3>Privacidade da conta</h3><p>Controle quem pode ver seu perfil e interagir com você.</p>
          <SettingRow title="Conta privada" description="Somente seguidores aprovados poderão ver suas publicações." checked={toggles.privateAccount} onChange={() => toggle('privateAccount')}/>
          <SettingRow title="Mostrar status de atividade" description="Permite que outras pessoas vejam quando você está ativo." checked={toggles.activityStatus} onChange={() => toggle('activityStatus')}/>
          <SettingRow title="Permitir menções" description="Outras pessoas podem mencionar seu nome de usuário." checked={toggles.mentions} onChange={() => toggle('mentions')}/>
          <div className="settings-info"><strong>Suas preferências são demonstrativas</strong><span>Elas ficam apenas nesta tela e ainda não são salvas em uma conta.</span></div>
        </section>}

        {section === 'supervision' && <section className="settings-section">
          <h3>Supervisão</h3><p>Ferramentas para acompanhar e organizar a experiência de uma conta.</p>
          <div className="supervision-card"><span className="supervision-icon">♙</span><div><strong>Supervisão da conta</strong><p>Ative uma visão de acompanhamento familiar para esta conta de demonstração.</p></div><Toggle checked={toggles.supervision} onChange={() => toggle('supervision')} label="Ativar supervisão"/></div>
          <div className="settings-info"><strong>Controle da conta</strong><span>As opções de convite e acompanhamento serão conectadas quando houver autenticação.</span></div>
        </section>}

        {section === 'login' && <section className="settings-section">
          <h3>Onde você está conectado</h3><p>Revise as sessões que acessaram sua conta.</p>
          <div className="login-session"><span className="session-device">▣</span><div><strong>Este dispositivo</strong><p>Chrome · Mac · Sessão atual</p></div><span className="session-current">Ativo agora</span></div>
          {!sessionClosed && <div className="login-session"><span className="session-device">▣</span><div><strong>Outro dispositivo</strong><p>Fortaleza · há 2 dias</p></div><button onClick={() => setSessionClosed(true)}>Sair</button></div>}
        </section>}
      </main>
    </div>
    {notice && <div className="settings-toast" role="status">{notice}</div>}
  </div>
}

function SettingRow({ title, description, checked, onChange }) {
  return <div className="setting-row"><div><strong>{title}</strong><p>{description}</p></div><Toggle checked={checked} onChange={onChange} label={title}/></div>
}
