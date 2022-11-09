import { useEffect, useState } from 'react'
import {
  Checkbox,
  FormControlLabel,
  Grid,
  InputAdornment,
  Stack,
  styled,
  TextField,
  Typography
} from '@mui/material'
import { SearchRounded } from '@mui/icons-material'
import { FormattedMessage } from 'react-intl'
import StyledPaper from '../../common/StyledPaper/StyledPaper'
import FileGroup from './FileGroup'
import FileUploader from './FileUploader'
import { useSearchStore } from '../../../store/searchStore'

const fileGroups = [{ groupName: 'Kaikki tiedostot' }]

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

//TO DO: ylimääräinen false-true-false -togglailu pois

const FilesPage = () => {
  const { fileIDs } = useSearchStore()

  const [boxChecked, setBoxChecked] = useState(false)
  const [preChecked, setPreChecked] = useState(false)

  // Filegroups nyt kovakoodattu, korvaa kun listat on käytössä (myös lkm)
  const [children, setChildren] = useState(
    fileGroups.map((file) => {
      return { key: file.groupName, groupName: file.groupName, selected: false }
    })
  )

  const [totalGroups, setTotalGroups] = useState(children.length)
  const [selectedGroups, setSelectedGroups] = useState(0)
  const [update, setUpdate] = useState(false)

  const toggleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Roll selection to sub-components
    setBoxChecked(event.target.checked)
    setPreChecked(true)
  }

  const check = () => {
    setBoxChecked(true)
  }

  const uncheck = () => {
    setBoxChecked(false)
  }

  // Update the state change to children
  const listenChanges = (name: string, selected: boolean) => {
    setChildren((groups) => {
      groups.forEach((group) => {
        group.groupName === name && (group.selected = selected)
      })
      return groups
    })
    // Update accordingly
    setTotalGroups(children.length)
    setSelectedGroups(children.reduce((prev, curr) => prev + (curr.selected ? 1 : 0), 0))
  }

  useEffect(() => {
    setChildren((prevChildren) => {
      return [...prevChildren]
    })
  }, [update])

  useEffect(() => {
    // If all files are selected, check the main checkbox
    selectedGroups === totalGroups ? check() : uncheck()
    // Checking or unchecking coming from sub-components, don't roll the change back
    setPreChecked(false)
  }, [selectedGroups, totalGroups])

  const uploadFile = (formData: FormData) => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/files/upload`, {
      method: 'POST',
      body: formData
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Uploaded: ' + data)
        // Toggle update state to rerender all files
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
        <UtilityBar container alignItems='center'>
          <Grid item sx={{ width: 1 / 3 }}>
            <FormControlLabel
              control={
                <Checkbox
                  name='chooseAll'
                  checked={boxChecked}
                  size='small'
                  onChange={toggleSelectAll}
                />
              }
              label={
                <Typography variant='subtitle2'>
                  <FormattedMessage id='chooseAll' defaultMessage='Valitse kaikki' />
                </Typography>
              }
            />
          </Grid>
          <Grid item sx={{ width: 2 / 3 }}>
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
            <FileGroup
              key={filegroup.groupName}
              groupName={filegroup.groupName}
              preDeterminedCheck={preChecked}
              checked={boxChecked}
              onChange={listenChanges}
            />
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
