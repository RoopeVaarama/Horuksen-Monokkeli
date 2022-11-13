import { Stack } from '@mui/material'
import FileUploader from './FileUploader'

const FilesContainer = () => {
  const handleUpload = (file?: File) => {
    console.log(file)
  }

  return (
    <Stack>
      <FileUploader handleUpload={handleUpload} />
    </Stack>
  )
}

export default FilesContainer
