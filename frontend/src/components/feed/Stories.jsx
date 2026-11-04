import { STORIES } from './feedData.js'

export default function Stories({ onOpen }) {
  return <section className="stories" aria-label="Stories">
    {STORIES.map((story, index) => <button className="story" key={story.name} onClick={() => onOpen(index)}>
      <span className={`story-ring ${story.own ? 'story-ring-own' : ''}`}><img src={story.image} alt=""/>{story.own && <i>+</i>}</span>
      <span className="story-name">{story.name}</span>
    </button>)}
    <button className="story-next" aria-label="Ver mais stories" onClick={() => document.querySelector('.stories')?.scrollBy({ left: 240, behavior: 'smooth' })}>›</button>
  </section>
}
