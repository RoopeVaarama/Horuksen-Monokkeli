import { useEffect, useState } from 'react'
import { Grid, Stack, Typography } from '@mui/material'
import { FormattedMessage, useIntl } from 'react-intl'
import { User } from '../../types'
import { Alert, StyledPaper } from '../common'
import { getAuthedUser } from '../../tools/auth'

const ProfileContainer = () => {
  const [authedUser, setAuthedUser] = useState<User['user'] | null>(null)
  const [error, setError] = useState<boolean>(false)
  const intl = useIntl()

  const renderField = (title: string, value: string) => {
    return (
      <Stack>
        <Typography sx={{ fontSize: '14px', fontWeight: 600 }}>{title}</Typography>
        <Typography sx={{ fontSize: '14px', fontWeight: 500 }}>{value}</Typography>
      </Stack>
    )
  }

  useEffect(() => {
    const user = getAuthedUser()
    if (user) {
      setAuthedUser(user)
    } else {
      setError(true)
    }
  }, [])

  return (
    <Stack spacing={2}>
      <Typography variant='h6'>
        <FormattedMessage id='profile' defaultMessage='Profiili' />
      </Typography>
      {authedUser && (
        <StyledPaper>
          <Grid container columnSpacing={2} rowSpacing={1} p={2}>
            <Grid item xs={12} sm={6}>
              {renderField(
                intl.formatMessage({ id: 'username', defaultMessage: 'Käyttäjätunnus' }),
                authedUser.username
              )}
            </Grid>
            <Grid item xs={12} sm={6}>
              {renderField(
                intl.formatMessage({ id: 'email', defaultMessage: 'Sähköposti' }),
                authedUser.email
              )}
            </Grid>
            <Grid item xs={12} sm={6}>
              {renderField(
                intl.formatMessage({ id: 'firstName', defaultMessage: 'Etunimi' }),
                authedUser.firstName
              )}
            </Grid>
            <Grid item xs={12} sm={6}>
              {renderField(
                intl.formatMessage({ id: 'lastName', defaultMessage: 'Sukunimi' }),
                authedUser.lastName
              )}
            </Grid>
          </Grid>
        </StyledPaper>
      )}
      {error && (
        <Alert
          message={intl.formatMessage({
            id: 'noAuthedUser',
            defaultMessage:
              'Kirjautumistietoja ei löytynyt paikallisesta muistista. Kirjaudu ulos ja takaisin sisään.'
          })}
        />
      )}
    </Stack>
  )
}

export default ProfileContainer
