import { TOKEN_KEY, AUTHED_USER_KEY } from '../constants'
import { User } from '../types'

export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY)
}

export const setToken = (token: string) => {
  localStorage.setItem(TOKEN_KEY, token)
}

export const removeAuth = () => {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(AUTHED_USER_KEY)
}

export const getAuthedUser = () => {
  const stringifiedUser = localStorage.getItem(AUTHED_USER_KEY)
  return stringifiedUser ? JSON.parse(stringifiedUser) : null
}

export const setAuthedUser = (user: User) => {
  const stringifiedUser = JSON.stringify(user)
  localStorage.setItem(AUTHED_USER_KEY, stringifiedUser)
}

export const getUid = () => {
  const user = getAuthedUser()
  return user?._id
}
