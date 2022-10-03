import { AppBar, Grid, Toolbar as MUIToolbar, Typography, useTheme } from '@mui/material'
import { FormattedMessage } from 'react-intl'
import { Link } from 'react-router-dom'
import LanguageSelector from './LanguageSelector'

const TOOLBAR_ROUTES = [
  { intlId: 'newSearch', intlDefault: 'Uusi haku', link: '/' },
  { intlId: 'files', intlDefault: 'Tiedostot', link: '/files' },
  { intlId: 'profile', intlDefault: 'Profiili', link: '/profile' }
]

const Toolbar = ({ height }: { height: string | number }) => {
  const theme = useTheme()
  return (
    <AppBar position='fixed'>
      <MUIToolbar
        variant='dense'
        sx={{ minHeight: height, maxHeight: height, padding: `${theme.spacing(0, 3)}!important` }}
      >
        <Grid container justifyContent='space-between' alignItems='center'>
          <Grid item>
            <Link
              to={'/'}
              style={{
                color: theme.palette.background.default,
                textDecoration: 'none'
              }}
            >
              <Typography variant='h6'>
                <FormattedMessage id='appTitle' defaultMessage='Horuksen monokkeli' />
              </Typography>
            </Link>
          </Grid>
          <Grid item>
            {TOOLBAR_ROUTES.map((route) => (
              <Link
                key={route.intlId}
                to={route.link}
                style={{
                  color: theme.palette.text.primary,
                  margin: theme.spacing(0, 1),
                  textDecoration: 'none'
                }}
              >
                <FormattedMessage id={route.intlId} defaultMessage={route.intlDefault} />
              </Link>
            ))}
          </Grid>
          <Grid item>
            <LanguageSelector />
          </Grid>
        </Grid>
      </MUIToolbar>
    </AppBar>
  )
}

export default Toolbar
