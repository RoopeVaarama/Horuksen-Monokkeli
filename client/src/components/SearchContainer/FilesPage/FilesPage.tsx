import { useEffect, useState } from 'react'
import { Grid, InputAdornment, Stack, styled, TextField } from '@mui/material'
import { SearchRounded } from '@mui/icons-material'
import StyledPaper from '../../common/StyledPaper/StyledPaper'
import FileGroup from './FileGroup'
import FileUploader from './FileUploader'
import { useSearchStore } from '../../../store/searchStore'
//import { fetcher } from '../../../tools/fetcher'
import { getToken } from '../../../tools/auth'

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
  const { setUpload } = useSearchStore()

  const [children, setChildren] = useState<
    {
      key: string
      groupName: string
      selected: boolean
    }[]
  >([])

  // Fetch the file groups
  useEffect(() => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/files/list`, {
      headers: {
        Authorization: `Bearer ${getToken()}`
      }
    })
      .then((res) => res.json())
      .then((data) => {
        const fileLists = []
        if (data.length > 0) {
          data.map((filelist: any) => {
            fileLists.push({ key: filelist._id, groupName: filelist.title, selected: false })
          })
        }
        // Always add one filegroup containing all files as the first one on the list
        fileLists.unshift({
          key: 'Kaikki tiedostot',
          groupName: 'Kaikki tiedostot',
          selected: false
        })
        setChildren(fileLists)
      })
      .catch((e) => console.log(e))
  }, [])

  // Upload file(s) to the database
  const uploadFile = async (formData: FormData) => {
    // Use fetch instead of fetcher to enable FormData content
    fetch(`${process.env.REACT_APP_BACKEND_URL}/files/upload`, {
      method: 'POST',
      body: formData,
      headers: {
        Authorization: `Bearer ${getToken()}`
      }
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
                )
              }}
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
          {children.map((filegroup) => (
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
