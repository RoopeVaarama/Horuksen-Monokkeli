import { styled, Typography, Button } from '@mui/material'
import { Box } from '@mui/system'
import { FormattedMessage } from 'react-intl'
import SimpleToolbar from './SimpleToolbar'

const TOOLBAR_HEIGHT = '60px'

const FormContainer = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  padding: '25px',
  borderRadius: '5px',
  border: 'solid'
}))

const SignInForm = styled('form')(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  display: 'flex',
  flexDirection: 'column'
}))

const FormInput = styled('input')(({ theme }) => ({
  marginTop: '5px',
  marginBottom: '5px',
  fontSize: '16px'
}))

const SignInContainer = () => {
  return (
    <div>
      <SimpleToolbar height={TOOLBAR_HEIGHT} />
      <FormContainer>
        <Typography variant='h6'>
          <FormattedMessage id='signIn' defaultMessage='Kirjaudu sisään' />
        </Typography>
        <SignInForm>
          <FormInput type='email' name='email' placeholder='Sähköposti' />
          <FormInput type='password' name='password' placeholder='Salasana' />
          <Button variant='contained'>Kirjaudu sisään</Button>
        </SignInForm>
      </FormContainer>
    </div>
  )
}

export default SignInContainer
