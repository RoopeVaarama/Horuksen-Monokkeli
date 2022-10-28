import { useEffect } from 'react'
import { CircularProgress, Stack, Typography } from '@mui/material'
import { FormattedMessage } from 'react-intl'
import { useSearchStore } from '../../../store/searchStore'

const ResultsPage = () => {
  const { search, searching, results } = useSearchStore()

  useEffect(() => {
    search()
  }, [])

  return (
    <Stack display='flex' alignItems='center' justifyContent='center' pt={3} spacing={2}>
      {searching || results.length === 0 ? (
        <CircularProgress color='secondary' />
      ) : (
        <>
          <Typography>
            <FormattedMessage id='examineResults' defaultMessage='Tarkastele tuloksia' />
          </Typography>
          {results.map((result) => (
            <Stack
              key={result.key}
              spacing={1}
              sx={{ border: '1px solid', p: 1, borderRadius: '10px' }}
            >
              {Object.entries(result).map(([key, value]) => (
                <Typography key={key}>{`${key}: ${value}`}</Typography>
              ))}
            </Stack>
          ))}
        </>
      )}
    </Stack>
  )
}

export default ResultsPage
