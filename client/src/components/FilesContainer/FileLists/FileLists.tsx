import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import ClearIcon from '@mui/icons-material/Clear'
import { FormattedMessage } from 'react-intl'
import { Alert } from '../../common'
import { useFileStore } from '../../../store/fileStore'
import { useEffect, useState } from 'react'
import FileListItem from '../FileListItem'
import NewFileList from '../NewFileList'
import SortingMenu from '../SortingMenu'
import { SearchRounded } from '@mui/icons-material'
import CloseIcon from '@mui/icons-material/Close'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp'

const FileLists = () => {
  const {
    creatingNewList,
    fileLists,
    fileListUpdate,
    listSortVariant,
    addEmptyFilelist,
    startCreating,
    stopCreating,
    resetFileLists,
    setListKeyword,
    fileListSearch,
    stopFileListSearch,
    setListSortVariant,
    sortFilelists
  } = useFileStore()

  const [open, setOpen] = useState(true)

  const createNew = () => {
    startCreating()
  }

  const cancelCreate = () => {
    stopCreating()
  }

  const updateSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setListKeyword(event.target.value)
    event.target.value !== '' ? fileListSearch() : stopFileListSearch()
  }

  useEffect(() => {
    resetFileLists()
  }, [fileListUpdate])

  useEffect(() => {
    sortFilelists()
  }, [listSortVariant])

  return (
    <Stack spacing={1}>
      <Stack direction='row' alignItems='center'>
        <Typography variant='h6'>
          <FormattedMessage id='filelists' defaultMessage='Käyttäjän listat' />
        </Typography>
        <IconButton onClick={() => setOpen(!open)}>
          {open ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
        </IconButton>
      </Stack>

      {open && (
        <Stack spacing={1}>
          <Stack direction='row' alignItems='center' justifyContent='space-between' spacing={1}>
            {creatingNewList ? (
              <Button
                startIcon={<ClearIcon />}
                onClick={cancelCreate}
                sx={{ width: '20%', fontSize: '12px' }}
              >
                <FormattedMessage id='cancel' defaultMessage='Peru' />
              </Button>
            ) : (
              <Button
                startIcon={<AddIcon />}
                onClick={createNew}
                sx={{ width: '20%', fontSize: '12px' }}
              >
                <FormattedMessage id='createNewList' defaultMessage='Luo uusi lista' />
              </Button>
            )}
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
                      <IconButton onClick={stopFileListSearch}>
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
                    intlId: 'editDateFromNewest',
                    msg: 'Muokkauspäivä (uusin ensin)',
                    sortId: 'dateReverse'
                  },
                  {
                    intlId: 'editDateFromOldest',
                    msg: 'Muokkauspäivä (vanhin ensin)',
                    sortId: 'date'
                  }
                ]}
                onSelection={setListSortVariant}
              />
            </Stack>
          </Stack>
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
      )}
    </Stack>
  )
}

export default FileLists
