import { useState, ChangeEvent, FormEvent } from 'react'
import { styled, Typography, Button, Box, TextField } from '@mui/material'
import { FormattedMessage } from 'react-intl'
import { Link, useNavigate } from 'react-router-dom'
import { LoginDto } from '../../types'
import { useUserStore } from '../../store/userStore'

const FormContainer = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  marginTop: theme.spacing(4),
  marginBottom: theme.spacing(2),
  padding: '25px',
  borderRadius: '10px',
  border: 'solid',
  alignItems: 'center'
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
  margin: '10px'
}))

const RegisterLink = styled(Link)(({ theme }) => ({
  fontSize: '12px',
  display: 'flex',
  justifyContent: 'center',
  fontColor: theme.palette.primary
}))

const DEFAULT_LOGIN_DTO: LoginDto = {
  username: '',
  password: ''
}

const SignInContainer = () => {
  const [credentials, setCredentials] = useState<LoginDto>(DEFAULT_LOGIN_DTO)
  const { login } = useUserStore()
  const navigate = useNavigate()

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = event.target
    setCredentials((currentData) => ({
      ...currentData,
      [name]: value
    }))
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()
    const success = await login(credentials)
    if (success) {
      setCredentials(DEFAULT_LOGIN_DTO)
      navigate('/')
    }
  }

  return (
    <Box display='flex' width='100%' justifyContent='center'>
      <FormContainer>
        <Typography variant='h6'>
          <FormattedMessage id='signIn' defaultMessage='Kirjautuminen' />
        </Typography>
        <SignInForm onSubmit={handleSubmit}>
          <FormInput
            color='secondary'
            label={<FormattedMessage id='username' defaultMessage='Käyttäjätunnus' />}
            name='username'
            value={credentials.username}
            onChange={handleChange}
            required
          />
          <FormInput
            color='secondary'
            label={<FormattedMessage id='password' defaultMessage='Salasana' />}
            type='password'
            name='password'
            value={credentials.password}
            onChange={handleChange}
            required
          />
          <SignInButton type='submit' variant='contained'>
            <FormattedMessage id='signIn' defaultMessage='Kirjaudu sisään' />
          </SignInButton>
        </SignInForm>
        <RegisterLink to='../register'>
          <FormattedMessage id='register' defaultMessage='Rekisteröidy' />
        </RegisterLink>
      </FormContainer>
    </Box>
  )
}

export default SignInContainer
