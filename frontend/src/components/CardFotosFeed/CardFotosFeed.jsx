import { useState } from 'react'
import { Icon } from '../Menu/Menu.jsx'
import { STORIES, POSTS } from '../../routes/Feed/data.js'

// Faixa horizontal de stories; a rota informa qual story foi selecionado.
export function Stories({ onOpen }) {
  return <section className="stories" aria-label="Stories">
    {STORIES.map((story, index) => <button className="story" key={story.name} onClick={() => onOpen(index)}>
      <span className={`story-ring ${story.own ? 'story-ring-own' : ''}`}>
        <img src={story.image} alt=""/>{story.own && <i>+</i>}
      </span>
      <span className="story-name">{story.name}</span>
    </button>)}
    <button className="story-next" aria-label="Ver mais stories" onClick={() => document.querySelector('.stories')?.scrollBy({ left: 240, behavior: 'smooth' })}>›</button>
  </section>
}

// Publicação individual, com curtida e comentário guardados no próprio cartão.
function PostCard({ post, index, onNotice }) {
  const [liked, setLiked] = useState(false)
  const [comment, setComment] = useState('')
  const likes = Number(post.likes.replaceAll('.', '')) + (liked ? 1 : 0)

  return <article className="post">
    <header className="post-header">
      <img className="avatar" src={post.avatar} alt=""/>
      <div className="post-author"><strong>{post.user}</strong><span>{post.location}</span></div>
      <span className="post-age">{index === 0 ? '2 h' : `${index + 1} h`}</span>
      <button className="icon-button post-more" aria-label="Mais opções" onClick={() => onNotice('Opções da publicação')}>•••</button>
    </header>
    <img className="post-image" src={post.image} alt={`Publicação de ${post.user}: ${post.caption}`}/>
    <div className="post-actions">
      <button className={liked ? 'is-liked' : ''} aria-label={liked ? 'Descurtir' : 'Curtir'} onClick={() => setLiked(!liked)}><Icon name="heart" filled={liked}/></button>
      <button aria-label="Comentar" onClick={() => document.getElementById(`comment-${index}`)?.focus()}><Icon name="comment"/></button>
      <button aria-label="Compartilhar" onClick={() => onNotice('Link da publicação copiado!')}><Icon name="send"/></button>
      <button className="save-action" aria-label="Salvar publicação" onClick={() => onNotice('Publicação salva')}><Icon name="bookmark"/></button>
    </div>
    <p className="post-likes">{likes.toLocaleString('pt-BR')} curtidas</p>
    <p className="post-caption"><strong>{post.user}</strong> {post.caption}</p>
    <p className="post-comments" onClick={() => document.getElementById(`comment-${index}`)?.focus()}>Ver todos os comentários</p>
    {comment && <p className="post-caption new-comment"><strong>voce</strong> {comment}</p>}
    <form className="comment-form" onSubmit={event => {
      event.preventDefault()
      const value = event.currentTarget.elements.comment.value.trim()
      if (value) { setComment(value); event.currentTarget.reset() }
    }}>
      <input id={`comment-${index}`} name="comment" placeholder="Adicione um comentário..." aria-label="Adicione um comentário"/>
      <button type="submit">Publicar</button>
    </form>
  </article>
}

// Lista de cartões de publicação exibida na página Feed.
export function CardFotosFeed({ onNotice }) {
  return <section className="post-list" aria-label="Feed de publicações">
    {POSTS.map((post, index) => <PostCard key={post.user} post={post} index={index} onNotice={onNotice}/ >)}
    <p className="feed-end">Você viu todas as publicações por enquanto <span>✳</span></p>
  </section>
}
