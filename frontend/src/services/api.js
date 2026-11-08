// Endereço do backend Node local. Pode ser substituído por uma variável Vite ao publicar.
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

// Envia uma chamada ao backend e devolve os dados recebidos.
export async function apiRequest(path, options = {}) {
  // Usa GET quando a chamada não informa um método, como POST ou DELETE.
  const method = options.method || 'GET'
  // Guarda os dados opcionais da requisição em variáveis fáceis de identificar.
  const body = options.body
  const token = options.token

  // Prepara os cabeçalhos que acompanham a chamada.
  const headers = {}
  if (body) {
    headers['Content-Type'] = 'application/json'
  }
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  // Monta as opções básicas para o fetch.
  const requestOptions = {
    method,
    headers,
  }

  // Converte os dados para JSON somente quando a chamada tem um corpo.
  if (body) {
    requestOptions.body = JSON.stringify(body)
  }

  let response
  try {
    response = await fetch(`${API_URL}${path}`, requestOptions)
  } catch {
    throw new Error('Não foi possível conectar ao servidor. Confira se o backend está em execução e tente novamente.')
  }

  // Começa sem dados. A resposta 204 significa que o servidor não enviou conteúdo.
  let result = null
  if (response.status !== 204) {
    result = await response.json()
  }

  // Transforma uma resposta de erro do backend em uma mensagem para a interface.
  if (!response.ok) {
    let mensagem = 'Não foi possível concluir a solicitação.'

    if (result && result.erro) {
      mensagem = result.erro
    }

    throw new Error(mensagem)
  }

  return result
}
