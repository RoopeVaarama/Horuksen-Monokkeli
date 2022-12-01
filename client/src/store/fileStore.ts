import create from 'zustand'
import axios from 'axios'
import { FileMeta, FileList, IntlMsg } from '../types'
import { fetcher } from '../tools/fetcher'
import { getToken } from '../tools/auth'

interface FileState {
  fetching: boolean
  files: FileMeta[]
  fileLists: FileList[]
  selectedFileIDs: string[]
  update: boolean
  uploadSuccess: IntlMsg | null
  uploadError: IntlMsg | null
  addFileID: (id: string) => void
  deleteFile: (id: string) => void
  openFile: (id: string) => void
  removeFileID: (id: string) => void
  resetFileIDs: () => void
  resetFiles: () => void
  uploadFiles: (formData: FormData) => void
}

const BASE_PATH = 'files'

export const useFileStore = create<FileState>((set, get) => ({
  fetching: false,
  files: [],
  fileLists: [],
  selectedFileIDs: [],
  update: false,
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
        update: !get().update
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
    if (!get().fetching) {
      set({ fetching: true })
      try {
        const fetchedData = await fetcher({
          method: 'GET',
          path: BASE_PATH
        })
        set({
          fetching: false,
          files: Array.isArray(fetchedData) ? fetchedData : []
        })
      } catch (error) {
        set({ fetching: false })
      }
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
        update: !get().update,
        uploadSuccess: { intlKey: 'uploadSuccess', defaultMessage: 'Tiedostojen lataus onnistui' }
      })
    } catch (error) {
      set({
        uploadError: { intlKey: 'uploadError', defaultMessage: 'Lataus epäonnistui' }
      })
    }
  }
}))
