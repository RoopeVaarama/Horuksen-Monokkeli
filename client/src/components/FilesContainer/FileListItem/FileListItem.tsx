import { Stack, IconButton, ListItemButton, Typography, Collapse } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import { ExpandLess, ExpandMore } from '@mui/icons-material'
import { StyledPaper } from '../../common'
import { useFileStore } from '../../../store/fileStore'
import { useEffect, useState } from 'react'
import { fetcher } from '../../../tools/fetcher'
import { FileMeta } from '../../../types'
import FileInList from '../FileInList'

const FileListItem = (props: { id: string; title: string }) => {
  const { id, title } = props
  const { fileUpdate, fileListUpdate, deleteFileList, deleteSingleFileFromList } = useFileStore()

  const [open, setOpen] = useState(false)
  const [files, setFiles] = useState<FileMeta[]>([])
  const [editing, setEditing] = useState(true)

  const getFilesInList = async () => {
    const listData = await fetcher({
      method: 'GET',
      path: 'files/list',
      id: id
    })
    setFiles(listData.files)
  }

  const toggleOpen = () => {
    setOpen((currState) => !currState)
  }

  const deleteSelf = () => {
    deleteFileList(id)
  }

  const deleteFile = (fileid: string) => {
    deleteSingleFileFromList(id, fileid)
  }

  useEffect(() => {
    getFilesInList()
  }, [fileUpdate, fileListUpdate])

  return (
    <Stack>
      <Stack direction='row' alignItems='center'>
        <StyledPaper>
          <ListItemButton
            disableRipple
            sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
            onClick={toggleOpen}
          >
            <Typography variant='subtitle1'>{title}</Typography>
            {open ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
        </StyledPaper>
        <IconButton onClick={deleteSelf} size='small'>
          <DeleteIcon color='primary' />
        </IconButton>
      </Stack>
      <Collapse in={open}>
        {files.map((file) => (
          <FileInList
            key={file._id}
            id={file._id}
            filename={file.filename}
            date={file.createdAt}
            editable={editing}
            onDelete={deleteFile}
          />
        ))}
      </Collapse>
    </Stack>
  )
}

export default FileListItem
