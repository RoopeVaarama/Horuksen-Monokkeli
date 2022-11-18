import { AxiosError } from 'axios'
import create from 'zustand'
import { getToken, removeToken, setToken, setUid } from '../tools/auth'
import { fetcher } from '../tools/fetcher'
import { IntlMsg, LoginDto, RegisterDto } from '../types'

interface UserState {
  fetching: boolean
  errorMsg: string | null
  successMsg: IntlMsg | null
  resetMsg: () => void
  register: (registerDto: RegisterDto) => Promise<boolean>
  login: (loginDto: LoginDto) => Promise<boolean>
  logout: () => void
  validateToken: () => Promise<boolean>
}

export const useUserStore = create<UserState>((set, get) => ({
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
      const uid = data?.user._id
      if (token && uid) {
        setToken(token)
        setUid(uid)
        set({
          fetching: false,
          successMsg: { intlKey: 'successLogin', defaultMessage: 'Kirjauduttu sisään' }
        })
        return true
      } else {
        set({ fetching: false, errorMsg: 'ERR: no token or user id' })
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
    removeToken()
    set({
      successMsg: { intlKey: 'successLogout', defaultMessage: 'Kirjauduttu ulos' }
    })
  },
  validateToken: async () => {
    const token = getToken()
    if (!token) {
      return false
    }
    try {
      await fetcher({
        method: 'GET',
        path: 'auth/validateToken',
        id: token
      })
      return true
    } catch (e) {
      removeToken()
      if (e instanceof AxiosError && e.response?.data.description) {
        set({ errorMsg: e.response?.data.description })
      }
      return false
    }
  }
}))
