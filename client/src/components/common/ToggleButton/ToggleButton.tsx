import { ToggleButtonGroup, ToggleButton as MUIToggleButton } from '@mui/material'
import { FormattedMessage } from 'react-intl'

const ToggleButton = ({ open, setOpen }: { open: boolean; setOpen: (value: boolean) => void }) => {
  const handleChange = (value: boolean) => {
    if (value !== null) {
      setOpen(value)
    }
  }

  return (
    <ToggleButtonGroup
      value={open}
      exclusive
      onChange={(e, v) => handleChange(v)}
      color='secondary'
      sx={{ maxHeight: '45px' }}
    >
      <MUIToggleButton value={false} size='small'>
        <FormattedMessage id='close' defaultMessage='Sulje' />
      </MUIToggleButton>
      <MUIToggleButton value={true} size='small'>
        <FormattedMessage id='open' defaultMessage='Avaa' />
      </MUIToggleButton>
    </ToggleButtonGroup>
  )
}

export default ToggleButton
