import { TemplateRow } from './TemplateRow'

export interface Template {
  userId: string
  title: string
  terms: TemplateRow[]
  _id?: string
}
