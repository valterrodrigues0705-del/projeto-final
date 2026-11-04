import { useState } from 'react'
import Icon from './Icon.jsx'

export default function PostCard({ post, index, onNotice }) {
  const [liked, setLiked] = useState(false)
  const [comment, setComment] = useState('')
  const likes = Number(post.likes.replaceAll('.', '')) + (liked ? 1 : 0)

  return <article className="post">
    <header className="post-header"><img className="avatar" src={post.avatar} alt=""/><div className="post-author"><strong>{post.user}</strong><span>{post.location}</span></div><span className="post-age">{index === 0 ? '2 h' : `${index + 1} h`}</span><button className="icon-button post-more" aria-label="Mais opções" onClick={() => onNotice('Opções da publicação')}>•••</button></header>
    <img className="post-image" src={post.image} alt={`Publicação de ${post.user}: ${post.caption}`}/>
    <div className="post-actions"><button className={liked ? 'is-liked' : ''} aria-label={liked ? 'Descurtir' : 'Curtir'} onClick={() => setLiked(!liked)}><Icon name="heart" filled={liked}/></button><button aria-label="Comentar" onClick={() => document.getElementById(`comment-${index}`)?.focus()}><Icon name="comment"/></button><button aria-label="Compartilhar" onClick={() => onNotice('Link da publicação copiado!')}><Icon name="send"/></button><button className="save-action" aria-label="Salvar publicação" onClick={() => onNotice('Publicação salva')}><Icon name="bookmark"/></button></div>
    <p className="post-likes">{likes.toLocaleString('pt-BR')} curtidas</p>
    <p className="post-caption"><strong>{post.user}</strong> {post.caption}</p>
    <p className="post-comments" onClick={() => document.getElementById(`comment-${index}`)?.focus()}>Ver todos os comentários</p>
    {comment && <p className="post-caption new-comment"><strong>voce</strong> {comment}</p>}
    <form className="comment-form" onSubmit={event => { event.preventDefault(); const value = event.currentTarget.elements.comment.value.trim(); if (value) { setComment(value); event.currentTarget.reset() } }}><input id={`comment-${index}`} name="comment" placeholder="Adicione um comentário..." aria-label="Adicione um comentário"/><button type="submit">Publicar</button></form>
  </article>
}

