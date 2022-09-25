import { lazy, Suspense } from 'react'
import { ThemeProvider } from '@emotion/react'
import theme from './assets/theme'
import { AppBar, Box, CircularProgress, Toolbar, Typography } from '@mui/material'
import { Route, Routes } from 'react-router-dom'

const AsyncSearchContainer = lazy(() => import('./components/SearchContainer'))
const AsyncPageNotFound = lazy(() => import('./components/PageNotFound'))

const HEADER_HEIGHT = '60px'

function App() {
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
            <Typography variant='h6'>LOGO</Typography>
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
