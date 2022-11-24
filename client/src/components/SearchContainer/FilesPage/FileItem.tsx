import { useState, useEffect } from 'react'
import { Button, Stack, Divider, ListItemButton, Checkbox, Typography, styled } from '@mui/material'
import { FormattedMessage } from 'react-intl'
import { useSearchStore } from '../../../store/searchStore'
import { getToken } from '../../../tools/auth'

const Sidetext = styled('div')(() => ({
  display: 'flex',
  alignItems: 'center',
  marginLeft: '10px'
}))

const FileItem = (props: {
  id: string
  date: string
  author: string
  fileName: string
  checked: boolean
  override: boolean
  onToggle: (key: string, selected: boolean) => void
}) => {
  const { id, author, date, fileName, checked, override, onToggle } = props
  const { addFileToSearch, removeFileFromSearch, fileIDs } = useSearchStore()

  const [fileSelected, setFileSelected] = useState(fileIDs.indexOf(id) >= 0 ? true : false)

  const toggle = () => {
    setFileSelected((currently) => !currently)
  }

  const openFile = () => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/files/read/${id}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`
      }
    })
      .then((res) => res.blob())
      .then((myBlob) => {
        const objectURL = URL.createObjectURL(myBlob)
        window.open(objectURL, '_blank', 'noopener, noreferrer')
      })
      .catch((e) => console.log(e))
  }

  useEffect(() => {
    onToggle(id, fileSelected)
    fileSelected
      ? addFileToSearch({ _id: id, author: author, filename: fileName, createdAt: date })
      : removeFileFromSearch({ _id: id, author: author, filename: fileName, createdAt: date })
  }, [fileSelected])

  useEffect(() => {
    override && setFileSelected(checked)
  })

  return (
    <Stack
      id='fileitem-row'
      alignItems='center'
      direction='row'
      divider={<Divider orientation='vertical' variant='middle' flexItem />}
      sx={{ border: 0.5, marginLeft: 5 }}
    >
      <Checkbox id='fileitem-checkbox' size='small' checked={fileSelected} onClick={toggle} />
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
        <Button id='fileitem-open-button' onClick={openFile}>
          <FormattedMessage id='open' defaultMessage='Avaa' />
        </Button>
      </Sidetext>
    </Stack>
  )
}

export default FileItem
