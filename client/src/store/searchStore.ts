import create from 'zustand'
import { relativePositions, locationsOnPage } from '../constants'
import { fetcher } from '../tools/fetcher'
import { Template, SearchResult, RelativePosition, LocationOnPage } from '../types'

interface SearchState {
  latestId: number
  templates: Template[]
  results: SearchResult[]
  refreshSearch: boolean
  searching: boolean
  addTemplate: () => void
  updateKeyword: (id: number, newState: string) => void
  updateRelativePosition: (id: number, newState: RelativePosition['value']) => void
  updateLocationOnPage: (id: number, newState: LocationOnPage['value']) => void
  updateBoolOnlyKeyword: (id: number, newState: boolean) => void
  updateBoolFontSizeDependent: (id: number, newState: boolean) => void
  deleteTemplate: (id: number) => void
  search: () => void
}

export const useSearchStore = create<SearchState>((set, get) => ({
  latestId: 0,
  templates: [],
  results: [],
  searching: false,
  refreshSearch: true,
  addTemplate: () => {
    set((state) => ({
      templates: [
        ...state.templates,
        {
          id: state.latestId + 1,
          keyword: '',
          relativePosition: relativePositions[0].value,
          locationOnPage: locationsOnPage[0].value,
          onlyKeyword: true,
          fontSizeDependent: true
        } as Template
      ],
      latestId: state.latestId + 1,
      refreshSearch: true
    }))
  },
  updateKeyword: (id, newState) => {
    set((state) => ({
      templates: state.templates.map((template) => {
        if (template.id === id) {
          return { ...template, keyword: newState }
        } else {
          return template
        }
      }),
      refreshSearch: true
    }))
  },
  updateRelativePosition: (id, newState) => {
    set((state) => ({
      templates: state.templates.map((template) => {
        if (template.id === id) {
          return { ...template, relativePosition: newState }
        } else {
          return template
        }
      }),
      refreshSearch: true
    }))
  },
  updateLocationOnPage: (id, newState) => {
    set((state) => ({
      templates: state.templates.map((template) => {
        if (template.id === id) {
          return { ...template, locationOnPage: newState }
        } else {
          return template
        }
      }),
      refreshSearch: true
    }))
  },
  updateBoolOnlyKeyword: (id: number, newState: boolean) => {
    set((state) => ({
      templates: state.templates.map((template) => {
        if (template.id === id) {
          return { ...template, onlyKeyword: newState }
        } else {
          return template
        }
      }),
      refreshSearch: true
    }))
  },
  updateBoolFontSizeDependent: (id: number, newState: boolean) => {
    set((state) => ({
      templates: state.templates.map((template) => {
        if (template.id === id) {
          return { ...template, fontSizeDependent: newState }
        } else {
          return template
        }
      }),
      refreshSearch: true
    }))
  },
  deleteTemplate: (id) => {
    set((state) => ({
      templates: state.templates.filter((template) => template.id !== id),
      refreshSearch: true
    }))
  },
  search: async () => {
    if (!get().searching && get().refreshSearch) {
      set({ searching: true })
      const body = {
        key: get().templates[0].keyword,
        direction: get().templates[0].relativePosition
      }
      const data = await fetcher({
        method: 'POST',
        path: 'search',
        id: 'invoice.pdf',
        body: body
      })
      set({ results: data, searching: false, refreshSearch: false })
    }
  }
}))
