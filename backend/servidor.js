const express = require('express')
const fs = require('fs')
const path = require('path')
const crypto = require('crypto')

const app = express()
const porta = 3000
const arquivoDados = path.join(__dirname, 'dados.json')
const sessoes = new Map()

// Permite que o frontend Vite local envie e receba JSON da API.
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE')
  if (req.method === 'OPTIONS') return res.sendStatus(204)
  next()
})

// Converte o JSON enviado pelo frontend em um objeto disponível em req.body.
app.use(express.json({ limit: '9mb' }))
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// Dados iniciais para que o feed tenha publicações e stories na primeira execução.
const dadosIniciais = {
  usuarios: [],
  stories: [
    { id: 'story-marina', usuario: 'marina.luz', avatar: '/avatars/marina-luz.jpg', imagem: 'https://images.unsplash.com/photo-1473116763249-2faaef81ccda?auto=format&fit=crop&w=1000&q=85' },
    { id: 'story-pedro', usuario: 'pedro.silva', avatar: '/avatars/pedro-silva.jpg', imagem: 'https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=1000&q=85' },
    { id: 'story-annaluiza', usuario: 'annaluiza', avatar: '/avatars/annaluiza.jpg', imagem: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1000&q=85' },
  ],
  posts: [
    { id: 'post-marina', usuario: 'marina.luz', local: 'Praia do Rosa, SC', avatar: '/avatars/marina-luz.jpg', imagem: 'https://images.unsplash.com/photo-1473116763249-2faaef81ccda?auto=format&fit=crop&w=1000&q=85', legenda: 'Um respiro no meio da correria 🌊', curtidas: 2438, criadoEm: new Date().toISOString() },
    { id: 'post-pedro', usuario: 'pedro.silva', local: 'São Paulo, Brasil', avatar: '/avatars/pedro-silva.jpg', imagem: 'https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=1000&q=85', legenda: 'A cidade também sabe desacelerar.', curtidas: 816, criadoEm: new Date().toISOString() },
    { id: 'post-annaluiza', usuario: 'annaluiza', local: 'Jardim botânico', avatar: '/avatars/annaluiza.jpg', imagem: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1000&q=85', legenda: 'Colecionando cantinhos verdes 🌿', curtidas: 1204, criadoEm: new Date().toISOString() },
  ],
}

// Lê os dados gravados; cria o arquivo com conteúdo inicial se for a primeira execução.
function lerDados() {
  try {
    return JSON.parse(fs.readFileSync(arquivoDados, 'utf8'))
  } catch (erro) {
    if (erro.code !== 'ENOENT') throw erro
    salvarDados(dadosIniciais)
    return JSON.parse(JSON.stringify(dadosIniciais))
  }
}

// Grava as alterações em JSON para que permaneçam depois de reiniciar o servidor.
function salvarDados(dados) {
  fs.writeFileSync(arquivoDados, JSON.stringify(dados, null, 2), 'utf8')
}

// Valida uma foto enviada pelo navegador e salva o arquivo na pasta local de uploads.
function salvarImagem(dataUrl, req) {
  const imagem = String(dataUrl || '')
  const correspondencia = imagem.match(/^data:image\/(jpeg|png|webp|gif);base64,([a-zA-Z0-9+/=]+)$/)
  if (!correspondencia) return null

  const extensao = correspondencia[1] === 'jpeg' ? 'jpg' : correspondencia[1]
  const conteudo = Buffer.from(correspondencia[2], 'base64')
  if (!conteudo.length || conteudo.length > 6 * 1024 * 1024) return null

  const pastaUploads = path.join(__dirname, 'uploads')
  fs.mkdirSync(pastaUploads, { recursive: true })
  const nomeArquivo = `${crypto.randomUUID()}.${extensao}`
  fs.writeFileSync(path.join(pastaUploads, nomeArquivo), conteudo)
  return `${req.protocol}://${req.get('host')}/uploads/${nomeArquivo}`
}

// Remove campos privados antes de devolver um usuário para o frontend.
function usuarioPublico(usuario) {
  const { senhaHash, senhaSalt, ...dadosPublicos } = usuario
  return dadosPublicos
}

// Confere o token retornado pelo endpoint de login e identifica a conta atual.
function exigirLogin(req, res, next) {
  const token = req.headers.authorization?.replace(/^Bearer\s+/i, '')
  const idUsuario = sessoes.get(token)
  const dados = lerDados()
  const usuario = dados.usuarios.find(item => item.id === idUsuario)

  if (!usuario) return res.status(401).json({ erro: 'Faça login para continuar.' })
  req.usuario = usuario
  next()
}

// Cria uma conta usando somente os dados necessários para login e perfil.
app.post('/usuario', (req, res) => {
  const { nome, usuario, email, senha } = req.body
  if (!nome || !usuario || !email || !senha) {
    return res.status(400).json({ erro: 'Informe nome, usuário, email e senha.' })
  }
  if (String(senha).length < 6) {
    return res.status(400).json({ erro: 'A senha precisa ter pelo menos 6 caracteres.' })
  }

  const dados = lerDados()
  const emailNormalizado = String(email).trim().toLowerCase()
  const usuarioNormalizado = String(usuario).trim().replace(/^@/, '').toLowerCase()
  const jaExiste = dados.usuarios.some(item => item.email === emailNormalizado || item.usuario === usuarioNormalizado)
  if (jaExiste) return res.status(409).json({ erro: 'Esse email ou nome de usuário já está cadastrado.' })

  const senhaSalt = crypto.randomBytes(16).toString('hex')
  const senhaHash = crypto.scryptSync(String(senha), senhaSalt, 64).toString('hex')
  const novoUsuario = {
    id: crypto.randomUUID(),
    nome: String(nome).trim(),
    usuario: usuarioNormalizado,
    email: emailNormalizado,
    bio: '',
    site: '',
    imagem: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
    senhaSalt,
    senhaHash,
    criadoEm: new Date().toISOString(),
  }

  dados.usuarios.push(novoUsuario)
  salvarDados(dados)
  res.status(201).json({ usuario: usuarioPublico(novoUsuario) })
})

// Confere o email e a senha e devolve um token para as próximas chamadas.
app.post('/login', (req, res) => {
  const email = String(req.body.email || '').trim().toLowerCase()
  const senha = String(req.body.senha || '')
  const dados = lerDados()
  const usuario = dados.usuarios.find(item => item.email === email)

  if (!usuario || !senha) return res.status(401).json({ erro: 'Usuário ou senha inválidos.' })
  const senhaInformada = crypto.scryptSync(senha, usuario.senhaSalt, 64)
  const senhaSalva = Buffer.from(usuario.senhaHash, 'hex')
  if (senhaInformada.length !== senhaSalva.length || !crypto.timingSafeEqual(senhaInformada, senhaSalva)) {
    return res.status(401).json({ erro: 'Usuário ou senha inválidos.' })
  }

  const token = crypto.randomBytes(32).toString('hex')
  sessoes.set(token, usuario.id)
  res.json({ token, usuario: usuarioPublico(usuario) })
})

// Retorna as publicações e os stories para montar a página de feed.
app.get('/feed', exigirLogin, (req, res) => {
  const dados = lerDados()
  res.json({ stories: dados.stories, posts: dados.posts })
})

// Cria um story com foto para a conta autenticada e o disponibiliza no feed.
app.post('/stories', exigirLogin, (req, res) => {
  const imagem = salvarImagem(req.body.imagem, req)
  if (!imagem) return res.status(400).json({ erro: 'Escolha uma imagem válida de até 6 MB.' })

  const dados = lerDados()
  const story = {
    id: crypto.randomUUID(),
    usuario: req.usuario.usuario,
    avatar: req.usuario.imagem,
    imagem,
    criadoEm: new Date().toISOString(),
  }
  dados.stories.unshift(story)
  salvarDados(dados)
  res.status(201).json(story)
})

// Exclui um story somente se ele pertencer à conta autenticada.
app.delete('/stories/:id', exigirLogin, (req, res) => {
  const dados = lerDados()
  const indice = dados.stories.findIndex(item => item.id === req.params.id)
  if (indice === -1) return res.status(404).json({ erro: 'Story não encontrado.' })
  if (dados.stories[indice].usuario !== req.usuario.usuario) {
    return res.status(403).json({ erro: 'Você só pode excluir seus próprios stories.' })
  }

  const [storyExcluido] = dados.stories.splice(indice, 1)
  salvarDados(dados)
  res.json({ mensagem: 'Story excluído.', story: storyExcluido })
})

// Lista publicações. A consulta autor permite filtrar por nome de usuário.
app.get('/posts', exigirLogin, (req, res) => {
  const dados = lerDados()
  const posts = req.query.autor
    ? dados.posts.filter(post => post.usuario === String(req.query.autor))
    : dados.posts
  res.json(posts)
})

// Cria uma publicação para a conta autenticada.
app.post('/posts', exigirLogin, (req, res) => {
  const { legenda = '', local = '' } = req.body
  const imagem = salvarImagem(req.body.imagem, req)
  if (!imagem) return res.status(400).json({ erro: 'Escolha uma imagem válida de até 6 MB.' })

  const dados = lerDados()
  const post = {
    id: crypto.randomUUID(),
    usuario: req.usuario.usuario,
    local: String(local),
    avatar: req.usuario.imagem,
    imagem,
    legenda: String(legenda),
    curtidas: 0,
    curtidoPor: [],
    comentarios: [],
    criadoEm: new Date().toISOString(),
  }
  dados.posts.unshift(post)
  salvarDados(dados)
  res.status(201).json(post)
})

// Alterna a curtida da conta autenticada e persiste a lista e a contagem no arquivo de dados.
app.post('/posts/:id/curtidas', exigirLogin, (req, res) => {
  const dados = lerDados()
  const post = dados.posts.find(item => item.id === req.params.id)
  if (!post) return res.status(404).json({ erro: 'Publicação não encontrada.' })

  post.curtidoPor = Array.isArray(post.curtidoPor) ? post.curtidoPor : []
  const indiceCurtida = post.curtidoPor.indexOf(req.usuario.id)
  if (indiceCurtida >= 0) {
    post.curtidoPor.splice(indiceCurtida, 1)
    post.curtidas = Math.max(0, Number(post.curtidas || 0) - 1)
  } else {
    post.curtidoPor.push(req.usuario.id)
    post.curtidas = Number(post.curtidas || 0) + 1
  }

  salvarDados(dados)
  res.json({ curtidas: post.curtidas, curtidoPor: post.curtidoPor })
})

// Registra um comentário na publicação e devolve a lista atualizada para a interface.
app.post('/posts/:id/comentarios', exigirLogin, (req, res) => {
  const texto = String(req.body.texto || '').trim()
  if (!texto) return res.status(400).json({ erro: 'Escreva um comentário antes de publicar.' })
  if (texto.length > 500) return res.status(400).json({ erro: 'O comentário pode ter no máximo 500 caracteres.' })

  const dados = lerDados()
  const post = dados.posts.find(item => item.id === req.params.id)
  if (!post) return res.status(404).json({ erro: 'Publicação não encontrada.' })

  post.comentarios = Array.isArray(post.comentarios) ? post.comentarios : []
  const comentario = {
    id: crypto.randomUUID(),
    usuario: req.usuario.usuario,
    nome: req.usuario.nome,
    texto,
    criadoEm: new Date().toISOString(),
  }
  post.comentarios.push(comentario)
  salvarDados(dados)
  res.status(201).json({ comentario, comentarios: post.comentarios })
})

// Altera a legenda, o local ou a imagem de uma publicação da própria conta.
app.patch('/posts/:id', exigirLogin, (req, res) => {
  const dados = lerDados()
  const post = dados.posts.find(item => item.id === req.params.id)
  if (!post) return res.status(404).json({ erro: 'Publicação não encontrada.' })
  if (post.usuario !== req.usuario.usuario) return res.status(403).json({ erro: 'Você só pode alterar suas publicações.' })

  for (const campo of ['imagem', 'legenda', 'local']) {
    if (req.body[campo] !== undefined) post[campo] = String(req.body[campo])
  }
  salvarDados(dados)
  res.json(post)
})

// Exclui uma publicação somente quando ela pertence à conta autenticada.
app.delete('/posts/:id', exigirLogin, (req, res) => {
  const dados = lerDados()
  const indice = dados.posts.findIndex(item => item.id === req.params.id)
  if (indice === -1) return res.status(404).json({ erro: 'Publicação não encontrada.' })
  if (dados.posts[indice].usuario !== req.usuario.usuario) {
    return res.status(403).json({ erro: 'Você só pode excluir suas publicações.' })
  }

  const [postExcluido] = dados.posts.splice(indice, 1)
  salvarDados(dados)
  res.json({ mensagem: 'Publicação excluída.', post: postExcluido })
})

// Consulta os dados da conta autenticada ou, com :id, um perfil público.
app.get('/usuario', exigirLogin, (req, res) => {
  res.json(usuarioPublico(req.usuario))
})

app.get('/usuario/:id', (req, res) => {
  const usuario = lerDados().usuarios.find(item => item.id === req.params.id || item.usuario === req.params.id)
  if (!usuario) return res.status(404).json({ erro: 'Usuário não encontrado.' })
  res.json(usuarioPublico(usuario))
})

// Atualiza somente os campos editáveis do perfil da conta autenticada.
app.patch('/usuario', exigirLogin, (req, res) => {
  const dados = lerDados()
  const usuario = dados.usuarios.find(item => item.id === req.usuario.id)
  const camposPermitidos = ['nome', 'usuario', 'bio', 'site', 'imagem']

  for (const campo of camposPermitidos) {
    if (req.body[campo] !== undefined) usuario[campo] = String(req.body[campo]).trim()
  }
  if (usuario.usuario.startsWith('@')) usuario.usuario = usuario.usuario.slice(1)
  salvarDados(dados)
  res.json(usuarioPublico(usuario))
})

// Remove a conta autenticada e as publicações dela.
app.delete('/usuario', exigirLogin, (req, res) => {
  const dados = lerDados()
  dados.usuarios = dados.usuarios.filter(item => item.id !== req.usuario.id)
  dados.posts = dados.posts.filter(item => item.usuario !== req.usuario.usuario)
  dados.stories = dados.stories.filter(item => item.usuario !== req.usuario.usuario)
  for (const [token, idUsuario] of sessoes) {
    if (idUsuario === req.usuario.id) sessoes.delete(token)
  }
  salvarDados(dados)
  res.json({ mensagem: 'Conta excluída.' })
})

// Informa quando um endereço da API não existe, sem criar endpoints extras.
app.use((req, res) => {
  res.status(404).json({ erro: 'Endpoint não encontrado.' })
})

// Inicia o servidor Node para receber chamadas do frontend.
app.listen(porta, () => {
  console.log(`Servidor iniciado em http://localhost:${porta}`)
})
