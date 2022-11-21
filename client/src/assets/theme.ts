import { createTheme } from '@mui/material/styles'

export const theme = createTheme({
  palette: {
    primary: {
      main: '#031329',
      light: '#06254f',
      dark: '#010c1c'
    },
    secondary: {
      main: '#0694C4',
      light: '#85E0FF',
      dark: '#007EA6'
    },
    background: {
      default: '#F7F7F7',
      paper: '#FFFFFF'
    },
    success: {
      main: '#0F9A60',
      light: '#2AD18B',
      dark: '#01804B'
    },
    text: {
      disabled: 'rgba(0, 0, 0, 0.7)'
    }
  }
})

export default theme
