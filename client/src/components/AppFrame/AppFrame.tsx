import { styled } from '@mui/material'
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
  backgroundColor: theme.palette.background.paper
}))

const Wrapper = styled('div')(({ theme }) => ({
  position: 'relative',
  minHeight: '100vh',
  top: 0,
  [theme.breakpoints.down('sm')]: {
    width: '100%'
  },
  [theme.breakpoints.up('sm')]: {
    width: theme.breakpoints.values.sm
  }
}))

const Content = styled('div')(({ theme }) => ({
  paddingTop: TOOLBAR_HEIGHT,
  boxSizing: 'border-box',
  width: '100%',
  height: '100%',
  backgroundColor: theme.palette.background.default
}))

const AppFrame = ({ children }: { children: JSX.Element }) => {
  return (
    <Root>
      <Wrapper>
        <Toolbar height={TOOLBAR_HEIGHT} />
        <Content>{children}</Content>
      </Wrapper>
    </Root>
  )
}

export default AppFrame
