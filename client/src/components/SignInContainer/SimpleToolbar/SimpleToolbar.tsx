import {
  AppBar,
  Box,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Toolbar as MUIToolbar,
  Typography,
  useTheme
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import { FormattedMessage } from 'react-intl'
import { Link } from 'react-router-dom'
import LanguageSelector from '../../AppFrame/Toolbar/LanguageSelector'
import { useState } from 'react'
import { useLocation } from 'react-router-dom'

const TOOLBAR_ROUTES = [
  { intlId: 'newSearch', intlDefault: 'Uusi haku', link: '/' },
  { intlId: 'files', intlDefault: 'Tiedostot', link: '/files' },
  { intlId: 'profile', intlDefault: 'Profiili', link: '/profile' }
]

const SimpleToolbar = ({ height }: { height: string | number }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const location = useLocation()
  const theme = useTheme()
  return (
    <AppBar position='fixed'>
      <MUIToolbar
        variant='dense'
        sx={{ minHeight: height, maxHeight: height, padding: `${theme.spacing(0, 3)}!important` }}
      >
        <Grid container justifyContent='space-between' alignItems='center' wrap='nowrap'>
          <Grid container item alignItems='center' wrap='nowrap' columnSpacing={3}>
            <Grid item>
              <Link
                to={'/'}
                style={{
                  color: theme.palette.background.default,
                  textDecoration: 'none'
                }}
              >
                <Typography variant='h6' sx={{ minWidth: 'max-content' }}>
                  <FormattedMessage id='appTitle' defaultMessage='Horuksen monokkeli' />
                </Typography>
              </Link>
            </Grid>
          </Grid>
          <Grid item>
            <IconButton
              size='large'
              color='inherit'
              aria-label='menu'
              onClick={(e) => setAnchorEl(e.currentTarget)}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              sx={{ mt: '45px', 'a.Mui-disabled': { color: theme.palette.primary.main } }}
              transitionDuration={200}
              anchorEl={anchorEl}
              keepMounted
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right'
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right'
              }}
              open={Boolean(anchorEl)}
              onClose={() => setAnchorEl(null)}
            >
              <Box display={{ xs: 'block', sm: 'none' }} mb={1}>
                {TOOLBAR_ROUTES.map((route) => (
                  <MenuItem
                    key={route.intlId}
                    component={Link}
                    to={route.link}
                    onClick={() => setAnchorEl(null)}
                    disabled={route.link === location.pathname}
                  >
                    <Typography textAlign='center'>
                      {<FormattedMessage id={route.intlId} defaultMessage={route.intlDefault} />}
                    </Typography>
                  </MenuItem>
                ))}
              </Box>
              <LanguageSelector />
            </Menu>
          </Grid>
        </Grid>
      </MUIToolbar>
    </AppBar>
  )
}

export default SimpleToolbar
