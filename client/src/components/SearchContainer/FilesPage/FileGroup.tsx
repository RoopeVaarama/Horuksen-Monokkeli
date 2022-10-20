import { useState } from 'react'
import { Checkbox, Collapse, ListItemButton, Divider, Stack } from '@mui/material'
import { ExpandLess, ExpandMore } from '@mui/icons-material'
import FileItem from './FileItem'

const FileGroup = (props: { groupName: string }) => {
  const { groupName } = props

  const [chooseAll, setChooseAll] = useState(false)

  const [open, setOpen] = useState(false)
  const toggle = () => {
    setOpen((currState) => !currState)
  }

  const files = ['File1', 'File2', 'File3']
  return (
    <Stack>
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
      <Collapse in={open}>
        {files.map((name) => (
          <FileItem key={name} fileName={name} />
        ))}
      </Collapse>
    </Stack>
  )
}

export default FileGroup
