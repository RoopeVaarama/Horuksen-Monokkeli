import { TOKEN_KEY, UID_KEY } from '../constants'

export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY)
}

export const setToken = (token: string) => {
  localStorage.setItem(TOKEN_KEY, token)
}

export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY)
}

export const getUid = () => {
  return localStorage.getItem(UID_KEY)
}

export const setUid = (uid: string) => {
  localStorage.setItem(UID_KEY, uid)
}
