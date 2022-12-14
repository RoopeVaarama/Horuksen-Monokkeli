import { Box, Stack, Typography, Button, useTheme, alpha } from '@mui/material'
import { useState, useRef, DragEvent, ChangeEvent } from 'react'
import { FormattedMessage } from 'react-intl'
import UploadIcon from '@mui/icons-material/Upload'

const FileUploader = ({ handleUpload }: { handleUpload: (files: File[] | null) => void }) => {
  const theme = useTheme()
  const [isDragging, setIsDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.stopPropagation()
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files) {
      const files = Array.from(e.dataTransfer.files)
      handleUpload(files)
    }
  }

  const handleDrag = (e: DragEvent<HTMLFormElement | HTMLDivElement>) => {
    e.stopPropagation()
    e.preventDefault()
    if (e.type === 'dragover' || e.type === 'dragenter') {
      setIsDragging(true)
    } else {
      setIsDragging(false)
    }
  }

  const handleSelection = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files !== null) {
      const selectedFiles = Array.from(e.target.files)
      handleUpload(selectedFiles)
    }
  }

  return (
    <Box onDragEnter={handleDrag}>
      <input
        id='input-file'
        type='file'
        multiple
        ref={inputRef}
        onChange={handleSelection}
        style={{ display: 'none' }}
      />
      <label id='label-file' htmlFor='input-file'>
        <Stack
          spacing={1}
          justifyContent='center'
          alignItems='center'
          height='100px'
          width='100%'
          borderRadius='10px'
          border={`dashed 1px ${theme.palette.secondary.dark}`}
          sx={{
            backgroundColor: isDragging
              ? theme.palette.secondary.light
              : alpha(theme.palette.secondary.light, 0.2)
          }}
        >
          {isDragging ? (
            <UploadIcon sx={{ fontSize: '48px', color: theme.palette.primary.main }} />
          ) : (
            <>
              <Typography>
                <FormattedMessage id='dropPdfHere' defaultMessage='Pudota PDF tiedosto t??h??n tai' />
              </Typography>
              <Button variant='contained' onClick={() => inputRef.current?.click()}>
                <FormattedMessage id='selectFile' defaultMessage='Valitse tiedosto' />
              </Button>
            </>
          )}
        </Stack>
      </label>
      {isDragging && (
        <Box
          id='drag-drop-file'
          position='absolute'
          width='100%'
          height='100%'
          top='0px'
          right='0px'
          bottom='0px'
          left='0px'
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        />
      )}
    </Box>
  )
}

export default FileUploader
