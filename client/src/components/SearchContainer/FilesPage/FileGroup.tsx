import { useState, useEffect } from 'react'
import {
  Checkbox,
  Collapse,
  ListItemButton,
  Divider,
  Stack,
  Typography,
  styled
} from '@mui/material'
import { ExpandLess, ExpandMore } from '@mui/icons-material'
import FileItem from './FileItem'

// Mock files
const files = [
  { name: 'File1', date: '2022-01-01' },
  { name: 'File2', date: '2022-02-02' },
  { name: 'File3', date: '2022-02-02' }
]

const Sidetext = styled('div')(() => ({
  display: 'flex',
  alignItems: 'center'
}))

const FileGroup = (props: { groupName: string }) => {
  const { groupName } = props

  //Lisää tähän tiedostojen tiedot fetchin kautta
  const [children, setChildren] = useState(
    files.map((file) => {
      return { name: file.name, date: file.date, checked: false }
    })
  )

  const [override, setOverride] = useState(false)

  const [chooseAll, setChooseAll] = useState(false)

  const toggleAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChooseAll(event.target.checked)
    setOverride(true)
  }

  const [open, setOpen] = useState(false)
  const toggleCollapse = () => {
    setOpen((currState) => !currState)
    setOverride(false)
  }

  const [chosenFiles, setChosenFiles] = useState(0)
  const [totalFiles, setTotalFiles] = useState(0)

  const onItemToggle = (key: string, selected: boolean) => {
    setChildren((current) => {
      current.forEach((item) => {
        item.name === key && (item.checked = selected)
      })
      return current
    })
    updateGroup()
  }

  const fileItems = children.map((file) => (
    <FileItem
      key={file.name}
      name={file.name}
      date={file.date}
      fileName={file.name}
      checked={chooseAll}
      override={override}
      onToggle={onItemToggle}
    />
  ))

  const check = () => {
    setChooseAll(true)
  }

  const uncheck = () => {
    setChooseAll(false)
  }

  const updateGroup = () => {
    setTotalFiles(children.length)
    setChosenFiles(countChosen)
  }

  const countChosen = (): number => {
    let selected = 0
    children.forEach((child) => {
      if (child.checked) {
        selected++
      }
    })
    return selected
  }

  useEffect(() => {
    // If all files are selected, check the main checkbox
    chosenFiles === totalFiles ? check() : uncheck()
    // Checking or unchecking coming from sub-components, don't roll the change back
    setOverride(false)
  }, [chosenFiles, totalFiles])

  return (
    <Stack>
      <Stack
        direction='row'
        divider={<Divider orientation='vertical' variant='middle' flexItem />}
        sx={{ border: 1 }}
      >
        <Checkbox size='small' onChange={toggleAll} checked={chooseAll} />
        <ListItemButton
          disableRipple
          onClick={toggleCollapse}
          sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
        >
          <Typography variant='subtitle1'>{groupName}</Typography>
          <Sidetext>
            <Typography variant='caption'>
              {chosenFiles}/{totalFiles} valittu
            </Typography>
            {open ? <ExpandLess /> : <ExpandMore />}
          </Sidetext>
        </ListItemButton>
      </Stack>
      <Collapse in={open}>{fileItems}</Collapse>
    </Stack>
  )
}

export default FileGroup
