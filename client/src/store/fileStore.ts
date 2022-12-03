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
  addFileList: (title: string) => void
  addEmptyFilelist: (title: string) => void
  resetFileLists: () => void
  deleteFileList: (id: string) => void
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
      set({
        fileUpdate: !get().fileUpdate
      })
    } catch (error) {
      console.log(error)
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
  addFileList: async (title: string) => {
    console.log('add')
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
      set({ fileListUpdate: !get().fileListUpdate, creatingNewList: false })
    } catch (error) {
      console.log(error)
    }
  },
  deleteFileList: async (id: string) => {
    try {
      await fetcher({
        method: 'DELETE',
        path: `${BASE_PATH}/list`,
        id: id
      })
      set({ fileListUpdate: !get().fileListUpdate })
    } catch (error) {
      console.log(error)
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
