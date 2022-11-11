import { useState, useEffect } from 'react'
import { useUserStore } from '../../store/userStore'
import { AlertColor, Snackbar, Alert } from '@mui/material'
import { IntlMsg } from '../../types'
import { useIntl } from 'react-intl'

const NotificationContainer = () => {
  const [snackPack, setSnackPack] = useState<readonly string[]>([])
  const [open, setOpen] = useState<boolean>(false)
  const [active, setActive] = useState<boolean>(false)
  const [severity, setSeverity] = useState<AlertColor | undefined>(undefined)
  const [message, setMessage] = useState<string | undefined>(undefined)

  const { successMsg: userSuccess, errorMsg: userError, resetMsg: userReset } = useUserStore()
  const intl = useIntl()

  useEffect(() => {
    if (!open) {
      setActive(false)
    }
    if (snackPack.length && !active) {
      setMessage(snackPack[0])
      setSnackPack((prev) => prev.slice(1))
      setOpen(true)
    } else if (snackPack.length && active && open) {
      setOpen(false)
    }
  }, [snackPack, active, open])

  const handleNewMessage = (newMessage: string | IntlMsg, newSeverity: AlertColor) => {
    if (typeof newMessage === 'string') {
      setSnackPack((prev) => [...prev, newMessage])
    } else {
      setSnackPack((prev) => [
        ...prev,
        intl.formatMessage({ id: newMessage.intlKey, defaultMessage: newMessage.defaultMessage })
      ])
    }
    setSeverity(newSeverity)
    setActive(true)
    userReset()
  }

  useEffect(() => {
    if (userSuccess) {
      handleNewMessage(userSuccess, 'success')
    }
  }, [userSuccess])

  useEffect(() => {
    if (userError) {
      handleNewMessage(userError, 'error')
    }
  }, [userError])

  return (
    <Snackbar
      autoHideDuration={3000}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      open={open}
      onClose={() => setOpen(false)}
    >
      <Alert severity={severity}>{message}</Alert>
    </Snackbar>
  )
}

export default NotificationContainer
