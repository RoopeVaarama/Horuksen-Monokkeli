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
  padding: theme.spacing(2, 3)
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
