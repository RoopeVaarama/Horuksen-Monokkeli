import { Stack, Button, TextField, styled } from '@mui/material'
import { useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { NewFileVariant } from '../../../types/NewFileVariant'

const NewFileList = ({
  variant,
  onSave
}: {
  variant: NewFileVariant
  onSave: (title: string) => void
}) => {
  const variantWidth = variant === 'popup' ? '100%' : '50%'
  const [title, setTitle] = useState('')

  const StyledStack = styled(Stack)(() => ({
    width: `${variantWidth}`
  }))

  const handleUpdateTitle = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (event.target.value !== null) {
      setTitle(event.target.value)
    }
  }

  return (
    <StyledStack direction='row' spacing={2} alignItems='center'>
      <TextField
        autoFocus
        color='secondary'
        size='small'
        value={title}
        onChange={handleUpdateTitle}
        sx={{ marginTop: '2px', marginBottom: '2px' }}
        label={<FormattedMessage id='listTitle' defaultMessage='Listan nimi' />}
      />
      <Button
        variant='outlined'
        onClick={() => onSave(title)}
        sx={{ marginTop: '2px', marginBottom: '2px', height: '90%' }}
      >
        <FormattedMessage id='createNewList' defaultMessage='Luo lista' />
      </Button>
    </StyledStack>
  )
}

export default NewFileList
