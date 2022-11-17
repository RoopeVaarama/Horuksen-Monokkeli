import { lazy, Suspense } from 'react'
import { Box, CircularProgress } from '@mui/material'
import { Route, Routes } from 'react-router-dom'
import { FormattedMessage } from 'react-intl'
import AppFrame from './components/AppFrame'

const AsyncSearchContainer = lazy(() => import('./components/SearchContainer'))
const AsyncPageNotFoundContainer = lazy(() => import('./components/PageNotFoundContainer'))
const AsyncSignInContainer = lazy(() => import('./components/SignInContainer'))
const AsyncRegisterContainer = lazy(() => import('./components/RegisterContainer'))
const AsyncTemplatesContainer = lazy(() => import('./components/TemplatesContainer'))

function App() {
  return (
    <AppFrame>
      <Suspense
        fallback={
          <Box py={2} width='100%' display='flex' justifyContent='center'>
            <CircularProgress color='secondary' />
          </Box>
        }
      >
        <Routes>
          <Route path='/' element={<AsyncSearchContainer />} />
          <Route
            path='/files'
            element={
              <div id='filesPlaceholder'>
                <FormattedMessage id='files' defaultMessage='Tiedostot' />
              </div>
            }
          />
          <Route
            path='/profile'
            element={
              <div id='profilePlaceholder'>
                <FormattedMessage id='profile' defaultMessage='Profiili' />
              </div>
            }
          />
          <Route path='/templates' element={<AsyncTemplatesContainer />} />
          <Route path='/signin' element={<AsyncSignInContainer />} />
          <Route path='/register' element={<AsyncRegisterContainer />} />
          <Route path='*' element={<AsyncPageNotFoundContainer />} />
        </Routes>
      </Suspense>
    </AppFrame>
  )
}

export default App
