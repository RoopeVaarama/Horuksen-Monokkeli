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
import { useSearchStore } from '../../../store/searchStore'

const Sidetext = styled('div')(() => ({
  display: 'flex',
  alignItems: 'center'
}))

const FileGroup = (props: {
  groupName: string
  preDeterminedCheck: boolean
  checked: boolean
  onChange: (name: string, selected: boolean) => void
}) => {
  const { files } = useSearchStore()
  const { groupName, preDeterminedCheck, checked, onChange } = props

  const [children, setChildren] = useState<
    {
      id: string
      author: string
      filename: string
      date: string
      dateObj: Date
      checked: boolean
    }[]
  >([])

  // Files
  useEffect(() => {
    if (groupName === 'Kaikki tiedostot') {
      fetchAllFiles()
    } else {
      console.log('Listojen käsittely jotenkin')
    }
  }, [])

  const fetchAllFiles = () => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/files`)
      .then((response) => response.json())
      .then((data) => {
        const selectedIDs = files.map((file) => {
          return file._id
        })
        const newData = data.map((file: any) => {
          const date = new Date(file.createdAt).toLocaleDateString()
          return {
            id: file._id,
            author: file.author,
            filename: file.filename,
            date: date,
            dateObj: file.createdAt,
            checked: selectedIDs.includes(file._id)
          }
        })
        // Sort from newest to oldest
        newData.sort(function compareFn(
          a: { name: string; date: string; dateObj: Date; checked: boolean },
          b: { name: string; date: string; dateObj: Date; checked: boolean }
        ) {
          return a.dateObj > b.dateObj ? -1 : 1
        })
        setChildren(newData)
      })
  }

  const [override, setOverride] = useState(false)
  const [groupSelected, setGroupSelected] = useState(false)

  const toggleGroup = (event: React.ChangeEvent<HTMLInputElement>) => {
    setGroupSelected(event.target.checked)
    setOverride(true)
  }

  const check = () => {
    setGroupSelected(true)
  }

  const uncheck = () => {
    setGroupSelected(false)
  }

  const updateGroup = () => {
    setTotalFiles(children.length)
    setChosenFiles(countChosen)
  }

  const [open, setOpen] = useState(false)
  const toggleCollapse = () => {
    setOpen((currState) => !currState)
    setOverride(false)
  }

  const [chosenFiles, setChosenFiles] = useState(0)
  const [totalFiles, setTotalFiles] = useState(0)

  const onItemToggle = (id: string, selected: boolean) => {
    setChildren((current) => {
      current.forEach((item) => {
        item.id === id && (item.checked = selected)
      })
      return current
    })
    updateGroup()
  }

  const countChosen = (): number => {
    return children.reduce((prev, curr) => prev + (curr.checked ? 1 : 0), 0)
  }

  useEffect(() => {
    // If all files are selected, check the main checkbox
    chosenFiles === totalFiles ? check() : uncheck()
    // Checking or unchecking is coming from sub-components, don't roll the change back
    setOverride(false)
  }, [chosenFiles, totalFiles])

  useEffect(() => {
    onChange(groupName, groupSelected)
  }, [groupSelected])

  // Roll the select all to files when the group is checked
  useEffect(() => {
    if (preDeterminedCheck) {
      setGroupSelected(checked)
      setOverride(true)
    }
  })

  return (
    <Stack id='filegroup-row'>
      <Stack
        id='filegroup-bar'
        direction='row'
        divider={<Divider orientation='vertical' variant='middle' flexItem />}
        sx={{ border: 1 }}
      >
        <Checkbox
          id='filegroup-checkbox'
          size='small'
          onChange={toggleGroup}
          checked={groupSelected}
        />
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
        {children.length > 0 &&
          children.map((file) => (
            <FileItem
              key={file.id}
              id={file.id}
              author={file.author}
              date={file.date}
              fileName={file.filename}
              groupName={groupName}
              checked={groupSelected}
              override={override}
              onToggle={onItemToggle}
            />
          ))}
      </Collapse>
    </Stack>
  )
}

export default FileGroup
