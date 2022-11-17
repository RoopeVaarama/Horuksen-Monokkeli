import { useEffect, useState } from 'react'
import { Grid, InputAdornment, Stack, styled, TextField, Typography } from '@mui/material'
import { SearchRounded } from '@mui/icons-material'
import StyledPaper from '../../common/StyledPaper/StyledPaper'
import FileGroup from './FileGroup'
import FileUploader from './FileUploader'
import { useSearchStore } from '../../../store/searchStore'
import { useFilesearchStore } from '../../../store/filesearchStore'
import { FormattedMessage } from 'react-intl'

const SearchField = styled(TextField)(() => ({
  variant: 'outlined',
  width: '100%',
  label: 'Etsi tiedostoja..'
}))
const UtilityBar = styled(Grid)(() => ({
  padding: '15px'
}))

const StyledDiv = styled('div')(() => ({
  width: '100vh'
}))

const FilesPage = () => {
  const { setUpload } = useSearchStore()
  const { keyword, refresh, setKeyword, setSearchActive, setSearchInactive, searchActive } =
    useFilesearchStore()

  const [children, setChildren] = useState<
    {
      key: string
      groupName: string
      selected: boolean
    }[]
  >([])

  // Fetch the file groups
  useEffect(() => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/files/list`)
      .then((res) => res.json())
      .then((data) => {
        const fileLists = data.map((filelist: any) => {
          return { key: filelist._id, groupName: filelist.title, selected: false }
        })
        // Always add one filegroup containing all files as the first one on the list
        /*fileLists.unshift({
          key: 'Kaikki tiedostot',
          groupName: 'Kaikki tiedostot',
          selected: false
        })*/
        setChildren(fileLists)
      })
      .catch((e) => console.log(e))
  }, [])

  // Upload file(s) to the database
  const uploadFile = (formData: FormData) => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/files/upload`, {
      method: 'POST',
      body: formData
    })
      .then((response) => response.json())
      .then((data) => {
        setUpload(true)
      })
      .catch((error) => console.log(error))
  }

  // Get the selected file(s) from FileUploader
  const filesUploaded = (files: File[]) => {
    files.forEach((file) => {
      const formData = new FormData()
      formData.append('file', file)
      uploadFile(formData)
    })
  }

  //TODO kokeile tätä

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

  return (
    <StyledPaper sx={{ width: 'calc(100% - 48px)' }}>
      <StyledDiv>
        <UtilityBar container alignItems='center' justifyContent='center'>
          <Grid item sx={{ width: 3 / 4 }}>
            <SearchField
              id='filepage-searchbar'
              size='small'
              placeholder='Etsi tiedostoja' // TODO intl
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    <SearchRounded />
                  </InputAdornment>
                )
              }}
              onChange={updateSearch}
              onKeyDown={handleKeyPress}
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
          {children.length > 0 && !searchActive && <hr />}
          {children.length > 0 && !searchActive && (
            <Typography>
              <FormattedMessage id='usersLists' defaultMessage='Käyttäjän omat listat' />
            </Typography>
          )}

          {!searchActive &&
            children.map((filegroup) => (
              <FileGroup key={filegroup.key} id={filegroup.key} groupName={filegroup.groupName} />
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
