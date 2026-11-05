// Rodapé reutilizado pelas páginas de entrada e pela coluna lateral do feed.
export default function Footer({ variant = 'login' }) {
  if (variant === 'feed') {
    return <footer className="feed-footer">
      <p>Sobre · Ajuda · Imprensa · API · Carreiras<br/>Privacidade · Termos · Localizações · Idioma</p>
      <span>© 2026 MOMENTOS</span>
    </footer>
  }

  return <footer className="login-footer">
    <a href="#sobre">Sobre</a><a href="#ajuda">Ajuda</a><a href="#api">API</a>
    <a href="#privacidade">Privacidade</a><a href="#termos">Termos</a>
    <a href="#localizacoes">Localizações</a>
    <span>© {new Date().getFullYear()} Projeto final</span>
  </footer>
}
