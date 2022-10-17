import { useState, ChangeEvent, FormEvent } from 'react'
import { styled, Typography, Button, Box, TextField } from '@mui/material'
import { FormattedMessage } from 'react-intl'
import { Link } from 'react-router-dom'

const FormContainer = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  padding: '25px',
  borderRadius: '10px',
  border: 'solid'
}))

const SignInForm = styled('form')(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  display: 'flex',
  flexDirection: 'column',
  padding: theme.spacing(2, 3)
}))

const FormInput = styled(TextField)(() => ({
  marginTop: '10px',
  marginBottom: '10px',
  fontSize: '16px',
  variant: 'outlined'
}))

const SignInButton = styled(Button)(({ theme }) => ({
  margin: '10px',
  variant: 'contained',
  color: theme.palette.primary.dark
}))

const RegisterLink = styled(Link)(({ theme }) => ({
  fontSize: '12px',
  display: 'flex',
  justifyContent: 'center',
  fontColor: theme.palette.primary
}))

const SignInContainer = () => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  })

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = event.target
    setCredentials((currentData) => ({
      ...currentData,
      [name]: value
    }))
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault()
    console.log('Submitted: ' + credentials.email + ': ' + credentials.password)
    // TO DO Varsinainen kirjautumisäksöni
  }

  return (
    <div>
      <FormContainer>
        <Typography variant='h6'>
          <FormattedMessage id='signIn' defaultMessage='Kirjautuminen' />
        </Typography>
        <SignInForm onSubmit={handleSubmit}>
          <FormInput
            label={<FormattedMessage id='email' defaultMessage='Sähköposti' />}
            type='email'
            name='email'
            onChange={handleChange}
            required
          />
          <FormInput
            label={<FormattedMessage id='password' defaultMessage='Salasana' />}
            type='password'
            name='password'
            required
            onChange={handleChange}
          />
          <SignInButton type='submit'>
            <FormattedMessage id='signIn' defaultMessage='Kirjaudu sisään' />
          </SignInButton>
        </SignInForm>
        <RegisterLink to='../register'>
          <FormattedMessage id='register' defaultMessage='Register' />
        </RegisterLink>
      </FormContainer>
    </div>
  )
}

export default SignInContainer
