import { Box, Button, Stack, Typography } from '@mui/material'
import { FormattedMessage } from 'react-intl'
import FileUploader from './FileUploader'
import Alert from '../common/Alert'
import { useFileStore } from '../../store/fileStore'
import { useEffect } from 'react'
import FileItem from './FileItem'
import ClearIcon from '@mui/icons-material/Clear'

const FilesContainer = () => {
  const { files, fileLists, selectedFileIDs, resetFiles, uploadFiles } = useFileStore()

  const handleUpload = (files: File[] | null) => {
    // Convert into FormData and upload
    files !== null &&
      files.forEach((file) => {
        const formData = new FormData()
        formData.append('file', file)
        uploadFiles(formData)
      })
  }

  useEffect(() => {
    resetFiles()
  }, [])

  return (
    <Stack spacing={3} id='filepage-container'>
      <FileUploader handleUpload={handleUpload} />
      <Stack spacing={2}>
        <Typography variant='h6'>
          <FormattedMessage id='files' defaultMessage='Tiedostot' />
        </Typography>
        <Stack>
          {Array.isArray(selectedFileIDs) && selectedFileIDs.length > 0 && (
            <Button startIcon={<ClearIcon />}>
              <FormattedMessage id='clearSelection' defaultMessage='Tyhjennä valinnat' />
            </Button>
          )}
        </Stack>

        <Box id='files-container'>
          {Array.isArray(files) &&
            files.length > 0 &&
            files.map((file) => (
              <FileItem
                key={file._id}
                id={file._id}
                filename={file.filename}
                date={file.createdAt}
              />
            ))}
        </Box>

        {Array.isArray(files) && files.length === 0 && (
          <Alert
            message={<FormattedMessage id='noUploadedFiles' defaultMessage='Ei tiedostoja' />}
          />
        )}
        <Typography variant='h6'>
          <FormattedMessage id='filelists' defaultMessage='Käyttäjän listat' />
        </Typography>
        {Array.isArray(fileLists) && fileLists.length === 0 && (
          <Alert message={<FormattedMessage id='noFileLists' defaultMessage='Ei listoja' />} />
        )}
      </Stack>
    </Stack>
  )
}

export default FilesContainer
