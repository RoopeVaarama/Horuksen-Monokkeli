import { Typography, styled } from '@mui/material'

const Message = styled(Typography)(({ theme }) => ({
  color: theme.palette.error.main,
  fontSize: '12px',
  display: 'flex',
  justifyContent: 'center'
}))

const ErrorMessage = (props: { errorMessage: string }) => {
  const { errorMessage } = props
  return <Message>{errorMessage}</Message>
}

export default ErrorMessage
