import create from 'zustand'
import { relativePositions, locationsOnPage } from '../constants'
import { LocationOnPage } from '../types/LocationOnPage'
import { RelativePosition } from '../types/RelativePosition'
import { Template } from '../types/Template'

interface TemplateState {
  latestId: number
  templates: Template[]
  addTemplate: () => void
  updateKeyword: (id: number, newState: string) => void
  updateRelativePosition: (id: number, newState: RelativePosition['value']) => void
  updateLocationOnPage: (id: number, newState: LocationOnPage['value']) => void
  updateBoolOnlyKeyword: (id: number, newState: boolean) => void
  updateBoolFontSizeDependent: (id: number, newState: boolean) => void
  deleteTemplate: (id: number) => void
}

export const useTemplateStore = create<TemplateState>((set) => ({
  latestId: 0,
  templates: [],
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
      latestId: state.latestId + 1
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
      })
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
      })
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
      })
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
      })
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
      })
    }))
  },
  deleteTemplate: (id) => {
    set((state) => ({
      templates: state.templates.filter((template) => template.id !== id)
    }))
  }
}))
