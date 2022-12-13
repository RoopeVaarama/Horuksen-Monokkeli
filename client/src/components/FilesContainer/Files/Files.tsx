import {
  Box,
  Stack,
  Typography,
  Button,
  TextField,
  InputAdornment,
  IconButton
} from '@mui/material'
import { useEffect, useState } from 'react'
import FileItem from '../FileItem'
import ListSelectionDialog from '../Dialogs/ListSelectionDialog'
import Alert from '../../common/Alert'
import { FormattedMessage } from 'react-intl'
import { useFileStore } from '../../../store/fileStore'
import { SearchRounded } from '@mui/icons-material'
import ClearIcon from '@mui/icons-material/Clear'
import CloseIcon from '@mui/icons-material/Close'
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp'
import SortingMenu from '../SortingMenu'

const Files = () => {
  const {
    files,
    selectedFileIDs,
    fileUpdate,
    fileSortVariant,
    addFilesToList,
    resetFileIDs,
    resetFiles,
    sortFiles,
    setFileKeyword,
    fileSearch,
    stopFileSearch,
    setFileSortVariant
  } = useFileStore()

  const [open, setOpen] = useState(true)
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

  const updateSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFileKeyword(event.target.value)
    event.target.value !== '' ? fileSearch() : stopFileSearch()
  }

  useEffect(() => {
    resetFiles()
  }, [fileUpdate])

  useEffect(() => {
    sortFiles()
  }, [fileSortVariant])

  return (
    <Stack spacing={1}>
      <Stack direction='row' alignItems='center'>
        <Typography variant='h6'>
          <FormattedMessage id='files' defaultMessage='Tiedostot' />
        </Typography>
        <IconButton onClick={() => setOpen(!open)} id='files-dropdown-button'>
          {open ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
        </IconButton>
      </Stack>
      {open && (
        <Stack spacing={1}>
          <Stack spacing={1} direction='row' justifyContent='space-between'>
            <Stack direction='row'>
              {Array.isArray(selectedFileIDs) && selectedFileIDs.length > 0 && (
                <Stack direction='row'>
                  <Button
                    startIcon={<ClearIcon />}
                    onClick={resetFileIDs}
                    sx={{ fontSize: '10px' }}
                  >
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
            <Stack
              direction='row'
              alignItems='center'
              justifyContent='space-between'
              spacing={1}
              sx={{ paddingRight: '5%' }}
            >
              <TextField
                size='small'
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <SearchRounded />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position='end'>
                      <IconButton onClick={stopFileSearch}>
                        <CloseIcon />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
                onChange={updateSearch}
              />
              <SortingMenu
                options={[
                  { intlId: 'nameAtoZ', msg: 'Nimi (A-Ö)', sortId: 'name' },
                  { intlId: 'nameZtoA', msg: 'Nimi (Ö-A)', sortId: 'nameReverse' },
                  {
                    intlId: 'dateFromNewest',
                    msg: 'Päivämäärä (uusin ensin)',
                    sortId: 'dateReverse'
                  },
                  { intlId: 'dateFromOldest', msg: 'Päivämäärä (vanhin ensin)', sortId: 'date' }
                ]}
                onSelection={setFileSortVariant}
              />
            </Stack>
          </Stack>

          <ListSelectionDialog open={dialogOpen} onClose={handleDialogClose}></ListSelectionDialog>

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
        </Stack>
      )}
    </Stack>
  )
}

export default Files
