import create from 'zustand'
import { fetcher } from '../tools/fetcher'
//import { templatesArrayToSearch } from '../tools/temporaryConverters'
import { FileMeta, SearchResult, Template, TemplateRow } from '../types'

interface SearchState {
  searchTemplates: Template[]
  openFileGroups: string[]
  results: SearchResult[]
  refreshSearch: boolean
  searching: boolean
  fileIDs: string[]
  upload: boolean
  addTemplateToSearch: (template: Template) => void
  removeTemplateFromSearch: (id: string) => void
  resetSearchParamaters: () => void
  search: () => void
  addFileToSearch: (file: FileMeta) => void
  removeFileFromSearch: (fileToRemove: FileMeta) => void
  setGroupAsOpen: (groupName: string) => void
  setGroupAsClosed: (groupName: string) => void
  setUpload: (status: boolean) => void
}

export const useSearchStore = create<SearchState>((set, get) => ({
  searchTemplates: [],
  openFileGroups: [],
  results: [],
  refreshSearch: true,
  searching: false,
  fileIDs: [],
  upload: false,
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
      set({ searching: true, results: [] })

      // Vaihda tää template-arrayhyn jos/kun haku päivitetään
      const terms: TemplateRow[] = []
      get().searchTemplates.forEach((template) => {
        template.terms.forEach((termSet) => {
          terms.push(termSet)
        })
      })

      // Filter duplicates
      const uniqueFileIDS = get().fileIDs.filter((v, i, a) => a.indexOf(v) === i)

      try {
        const data = await fetcher({
          method: 'POST',
          path: 'search/search',
          body: JSON.stringify({
            terms: terms,
            files: uniqueFileIDS
          })
        })
        set({ searching: false, refreshSearch: false, results: data.results })
      } catch (e) {
        console.log(e)
        set({ searching: false })
      }
    }
  },
  addFileToSearch(file: FileMeta) {
    set((state) => ({
      fileIDs: [...state.fileIDs, file._id],
      refreshSearch: true
    }))
  },
  removeFileFromSearch(fileToRemove: FileMeta) {
    set((state) => ({
      fileIDs: state.fileIDs.filter((fileID) => fileID !== fileToRemove._id),
      refreshSearch: true
    }))
  },
  setGroupAsOpen(groupName: string) {
    set((state) => ({
      openFileGroups: [...state.openFileGroups, groupName]
    }))
  },
  setGroupAsClosed(groupName: string) {
    set((state) => ({
      openFileGroups: state.openFileGroups.filter((groupname) => groupname !== groupName)
    }))
  },
  setUpload(status: boolean) {
    set({ upload: status })
  }
}))
