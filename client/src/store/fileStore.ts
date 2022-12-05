import create from 'zustand'
import axios from 'axios'
import { FileMeta, FileList, IntlMsg, SortVariant } from '../types'
import { fetcher } from '../tools/fetcher'
import { getToken } from '../tools/auth'
import {
  sortFilesByDate,
  sortFilesByDateReverse,
  sortFilesByAlphabets,
  sortFilesByAlphabetsReverse,
  sortListsByAlphabets,
  sortListsByAlphabetsReverse,
  sortListsByDate,
  sortListsByDateReverse
} from '../tools/sortPredicates'

interface FileState {
  creatingNewList: boolean
  files: FileMeta[]
  fileLists: FileList[]
  selectedFileIDs: string[]
  fileUpdate: boolean
  fileListUpdate: boolean
  uploadSuccess: IntlMsg | null
  uploadError: IntlMsg | null
  fileSortVariant: SortVariant
  listSortVariant: SortVariant
  fileKeyword: string
  listKeyword: string
  addFileID: (id: string) => void
  deleteFile: (id: string) => void
  openFile: (id: string) => void
  removeFileID: (id: string) => void
  resetFileIDs: () => void
  resetFiles: () => void
  uploadFiles: (formData: FormData) => void
  addEmptyFilelist: (title: string) => void
  addListWithFiles: (title: string) => void
  addFilesToList: (id: string) => void
  editFilelist: (id: string, newTitle: string, filesIDs: string[]) => void
  resetFileLists: () => void
  deleteFileList: (id: string) => void
  deleteSingleFileFromList: (listID: string, fileID: string) => void
  startCreating: () => void
  stopCreating: () => void
  setFileSortVariant: (variant: SortVariant) => void
  setListSortVariant: (variant: SortVariant) => void
  sortFiles: () => void
  sortFilelists: () => void
  setFileKeyword: (keyword: string) => void
  fileSearch: () => void
  stopFileSearch: () => void
  setListKeyword: (keyword: string) => void
  fileListSearch: () => void
  stopFileListSearch: () => void
}

const BASE_PATH = 'files'

