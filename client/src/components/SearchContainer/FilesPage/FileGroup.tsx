import { useState } from 'react'
import {
  Checkbox,
  Collapse,
  ListItemButton,
  Divider,
  Stack,
  Typography,
  styled
} from '@mui/material'
import { ExpandLess, ExpandMore } from '@mui/icons-material'
import FileItem from './FileItem'

const Sidetext = styled('div')(() => ({
  display: 'flex',
  alignItems: 'center'
}))

const FileGroup = (props: { groupName: string }) => {
  const { groupName } = props

  const [chooseAll, setChooseAll] = useState(false)

  const toggleAll = () => {
    setChooseAll((current) => !current)
  }

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
          <Typography variant='subtitle1'>{groupName}</Typography>
          <Sidetext>
            <Typography variant='caption'>x/x valittu</Typography>
            {open ? <ExpandLess /> : <ExpandMore />}
          </Sidetext>
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
