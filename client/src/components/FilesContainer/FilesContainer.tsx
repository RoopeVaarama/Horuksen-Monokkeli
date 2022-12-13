import { Stack } from '@mui/material'
import FileUploader from './FileUploader'
import Files from './Files'
import FileLists from './FileLists'
import { useFileStore } from '../../store/fileStore'

const FilesContainer = () => {
  const { uploadFiles } = useFileStore()

  const handleUpload = async (files: File[] | null) => {
    // Convert into FormData and upload
    files !== null &&
      files.forEach(async (file) => {
        const formData = new FormData()
        formData.append('file', file)
        await uploadFiles(formData)
      })
  }

  return (
    <Stack spacing={3} id='filepage-container'>
      <FileUploader handleUpload={handleUpload} />
      <Stack spacing={4}>
        <Files />
        <FileLists />
      </Stack>
    </Stack>
  )
}

export default FilesContainer
