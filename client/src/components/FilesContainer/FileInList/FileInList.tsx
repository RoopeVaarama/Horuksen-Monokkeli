import { Stack, Typography, Button, styled, IconButton } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import { FormattedMessage } from 'react-intl'
import { StyledPaper } from '../../common'
import { useFileStore } from '../../../store/fileStore'

const ItemRow = styled(Stack)(() => ({
  justifyContent: 'space-between',
  width: '100%',
  paddingLeft: '10px'
}))

const Sidetext = styled('div')(() => ({
  display: 'flex',
  alignItems: 'center',
  marginLeft: '10px'
}))

const FileInList = (props: {
  filename: string
  id: string
  date: string
  editable: boolean
  onDelete: (id: string) => void
}) => {
  const { id, filename, date, editable, onDelete } = props
  const { openFile } = useFileStore()

  const open = () => {
    openFile(id)
  }

  const deleteSelf = () => {
    onDelete(id)
  }

  return (
    <Stack direction='row' alignItems='center' sx={{ width: '80%' }}>
      <StyledPaper>
        <ItemRow direction='row'>
          <Stack direction='row' alignItems='center'>
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
      {editable && (
        <IconButton onClick={deleteSelf} size='small'>
          <DeleteIcon color='primary' />
        </IconButton>
      )}
    </Stack>
  )
}

export default FileInList
