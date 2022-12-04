import { Stack, Typography, Button, styled } from '@mui/material'
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

const FileInList = ({ filename, id, date }: { filename: string; id: string; date: string }) => {
  const { openFile } = useFileStore()

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
            <Button id='fileitem-open-button' onClick={() => openFile(id)}>
              <FormattedMessage id='open' defaultMessage='Avaa' />
            </Button>
          </Sidetext>
        </ItemRow>
      </StyledPaper>
    </Stack>
  )
}

export default FileInList
