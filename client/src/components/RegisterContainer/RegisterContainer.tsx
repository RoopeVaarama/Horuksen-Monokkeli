import { useState, ChangeEvent, FormEvent, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { styled, Typography, Button, Box, TextField } from '@mui/material'
import { FormattedMessage } from 'react-intl'
import ErrorMessage from '../ErrorMessage'

const errorShortPassword = {
  msg: 'Salasanan minimipituus 8 merkkiä',
  translation: 'shortPassword'
}
const errorMismatchPasswords = {
  msg: 'Salasanat eivät täsmää',
  translation: 'mismatchPassword'
}

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

  const [formSent, setFormSent] = useState(false)

  const showPossibleErrors = () => {
    setFormSent(true)
  }

  const [error, setError] = useState({
    errorPresent: false,
    errorObject: { msg: '', translation: '' }
  })

  const raiseError = (errorObj: { msg: string; translation: string }): void => {
    setError({
      errorPresent: true,
      errorObject: errorObj
    })
  }

  const clearError = (): void => {
    setError({
      errorPresent: false,
      errorObject: { msg: '', translation: '' }
    })
  }

  // Validate when passwords are changed
  useEffect(() => {
    validatePassword()
  }, [registerData.password, registerData.repeatPassword])

  const validatePassword = (): void => {
    const { password, repeatPassword } = registerData
    {
      if (password.length > 0 || repeatPassword.length > 0)
        password === repeatPassword && password.length > 7
          ? clearError()
          : password === repeatPassword
          ? raiseError(errorShortPassword)
          : raiseError(errorMismatchPasswords)
    }
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault()
    showPossibleErrors()
    // TO DO Varsinainen rekisteröitymisäksöni
    error.errorPresent ? console.log('Failure') : console.log('Rekisteröityminen OK')
  }

  return (
    <div>
      <FormContainer>
        <Typography variant='h6'>
          <FormattedMessage id='register' defaultMessage='Rekisteröidy' />
        </Typography>
        <RegisterForm onSubmit={handleSubmit}>
          <FormInput
            label={<FormattedMessage id='name' defaultMessage='Nimi' />}
            type='text'
            name='name'
            value={registerData.name}
            onChange={handleChange}
            required
          />
          <FormInput
            label={<FormattedMessage id='email' defaultMessage='Sähköposti' />}
            type='email'
            name='email'
            value={registerData.email}
            onChange={handleChange}
            required
          />
          <FormInput
            label={<FormattedMessage id='password' defaultMessage='Password' />}
            type='password'
            name='password'
            value={registerData.password}
            onChange={handleChange}
            error={formSent && error.errorPresent}
            required
          />
          <FormInput
            label={<FormattedMessage id='repeatPassword' defaultMessage='Salasana uudelleen' />}
            type='password'
            name='repeatPassword'
            value={registerData.repeatPassword}
            onChange={handleChange}
            error={formSent && error.errorPresent}
            required
          />
          {formSent && error.errorPresent && <ErrorMessage errorObject={error.errorObject} />}
          <SignInButton type='submit'>
            {<FormattedMessage id='register' defaultMessage='Rekisteröidy' />}
          </SignInButton>
        </RegisterForm>
        <SignInLink to='../signin'>
          {<FormattedMessage id='signIn' defaultMessage='Sisäänkirjautuminen' />}
        </SignInLink>
      </FormContainer>
    </div>
  )
}

export default RegisterContainer
