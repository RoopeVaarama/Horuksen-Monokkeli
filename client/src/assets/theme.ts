import { createTheme } from '@mui/material/styles'

export const theme = createTheme({
  palette: {
    primary: {
      main: '#022C61',
      light: '#0051b8',
      dark: '#02234D'
    },
    secondary: {
      main: '#0694C4',
      light: '#85E0FF',
      dark: '#007EA6'
    },
    background: {
      default: '#FFFFFF',
      paper: '#F2F2F2'
    },
    success: {
      main: '#0F9A60',
      light: '#2AD18B',
      dark: '#01804B'
    }
  }
})

export default theme
