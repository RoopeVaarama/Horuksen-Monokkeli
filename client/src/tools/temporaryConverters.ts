import { templateRowBase } from '../constants'
import { Template, TemplateRow } from '../types'

// TODO: delete once backend accepts template.terms as an array

export interface TemplateDb {
  _id: string
  userId: string
  title: string
  terms: TemplateRow
}

export const termsObjToArray = (templates: TemplateDb[] | Template[]) => {
  return templates.map((template) => {
    if (!Array.isArray(template.terms)) {
      return { ...template, terms: [template.terms] }
    } else {
      return template
    }
  }) as Template[]
}

export const templateToDb = (template: Template) => {
  return { ...template, terms: template.terms?.[0] || templateRowBase } as TemplateDb
}

export const dbToTemplate = (template: TemplateDb) => {
  return { ...template, terms: [template.terms] } as Template
}

export const templatesArrayToSearch = (templates: Template[]) => {
  return templates?.[0].terms?.[0]
}
