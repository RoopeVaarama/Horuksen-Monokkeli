import { Button, Stack, Typography } from '@mui/material'
import { FormattedMessage } from 'react-intl'

const FilesPage = ({ isComplete, onComplete }: { isComplete: boolean; onComplete: () => void }) => {
  return (
    <Stack display='flex' alignItems='center' spacing={2}>
      <Typography>
        <FormattedMessage id='selectFiles' defaultMessage='Valitse tiedostot' />
      </Typography>
      <Button
        id='placeholderButton'
        onClick={onComplete}
        sx={{ width: 'max-content' }}
        variant='contained'
      >
        {isComplete ? 'Merkitse keskeneräiseksi' : 'Merkitse valmiiksi'}
      </Button>
    </Stack>
  )
}

export default FilesPage
