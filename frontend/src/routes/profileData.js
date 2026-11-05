// Chave usada pelo navegador para guardar os dados de perfil deste protótipo.
export const PROFILE_STORAGE_KEY = 'momentos-profile'

// Valores iniciais usados quando ainda não há perfil salvo no localStorage.
export const DEFAULT_PROFILE = {
  // Nome curto usado na URL e no cabeçalho do perfil.
  username: 'abion_lorran',
  // Nome de exibição mostrado abaixo do nome de usuário.
  displayName: 'Jess7x',
  // Biografia pública; vazia na conta de demonstração.
  bio: '',
  // Site associado ao perfil; vazio inicialmente.
  website: '',
  // Foto padrão usada quando ainda não há foto salva.
  image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
}

// Lê os dados persistidos e completa campos ausentes com os valores padrão.
export function readProfile() {
  try {
    return { ...DEFAULT_PROFILE, ...JSON.parse(localStorage.getItem(PROFILE_STORAGE_KEY) || '{}') }
  } catch {
    return DEFAULT_PROFILE
  }
}

// Guarda as alterações no navegador até existir uma API/backend.
export function saveProfile(profile) {
  // Acessa o armazenamento do navegador ou o leitor de arquivo para manter os dados locais.
  localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile))
}
