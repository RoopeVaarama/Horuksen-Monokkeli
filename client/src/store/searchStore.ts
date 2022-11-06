import create from 'zustand'
import { fetcher } from '../tools/fetcher'
import { templatesArrayToSearch } from '../tools/temporaryConverters'
import { FileMeta, SearchResult, Template } from '../types'

interface SearchState {
  searchTemplates: Template[]
  results: SearchResult[]
  refreshSearch: boolean
  searching: boolean
  files: FileMeta[]
  addTemplateToSearch: (template: Template) => void
  removeTemplateFromSearch: (id: string) => void
  resetSearchParamaters: () => void
  search: () => void
  addFileToSearch: (file: FileMeta) => void
  removeFileFromSearch: (fileToRemove: FileMeta) => void
}

export const useSearchStore = create<SearchState>((set, get) => ({
  searchTemplates: [],
  results: [],
  refreshSearch: true,
  searching: false,
  files: [],
  addTemplateToSearch: (template: Template) => {
    set((state) => ({
      searchTemplates: [...state.searchTemplates, template],
      refreshSearch: true
    }))
  },
  removeTemplateFromSearch: (id: string) => {
    set((state) => ({
      searchTemplates: state.searchTemplates.filter((template) => template._id !== id),
      refreshSearch: true
    }))
  },
  resetSearchParamaters: () => {
    set({
      searchTemplates: [],
      refreshSearch: false
    })
  },
  search: async () => {
    if (!get().searching && get().refreshSearch && get().searchTemplates.length !== 0) {
      set({ searching: true })
      try {
        const data = await fetcher({
          method: 'POST',
          path: 'search',
          id: 'invoice.pdf',
          body: templatesArrayToSearch(get().searchTemplates)
        })
        set({ searching: false, refreshSearch: false, results: data })
      } catch (e) {
        set({ searching: false })
      }
    }
  },
  addFileToSearch(file: FileMeta) {
    set((state) => ({
      files: [...state.files, file]
    }))
  },
  removeFileFromSearch(fileToRemove: FileMeta) {
    set((state) => ({
      files: state.files.filter((file) => file._id != fileToRemove._id)
    }))
  }
}))
