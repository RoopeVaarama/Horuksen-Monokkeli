import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { Outlet, useLocation } from 'react-router-dom'
import { useUserStore } from '../../store/userStore'
import { getToken, removeToken } from '../../tools/auth'

const AuthContainer = ({ restricted }: { restricted: boolean }) => {
  const [access, setAccess] = useState(false)
  const { validateToken } = useUserStore()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const token = getToken()
    if ((restricted && token) || (!restricted && !token)) {
      setAccess(true)
    } else if (restricted && !token) {
      setAccess(false)
      navigate('/signin')
    } else if (!restricted && token) {
      setAccess(false)
      navigate('/')
    }
  }, [location?.pathname])

  const validation = async () => {
    const hasValidToken = await validateToken()
    if (!hasValidToken) {
      navigate('/signin')
      removeToken()
    }
  }

  useEffect(() => {
    validation()
  }, [])

  return <>{access && <Outlet />}</>
}

export default AuthContainer
