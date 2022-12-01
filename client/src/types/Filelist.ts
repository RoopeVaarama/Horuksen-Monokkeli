import { FileMeta } from './FileMeta'

export interface FileList {
  _id: string
  title: string
  author: string
  files: FileMeta[]
  createdAt: string
  updatedAt: string
  __v: number
}
