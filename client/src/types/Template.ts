import { LocationOnPage } from './LocationOnPage'
import { RelativePosition } from './RelativePosition'

export interface Template {
  id: number
  keyword: string
  relativePosition: RelativePosition['value']
  locationOnPage: LocationOnPage['value']
  onlyKeyword: boolean
  fontSizeDependent: boolean
}
