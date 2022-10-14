import { styled, Typography, Button } from '@mui/material'
import { TextField } from '@mui/material'
import { Box } from '@mui/system'
import { FormattedMessage } from 'react-intl'
import SimpleToolbar from './SimpleToolbar'
import { useState, ChangeEvent, FormEvent } from 'react'

const TOOLBAR_HEIGHT = '60px'

const FormContainer = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  padding: '25px',
  borderRadius: '5px',
  border: 'solid',
  alignItems: 'center'
}))

const SignInForm = styled('form')(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  display: 'flex',
  flexDirection: 'column',
  padding: theme.spacing(2, 3)
}))

const FormInput = styled(TextField)(({ theme }) => ({
  marginTop: '10px',
  marginBottom: '10px',
  fontSize: '16px',
  variant: 'outlined'
}))

const SignInButton = styled(Button)(({ theme }) => ({
  margin: '10px',
  variant: 'contained',
  color: theme.palette.primary.main
}))

const SignInContainer = () => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  })

  const setEmail = (event: ChangeEvent<HTMLInputElement>): void => {
    setCredentials((currentCred) => ({
      ...currentCred,
      email: event.target.value
    }))
  }

  const setPassword = (event: ChangeEvent<HTMLInputElement>): void => {
    setCredentials((currentCred) => ({
      ...currentCred,
      password: event.target.value
    }))
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault()
    console.log('Submitted')
    // Varsinainen kirjautumisäksöni
  }

  return (
    <div>
      <SimpleToolbar height={TOOLBAR_HEIGHT} />
      <FormContainer>
        <Typography variant='h6'>
          <FormattedMessage id='signIn' defaultMessage='Kirjautuminen' />
        </Typography>
        <SignInForm onSubmit={handleSubmit}>
          <FormInput label='Sähköposti' required onChange={setEmail} />
          <FormInput label='Salasana' required onChange={setPassword} />
          <SignInButton type='submit'>Kirjaudu sisään</SignInButton>
        </SignInForm>
      </FormContainer>
    </div>
  )
}

export default SignInContainer