export const useFileStore = create<FileState>((set, get) => ({
  creatingNewList: false,
  files: [],
  fileLists: [],
  selectedFileIDs: [],
  fileUpdate: false,
  fileListUpdate: false,
  uploadSuccess: null,
  uploadError: null,
  fileSortVariant: 'date',
  listSortVariant: 'date',
  fileKeyword: '',
  listKeyword: '',
  addFileID: (id: string) => {
    set((state) => ({
      selectedFileIDs: [...state.selectedFileIDs, id]
    }))
  },
  deleteFile: async (id: string) => {
    try {
      await fetcher({
        method: 'DELETE',
        path: BASE_PATH,
        id: id
      })
      set((state) => ({
        files: get().files.filter((file) => file._id !== id),
        selectedFileIDs: state.selectedFileIDs.filter((fileid) => fileid !== id),
        fileUpdate: !get().fileUpdate
      }))
    } catch (error) {
      set({ uploadError: { intlKey: 'deleteFail', defaultMessage: 'Poistaminen epäonnistui' } })
    }
  },
  openFile: (id: string) => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/files/read/${id}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`
      }
    })
      .then((res) => res.blob())
      .then((myBlob) => {
        const objectURL = URL.createObjectURL(myBlob)
        window.open(objectURL, '_blank', 'noopener, noreferrer')
      })
      .catch((e) => console.log(e))
  },
  removeFileID: (id: string) => {
    set((state) => ({
      selectedFileIDs: state.selectedFileIDs.filter((fileID) => fileID !== id)
    }))
  },
  resetFileIDs: () => {
    set({ selectedFileIDs: [] })
  },
  resetFiles: async () => {
    try {
      const fetchedData = await fetcher({
        method: 'GET',
        path: BASE_PATH
      })
      get().sortFiles()
      set({
        files: Array.isArray(fetchedData) ? fetchedData : []
      })
    } catch (error) {
      console.log(error)
    }
  },
  uploadFiles: async (formData: FormData) => {
    const options = {
      url: `${process.env.REACT_APP_BACKEND_URL}/${BASE_PATH}/upload`,
      method: 'POST',
      headers: {
        Authorization: `Bearer ${getToken()}`,
        'Content-Type': 'multipart/form-data'
      },
      data: formData
    }
    try {
      await axios(options)
      set({
        fileUpdate: !get().fileUpdate,
        uploadSuccess: { intlKey: 'uploadSuccess', defaultMessage: 'Tiedostojen lataus onnistui' }
      })
    } catch (error) {
      set({
        uploadError: { intlKey: 'uploadError', defaultMessage: 'Lataus epäonnistui' }
      })
    }
  },
  addListWithFiles: async (title: string) => {
    try {
      await fetcher({
        method: 'POST',
        path: `${BASE_PATH}/list`,
        body: {
          title: title,
          files: get().selectedFileIDs
        }
      })
      set({
        selectedFileIDs: [],
        fileListUpdate: !get().fileListUpdate,
        fileUpdate: !get().fileUpdate,
        uploadSuccess: {
          intlKey: 'listWithFilesAdded',
          defaultMessage: 'Lista ja tiedostot lisätty onnistuneesti'
        }
      })
    } catch (error) {
      console.log(error)
    }
  },
  addFilesToList: async (id: string) => {
    try {
      await fetcher({
        method: 'PATCH',
        path: `${BASE_PATH}/list/files`,
        id: id,
        body: get().selectedFileIDs
      })
      set({
        fileListUpdate: !get().fileListUpdate,
        selectedFileIDs: [],
        uploadSuccess: { intlKey: 'fileAddSuccess', defaultMessage: 'Tiedostojen lisäys onnistui' }
      })
    } catch (error) {
      set({
        uploadError: { intlKey: 'fileAddError', defaultMessage: 'Lataus epäonnistui' }
      })
    }
  },
  editFilelist: async (id: string, newTitle: string, files: string[]) => {
    try {
      await fetcher({
        method: 'PATCH',
        path: `${BASE_PATH}/list`,
        id: id,
        body: {
          title: newTitle,
          files: files
        }
      })
      set({
        fileListUpdate: !get().fileListUpdate
      })
    } catch (error) {
      console.log(error)
      set({
        uploadError: { intlKey: 'listEditError', defaultMessage: 'Listan muokkaus epäonnistui' }
      })
    }
  },
  deleteSingleFileFromList: async (listID: string, fileID: string) => {
    try {
      await fetcher({
        method: 'DELETE',
        path: `${BASE_PATH}/list/files`,
        id: listID,
        body: [fileID]
      })
      set({ fileListUpdate: !get().fileListUpdate })
    } catch (error) {
      console.log(error)
    }
  },
  addEmptyFilelist: async (title: string) => {
    try {
      await fetcher({
        method: 'POST',
        path: `${BASE_PATH}/list`,
        body: {
          title: title,
          files: []
        }
      })
      set({
        fileListUpdate: !get().fileListUpdate,
        creatingNewList: false,
        uploadSuccess: { intlKey: 'filelistAddSuccess', defaultMessage: 'Lista luotu' }
      })
    } catch (error) {
      set({
        creatingNewList: false,
        uploadError: { intlKey: 'addFailure', defaultMessage: 'Poistaminen epäonnistui' }
      })
    }
  },
  deleteFileList: async (id: string) => {
    try {
      await fetcher({
        method: 'DELETE',
        path: `${BASE_PATH}/list`,
        id: id
      })
      set({
        fileLists: get().fileLists.filter((list) => list._id !== id),
        fileListUpdate: !get().fileListUpdate,
        uploadSuccess: { intlKey: 'listDeleted', defaultMessage: 'Lista poistettu' }
      })
    } catch (error) {
      set({
        uploadError: { intlKey: 'deleteFail', defaultMessage: 'Poistaminen epäonnistui' }
      })
    }
  },
  resetFileLists: async () => {
    try {
      const fetchedData = await fetcher({
        method: 'GET',
        path: `${BASE_PATH}/list`
      })
      get().sortFilelists()
      set({
        fileLists: Array.isArray(fetchedData) ? fetchedData : []
      })
    } catch (error) {
      console.log(error)
    }
  },
  startCreating: () => {
    set({ creatingNewList: true })
  },
  stopCreating: () => {
    set({ creatingNewList: false })
  },
  setFileSortVariant: (variant: SortVariant) => {
    set({ fileSortVariant: variant })
  },
  setListSortVariant: (variant: SortVariant) => {
    set({ listSortVariant: variant })
  },
  sortFiles: () => {
    switch (get().fileSortVariant) {
      case 'name':
        set((state) => ({
          files: state.files.sort(sortFilesByAlphabets)
        }))
        break
      case 'nameReverse':
        set((state) => ({
          files: state.files.sort(sortFilesByAlphabetsReverse)
        }))
        break
      case 'date':
        set((state) => ({
          files: state.files.sort(sortFilesByDate)
        }))
        break
      case 'dateReverse':
        set((state) => ({
          files: state.files.sort(sortFilesByDateReverse)
        }))
        break
      default:
        break
    }
  },
  sortFilelists: () => {
    switch (get().listSortVariant) {
      case 'name':
        set((state) => ({
          fileLists: state.fileLists.sort(sortListsByAlphabets)
        }))
        break
      case 'nameReverse':
        set((state) => ({
          fileLists: state.fileLists.sort(sortListsByAlphabetsReverse)
        }))
        break
      case 'date':
        set((state) => ({
          fileLists: state.fileLists.sort(sortListsByDate)
        }))
        break
      case 'dateReverse':
        set((state) => ({
          fileLists: state.fileLists.sort(sortListsByDateReverse)
        }))
        break
      default:
        break
    }
  },
  setFileKeyword: (newKeyword: string) => {
    set({
      fileKeyword: newKeyword
    })
  },
  fileSearch: () => {
    if (get().fileKeyword !== '') {
      set({
        files: get().files.filter((file) =>
          file.filename.toLowerCase().includes(get().fileKeyword.toLowerCase())
        )
      })
    }
  },
  stopFileSearch: () => {
    set({
      fileKeyword: ''
    })
    get().resetFiles()
  },
  setListKeyword: (newKeyword: string) => {
    set({
      listKeyword: newKeyword
    })
  },
  fileListSearch: () => {
    if (get().listKeyword !== '') {
      set({
        fileLists: get().fileLists.filter((filelist) =>
          filelist.title.toLowerCase().includes(get().listKeyword.toLowerCase())
        )
      })
    }
  },
  stopFileListSearch: () => {
    set({
      listKeyword: ''
    })
    get().resetFileLists()
  }
}))
