import { FileMeta } from '../types'

const sortByAlphabets = (a: FileMeta, b: FileMeta) => {
  if (a.filename === b.filename) {
    return 0
  } else {
    return a.filename < b.filename ? -1 : 1
  }
}

const sortByAlphabetsReverse = (a: FileMeta, b: FileMeta) => {
  if (a.filename === b.filename) {
    return 0
  } else {
    return a > b ? -1 : 1
  }
}

const sortByDate = (a: FileMeta, b: FileMeta) => {
  console.log(a.createdAt == b.createdAt)
  return a.createdAt > b.createdAt ? 1 : -1
}

const sortByDateReverse = (a: FileMeta, b: FileMeta) => {
  return a.createdAt < b.createdAt ? 1 : -1
}

export { sortByAlphabets, sortByAlphabetsReverse, sortByDate, sortByDateReverse }
