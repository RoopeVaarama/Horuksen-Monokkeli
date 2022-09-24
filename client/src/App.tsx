import { ThemeProvider } from '@emotion/react'
import theme from './assets/theme'
import { AppBar, Box, Toolbar, Typography } from '@mui/material'

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
          CONTENT
        </Box>
      </Box>
    </ThemeProvider>
  )
}

export default App
