import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import { Typography, Stack, Button } from '@mui/material'
import { FormattedMessage } from 'react-intl'

const Alert = ({
  message,
  onCancel,
  onSave
}: {
  message: string | JSX.Element
  onCancel: () => void
  onSave: () => void
}) => {
  return (
    <Stack
      direction='row'
      spacing={2}
      p={1}
      borderRadius={1}
      alignItems='center'
      justifyContent='space-between'
      sx={{ backgroundColor: 'rgb(229, 246, 253)', height: '40px' }}
    >
      <Stack direction='row' spacing={1}>
        <InfoOutlinedIcon color='secondary' />
        <Typography color='secondary' fontSize='14px'>
          {message}
        </Typography>
      </Stack>
      <Stack direction='row' spacing={1}>
        <Button onClick={() => onCancel()}>
          <FormattedMessage id='cancel' defaultMessage='Peruuta' />
        </Button>
        <Button variant='contained' onClick={() => onSave()}>
          <FormattedMessage id='save' defaultMessage='Tallenna' />
        </Button>
      </Stack>
    </Stack>
  )
}

export default Alert
