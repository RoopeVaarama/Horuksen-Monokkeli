import { useEffect } from 'react'
import {
  Grid,
  IconButton,
  InputAdornment,
  Stack,
  styled,
  TextField,
  Typography
} from '@mui/material'
import { SearchRounded } from '@mui/icons-material'
import CloseIcon from '@mui/icons-material/Close'
import StyledPaper from '../../common/StyledPaper/StyledPaper'
import FileGroup from './FileGroup'
import FileUploader from './FileUploader'
import { useSearchStore } from '../../../store/searchStore'
import { useFileStore } from '../../../store/fileStore'
import { useFilesearchStore } from '../../../store/filesearchStore'
import { FormattedMessage } from 'react-intl'

const SearchField = styled(TextField)(() => ({
  variant: 'outlined',
  width: '100%'
}))
const UtilityBar = styled(Grid)(() => ({
  padding: '15px'
}))

const StyledDiv = styled('div')(() => ({
  width: '100vh'
}))

const FilesPage = () => {
  const { keyword, refresh, setKeyword, setSearchActive, setSearchInactive, searchActive } =
    useFilesearchStore()
  const { files, fileUpdate, fileLists, fileListUpdate, resetFiles, resetFileLists, uploadFiles } =
    useFileStore()
  const { fileIDs, removeFileIDfromSearch } = useSearchStore()

  useEffect(() => {
    resetFileLists()
  }, [fileUpdate, fileListUpdate])

  // Get the selected file(s) from FileUploader
  const filesUploaded = async (files: File[]) => {
    files.forEach((file) => {
      const formData = new FormData()
      formData.append('file', file)
      uploadFiles(formData)
    })
  }

  const updateSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(event.target.value)
    if (event.target.value === '') {
      setSearchInactive()
    }
  }

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && keyword !== '') {
      setSearchActive()
      refresh()
    }
  }

  const resetSearch = () => {
    setKeyword('')
    setSearchInactive()
  }

  useEffect(() => {
    resetFiles()
  }, [])

  const checkForDeletions = () => {
    const allIDs = files.map((file) => file._id)
    const extraIDs = fileIDs.filter((id) => !allIDs.includes(id))
    extraIDs.forEach((id) => {
      removeFileIDfromSearch(id)
    })
  }

  useEffect(() => {
    checkForDeletions()
  }, [fileUpdate])

  return (
    <StyledPaper sx={{ width: 'calc(100% - 48px)' }}>
      <StyledDiv>
        <UtilityBar container alignItems='center' justifyContent='center'>
          <Grid item sx={{ width: 3 / 4 }}>
            <SearchField
              id='filepage-searchbar'
              size='small'
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    <SearchRounded />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position='end'>
                    <IconButton onClick={resetSearch}>
                      <CloseIcon />
                    </IconButton>
                  </InputAdornment>
                )
              }}
              onChange={updateSearch}
              onKeyDown={handleKeyPress}
              value={keyword}
            />
          </Grid>
        </UtilityBar>
        <Stack
          id='filepage-filegroups-container'
          spacing={2}
          component='ol'
          sx={{
            width: '100%',
            pl: 0,
            listStyleType: 'none',
            my: 2
          }}
        >
          <FileGroup id='Kaikki tiedostot' groupName='Kaikki tiedostot' />
          {fileLists.length > 0 && !searchActive && <hr />}
          {fileLists.length > 0 && !searchActive && (
            <Typography>
              <FormattedMessage id='usersLists' defaultMessage='Käyttäjän omat listat' />
            </Typography>
          )}
          {!searchActive &&
            Array.isArray(fileLists) &&
            fileLists.length > 0 &&
            fileLists.map((filelist) => (
              <FileGroup key={filelist._id} id={filelist._id} groupName={filelist.title} />
            ))}
        </Stack>
        <hr />
        <Stack direction='row' marginBottom='10px' sx={{ justifyContent: 'space-evenly' }}>
          <FileUploader fileUploaded={filesUploaded} />
        </Stack>
      </StyledDiv>
    </StyledPaper>
  )
}

export default FilesPage
