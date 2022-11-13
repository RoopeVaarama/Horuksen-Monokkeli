import { useState, ChangeEvent, FormEvent, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { styled, Typography, Button, Box, TextField } from '@mui/material'
import { FormattedMessage } from 'react-intl'
import ErrorMessage from '../ErrorMessage'
import { RegisterDto } from '../../types'
import { useUserStore } from '../../store/userStore'

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
  marginTop: theme.spacing(4),
  marginBottom: theme.spacing(2),
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
  margin: '10px'
}))

const SignInLink = styled(Link)(() => ({
  maxWidth: 'max-content',
  fontSize: '12px'
}))

const DEFAULT_USER_DTO: RegisterDto = {
  username: '',
  firstName: '',
  lastName: '',
  email: '',
  password: ''
}

const RegisterContainer = () => {
  const [registerData, setRegisterData] = useState<RegisterDto>(DEFAULT_USER_DTO)
  const [repeatPassword, setRepeatPassword] = useState('')
  const { register } = useUserStore()
  const navigate = useNavigate()

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
  }, [registerData.password, repeatPassword])

  const validatePassword = (): void => {
    const { password } = registerData
    {
      if (password.length > 0 || repeatPassword.length > 0)
        password === repeatPassword && password.length > 7
          ? clearError()
          : password === repeatPassword
          ? raiseError(errorShortPassword)
          : raiseError(errorMismatchPasswords)
    }
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()
    showPossibleErrors()
    const success = await register(registerData)
    if (success) {
      setRegisterData(DEFAULT_USER_DTO)
      setRepeatPassword('')
      navigate('/signin')
    }
  }

  return (
    <Box display='flex' width='100%' justifyContent='center' textAlign='center'>
      <FormContainer>
        <Typography variant='h6'>
          <FormattedMessage id='register' defaultMessage='Rekisteröidy' />
        </Typography>
        <RegisterForm onSubmit={handleSubmit}>
          <FormInput
            color='secondary'
            label={<FormattedMessage id='username' defaultMessage='Käyttäjätunnus' />}
            type='text'
            name='username'
            value={registerData.username}
            onChange={handleChange}
            required
          />
          <FormInput
            color='secondary'
            label={<FormattedMessage id='firstName' defaultMessage='Etunimi' />}
            type='text'
            name='firstName'
            value={registerData.firstName}
            onChange={handleChange}
            required
          />
          <FormInput
            color='secondary'
            label={<FormattedMessage id='lastName' defaultMessage='Sukunimi' />}
            type='text'
            name='lastName'
            value={registerData.lastName}
            onChange={handleChange}
            required
          />
          <FormInput
            color='secondary'
            label={<FormattedMessage id='email' defaultMessage='Sähköposti' />}
            type='email'
            name='email'
            value={registerData.email}
            onChange={handleChange}
            required
          />
          <FormInput
            color='secondary'
            label={<FormattedMessage id='password' defaultMessage='Salasana' />}
            type='password'
            name='password'
            value={registerData.password}
            onChange={handleChange}
            error={formSent && error.errorPresent}
            required
          />
          <FormInput
            color='secondary'
            label={<FormattedMessage id='repeatPassword' defaultMessage='Salasana uudelleen' />}
            type='password'
            name='repeatPassword'
            value={repeatPassword}
            onChange={(e) => setRepeatPassword(e.target.value)}
            error={formSent && error.errorPresent}
            required
          />
          {formSent && error.errorPresent && <ErrorMessage errorObject={error.errorObject} />}
          <SignInButton type='submit' variant='contained'>
            {<FormattedMessage id='register' defaultMessage='Rekisteröidy' />}
          </SignInButton>
        </RegisterForm>
        <SignInLink to='../signin'>
          {<FormattedMessage id='signIn' defaultMessage='Sisäänkirjautuminen' />}
        </SignInLink>
      </FormContainer>
    </Box>
  )
}

export default RegisterContainer
