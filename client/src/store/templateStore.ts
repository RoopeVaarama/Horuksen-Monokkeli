import create from 'zustand'
import { templateBase, templateRowBase } from '../constants'
import { fetcher } from '../tools/fetcher'
import { templateToDb, termsObjToArray } from '../tools/temporaryConverters'
import { Direction, Template, TemplateRow } from '../types'

interface TemplateState {
  latestTemplateRowId: number
  templateDraft: Template | null
  templates: Template[]
  fetching: boolean
  createTemplateDraft: (userId: string) => void
  deleteTemplateDraft: () => void
  addTemplateDraftRow: () => void
  deleteTemplateDraftRow: (rowId: number) => void
  updateTemplateDraftTitle: (newTitle: string) => void
  updateTemplateDraftKey: (rowId: number, newKey: string) => void
  updateTemplateDraftDirection: (rowId: number, newDirection: Direction['value']) => void
  resetTemplates: (userId: string) => void
  deleteTemplate: (id: string) => void
  createTemplate: () => void
}

/**
 * Store for interacting with templates stored in the database
 */
export const useTemplateStore = create<TemplateState>((set, get) => ({
  latestTemplateRowId: templateRowBase.id as number,
  templateDraft: null,
  templates: [],
  fetching: false,
  createTemplateDraft: (userId: string) => {
    set(() => ({
      templateDraft: { ...templateBase, userId }
    }))
  },
  deleteTemplateDraft: () => {
    set(() => ({
      templateDraft: null,
      latestTemplateRowId: templateRowBase.id
    }))
  },
  addTemplateDraftRow: () => {
    set((state) => ({
      templateDraft: state.templateDraft
        ? {
            ...state.templateDraft,
            terms: [
              ...state.templateDraft.terms,
              { ...templateRowBase, id: state.latestTemplateRowId + 1 }
            ]
          }
        : null,
      latestTemplateRowId: state.latestTemplateRowId + 1
    }))
  },
  deleteTemplateDraftRow: (rowId) => {
    set((state) => ({
      templateDraft: state.templateDraft
        ? {
            ...state.templateDraft,
            terms: state.templateDraft.terms.filter((row) => row.id !== rowId)
          }
        : null
    }))
  },
  updateTemplateDraftTitle: (newTitle: string) => {
    set((state) => ({
      templateDraft: state.templateDraft ? { ...state.templateDraft, title: newTitle } : null
    }))
  },
  updateTemplateDraftKey: (rowId: number, newKey: string) => {
    set((state) => ({
      templateDraft: state.templateDraft
        ? {
            ...state.templateDraft,
            terms: state.templateDraft.terms.map((row) => {
              if (row.id === rowId) {
                return { ...row, key: newKey }
              } else {
                return row
              }
            })
          }
        : null
    }))
  },
  updateTemplateDraftDirection: (rowId: number, newDirection: Direction['value']) => {
    set((state) => ({
      templateDraft: state.templateDraft
        ? {
            ...state.templateDraft,
            terms: state.templateDraft.terms.map((row) => {
              if (row.id === rowId) {
                return { ...row, direction: newDirection }
              } else {
                return row
              }
            })
          }
        : null
    }))
  },
  resetTemplates: async (userId: string) => {
    if (!get().fetching) {
      set({ fetching: true })
      try {
        const data = await fetcher({
          method: 'GET',
          path: 'template/templates',
          id: userId
        })
        set({ fetching: false, templates: termsObjToArray(data) })
      } catch (e) {
        set({ fetching: false })
      }
    }
  },
  deleteTemplate: async (id: string) => {
    if (!get().fetching) {
      set({ fetching: true })
      try {
        const data = await fetcher({
          method: 'DELETE',
          path: 'template/delete',
          id: id
        })
        set((state) => ({
          fetching: false,
          templates: data
            ? state.templates.filter((template) => template._id !== id)
            : state.templates
        }))
      } catch (e) {
        set({ fetching: false })
      }
    }
  },
  createTemplate: async () => {
    if (get().fetching) return
    const templateDraft = get().templateDraft
    const hasKey = (obj: TemplateRow) => obj.key
    if (
      templateDraft !== null &&
      templateDraft?.title &&
      templateDraft?.terms.every(hasKey) &&
      templateDraft?.terms.length !== 0
    ) {
      set({ fetching: true })
      try {
        const data = await fetcher({
          method: 'POST',
          path: 'template/create',
          body: { templates: [templateToDb(templateDraft)] }
        })
        set((state) => ({
          fetching: false,
          templateDraft: null,
          latestTemplateRowId: templateRowBase.id,
          templates:
            Array.isArray(data) && data.length !== 0
              ? [...state.templates, termsObjToArray(data)[0]]
              : state.templates
        }))
      } catch (e) {
        set({ fetching: false })
      }
    } else {
      console.log('ERROR: MISSING VALUES') // TODO
    }
  }
}))
