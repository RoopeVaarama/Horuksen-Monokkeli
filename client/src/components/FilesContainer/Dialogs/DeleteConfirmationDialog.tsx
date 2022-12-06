import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography
} from '@mui/material'
import { FormattedMessage } from 'react-intl'
import { IntlMsg } from '../../../types'

const DeleteConfirmationDialog = ({
  open,
  itemname,
  onClose,
  additionalInfo
}: {
  open: boolean
  itemname: string
  onClose: (confirmation: boolean) => void
  additionalInfo?: IntlMsg
}) => {
  const handleCancel = () => {
    onClose(false)
  }

  const handleOK = () => {
    onClose(true)
  }

  return (
    <Dialog open={open} onClose={handleCancel}>
      <DialogTitle>
        <FormattedMessage id='deleteConfirmation' defaultMessage='Vahvista poisto' />
      </DialogTitle>
      <DialogContent dividers={true}>
        <DialogContentText>{itemname}</DialogContentText>
        {additionalInfo && (
          <Typography variant='subtitle2'>
            <FormattedMessage
              id={additionalInfo.intlKey}
              defaultMessage={additionalInfo.defaultMessage}
            />
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel}>
          <FormattedMessage id='cancel' defaultMessage='Peruuta' />
        </Button>
        <Button onClick={handleOK}>
          <FormattedMessage id='confirm' defaultMessage='Vahvista' />
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default DeleteConfirmationDialog
