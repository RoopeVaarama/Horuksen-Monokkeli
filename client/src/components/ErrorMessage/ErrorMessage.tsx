import { Typography, styled } from '@mui/material'
import { FormattedMessage } from 'react-intl'

const Message = styled(Typography)(({ theme }) => ({
  color: theme.palette.error.main,
  fontSize: '12px',
  display: 'flex',
  justifyContent: 'center'
}))

const ErrorMessage = (props: { errorObject: { msg: string; translation: string } }) => {
  const { msg, translation } = props.errorObject
  return (
    <Message>
      <FormattedMessage id={translation} defaultMessage={msg} />
    </Message>
  )
}

export default ErrorMessage
