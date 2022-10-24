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

const fileGroups = [{ groupName: 'Laskut Reaktorilta' }, { groupName: 'CV:t' }]

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

const FilesPage = ({ isComplete, onComplete }: { isComplete: boolean; onComplete: () => void }) => {
  const [allSelected, setAllSelected] = useState(false)
  const [preChecked, setPreChecked] = useState(false)

  const [children, setChildren] = useState(
    fileGroups.map((file) => {
      return { groupName: file.groupName, selected: false }
    })
  )
  const [totalGroups, setTotalGroups] = useState(children.length)
  const [selectedGroups, setSelectedGroups] = useState(0)

  const toggleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Roll selection to sub-components
    setAllSelected(event.target.checked)
    setPreChecked(true)
  }

  const check = () => {
    setAllSelected(true)
  }

  const uncheck = () => {
    setAllSelected(false)
  }

  const updateCount = () => {
    const sum = children.reduce((prev, curr) => prev + (curr.selected ? 1 : 0), 0)
    return sum
  }

  const updateSelectedGroups = () => {
    setTotalGroups(children.length)
    setSelectedGroups(updateCount)
  }

  const listenChanges = (name: string, selected: boolean) => {
    setChildren((groups) => {
      groups.forEach((group) => {
        group.groupName === name && (group.selected = selected)
      })
      return groups
    })
    updateSelectedGroups()
  }

  // Create components
  const allFileGroups = children.map((filegroup) => (
    <FileGroup
      key={filegroup.groupName}
      groupName={filegroup.groupName}
      preDeterminedCheck={preChecked}
      checked={allSelected}
      onChange={listenChanges}
    />
  ))

  const updateView = () => {
    // If all files are selected, check the main checkbox
    selectedGroups === totalGroups ? check() : uncheck()
    // Checking or unchecking coming from sub-components, don't roll the change back
    setPreChecked(false)
  }

  useEffect(() => {
    updateView()
  }, [selectedGroups, totalGroups])

  console.log('Render. Selected: ' + allSelected)

  return (
    <StyledPaper sx={{ width: 'calc(100% - 48px)' }}>
      <StyledDiv>
        <UtilityBar container alignItems='center'>
          <Grid item sx={{ width: 1 / 3 }}>
            <FormControlLabel
              control={
                <Checkbox
                  name='chooseAll'
                  checked={allSelected}
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
          {allFileGroups}
        </Stack>
      </StyledDiv>
    </StyledPaper>
  )
}

export default FilesPage
