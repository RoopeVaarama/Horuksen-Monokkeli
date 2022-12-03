import { Stack, Button, TextField } from '@mui/material'
import { useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { useFileStore } from '../../../store/fileStore'

const NewFileList = () => {
  const { addEmptyFilelist } = useFileStore()

  const [title, setTitle] = useState('')

  const handleUpdateTitle = (
    event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement, Element>
  ) => {
    if (event.target.value !== null) {
      setTitle(event.target.value)
    }
  }

  // TODO error handling

  const createList = () => {
    addEmptyFilelist(title)
  }
  return (
    <Stack direction='row' spacing='15px' sx={{ width: '50%' }} alignItems='center'>
      <TextField
        color='secondary'
        size='small'
        onBlur={handleUpdateTitle}
        sx={{ marginTop: '2px', marginBottom: '2px' }}
        label={<FormattedMessage id='listTitle' defaultMessage='Listan nimi' />}
      ></TextField>
      <Button
        variant='outlined'
        onClick={createList}
        sx={{ marginTop: '2px', marginBottom: '2px', height: '90%' }}
      >
        <FormattedMessage id='createNewList' defaultMessage='Luo lista' />
      </Button>
    </Stack>
  )
}

export default NewFileList
