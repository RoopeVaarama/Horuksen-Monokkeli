import axios from 'axios'
import { getToken } from './auth'

export const uploader = async (formData: FormData) => {
  const options = {
    url: `${process.env.REACT_APP_BACKEND_URL}/files/upload`,
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getToken()}`,
      'Content-Type': 'multipart/form-data'
    },
    data: formData
  }
  const response = await axios(options)
  return response.data
}
