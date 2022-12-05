import { FileMeta } from '../types'
import { FileList } from '../types'

const sortFilesByAlphabets = (a: FileMeta, b: FileMeta) => {
  if (a.filename === b.filename) {
    return 0
  } else {
    return a.filename < b.filename ? -1 : 1
  }
}

const sortFilesByAlphabetsReverse = (a: FileMeta, b: FileMeta) => {
  if (a.filename === b.filename) {
    return 0
  } else {
    return a > b ? -1 : 1
  }
}

const sortFilesByDate = (a: FileMeta, b: FileMeta) => {
  return a.createdAt > b.createdAt ? 1 : -1
}

const sortFilesByDateReverse = (a: FileMeta, b: FileMeta) => {
  return a.createdAt < b.createdAt ? 1 : -1
}

const sortListsByAlphabets = (a: FileList, b: FileList) => {
  if (a.title === b.title) {
    return 0
  } else {
    return a.title < b.title ? -1 : 1
  }
}

const sortListsByAlphabetsReverse = (a: FileList, b: FileList) => {
  if (a.title === b.title) {
    return 0
  } else {
    return a > b ? -1 : 1
  }
}

const sortListsByDate = (a: FileList, b: FileList) => {
  return a.updatedAt > b.updatedAt ? 1 : -1
}

const sortListsByDateReverse = (a: FileList, b: FileList) => {
  return a.updatedAt < b.updatedAt ? 1 : -1
}

export {
  sortFilesByAlphabets,
  sortFilesByAlphabetsReverse,
  sortFilesByDate,
  sortFilesByDateReverse,
  sortListsByAlphabets,
  sortListsByAlphabetsReverse,
  sortListsByDate,
  sortListsByDateReverse
}
