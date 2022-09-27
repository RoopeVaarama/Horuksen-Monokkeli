import { lazy, Suspense, useContext } from 'react'
import { ThemeProvider } from '@emotion/react'
import theme from './assets/theme'
import { AppBar, Box, CircularProgress, Grid, MenuItem, Toolbar, Typography } from '@mui/material'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import { Route, Routes } from 'react-router-dom'
import { IntlContext } from './components/LanguageContainer/LanguageContainer'
import { FormattedMessage } from 'react-intl'

const AsyncSearchContainer = lazy(() => import('./components/SearchContainer'))
const AsyncPageNotFound = lazy(() => import('./components/PageNotFound'))

const HEADER_HEIGHT = '60px'

function App() {
  const intlContext = useContext(IntlContext)

  return (
    <ThemeProvider theme={theme}>
      <Box
        position='relative'
        height='100vh'
        width='100%'
        sx={{ backgroundColor: theme.palette.background.default }}
      >
        <AppBar position='fixed'>
          <Toolbar variant='dense' sx={{ minHeight: HEADER_HEIGHT }}>
            <Grid container justifyContent='space-between' alignItems='center'>
              <Grid item>
                <Typography variant='h6'>
                  <FormattedMessage id='appTitle' defaultMessage='Horuksen monokkeli' />
                </Typography>
              </Grid>
              <Grid item>
                {intlContext && (
                  <Select
                    value={intlContext.locale}
                    onChange={(e: SelectChangeEvent<string>) =>
                      intlContext.changeLanguage(e.target.value)
                    }
                  >
                    {Object.keys(intlContext.locales).map((option) => (
                      <MenuItem key={option} value={option}>
                        {intlContext.locales[option]}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              </Grid>
            </Grid>
          </Toolbar>
        </AppBar>
        <Box
          pt={HEADER_HEIGHT}
          boxSizing='border-box'
          width='100%'
          height='100%'
          sx={{ backgroundColor: theme.palette.background.default }}
        >
          <Suspense
            fallback={
              <Box pt={2} width='100%' display='flex' justifyContent='center'>
                <CircularProgress />
              </Box>
            }
          >
            <Routes>
              <Route path='/' element={<AsyncSearchContainer />} />
              <Route path='*' element={<AsyncPageNotFound />} />
            </Routes>
          </Suspense>
        </Box>
      </Box>
    </ThemeProvider>
  )
}

export default App
