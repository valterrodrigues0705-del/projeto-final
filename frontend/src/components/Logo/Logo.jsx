// Logo SVG compartilhada pelas páginas da aplicação.
export default function Logo({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 48 48" role="img" aria-label="Projeto final">
      <defs>
        <linearGradient id="logoGradient" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stopColor="#f9ce34" />
          <stop offset="45%" stopColor="#ee2a7b" />
          <stop offset="100%" stopColor="#6228d7" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="44" height="44" rx="12" fill="url(#logoGradient)" />
      <rect x="14" y="14" width="20" height="20" rx="6" fill="none" stroke="#fff" strokeWidth="2.4" />
      <circle cx="24" cy="24" r="5" fill="none" stroke="#fff" strokeWidth="2.4" />
      <circle cx="32.8" cy="15.4" r="1.6" fill="#fff" />
    </svg>
  )
}
