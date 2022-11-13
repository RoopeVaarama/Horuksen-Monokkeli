import create from 'zustand'
//import { fetcher } from '../tools/fetcher'
//import { templatesArrayToSearch } from '../tools/temporaryConverters'
import { FileMeta, SearchResult, Template, TemplateRow } from '../types'

interface SearchState {
  searchTemplates: Template[]
  openFileGroups: string[]
  results: SearchResult[]
  refreshSearch: boolean
  searching: boolean
  files: FileMeta[]
  fileIDs: string[]
  addTemplateToSearch: (template: Template) => void
  removeTemplateFromSearch: (id: string) => void
  resetSearchParamaters: () => void
  search: () => void
  addFileToSearch: (file: FileMeta) => void
  removeFileFromSearch: (fileToRemove: FileMeta) => void
  setGroupAsOpen: (groupName: string) => void
  setGroupAsClosed: (groupName: string) => void
}

export const useSearchStore = create<SearchState>((set, get) => ({
  searchTemplates: [],
  openFileGroups: [],
  results: [],
  refreshSearch: true,
  searching: false,
  fileIDs: [],
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
      set({ searching: true, results: [] })

      // Vaihda tää template-arrayhyn jos/kun haku päivitetään toivotusti
      const terms: TemplateRow[] = []
      get().searchTemplates.forEach((template) => {
        template.terms.forEach((termSet) => {
          terms.push(termSet)
        })
      })

      // Muutettu sprint reviewin demoa varten
      try {
        fetch(`${process.env.REACT_APP_BACKEND_URL}/search/search`, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            terms: terms,
            files: get().fileIDs
          })
        })
          .then((res) => res.json())
          .then((data) => {
            set({ searching: false, refreshSearch: false, results: data.results })
          })

        /*
        const data = await fetcher({
          method: 'POST',
          path: 'search',
          id: 'invoice.pdf',
          body: templatesArrayToSearch(get().searchTemplates)
        })
        */
        //set({ searching: false, refreshSearch: false, results: data })
      } catch (e) {
        console.log(e)
        set({ searching: false })
      }
    }
  },
  addFileToSearch(file: FileMeta) {
    set((state) => ({
      files: [...state.files, file],
      fileIDs: [...state.fileIDs, file._id],
      refreshSearch: true
    }))
  },
  removeFileFromSearch(fileToRemove: FileMeta) {
    set((state) => ({
      files: state.files.filter((file) => file._id != fileToRemove._id),
      fileIDs: state.fileIDs.filter((fileID) => fileID !== fileToRemove._id),
      refreshSearch: true
    }))
  },
  setGroupAsOpen(groupName: string) {
    set((state) => ({
      openFileGroups: [...state.openFileGroups, groupName]
    }))
    console.log(get().openFileGroups)
  },
  setGroupAsClosed(groupName: string) {
    set((state) => ({
      openFileGroups: state.openFileGroups.filter((groupname) => groupname !== groupName)
    }))
  }
}))
