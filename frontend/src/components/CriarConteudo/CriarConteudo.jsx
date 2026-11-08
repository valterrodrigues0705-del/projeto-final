import { useState } from 'react'
import { apiRequest } from '../../services/api.js'
import './CriarConteudo.css'

// Formatos de imagem aceitos pelo formulário de publicações.
const TIPOS_DE_IMAGEM = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']

// O mesmo formulário é usado para publicar no feed e no perfil.
export default function CriarConteudo({ token, tipoInicial = 'post', variante = 'feed', onClose, onPublished }) {
  const [tipo, setTipo] = useState(tipoInicial)
  const [enviando, setEnviando] = useState(false)
  const [mensagemErro, setMensagemErro] = useState('')

  // Valida o arquivo, converte a imagem e envia os dados ao backend.
  async function publicar(event) {
    event.preventDefault()

    const formulario = event.currentTarget
    const dadosFormulario = new FormData(formulario)
    const arquivo = dadosFormulario.get('imagemArquivo')

    if (!arquivo || !TIPOS_DE_IMAGEM.includes(arquivo.type) || arquivo.size > 6 * 1024 * 1024) {
      setMensagemErro('Escolha uma imagem JPG, PNG, WEBP ou GIF de até 6 MB.')
      return
    }

    setMensagemErro('')
    setEnviando(true)

    try {
      const imagem = await new Promise((resolve, reject) => {
        const leitor = new FileReader()
        leitor.onload = () => resolve(leitor.result)
        leitor.onerror = () => reject(new Error('Não foi possível ler a foto selecionada.'))
        leitor.readAsDataURL(arquivo)
      })

      const caminho = tipo === 'story' ? '/stories' : '/posts'
      const conteudo = await apiRequest(caminho, {
        method: 'POST',
        token,
        body: {
          imagem,
          legenda: String(dadosFormulario.get('legenda') || ''),
          local: String(dadosFormulario.get('local') || ''),
        },
      })

      onPublished(conteudo, tipo)
    } catch (error) {
      setMensagemErro(error.message)
    } finally {
      setEnviando(false)
    }
  }

  // Fecha pelo fundo da janela, mas mantém o formulário aberto durante o envio.
  function fecharAoClicarFora(event) {
    if (event.target === event.currentTarget && !enviando) onClose()
  }

  return (
    <div
      className="composer-overlay"
      role="presentation"
      onMouseDown={fecharAoClicarFora}
    >
      <form
        className={`composer-form composer-form--${variante}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="composer-title"
        onSubmit={publicar}
      >
        <button
          type="button"
          className="composer-close"
          aria-label="Fechar"
          disabled={enviando}
          onClick={onClose}
        >
          ×
        </button>

        <h2 id="composer-title">{tipo === 'story' ? 'Novo story' : 'Nova publicação'}</h2>

        <div className="composer-switch" role="group" aria-label="Tipo de conteúdo">
          <button
            type="button"
            className={tipo === 'post' ? 'selected' : ''}
            onClick={() => setTipo('post')}
          >
            Publicação
          </button>
          <button
            type="button"
            className={tipo === 'story' ? 'selected' : ''}
            onClick={() => setTipo('story')}
          >
            Story
          </button>
        </div>

        <label>
          Foto
          <input
            name="imagemArquivo"
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            required
            onChange={() => setMensagemErro('')}
          />
        </label>

        {tipo === 'post' && (
          <>
            <label>
              Legenda
              <textarea name="legenda" placeholder="Escreva uma legenda..." maxLength={500} />
            </label>
            <label>
              Local
              <input name="local" placeholder="Adicionar localização" maxLength={100} />
            </label>
          </>
        )}

        <p className="composer-hint">JPG, PNG, WEBP ou GIF · até 6 MB</p>
        {mensagemErro && <p className="composer-error" role="alert">{mensagemErro}</p>}
        <button className="composer-submit" type="submit" disabled={enviando}>
          {enviando ? 'Enviando...' : tipo === 'story' ? 'Publicar story' : 'Publicar'}
        </button>
      </form>
    </div>
  )
}
