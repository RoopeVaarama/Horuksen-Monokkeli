import {
  Avatar,
  Dialog,
  DialogTitle,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { FormattedMessage } from 'react-intl'
import { useFileStore } from '../../../store/fileStore'
import { FileList } from '../../../types'
import { useState } from 'react'
import NewFileList from '../NewFileList'

const ListSelectionDialog = (props: { open: boolean; onClose: (id: string | null) => void }) => {
  const { onClose, open } = props
  const { fileLists, addListWithFiles } = useFileStore()
  const [createNew, setCreateNew] = useState(false)

  const handleClose = () => {
    onClose(null)
  }

  const handleSelection = (filelist: FileList) => {
    onClose(filelist._id)
  }

  const createNewList = () => {
    setCreateNew(true)
  }

  const createAndAdd = (title: string) => {
    addListWithFiles(title)
    onClose(null)
  }

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>
        <FormattedMessage id='selectFilelist' defaultMessage='Valitse lista' />
      </DialogTitle>
      <List>
        {fileLists.map((filelist) => (
          <ListItem button key={filelist._id} onClick={() => handleSelection(filelist)}>
            <ListItemText>{filelist.title}</ListItemText>
          </ListItem>
        ))}
        {createNew ? (
          <ListItem>
            <NewFileList variant='popup' onSave={createAndAdd} />
          </ListItem>
        ) : (
          <ListItem autoFocus button onClick={createNewList}>
            <ListItemAvatar>
              <Avatar>
                <AddIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText>
              <FormattedMessage id='createNewList' defaultMessage='Luo uusi lista' />
            </ListItemText>
          </ListItem>
        )}
      </List>
    </Dialog>
  )
}

export default ListSelectionDialog
