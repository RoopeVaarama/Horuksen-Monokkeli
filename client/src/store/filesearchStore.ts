import create from 'zustand'

interface SearchKeyword {
  keyword: string
  searchActive: boolean
  refreshSearch: boolean
  setKeyword: (newKeyword: string) => void
  setSearchActive: () => void
  setSearchInactive: () => void
  refresh: () => void
}

export const useFilesearchStore = create<SearchKeyword>((set, get) => ({
  keyword: '',
  searchActive: false,
  refreshSearch: false,
  setKeyword: (newKeyword) => {
    set({
      keyword: newKeyword
    })
  },
  setSearchActive: () => {
    set({
      searchActive: true
    })
  },
  setSearchInactive: () => {
    set({
      searchActive: false
    })
  },
  refresh() {
    set({
      refreshSearch: !get().refreshSearch
    })
  }
}))
