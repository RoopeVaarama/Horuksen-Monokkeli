import { Checkbox, Stack, Typography, styled, Button, IconButton } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import { useEffect, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { StyledPaper } from '../../common'
import { useFileStore } from '../../../store/fileStore'
import { DeleteConfirmationDialog } from '../Dialogs'

const ItemRow = styled(Stack)(() => ({
  justifyContent: 'space-between',
  width: '100%'
}))
const Sidetext = styled('div')(() => ({
  display: 'flex',
  alignItems: 'center',
  marginLeft: '10px'
}))

const FilesContainer = ({ id, filename, date }: { id: string; filename: string; date: string }) => {
  const formattedDate = new Date(date).toLocaleDateString()
  const { selectedFileIDs, addFileID, deleteFile, removeFileID, openFile } = useFileStore()

  const [selected, setSelected] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const toggle = () => {
    setSelected((currState) => !currState)
  }

  const open = () => {
    openFile(id)
  }

  const deleteSelf = () => {
    setDeleting(true)
  }

  const handleDeletion = (deleteConfirmation: boolean) => {
    deleteConfirmation && deleteFile(id)
    setDeleting(false)
  }

  useEffect(() => {
    selected ? addFileID(id) : removeFileID(id)
  }, [selected])

  useEffect(() => {
    selectedFileIDs.length === 0 && setSelected(false)
  }, [selectedFileIDs])

  return (
    <Stack direction='row' alignItems='center'>
      <StyledPaper>
        <ItemRow direction='row'>
          <Stack direction='row' alignItems='center'>
            <Checkbox size='small' checked={selected} onChange={toggle} />
            <Typography variant='body2'>{filename}</Typography>
          </Stack>
          <Sidetext>
            <Typography id='fileitem-date' variant='caption'>
              <FormattedMessage id='added' defaultMessage='Lisätty '></FormattedMessage>
              {formattedDate}
            </Typography>
            <Button id='fileitem-open-button' onClick={open}>
              <FormattedMessage id='open' defaultMessage='Avaa' />
            </Button>
          </Sidetext>
        </ItemRow>
      </StyledPaper>
      <IconButton onClick={deleteSelf} size='small'>
        <DeleteIcon color='primary' />
      </IconButton>
      <DeleteConfirmationDialog
        open={deleting}
        itemname={filename}
        onClose={handleDeletion}
        additionalInfo={{
          intlKey: 'fileDeleteWarning',
          defaultMessage: 'Tiedosto poistetaan myös kaikista listoista.'
        }}
      />
    </Stack>
  )
}

export default FilesContainer
