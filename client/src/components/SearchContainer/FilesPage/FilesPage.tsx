import { useEffect, useState } from 'react'
import { Grid, InputAdornment, Stack, styled, TextField } from '@mui/material'
import { SearchRounded } from '@mui/icons-material'
import StyledPaper from '../../common/StyledPaper/StyledPaper'
import FileGroup from './FileGroup'
import FileUploader from './FileUploader'

/**
 * TO DO:
 * - uploadin jälkeen re-renderöinti
 * - togglailuboogie
 */

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
  const [children, setChildren] = useState<
    {
      key: string
      groupName: string
      selected: boolean
    }[]
  >([])

  useEffect(() => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/files/list`)
      .then((res) => res.json())
      .then((data) => {
        const fileLists = data.map((filelist: any) => {
          return { key: filelist._id, groupName: filelist.title, selected: false }
        })

        fileLists.unshift({
          key: 'Kaikki tiedostot',
          groupName: 'Kaikki tiedostot',
          selected: false
        })
        setChildren(fileLists)
      })
      .catch((e) => console.log(e))
  }, [])

  // CHECKOUT
  const [update, setUpdate] = useState(false)

  useEffect(() => {
    setChildren((prevChildren) => {
      return [...prevChildren]
    })
  }, [update])

  const uploadFile = (formData: FormData) => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/files/upload`, {
      method: 'POST',
      body: formData
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Uploaded: ' + data)
        // Toggle update state to rerender all files??
        setUpdate((prevState) => !prevState)
      })
      .catch((error) => console.log(error))
  }

  // Upload the selected file(s) from FileUploader
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
