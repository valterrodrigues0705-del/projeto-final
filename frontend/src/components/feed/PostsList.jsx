import PostCard from './PostCard.jsx'
import { POSTS } from './feedData.js'

export default function PostsList({ onNotice }) {
  return <section className="post-list" aria-label="Feed de publicações">
    {POSTS.map((post, index) => <PostCard key={post.user} post={post} index={index} onNotice={onNotice}/ >)}
    <p className="feed-end">Você viu todas as publicações por enquanto <span>✳</span></p>
  </section>
}
