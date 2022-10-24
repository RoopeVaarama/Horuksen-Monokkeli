import { useState, useEffect } from 'react'
import { Button, Stack, Divider, ListItemButton, Checkbox, Typography, styled } from '@mui/material'
import { FormattedMessage } from 'react-intl'

const Sidetext = styled('div')(() => ({
  display: 'flex',
  alignItems: 'center'
}))

const FileItem = (props: {
  name: string
  date: string
  fileName: string
  checked: boolean
  override: boolean
  onToggle: (key: string, selected: boolean) => void
}) => {
  const { name, date, fileName, checked, onToggle, override } = props

  const [selected, setSelected] = useState(false)

  const toggle = () => {
    setSelected((currently) => !currently)
  }
  useEffect(() => {
    onToggle(name, selected)
    console.log('Item selected effect')
  }, [selected])

  useEffect(() => {
    override && setSelected(checked)
    console.log('Item override effect')
  })

  console.log(name + ': ' + selected)

  return (
    <Stack
      id='fileitem-row'
      alignItems='center'
      direction='row'
      divider={<Divider orientation='vertical' variant='middle' flexItem />}
      sx={{ border: 0.5, marginLeft: 5 }}
    >
      <Checkbox id='fileitem-checkbox' size='small' checked={selected} onClick={toggle} />
      <ListItemButton
        id='fileitem-listitembutton'
        onClick={toggle}
        disableRipple
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
      >
        <Typography variant='subtitle2'>{fileName}</Typography>
      </ListItemButton>
      <Sidetext>
        <Typography id='fileitem-date' variant='caption'>
          <FormattedMessage id='added' defaultMessage='Lisätty '></FormattedMessage>
          {date}
        </Typography>
        <Button id='fileitem-open-button'>
          <FormattedMessage id='open' defaultMessage='Avaa' />
        </Button>
      </Sidetext>
    </Stack>
  )
}

export default FileItem
