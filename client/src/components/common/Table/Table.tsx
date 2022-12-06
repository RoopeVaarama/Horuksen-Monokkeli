import {
  Table as MUITable,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material'
import { FormattedMessage } from 'react-intl'
import { StyledPaper } from '../../common'

const Table = ({
  rows,
  columns,
  defaultColumnMessages
}: {
  rows: Record<string, any>[]
  columns: string[]
  defaultColumnMessages: Record<string, string>
}) => {
  return (
    <StyledPaper>
      <TableContainer>
        <MUITable size='small' aria-label='a dense table'>
          <TableHead>
            <TableRow>
              {columns.map((col) => (
                <TableCell key={col} sx={{ fontWeight: 600 }}>
                  <FormattedMessage id={col} defaultMessage={defaultColumnMessages[col]} />
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, i) => (
              <TableRow key={i} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                {columns.map((col) => {
                  const value = row?.[col] || '-'
                  return <TableCell key={`${col}-${value}`}>{value}</TableCell>
                })}
              </TableRow>
            ))}
          </TableBody>
        </MUITable>
      </TableContainer>
    </StyledPaper>
  )
}

export default Table
