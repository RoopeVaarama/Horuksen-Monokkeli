import { ChangeEvent, useRef } from 'react'
import { Button } from '@mui/material'
import { FormattedMessage } from 'react-intl'

const FileUploader = (props: { fileUploaded: () => void }) => {
  const { fileUploaded } = props
  const fileInput = useRef<HTMLInputElement>(null)

  const handleUploadClick = () => {
    fileInput.current?.click()
  }

  // Käsittele tiedosto
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files !== null) {
      const selectedFile = event.target.files[0]
      console.log(selectedFile)
      fileUploaded()
    }
  }

  return (
    <>
      <Button variant='outlined' onClick={handleUploadClick}>
        <FormattedMessage id='selectFiles' defaultMessage='Valitse tiedostot' />
      </Button>
      <input type='file' ref={fileInput} onChange={handleChange} style={{ display: 'none' }} />
    </>
  )
}

export default FileUploader
