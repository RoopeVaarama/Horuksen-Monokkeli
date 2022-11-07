import { Direction } from './Direction'

export interface TemplateRow {
  [key: string]: any
  key: string
  keyOnly: boolean
  direction: Direction['value']
  allowedOffset?: number
  valueMatch?: string
  valuePrune?: string
  ignoreFirst?: number
  maxPerPage?: number
  _id?: string
  localId?: number
}
