import { Box, Button, Stack, Typography } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import ClearIcon from '@mui/icons-material/Clear'
import { FormattedMessage } from 'react-intl'
import { Alert } from '../../common'
import { useFileStore } from '../../../store/fileStore'
import { useEffect } from 'react'
import FileListItem from '../FileListItem'
import NewFileList from '../NewFileList'

const FileLists = () => {
  const {
    creatingNewList,
    fileLists,
    fileListUpdate,
    addEmptyFilelist,
    startCreating,
    stopCreating,
    resetFileLists
  } = useFileStore()

  const createNew = () => {
    startCreating()
  }

  const cancelCreate = () => {
    stopCreating()
  }

  useEffect(() => {
    resetFileLists()
  }, [fileListUpdate])

  return (
    <Stack spacing={1}>
      <Typography variant='h6'>
        <FormattedMessage id='filelists' defaultMessage='Käyttäjän listat' />
      </Typography>
      {creatingNewList ? (
        <Button
          startIcon={<ClearIcon />}
          onClick={cancelCreate}
          sx={{ width: '20%', fontSize: '12px' }}
        >
          <FormattedMessage id='cancel' defaultMessage='Peru' />
        </Button>
      ) : (
        <Button startIcon={<AddIcon />} onClick={createNew} sx={{ width: '20%', fontSize: '12px' }}>
          <FormattedMessage id='createNewList' defaultMessage='Luo uusi lista' />
        </Button>
      )}
      <Box id='filelists-container'>
        {creatingNewList && <NewFileList variant='normal' onSave={addEmptyFilelist} />}
        {Array.isArray(fileLists) &&
          fileLists.length > 0 &&
          fileLists.map((filelist) => (
            <FileListItem key={filelist._id} id={filelist._id} title={filelist.title} />
          ))}
      </Box>
      {Array.isArray(fileLists) && fileLists.length === 0 && (
        <Alert message={<FormattedMessage id='noFileLists' defaultMessage='Ei listoja' />} />
      )}
    </Stack>
  )
}

export default FileLists
