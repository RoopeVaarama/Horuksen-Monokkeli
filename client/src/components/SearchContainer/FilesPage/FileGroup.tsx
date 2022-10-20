import { useState } from 'react'
import { Checkbox, ListItemButton, Divider, Stack } from '@mui/material'
import { ExpandLess, ExpandMore } from '@mui/icons-material'

const FileGroup = (props: { groupName: string }) => {
  const { groupName } = props

  const [open, setOpen] = useState(false)
  const toggle = () => {
    setOpen((currState) => !currState)
  }
  return (
    <Stack
      direction='row'
      divider={<Divider orientation='vertical' variant='middle' flexItem />}
      sx={{ border: 1 }}
    >
      <Checkbox size='small' />
      <ListItemButton
        disableRipple
        onClick={toggle}
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
      >
        {groupName} {open ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
    </Stack>
  )
}

export default FileGroup
