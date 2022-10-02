import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './assets/index.css'
import theme from './assets/theme'
import App from './App'
import reportWebVitals from './reportWebVitals'
import TranslationProvider from './components/TranslationProvider'
import { ThemeProvider } from '@mui/material'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <TranslationProvider>
        <ThemeProvider theme={theme}>
          <App />
        </ThemeProvider>
      </TranslationProvider>
    </BrowserRouter>
  </React.StrictMode>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
