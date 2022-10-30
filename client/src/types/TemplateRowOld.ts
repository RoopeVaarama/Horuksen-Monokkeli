import { LocationOnPage } from './LocationOnPage'
import { Direction } from './Direction'

export interface TemplateRow {
  [key: string]: any
  id: number
  keyword: string
  relativePosition: Direction['value']
  locationOnPage: LocationOnPage['value']
  onlyKeyword: boolean
  fontSizeDependent: boolean
}
