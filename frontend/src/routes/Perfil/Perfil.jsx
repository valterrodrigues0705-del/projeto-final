import { useEffect, useState } from 'react'
import Sidebar from '../../components/Menu/Menu.jsx'
import ProfileCard from '../../components/ProfileCard/ProfileCard.jsx'
import CriarConteudo from '../../components/CriarConteudo/CriarConteudo.jsx'
import { apiRequest } from '../../services/api.js'
import './Perfil.css'

// Rota do perfil: mantém estados da página e reúne navegação e componentes.
export default function ProfilePage({ token, user, onUserUpdate, onHome, onLogout, onSettings }) {
  const [profile, setProfile] = useState(() => ({ username: user?.usuario || '', displayName: user?.nome || '', bio: user?.bio || '', image: user?.imagem || '' }))
  const [posts, setPosts] = useState([])
  const [tab, setTab] = useState('posts')
  const [modal, setModal] = useState('')
  const [notice, setNotice] = useState('')
  const [showSettingsMenu, setShowSettingsMenu] = useState(false)
  const [creationType, setCreationType] = useState('post')
  const [isComposerOpen, setIsComposerOpen] = useState(false)

  useEffect(() => {
    apiRequest('/usuario', { token }).then(usuario => {
      onUserUpdate(usuario)
      setProfile({ username: usuario.usuario, displayName: usuario.nome, bio: usuario.bio, image: usuario.imagem })
    }).catch(error => setNotice(error.message))
    apiRequest(`/posts?autor=${encodeURIComponent(user?.usuario || '')}`, { token }).then(setPosts).catch(() => {})
  }, [token, user?.usuario, onUserUpdate])

  function openComposer(type) {
    setCreationType(type)
    setIsComposerOpen(true)
  }

  function handlePublished(conteudo, tipo) {
    if (tipo === 'post') setPosts(atual => [conteudo, ...atual])
    setIsComposerOpen(false)
    setNotice(tipo === 'story'
      ? 'Story publicado! Ele aparecerá no feed.'
      : 'Publicação criada! Ela aparecerá no perfil e no feed.')
  }

  async function deletePost(postId) {
    if (!window.confirm('Quer mesmo excluir esta publicação?')) return
    try {
      await apiRequest(`/posts/${postId}`, { method: 'DELETE', token })
      setPosts(current => current.filter(post => post.id !== postId))
      setNotice('Publicação excluída.')
    } catch (error) {
      setNotice(error.message)
    }
  }

  return <div className="profile-app">
    <Sidebar user={user} active="profile" onLogout={onLogout} onHome={onHome} onCreate={() => openComposer('post')} onNotice={setNotice}/>
    <ProfileCard profile={profile} posts={posts} postCount={posts.length} tab={tab} setTab={setTab} setModal={setModal} onCreate={openComposer} onDeletePost={deletePost}
      showSettingsMenu={showSettingsMenu} setShowSettingsMenu={setShowSettingsMenu}
      onSettings={onSettings} onLogout={onLogout}/>
    {modal && <div className="profile-modal-backdrop" role="presentation" onMouseDown={event => {
      if (event.target === event.currentTarget) setModal('')
    }}>
      <div className="profile-modal info-modal">
        <button type="button" className="modal-close" onClick={() => setModal('')}>×</button>
        <h2>{({ settings: 'Configurações', archive: 'Itens arquivados', followers: 'Seguidores', following: 'Seguindo' })[modal]}</h2>
        <p>{modal === 'settings' ? 'As configurações da conta estarão disponíveis em breve.' : modal === 'archive' ? 'Suas publicações arquivadas aparecerão aqui.' : 'Esta lista será carregada quando a conta estiver conectada.'}</p>
        <button className="modal-primary" onClick={() => setModal('')}>Entendi</button>
      </div>
    </div>}
    {isComposerOpen && <CriarConteudo token={token} tipoInicial={creationType} variante="perfil" onClose={() => setIsComposerOpen(false)} onPublished={handlePublished}/>}
    {notice && <div className="profile-toast" role="status">{notice}</div>}
  </div>
}
