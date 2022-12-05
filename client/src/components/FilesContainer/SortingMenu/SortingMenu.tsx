import { IconButton, Menu, MenuItem, Stack, Typography } from '@mui/material'
import SortIcon from '@mui/icons-material/Sort'
import { useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { useFileStore } from '../../../store/fileStore'
import { SortVariant } from '../../../types'

const options: { intlId: string; msg: string; sortId: SortVariant }[] = [
  { intlId: 'nameAtoZ', msg: 'Nimi (A-Ö)', sortId: 'name' },
  { intlId: 'nameZtoA', msg: 'Nimi (Ö-A)', sortId: 'nameReverse' },
  { intlId: 'dateFromNewest', msg: 'Päivämäärä (uusin ensin)', sortId: 'dateReverse' },
  { intlId: 'dateFromOldest', msg: 'Päivämäärä (vanhin ensin)', sortId: 'date' }
]

const SortingMenu = () => {
  const { setSortVariant } = useFileStore()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [open, setOpen] = useState(false)

  const handleButtonClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const setSorter = (id: SortVariant) => {
    setOpen(false)
    setSortVariant(id)
  }

  return (
    <Stack direction='row'>
      <IconButton size='small' onClick={handleButtonClick}>
        <Typography variant='subtitle2'>
          <FormattedMessage id='sort' defaultMessage='Lajittele' />
        </Typography>
        <SortIcon />
      </IconButton>
      <Menu open={open} anchorEl={anchorEl} onClose={handleClose}>
        {options.map((option) => (
          <MenuItem key={option.intlId} onClick={() => setSorter(option.sortId)}>
            <FormattedMessage id={option.intlId} defaultMessage={option.msg} />
          </MenuItem>
        ))}
      </Menu>
    </Stack>
  )
}

export default SortingMenu
