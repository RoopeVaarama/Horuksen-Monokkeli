import { Stack } from '@mui/material'
import { FormattedMessage } from 'react-intl'

const ResultsPage = () => {
  return (
    <Stack display='flex' alignItems='center' pt={3} spacing={2}>
      <FormattedMessage id='examineResults' defaultMessage='Tarkastele tuloksia' />
    </Stack>
  )
}

export default ResultsPage
