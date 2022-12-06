import { styled } from '@mui/material'
import NotificationContainer from '../NotificationContainer'
import Toolbar from './Toolbar'

const TOOLBAR_HEIGHT = '60px'

const Root = styled('div')(({ theme }) => ({
  position: 'relative',
  height: '100%',
  width: '100%',
  minWidth: '320px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'stretch',
  backgroundColor: theme.palette.background.default
}))

const Wrapper = styled('div')(({ theme }) => ({
  position: 'relative',
  minHeight: '100vh',
  top: 0,
  [theme.breakpoints.down('md')]: {
    width: '100%'
  },
  [theme.breakpoints.up('md')]: {
    width: theme.breakpoints.values.md
  }
}))

const Content = styled('div')(({ theme }) => ({
  marginTop: TOOLBAR_HEIGHT,
  height: `calc(100% - ${TOOLBAR_HEIGHT})`,
  width: '100%',
  minWidth: '320px',
  boxSizing: 'border-box',
  backgroundColor: theme.palette.background.default,
  padding: theme.spacing(2, 1),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(2, 3)
  }
}))

const Background = styled('div')(({ theme }) => ({
  position: 'fixed',
  width: '100vw',
  height: '100vh',
  backgroundColor: theme.palette.background.default
}))

const AppFrame = ({ children }: { children: JSX.Element | JSX.Element[] }) => {
  return (
    <Root>
      <Background />
      <Wrapper>
        <Toolbar height={TOOLBAR_HEIGHT} />
        <NotificationContainer />
        <Content>{children}</Content>
      </Wrapper>
    </Root>
  )
}

export default AppFrame
