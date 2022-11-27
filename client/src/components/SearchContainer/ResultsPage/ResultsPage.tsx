import { Box, CircularProgress, Stack, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { useSearchStore } from '../../../store/searchStore'
import { Alert, Table } from '../../common'

const ALL_COLUMNS: string[] = [
  'file',
  'page',
  'termIndex',
  'key',
  'value',
  'key_x',
  'key_y',
  'val_x',
  'val_y'
]
const KEY_ONLY_COLUMNS: string[] = ['key', 'count']
const VALUE_COLUMNS: string[] = ['file', 'page', 'key', 'value']

const getResults = (objects: Record<string, any>[]) => {
  const valueTableRows: Record<string, any>[] = []
  const keyOnlyTableRows: Record<string, any>[] = []
  const keyCounts: Record<string, number> = {}
  objects.forEach((obj) => {
    if (obj.key !== undefined && obj.value === undefined) {
      if (keyCounts[obj.key] === undefined) {
        keyCounts[obj.key] = 1
      } else {
        keyCounts[obj.key] += 1
      }
    } else if (obj.key !== undefined) {
      valueTableRows.push(obj)
    }
  })
  for (const [key, value] of Object.entries(keyCounts)) {
    keyOnlyTableRows.push({
      key,
      count: value
    })
  }
  return { keyOnlyTableRows, valueTableRows }
}

const translations: Record<string, string> = {
  file: 'Tiedosto',
  page: 'Sivu',
  termIndex: 'Termin indeksi',
  key_x: 'x (avainsana)',
  key_y: 'y (avainsana)',
  key: 'Avainsana',
  value: 'Arvo',
  val_x: 'x (arvo)',
  val_y: 'y (arvo)',
  count: 'Määrä'
}

const ResultsPage = () => {
  const { search, searching, results } = useSearchStore()
  const [keyOnlyRows, setKeyOnlyRows] = useState<Record<string, any>[]>([])
  const [valueRows, setValueRows] = useState<Record<string, any>[]>([])

  useEffect(() => {
    if (Array.isArray(results)) {
      const { keyOnlyTableRows, valueTableRows } = getResults(results)
      setKeyOnlyRows(keyOnlyTableRows)
      setValueRows(valueTableRows)
    }
  }, [results])

  useEffect(() => {
    if (!searching) search()
  }, [])

  return (
    <Stack width='100%' alignItems='center'>
      {searching ? (
        <CircularProgress color='secondary' />
      ) : (
        <>
          {!Array.isArray(results) || results.length === 0 ? (
            <Alert message={<FormattedMessage id='noResults' defaultMessage='Ei tuloksia' />} />
          ) : (
            <Stack spacing={2} width='100%'>
              {keyOnlyRows.length !== 0 && (
                <Box>
                  <Typography variant='h6' sx={{ py: 1 }}>
                    <FormattedMessage id='keyOnlySearchResults' defaultMessage='Avainsanahaku' />
                  </Typography>
                  <Table
                    rows={keyOnlyRows}
                    columns={KEY_ONLY_COLUMNS}
                    defaultColumnMessages={translations}
                  />
                </Box>
              )}
              {valueRows.length !== 0 && (
                <Box>
                  <Typography variant='h6' sx={{ py: 1 }}>
                    <FormattedMessage id='valueSearchResults' defaultMessage='Arvohaku' />
                  </Typography>
                  <Table
                    rows={valueRows}
                    columns={VALUE_COLUMNS}
                    defaultColumnMessages={translations}
                  />
                </Box>
              )}
              <Box>
                <Typography variant='h6' sx={{ py: 1 }}>
                  <FormattedMessage id='allResults' defaultMessage='Kaikki tulokset' />
                </Typography>
                <Table rows={results} columns={ALL_COLUMNS} defaultColumnMessages={translations} />
              </Box>
            </Stack>
          )}
        </>
      )}
    </Stack>
  )
}

export default ResultsPage
