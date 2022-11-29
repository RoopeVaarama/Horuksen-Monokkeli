import { Checkbox, Stack, Typography, styled, Button, IconButton } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import { useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { StyledPaper } from '../common'
import { useFileStore } from '../../store/fileStore'

const ItemRow = styled(Stack)(() => ({
  justifyContent: 'space-between',
  width: '100%'
}))
const Sidetext = styled('div')(() => ({
  display: 'flex',
  alignItems: 'center',
  marginLeft: '10px'
}))

const FilesContainer = (props: { id: string; filename: string; date: string }) => {
  const { id, filename, date } = props
  const { openFile } = useFileStore()

  const [selected, setSelected] = useState(false)
  const toggle = () => {
    setSelected((currState) => !currState)
  }

  const open = () => {
    openFile(id)
  }

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
              {date}
            </Typography>
            <Button id='fileitem-open-button' onClick={open}>
              <FormattedMessage id='open' defaultMessage='Avaa' />
            </Button>
          </Sidetext>
        </ItemRow>
      </StyledPaper>
      <IconButton>
        <DeleteIcon color='primary' />
      </IconButton>
    </Stack>
  )
}

export default FilesContainer
