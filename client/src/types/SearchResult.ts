export interface SearchResult {
  file: string
  [k: string]: string | number | undefined
  key: string
  value?: string
  key_x: number
  key_y: number
  key_width: number
  key_height: number
  val_x?: number
  val_y?: number
  value_width?: number
  value_height?: number
  page: number
}
