import { Box, Stack, Typography, Button } from '@mui/material'
import { useEffect, useState } from 'react'
import FileItem from '../FileItem'
import ListSelectionDialog from '../Dialogs/ListSelectionDialog'
import Alert from '../../common/Alert'
import { FormattedMessage } from 'react-intl'
import { useFileStore } from '../../../store/fileStore'
import ClearIcon from '@mui/icons-material/Clear'
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd'
import SortingMenu from '../SortingMenu'

const Files = () => {
  const {
    files,
    selectedFileIDs,
    fileUpdate,
    sortVariant,
    addFilesToList,
    resetFileIDs,
    resetFiles,
    sortFiles
  } = useFileStore()

  const [dialogOpen, setDialogOpen] = useState(false)

  const handleAddButtonClick = () => {
    setDialogOpen(true)
  }

  const handleDialogClose = (id: string | null) => {
    setDialogOpen(false)
    if (id !== null) {
      addFilesToList(id)
    }
  }

  useEffect(() => {
    resetFiles()
  }, [fileUpdate])

  useEffect(() => {
    sortFiles()
  }, [sortVariant])

  return (
    <Stack spacing={1}>
      <Typography variant='h6'>
        <FormattedMessage id='files' defaultMessage='Tiedostot' />
      </Typography>
      <Stack spacing={1} direction='row' justifyContent='space-between'>
        <Stack direction='row'>
          {Array.isArray(selectedFileIDs) && selectedFileIDs.length > 0 && (
            <Stack direction='row'>
              <Button startIcon={<ClearIcon />} onClick={resetFileIDs} sx={{ fontSize: '10px' }}>
                <FormattedMessage id='clearSelection' defaultMessage='Tyhjennä valinnat' />
              </Button>
              <Button
                startIcon={<PlaylistAddIcon />}
                sx={{ fontSize: '10px' }}
                onClick={handleAddButtonClick}
              >
                <FormattedMessage
                  id='addSelectedToExistingList'
                  defaultMessage='Lisää tiedostot listaan'
                />
              </Button>
            </Stack>
          )}
        </Stack>

        <SortingMenu />
      </Stack>

      <ListSelectionDialog open={dialogOpen} onClose={handleDialogClose}></ListSelectionDialog>

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
