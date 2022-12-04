import { Stack, IconButton, ListItemButton, Typography, Collapse, TextField } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import SaveIcon from '@mui/icons-material/Save'
import CancelIcon from '@mui/icons-material/Cancel'
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline'
import { ExpandLess, ExpandMore } from '@mui/icons-material'
import { StyledPaper } from '../../common'
import { useFileStore } from '../../../store/fileStore'
import { useEffect, useState } from 'react'
import { fetcher } from '../../../tools/fetcher'
import { FileMeta } from '../../../types'
import FileInList from '../FileInList'
import { FormattedMessage } from 'react-intl'
import { DeleteConfirmationDialog } from '../Dialogs'

const FileListItem = ({ id, title }: { id: string; title: string }) => {
  const { fileUpdate, fileListUpdate, editFilelist, deleteFileList, deleteSingleFileFromList } =
    useFileStore()

  const [open, setOpen] = useState(false)
  const [files, setFiles] = useState<FileMeta[]>([])
  const [editing, setEditing] = useState(false)
  const [editedTitle, setEditedTitle] = useState(title)
  const [newTitleError, setNewTitleError] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const getFilesInList = async () => {
    const listData = await fetcher({
      method: 'GET',
      path: 'files/list',
      id: id
    })
    setFiles(listData.files)
  }

  const toggleOpen = () => {
    !editing && setOpen((currState) => !currState)
  }

  const deleteSelf = () => {
    setDeleting(true)
  }

  const handleDeletion = (confirmation: boolean) => {
    if (confirmation) {
      deleteFileList(id)
    }
    setDeleting(false)
  }

  const saveChanges = () => {
    setEditing(false)
    if (editedTitle !== null && editedTitle !== title) {
      const fileIDs = files.map((file) => file._id)
      editFilelist(id, editedTitle, fileIDs)
    }
    setNewTitleError(false)
  }
  const deleteFile = (fileid: string) => {
    deleteSingleFileFromList(id, fileid)
  }

  const edit = () => {
    setOpen(true)
    setEditing(true)
  }

  const handleTitleEdit = (newTitle: string) => {
    setEditedTitle(newTitle)
    if (newTitle === '') {
      setNewTitleError(true)
    } else {
      setNewTitleError(false)
    }
  }

  const cancelEdits = () => {
    setEditedTitle(title)
    setEditing(false)
    setOpen(false)
    setNewTitleError(false)
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
            {editing ? (
              <TextField
                value={editedTitle}
                color='secondary'
                size='small'
                autoFocus={true}
                error={newTitleError}
                onChange={(e) => handleTitleEdit(e.target.value)}
              />
            ) : (
              <Typography variant='subtitle1'>{title}</Typography>
            )}
            {open ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
        </StyledPaper>
        {editing ? (
          <IconButton onClick={saveChanges}>
            <SaveIcon color='primary' />
          </IconButton>
        ) : (
          <IconButton onClick={edit} size='small'>
            <EditIcon color='primary' />
          </IconButton>
        )}
        {editing ? (
          <IconButton onClick={cancelEdits} size='small'>
            <CancelIcon color='primary' />
          </IconButton>
        ) : (
          <IconButton onClick={deleteSelf} size='small'>
            <DeleteIcon color='primary' />
          </IconButton>
        )}
      </Stack>
      <Collapse in={open}>
        {files.length > 0 ? (
          files.map((file) => (
            <Stack key={file._id} direction='row' alignItems='center'>
              <FileInList id={file._id} filename={file.filename} date={file.createdAt} />
              {editing && (
                <IconButton onClick={() => deleteFile(file._id)} size='small'>
                  <RemoveCircleOutlineIcon color='primary' />
                </IconButton>
              )}
            </Stack>
          ))
        ) : (
          <StyledPaper sx={{ width: '80%' }}>
            <Typography variant='subtitle1'>
              <FormattedMessage id='noUploadedFiles' defaultMessage='No files' />
            </Typography>
          </StyledPaper>
        )}
      </Collapse>
      <DeleteConfirmationDialog
        open={deleting}
        itemname={title}
        onClose={handleDeletion}
        additionalInfo={{
          intlKey: 'filelistDeletionInfo',
          defaultMessage: 'Listan poistaminen ei poista sen sisältämiä tiedostoja järjestelmästä.'
        }}
      />
    </Stack>
  )
}

export default FileListItem
