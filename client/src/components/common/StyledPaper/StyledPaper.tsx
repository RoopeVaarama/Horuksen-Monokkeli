import { Paper, styled } from '@mui/material'

const StyledPaper = styled(Paper)(({ theme }) => ({
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  boxShadow: '2px 2px 2px rgba(0, 0, 0, 0.10)',
  border: `1px solid ${theme.palette.grey[300]}`
}))

export default StyledPaper
