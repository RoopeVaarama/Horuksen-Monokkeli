import { Box, CircularProgress, Stack, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { useSearchStore } from '../../../store/searchStore'
import { fetcher } from '../../../tools/fetcher'
import { FileInfo } from '../../../types'
import { Alert, Table } from '../../common'
import PdfView from '../../common/PdfView'

const KEY_ONLY_COLUMNS: string[] = ['fileName', 'key', 'count']
const VALUE_COLUMNS: string[] = ['fileName', 'page', 'key', 'value']

const getResults = (objects: Record<string, any>[], files?: FileInfo[]) => {
  const valueTableRows: Record<string, any>[] = []
  const keyOnlyTableRows: Record<string, any>[] = []
  const fileCounts: Record<string, Record<string, number>> = {}
  let fileName: string | undefined = undefined
  objects.forEach((obj) => {
    if (Array.isArray(files) && files.length !== 0) {
      fileName = files.find((file) => file._id === obj.file)?.filename
    }
    if (obj.key !== undefined && obj.value === undefined && fileName !== undefined) {
      if (fileCounts[fileName] === undefined) {
        fileCounts[fileName] = {}
      }
      if (fileCounts[fileName][obj.key] === undefined) {
        fileCounts[fileName][obj.key] = 1
      } else {
        fileCounts[fileName][obj.key] += 1
      }
    } else if (obj.key !== undefined && fileName !== undefined) {
      valueTableRows.push({ ...obj, fileName })
    }
  })
  for (const [fileName, keyCounts] of Object.entries(fileCounts)) {
    for (const [key, value] of Object.entries(keyCounts)) {
      keyOnlyTableRows.push({
        fileName,
        key,
        count: value
      })
    }
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
  const { search, searching, results, fileIDs } = useSearchStore()
  const [keyOnlyRows, setKeyOnlyRows] = useState<Record<string, any>[]>([])
  const [valueRows, setValueRows] = useState<Record<string, any>[]>([])
  const [files, setFiles] = useState<FileInfo[]>([])

  const getFiles = async () => {
    const data = await fetcher({
      method: 'GET',
      path: 'files'
    })
    setFiles(data)
  }

  useEffect(() => {
    if (Array.isArray(results)) {
      const { keyOnlyTableRows, valueTableRows } = getResults(results, files)
      setKeyOnlyRows(keyOnlyTableRows)
      setValueRows(valueTableRows)
    }
  }, [results, files])

  useEffect(() => {
    if (!searching) search()
    getFiles()
  }, [])

  return (
    <Stack width='100%' alignItems='center' spacing={2}>
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
            </Stack>
          )}
          <Stack width='100%'>
            <Typography variant='h6' sx={{ pt: 1 }}>
              <FormattedMessage id='results' defaultMessage='Tulokset' />
            </Typography>
            {fileIDs.map((fileID) => {
              const fileName = files.find((file) => file._id === fileID)?.filename
              return (
                <Stack key={fileID}>
                  <Typography variant='body1' sx={{ py: 1 }}>
                    {fileName}
                  </Typography>
                  <PdfView
                    fileId={fileID}
                    width={852}
                    results={results.filter((res) => res.file === fileID)}
                  ></PdfView>
                </Stack>
              )
            })}
          </Stack>
        </>
      )}
    </Stack>
  )
}

export default ResultsPage
