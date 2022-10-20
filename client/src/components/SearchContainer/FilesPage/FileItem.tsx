import { useState } from 'react'
import { Stack, Divider, ListItemButton, Checkbox, Typography } from '@mui/material'

const FileItem = (props: { fileName: string }) => {
  const { fileName } = props
  const [selected, setSelected] = useState(false)
  const toggle = () => {
    setSelected((currently) => !currently)
  }
  return (
    <Stack
      alignItems='center'
      direction='row'
      divider={<Divider orientation='vertical' variant='middle' flexItem />}
      sx={{ border: 0.5, marginLeft: 5 }}
    >
      <Checkbox size='small' checked={selected} />
      <ListItemButton
        onClick={toggle}
        disableRipple
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
      >
        <Typography variant='subtitle2'>{fileName}</Typography>
      </ListItemButton>
    </Stack>
  )
}

export default FileItem
