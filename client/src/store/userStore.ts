import { AxiosError } from 'axios'
import create from 'zustand'
import { TOKEN_KEY } from '../constants'
import { fetcher } from '../tools/fetcher'
import { IntlMsg, LoginDto, RegisterDto, User } from '../types'

interface UserState {
  userId: string
  authedUser: User | null
  fetching: boolean
  errorMsg: string | null
  successMsg: IntlMsg | null
  resetMsg: () => void
  register: (registerDto: RegisterDto) => Promise<boolean>
  login: (loginDto: LoginDto) => Promise<boolean>
  logout: () => void
}

export const useUserStore = create<UserState>((set, get) => ({
  userId: '6355493fe42ec670363d1210',
  authedUser: null,
  fetching: false,
  errorMsg: null,
  successMsg: null,
  resetMsg: () => {
    set({ errorMsg: null, successMsg: null })
  },
  register: async (registerDto: RegisterDto) => {
    if (get().fetching) return false
    set({ fetching: true })
    try {
      await fetcher({
        method: 'POST',
        path: 'user',
        body: registerDto
      })
      set({
        fetching: false,
        successMsg: { intlKey: 'successRegister', defaultMessage: 'Rekisteröityminen onnistui' }
      })
      return true
    } catch (e) {
      if (e instanceof AxiosError && e.response?.data.description) {
        set({ errorMsg: e.response?.data.description })
      }
      set({ fetching: false })
      return false
    }
  },
  login: async (loginDto: LoginDto) => {
    if (get().fetching) return false
    set({ fetching: true })
    try {
      const data = await fetcher({
        method: 'POST',
        path: 'auth/login',
        body: loginDto
      })
      const token = data?.token
      if (token) {
        localStorage.setItem(TOKEN_KEY, token)
        set({
          authedUser: data,
          fetching: false,
          successMsg: { intlKey: 'successLogin', defaultMessage: 'Kirjauduttu sisään' }
        })
        return true
      } else {
        set({ fetching: false })
        return false
      }
    } catch (e) {
      if (e instanceof AxiosError && e.response?.data.description) {
        set({ errorMsg: e.response?.data.description })
      }
      set({ fetching: false })
      return false
    }
  },
  logout: () => {
    localStorage.removeItem(TOKEN_KEY)
    set({
      successMsg: { intlKey: 'successLogout', defaultMessage: 'Kirjauduttu ulos' }
    })
  }
}))
