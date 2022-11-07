import create from 'zustand'
import { templateBase, templateRowBase } from '../constants'
import { fetcher } from '../tools/fetcher'
import { titleAlreadyExists } from '../tools/validation'
import { Direction, Template, TemplateRow } from '../types'

const BASE_PATH = 'template'

interface TemplateState {
  latestTemplateRowId: number
  draftIsEdit: boolean
  templateDraft: Template | null
  templates: Template[]
  fetching: boolean
  createTemplateDraft: (userId: string, baseTemplate?: Template) => void
  deleteTemplateDraft: () => void
  addTemplateDraftRow: () => void
  deleteTemplateDraftRow: (id?: string, localId?: number) => void
  updateTemplateDraftTitle: (newTitle: string) => void
  updateTemplateDraftKey: (newKey: string, id?: string, localId?: number) => void
  updateTemplateDraftDirection: (
    newDirection: Direction['value'],
    id?: string,
    localId?: number
  ) => void
  updateTemplateDraftKeyOnly: (newState: boolean, id?: string, localId?: number) => void
  resetTemplates: (userId: string) => void
  deleteTemplate: (id: string) => void
  createTemplate: () => void
  updateTemplate: () => void
}

/**
 * Store for interacting with templates stored in the database
 */
export const useTemplateStore = create<TemplateState>((set, get) => ({
  latestTemplateRowId: templateRowBase.localId as number,
  draftIsEdit: false,
  templateDraft: null,
  templates: [],
  fetching: false,
  createTemplateDraft: (userId: string, baseTemplate?: Template) => {
    set(() => ({
      templateDraft: baseTemplate ?? { ...templateBase, author: userId },
      draftIsEdit: Boolean(baseTemplate)
    }))
  },
  deleteTemplateDraft: () => {
    set(() => ({
      templateDraft: null,
      latestTemplateRowId: templateRowBase.localId
    }))
  },
  addTemplateDraftRow: () => {
    set((state) => ({
      templateDraft: state.templateDraft
        ? {
            ...state.templateDraft,
            terms: [
              ...state.templateDraft.terms,
              { ...templateRowBase, localId: state.latestTemplateRowId + 1 }
            ]
          }
        : null,
      latestTemplateRowId: state.latestTemplateRowId + 1
    }))
  },
  deleteTemplateDraftRow: (id?: string, localId?: number) => {
    if (id === undefined && localId === undefined) {
      return
    }
    set((state) => ({
      templateDraft: state.templateDraft
        ? {
            ...state.templateDraft,
            terms: state.templateDraft.terms.filter(
              (row) =>
                (row._id !== undefined && row._id !== id) ||
                (row.localId !== undefined && row.localId !== localId)
            )
          }
        : null
    }))
  },
  updateTemplateDraftTitle: (newTitle: string) => {
    set((state) => ({
      templateDraft: state.templateDraft ? { ...state.templateDraft, title: newTitle } : null
    }))
  },
  updateTemplateDraftKey: (newKey: string, id?: string, localId?: number) => {
    set((state) => ({
      templateDraft: state.templateDraft
        ? {
            ...state.templateDraft,
            terms: state.templateDraft.terms.map((row) => {
              if (
                (row._id !== undefined && row._id === id) ||
                (row.localId !== undefined && row.localId === localId)
              ) {
                return { ...row, key: newKey }
              } else {
                return row
              }
            })
          }
        : null
    }))
  },
  updateTemplateDraftDirection: (
    newDirection: Direction['value'],
    id?: string,
    localId?: number
  ) => {
    set((state) => ({
      templateDraft: state.templateDraft
        ? {
            ...state.templateDraft,
            terms: state.templateDraft.terms.map((row) => {
              if (
                (row._id !== undefined && row._id === id) ||
                (row.localId !== undefined && row.localId === localId)
              ) {
                return { ...row, direction: newDirection }
              } else {
                return row
              }
            })
          }
        : null
    }))
  },
  updateTemplateDraftKeyOnly: (newState: boolean, id?: string, localId?: number) => {
    set((state) => ({
      templateDraft: state.templateDraft
        ? {
            ...state.templateDraft,
            terms: state.templateDraft.terms.map((row) => {
              if (
                (row._id !== undefined && row._id === id) ||
                (row.localId !== undefined && row.localId === localId)
              ) {
                return { ...row, keyOnly: newState }
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
          path: `${BASE_PATH}/u`,
          id: userId
        })
        set({ fetching: false, templates: Array.isArray(data) ? data : [] })
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
          path: BASE_PATH,
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
      templateDraft?.terms.length !== 0 &&
      !titleAlreadyExists(get().templates, templateDraft.title)
    ) {
      set({ fetching: true })
      try {
        const data = await fetcher({
          method: 'POST',
          path: BASE_PATH,
          body: templateDraft
        })
        set((state) => ({
          fetching: false,
          templateDraft: null,
          latestTemplateRowId: templateRowBase.localId,
          templates: [...state.templates, data]
        }))
      } catch (e) {
        set({ fetching: false })
      }
    } else {
      console.log('ERROR: MISSING VALUES') // TODO
    }
  },
  updateTemplate: async () => {
    if (get().fetching) return
    const templateDraft = get().templateDraft
    const hasKey = (obj: TemplateRow) => obj.key
    if (
      templateDraft !== null &&
      templateDraft?.title &&
      templateDraft?.terms.every(hasKey) &&
      templateDraft?.terms.length !== 0 &&
      !titleAlreadyExists(get().templates, templateDraft.title, templateDraft._id)
    ) {
      set({ fetching: true })
      try {
        const data = await fetcher({
          method: 'PATCH',
          path: BASE_PATH,
          body: templateDraft,
          id: templateDraft._id
        })
        set((state) => ({
          fetching: false,
          templateDraft: null,
          latestTemplateRowId: templateRowBase.localId,
          templates: data
            ? state.templates.map((template) => {
                if (template._id === data._id) {
                  return data
                } else {
                  return template
                }
              })
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