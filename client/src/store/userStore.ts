import create from 'zustand'

interface UserState {
  userId: string
}

export const useUserStore = create<UserState>((set, get) => ({
  userId: '6355493fe42ec670363d1210'
}))
