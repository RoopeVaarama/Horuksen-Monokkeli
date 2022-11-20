import { lazy, Suspense } from 'react'
import { Box, CircularProgress } from '@mui/material'
import { Route, Routes } from 'react-router-dom'
import AppFrame from './components/AppFrame'
import AuthContainer from './components/AuthContainer'

const AsyncSearchContainer = lazy(() => import('./components/SearchContainer'))
const AsyncPageNotFoundContainer = lazy(() => import('./components/PageNotFoundContainer'))
const AsyncSignInContainer = lazy(() => import('./components/SignInContainer'))
const AsyncRegisterContainer = lazy(() => import('./components/RegisterContainer'))
const AsyncTemplatesContainer = lazy(() => import('./components/TemplatesContainer'))
const AsyncFilesContainer = lazy(() => import('./components/FilesContainer'))
const AsyncProfileContainer = lazy(() => import('./components/ProfileContainer'))

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
          <Route element={<AuthContainer restricted />}>
            <Route path='/' element={<AsyncSearchContainer />} />
            <Route path='/files' element={<AsyncFilesContainer />} />
            <Route path='/profile' element={<AsyncProfileContainer />} />
            <Route path='/templates' element={<AsyncTemplatesContainer />} />
          </Route>
          <Route element={<AuthContainer restricted={false} />}>
            <Route path='/signin' element={<AsyncSignInContainer />} />
            <Route path='/register' element={<AsyncRegisterContainer />} />
          </Route>
          <Route path='*' element={<AsyncPageNotFoundContainer />} />
        </Routes>
      </Suspense>
    </AppFrame>
  )
}

export default App
