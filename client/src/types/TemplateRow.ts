import { Direction } from './Direction'

export interface TemplateRow {
  [key: string]: any
  key: string
  direction: Direction['value']
  allowedOffset?: number
  valueMatch?: string
  valuePrune?: string
  ignoreFirst?: number
  maxPerPage?: number
  id?: number
}
