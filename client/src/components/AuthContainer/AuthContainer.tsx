import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { Outlet, useLocation } from 'react-router-dom'
import { TOKEN_KEY } from '../../constants'

const AuthContainer = ({ restricted }: { restricted: boolean }) => {
  const [access, setAccess] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY)
    if ((restricted && token) || (!restricted && !token)) {
      setAccess(true)
    } else if (restricted && !token) {
      setAccess(false)
      navigate('/signin')
    } else if (!restricted && token) {
      setAccess(false)
      console.log('sds', restricted, token, location?.pathname)
      navigate('/')
    }
  }, [location?.pathname])

  return <>{access && <Outlet />}</>
}

export default AuthContainer