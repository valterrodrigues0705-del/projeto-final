// Chave nova usada pelo navegador para guardar os dados locais de perfil.
export const PROFILE_STORAGE_KEY = 'projeto-final-profile'

// Valores iniciais usados quando ainda não há perfil salvo no localStorage.
export const DEFAULT_PROFILE = {
  username: 'abion_lorran',
  displayName: 'Jess7x',
  bio: '',
  website: '',
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

export function saveProfile(profile) {
  localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile))
}
