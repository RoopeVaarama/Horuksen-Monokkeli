import { useState, ChangeEvent, FormEvent, useEffect } from 'react'
import { styled, Typography, Button, Box, TextField, Link } from '@mui/material'
import { FormattedMessage } from 'react-intl'
import SimpleToolbar from '../SignInContainer/SimpleToolbar'
import ErrorMessage from '../ErrorMessage'

const TOOLBAR_HEIGHT = '60px'

const FormContainer = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  marginTop: '25px',
  padding: '25px',
  borderRadius: '10px',
  border: 'solid',
  alignItems: 'center'
}))

const RegisterForm = styled('form')(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  display: 'flex',
  flexDirection: 'column',
  padding: theme.spacing(2, 3)
}))

const FormInput = styled(TextField)(() => ({
  marginTop: '5px',
  marginBottom: '10px',
  fontSize: '16px',
  variant: 'outlined',
  size: 'small'
}))

const SignInButton = styled(Button)(({ theme }) => ({
  margin: '10px',
  variant: 'contained',
  color: theme.palette.primary.main
}))

const SignInLink = styled(Link)(({ theme }) => ({
  fontSize: '12px',
  display: 'flex',
  justifyContent: 'center'
}))

const RegisterContainer = () => {
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    password: '',
    repeatPassword: ''
  })

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = event.target
    setRegisterData((currentData) => ({
      ...currentData,
      [name]: value
    }))
  }

  const [error, setError] = useState({
    errorPresent: false,
    msg: ''
  })

  const raiseError = (errorMsg: string): void => {
    setError({
      errorPresent: true,
      msg: errorMsg
    })
  }

  const clearError = (): void => {
    setError({
      errorPresent: false,
      msg: ''
    })
  }

  // Validate when passwords are changed
  useEffect(() => {
    validatePassword()
  }, [registerData.password, registerData.repeatPassword])

  const validatePassword = (): void => {
    const { password, repeatPassword } = registerData
    password === repeatPassword && password.length > 7
      ? clearError()
      : password === repeatPassword
      ? raiseError('Salasanan minimipituus 8 merkkiä')
      : raiseError('Salasanat eivät täsmää')
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault()
    // TO DO Varsinainen rekisteröitymisäksöni
    error.errorPresent ? console.log('Failure') : console.log('Rekisteröityminen OK')
  }

  return (
    <div>
      <SimpleToolbar height={TOOLBAR_HEIGHT} />
      <FormContainer>
        <Typography variant='h6'>
          <FormattedMessage id='register' defaultMessage='Rekisteröidy' />
        </Typography>
        <RegisterForm onSubmit={handleSubmit}>
          <FormInput label='Nimi' type='text' name='name' onChange={handleChange} required />
          <FormInput
            label='Sähköposti'
            type='email'
            name='email'
            onChange={handleChange}
            required
          />
          <FormInput
            label='Salasana'
            type='password'
            name='password'
            onChange={handleChange}
            required
          />
          <FormInput
            label='Salasana uudelleen'
            type='password'
            name='repeatPassword'
            onChange={handleChange}
            required
          />
          {error.errorPresent && <ErrorMessage errorMessage={error.msg} />}
          <SignInButton type='submit'>Rekisteröidy</SignInButton>
        </RegisterForm>
        <SignInLink href='signin'>Kirjaudu sisään</SignInLink>
      </FormContainer>
    </div>
  )
}

export default RegisterContainer
