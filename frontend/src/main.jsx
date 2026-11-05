import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './styles/reset.css'
import './styles/base.css'

// Encontra o elemento #root do index.html e monta o app React dentro dele.
createRoot(document.getElementById('root')).render(
  // StrictMode ajuda a identificar problemas comuns durante o desenvolvimento.
  <StrictMode>
    <App />
  </StrictMode>,
)
