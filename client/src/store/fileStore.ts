import create from 'zustand'
import axios from 'axios'
import { FileMeta, FileList, IntlMsg } from '../types'
import { fetcher } from '../tools/fetcher'
import { getToken } from '../tools/auth'

interface FileState {
  creatingNewList: boolean
  files: FileMeta[]
  fileLists: FileList[]
  selectedFileIDs: string[]
  fileUpdate: boolean
  fileListUpdate: boolean
  uploadSuccess: IntlMsg | null
  uploadError: IntlMsg | null
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
      set({
        files: Array.isArray(fetchedData) ? fetchedData : []
      })
    } catch (error) {
      console.log(error)
    }
  },
  uploadFiles: async (formData: FormData) => {
    console.log('upload')
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
      console.log('upload success')
    } catch (error) {
      set({
        uploadError: { intlKey: 'uploadError', defaultMessage: 'Lataus epäonnistui' }
      })
    }
  },
  addListWithFiles: async (title: string) => {
    console.log('Add list with files, title: ' + title)
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
  }
}))
