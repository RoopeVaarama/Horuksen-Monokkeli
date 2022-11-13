import { ChangeEvent, useRef } from 'react'
import { Button } from '@mui/material'
import { FormattedMessage } from 'react-intl'

const FileUploader = (props: { fileUploaded: (files: File[]) => void }) => {
  const { fileUploaded } = props
  const fileInput = useRef<HTMLInputElement>(null)

  const handleUploadClick = () => {
    fileInput.current?.click()
  }

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files !== null) {
      const selectedFiles = Array.from(event.target.files)
      fileUploaded(selectedFiles)
    }
  }

  return (
    <>
      <Button id='file-upload-button' variant='outlined' onClick={handleUploadClick}>
        <FormattedMessage id='uploadFiles' defaultMessage='Lataa tiedostoja' />
      </Button>
      <input
        id='file-upload-input'
        type='file'
        multiple
        ref={fileInput}
        onChange={handleChange}
        style={{ display: 'none' }}
      />
    </>
  )
}

export default FileUploader
