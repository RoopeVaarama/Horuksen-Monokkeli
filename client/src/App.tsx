import { lazy, Suspense } from 'react'
import { Box, CircularProgress } from '@mui/material'
import { Route, Routes } from 'react-router-dom'
import { FormattedMessage } from 'react-intl'
import AppFrame from './components/AppFrame'

const AsyncSearchContainer = lazy(() => import('./components/SearchContainer'))
const AsyncPageNotFoundContainer = lazy(() => import('./components/PageNotFoundContainer'))

function App() {
  return (
    <AppFrame>
      <Suspense
        fallback={
          <Box py={2} width='100%' display='flex' justifyContent='center'>
            <CircularProgress />
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
          <Route path='*' element={<AsyncPageNotFoundContainer />} />
        </Routes>
      </Suspense>
    </AppFrame>
  )
}

export default App
