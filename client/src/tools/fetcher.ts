import axios from 'axios'
import { getToken } from './auth'

export const fetcher = async ({
  method,
  path,
  id,
  body
}: {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  path: string
  id?: string
  body?: any
}) => {
  const urlEnding = id ? `${path}/${id}` : path
  const options = {
    url: `${process.env.REACT_APP_BACKEND_URL}/${urlEnding}`,
    method: method,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`
    },
    data: body
  }
  const response = await axios(options)
  return response.data
}
