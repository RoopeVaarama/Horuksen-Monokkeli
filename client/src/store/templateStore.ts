import create from 'zustand'
import { templateBase, templateRowBase } from '../constants'
import { fetcher } from '../tools/fetcher'
import { titleAlreadyExists } from '../tools/validation'
import { Direction, Template, TemplateRow } from '../types'

const BASE_PATH = 'template'

interface NewValue {
  [key: string]: any
}

const updateDraftRow = (
  newValue: NewValue,
  templateDraft: Template | null,
  id?: string,
  localId?: number
) => {
  return templateDraft
    ? {
        ...templateDraft,
        terms: templateDraft.terms.map((row) => {
          if (
            (row._id !== undefined && row._id === id) ||
            (row.localId !== undefined && row.localId === localId)
          ) {
            return Object.assign(row, newValue)
          } else {
            return Object.assign({}, row)
          }
        })
      }
    : null
}

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
  updateTemplateDraftKey: (key: string, id?: string, localId?: number) => void
  updateTemplateDraftDirection: (
    direction: Direction['value'],
    id?: string,
    localId?: number
  ) => void
  updateTemplateDraftKeyOnly: (keyOnly: boolean, id?: string, localId?: number) => void
  updateTemplateDraftAllowedOffset: (allowedOffset: number, id?: string, localId?: number) => void
  updateTemplateDraftLevenDist: (levenDistance: number, id?: string, localId?: number) => void
  updateTemplateDraftValueMatch: (valueMatch: string, id?: string, localId?: number) => void
  updateTemplateDraftValuePrune: (valuePrune: string, id?: string, localId?: number) => void
  updateTemplateDraftIgnoreFirst: (ignoreFirst: number, id?: string, localId?: number) => void
  updateTemplateDraftMaxPerPage: (maxPerPage: number, id?: string, localId?: number) => void
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
    const newDraft = JSON.parse(JSON.stringify(baseTemplate ?? templateBase))
    set(() => ({
      templateDraft: { ...newDraft, author: userId },
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
    const newDraftRow = JSON.parse(JSON.stringify(templateRowBase))
    set((state) => ({
      templateDraft: state.templateDraft
        ? {
            ...state.templateDraft,
            terms: [
              ...state.templateDraft.terms,
              { ...newDraftRow, localId: state.latestTemplateRowId + 1 }
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
  updateTemplateDraftKey: (key: string, id?: string, localId?: number) => {
    set((state) => ({
      templateDraft: updateDraftRow({ key }, state.templateDraft, id, localId)
    }))
  },
  updateTemplateDraftDirection: (direction: Direction['value'], id?: string, localId?: number) => {
    set((state) => ({
      templateDraft: updateDraftRow({ direction }, state.templateDraft, id, localId)
    }))
  },
  updateTemplateDraftKeyOnly: (keyOnly: boolean, id?: string, localId?: number) => {
    set((state) => ({
      templateDraft: updateDraftRow({ keyOnly }, state.templateDraft, id, localId)
    }))
  },
  updateTemplateDraftAllowedOffset: (allowedOffset: number, id?: string, localId?: number) => {
    set((state) => ({
      templateDraft: updateDraftRow({ allowedOffset }, state.templateDraft, id, localId)
    }))
  },
  updateTemplateDraftLevenDist: (levenDistance: number, id?: string, localId?: number) => {
    set((state) => ({
      templateDraft: updateDraftRow({ levenDistance }, state.templateDraft, id, localId)
    }))
  },
  updateTemplateDraftValueMatch: (valueMatch: string, id?: string, localId?: number) => {
    const newValueMatch = valueMatch || templateRowBase.valueMatch
    set((state) => ({
      templateDraft: updateDraftRow({ valueMatch: newValueMatch }, state.templateDraft, id, localId)
    }))
  },
  updateTemplateDraftValuePrune: (valuePrune: string, id?: string, localId?: number) => {
    const newValuePrune = valuePrune || templateRowBase.valuePrune
    set((state) => ({
      templateDraft: updateDraftRow({ valuePrune: newValuePrune }, state.templateDraft, id, localId)
    }))
  },
  updateTemplateDraftIgnoreFirst: (ignoreFirst: number, id?: string, localId?: number) => {
    set((state) => ({
      templateDraft: updateDraftRow({ ignoreFirst }, state.templateDraft, id, localId)
    }))
  },
  updateTemplateDraftMaxPerPage: (maxPerPage: number, id?: string, localId?: number) => {
    set((state) => ({
      templateDraft: updateDraftRow({ maxPerPage }, state.templateDraft, id, localId)
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
