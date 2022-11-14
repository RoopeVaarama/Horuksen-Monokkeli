import { TemplateRow } from './TemplateRow'

export interface Template {
  author: string
  title: string
  terms: TemplateRow[]
  _id?: string
}
