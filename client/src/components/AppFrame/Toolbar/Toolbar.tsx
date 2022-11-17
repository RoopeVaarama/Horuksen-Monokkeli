import {
  AppBar,
  Box,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Toolbar as MUIToolbar,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material'
import LogoutIcon from '@mui/icons-material/Logout'
import MenuIcon from '@mui/icons-material/Menu'
import { FormattedMessage } from 'react-intl'
import { Link, useNavigate } from 'react-router-dom'
import LanguageSelector from './LanguageSelector'
import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { TOKEN_KEY, toolbarRoutes } from '../../../constants'
import { useUserStore } from '../../../store/userStore'

const Toolbar = ({ height }: { height: string | number }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)
  const location = useLocation()
  const navigate = useNavigate()
  const theme = useTheme()
  const matches = useMediaQuery('(max-width:700px)')
  const hasToken = Boolean(localStorage.getItem(TOKEN_KEY))
  const { logout } = useUserStore()

  const handleLogout = () => {
    logout()
    navigate('/signin')
    setIsLoggedIn(false)
  }

  useEffect(() => {
    setIsLoggedIn(hasToken)
  }, [hasToken])

  return (
    <AppBar position='fixed' id='app-bar'>
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
                <Typography id='appTitle' variant='h6' sx={{ minWidth: 'max-content' }}>
                  <FormattedMessage id='appTitle' defaultMessage='Horuksen monokkeli' />
                </Typography>
              </Link>
            </Grid>
            {location.pathname !== '/signin' && location.pathname !== '/register' && (
              <Grid item display={matches ? 'none' : 'block'}>
                {toolbarRoutes.map((route) => (
                  <Link
                    id={'nav-route-' + route.intlId}
                    key={route.intlId}
                    to={route.link}
                    style={{
                      color:
                        route.link === location.pathname
                          ? theme.palette.secondary.light
                          : theme.palette.background.paper,
                      margin: theme.spacing(0, 1),
                      textDecoration: 'none',
                      textTransform: 'uppercase'
                    }}
                  >
                    <FormattedMessage id={route.intlId} defaultMessage={route.intlDefault} />
                  </Link>
                ))}
              </Grid>
            )}
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
              id='app-bar-dropdown-menu'
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
              {location.pathname !== '/signin' && location.pathname !== '/register' && (
                <Box display={matches ? 'block' : 'none'} mb={1}>
                  {toolbarRoutes.map((route) => (
                    <MenuItem
                      id={'nav-route-' + route.intlId}
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
              )}
              <LanguageSelector />
              {isLoggedIn && (
                <MenuItem onClick={() => handleLogout()} sx={{ mt: 1 }}>
                  <LogoutIcon />
                  <Typography textAlign='center' sx={{ ml: 1 }}>
                    {<FormattedMessage id='logout' defaultMessage='Kirjaudu ulos' />}
                  </Typography>
                </MenuItem>
              )}
            </Menu>
          </Grid>
        </Grid>
      </MUIToolbar>
    </AppBar>
  )
}

export default Toolbar
