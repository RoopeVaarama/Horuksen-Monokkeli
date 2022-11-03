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

const FileGroup = (props: {
  groupName: string
  preDeterminedCheck: boolean
  checked: boolean
  onChange: (name: string, selected: boolean) => void
  returnSelected: (selected: { name: string; date: string; checked: boolean }[]) => void
}) => {
  const { groupName, preDeterminedCheck, checked, onChange, returnSelected } = props

  //Lisää tähän tiedostojen tiedot fetchin kautta
  const [children, setChildren] = useState([{ name: '', date: '', checked: false }])

  // File names only

  useEffect(() => {
    fetch('http://localhost:3002/files/get')
      .then((response) => response.json())
      .then((data) =>
        setChildren(
          data.map((filename: string) => {
            return { name: filename, date: '', checked: false }
          })
        )
      )
  }, [])

  // Files
  /*
  useEffect(() => {
    fetch('http://localhost:3002/files/get')
      .then((response) => response.json())
      .then((data) =>
        setChildren(
          data.map((file: any) => {
            return { key: file._id, name: file.filename, date: '', checked: false }
          })
        )
      )
  }, [])
  */

  const [override, setOverride] = useState(false)
  const [allSelected, setAllSelected] = useState(false)

  const toggleAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAllSelected(event.target.checked)
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

  const check = () => {
    setAllSelected(true)
  }

  const uncheck = () => {
    setAllSelected(false)
  }

  const updateGroup = () => {
    setTotalFiles(children.length)
    setChosenFiles(countChosen)
  }

  const countChosen = (): number => {
    return children.reduce((prev, curr) => prev + (curr.checked ? 1 : 0), 0)
  }

  // Create components
  const fileItems = children.map((file) => (
    <FileItem
      key={file.name}
      name={file.name}
      date={file.date}
      fileName={file.name}
      checked={allSelected}
      override={override}
      onToggle={onItemToggle}
    />
  ))

  useEffect(() => {
    // If all files are selected, check the main checkbox
    chosenFiles === totalFiles ? check() : uncheck()
    // Checking or unchecking is coming from sub-components, don't roll the change back
    setOverride(false)
  }, [chosenFiles, totalFiles])

  useEffect(() => {
    onChange(groupName, allSelected)
  }, [allSelected])

  // Roll the select all to files
  useEffect(() => {
    if (preDeterminedCheck) {
      setAllSelected(checked)
      setOverride(true)
    }
  })

  useEffect(() => {
    const selectedFiles: { name: string; date: string; checked: boolean }[] = []
    children.forEach((child) => {
      if (child.checked === true) {
        selectedFiles.push(child)
      }
    })
    returnSelected(selectedFiles)
  }, [chosenFiles])

  return (
    <Stack id='filegroup-row'>
      <Stack
        id='filegroup-bar'
        direction='row'
        divider={<Divider orientation='vertical' variant='middle' flexItem />}
        sx={{ border: 1 }}
      >
        <Checkbox id='filegroup-checkbox' size='small' onChange={toggleAll} checked={allSelected} />
        <ListItemButton
          id='filegroup-button'
          disableRipple
          onClick={toggleCollapse}
          sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
        >
          <Typography id='filegroup-name' variant='subtitle1'>
            {groupName}
          </Typography>
          <Sidetext id='filegroup-sub-bar'>
            <Typography id='filegroup-group-info' variant='caption'>
              {chosenFiles}/{totalFiles} valittu
            </Typography>
            {open ? <ExpandLess /> : <ExpandMore />}
          </Sidetext>
        </ListItemButton>
      </Stack>
      <Collapse id='filegroup-files-container' in={open}>
        {fileItems}
      </Collapse>
    </Stack>
  )
}

export default FileGroup
