import { Box, Stack, Typography, Button } from '@mui/material'
import { useEffect, useState } from 'react'
import FileItem from '../FileItem'
import Alert from '../../common/Alert'
import { FormattedMessage } from 'react-intl'
import { useFileStore } from '../../../store/fileStore'
import ClearIcon from '@mui/icons-material/Clear'
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd'

const Files = () => {
  const { files, selectedFileIDs, fileUpdate, resetFileIDs, resetFiles } = useFileStore()

  const [open, setOpen] = useState(true)

  useEffect(() => {
    resetFiles()
  }, [fileUpdate])

  return (
    <Stack spacing={1}>
      <Typography variant='h6'>
        <FormattedMessage id='files' defaultMessage='Tiedostot' />
      </Typography>

      {Array.isArray(selectedFileIDs) && selectedFileIDs.length > 0 && (
        <Stack spacing={1} direction='row'>
          <Button
            startIcon={<ClearIcon />}
            onClick={resetFileIDs}
            sx={{ width: '20%', fontSize: '12px' }}
          >
            <FormattedMessage id='clearSelection' defaultMessage='Tyhjennä valinnat' />
          </Button>
          <Button startIcon={<PlaylistAddIcon />} sx={{ width: '20%', fontSize: '12px' }}>
            <FormattedMessage
              id='addSelectedToExistingList'
              defaultMessage='Lisää tiedostot listaan'
            />
          </Button>
        </Stack>
      )}

      <Box id='files-container'>
        {Array.isArray(files) &&
          files.length > 0 &&
          files.map((file) => (
            <FileItem key={file._id} id={file._id} filename={file.filename} date={file.createdAt} />
          ))}
      </Box>

      {Array.isArray(files) && files.length === 0 && (
        <Alert message={<FormattedMessage id='noUploadedFiles' defaultMessage='Ei tiedostoja' />} />
      )}
    </Stack>
  )
}

export default Files
