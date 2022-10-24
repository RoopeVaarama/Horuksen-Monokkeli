import axios from 'axios'

export const fetcher = async ({
  method,
  path,
  id,
  body,
  token
}: {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  path: string
  id?: string
  body?: any
  token?: string
}) => {
  const urlEnding = id ? `${path}/${id}` : path
  const options = {
    url: `${process.env.REACT_APP_BACKEND_URL}/${urlEnding}`,
    method: method,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    data: body
  }
  try {
    const response = await axios(options)
    return response.data
  } catch (e) {
    console.log(e)
  }
}
