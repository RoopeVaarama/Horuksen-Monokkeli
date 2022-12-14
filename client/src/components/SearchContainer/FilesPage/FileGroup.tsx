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
import { useFilesearchStore } from '../../../store/filesearchStore'
import { FormattedMessage } from 'react-intl'
import { FileMeta } from '../../../types'
import { fetcher } from '../../../tools/fetcher'
import { useFileStore } from '../../../store/fileStore'

const Sidetext = styled('div')(() => ({
  display: 'flex',
  alignItems: 'center'
}))

const FileGroup = (props: { id: string; groupName: string }) => {
  const { fileIDs, openFileGroups, setGroupAsOpen, setGroupAsClosed } = useSearchStore()

  const { files, fileUpdate } = useFileStore()

  const { keyword, refreshSearch, searchActive } = useFilesearchStore()
  const { id, groupName } = props

  const [allFiles, setAllFiles] = useState<
    {
      id: string
      author: string
      filename: string
      date: string
      dateObj: Date
      checked: boolean
    }[]
  >([])

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

  // Initial fetch to get the files in the group
  useEffect(() => {
    if (groupName === 'Kaikki tiedostot') {
      fetchAllFiles()
    } else {
      fetchFilesInList()
    }
  }, [])

  const fetchAllFiles = async () => {
    try {
      const data = await fetcher({ method: 'GET', path: 'files' })
      const newData = data.map((file: FileMeta) => {
        const date = new Date(file.createdAt).toLocaleDateString()
        return {
          id: file._id,
          author: file.author,
          filename: file.filename,
          date: date,
          dateObj: file.createdAt,
          checked: fileIDs.includes(file._id)
        }
      })
      // Sort from newest to oldest
      newData.sort(function compareFn(
        a: { name: string; date: string; dateObj: Date; checked: boolean },
        b: { name: string; date: string; dateObj: Date; checked: boolean }
      ) {
        return a.dateObj > b.dateObj ? -1 : 1
      })
      setAllFiles(newData)
      setChildren(newData)
    } catch (e) {
      console.log(e)
    }
  }

  const fetchFilesInList = async () => {
    try {
      const data = await fetcher({ method: 'GET', path: 'files/list', id: id })
      const files = data.files.map((file: FileMeta) => {
        const date = new Date(file.createdAt).toLocaleDateString()
        return {
          id: file._id,
          author: file.author,
          filename: file.filename,
          date: date,
          dateObj: file.createdAt,
          checked: fileIDs.includes(file._id)
        }
      })
      setChildren(files)
    } catch (e) {
      console.log(e)
    }
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

  const [open, setOpen] = useState(openFileGroups.includes(groupName))

  const toggleCollapse = () => {
    open ? setGroupAsClosed(groupName) : setGroupAsOpen(groupName)
    setOpen((currState) => !currState)
    setOverride(false)
  }

  const [chosenFiles, setChosenFiles] = useState(0)
  const [totalFiles, setTotalFiles] = useState(files.length)

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

  const filterSearch = () => {
    const filteredFiles = allFiles.filter((file) => {
      return file.filename.includes(keyword)
    })
    setChildren(filteredFiles)
    setOpen(true)
    updateGroup()
  }

  useEffect(() => {
    // If all files are selected, check the main checkbox
    totalFiles > 0 && (chosenFiles === totalFiles ? check() : uncheck())
    // Checking or unchecking is coming from sub-components, don't roll the change back
    setOverride(false)
  }, [chosenFiles, totalFiles])

  useEffect(() => {
    groupName === 'Kaikki tiedostot' ? fetchAllFiles() : fetchFilesInList()
  }, [fileUpdate])

  useEffect(() => {
    updateGroup()
  }, [fileUpdate, children])

  useEffect(() => {
    if (groupName === 'Kaikki tiedostot') {
      searchActive ? filterSearch() : fetchAllFiles()
    }
  }, [refreshSearch, searchActive])

  return (
    <Stack id='filegroup-row'>
      <Stack
        id='filegroup-bar'
        direction='row'
        borderRadius='5px'
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
            {groupName === 'Kaikki tiedostot' ? (
              <FormattedMessage id='allFiles' defaultMessage='Kaikki tiedostot' />
            ) : (
              groupName
            )}
          </Typography>
          <Sidetext id='filegroup-sub-bar'>
            <Typography id='filegroup-group-info' variant='caption'>
              {chosenFiles}/{totalFiles}{' '}
              {<FormattedMessage id='selected' defaultMessage='valittu' />}
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
