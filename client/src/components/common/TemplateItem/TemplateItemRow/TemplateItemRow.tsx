import { useState } from 'react'
import DeleteIcon from '@mui/icons-material/Delete'
import ExpandLess from '@mui/icons-material/ExpandLess'
import ExpandMore from '@mui/icons-material/ExpandMore'
import {
  Collapse,
  Divider,
  Grid,
  ListItemButton,
  ListItemText,
  IconButton,
  Stack,
  TextField,
  useTheme,
  alpha,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  SelectChangeEvent,
  Box
} from '@mui/material'
import { FormattedMessage } from 'react-intl'
import { directions } from '../../../../constants'
import { Direction, TemplateRow } from '../../../../types'
import { useTemplateStore } from '../../../../store/templateStore'

const TemplateItemRow = ({
  marker,
  templateRow,
  isDraft = false
}: {
  marker: number
  templateRow: TemplateRow
  isDraft?: boolean
}) => {
  const theme = useTheme()
  const [open, setOpen] = useState(true)
  const [textFieldError, setTextFieldError] = useState(false)
  const { deleteTemplateDraftRow, updateTemplateDraftKey, updateTemplateDraftDirection } =
    useTemplateStore()

  const handleDeleteRow = () => {
    if (isDraft && templateRow.id !== undefined) {
      deleteTemplateDraftRow(templateRow.id)
    }
  }
  const handleUpdateKey = (newKey: string) => {
    if (isDraft && templateRow.id !== undefined) {
      if (newKey) {
        setTextFieldError(false)
      } else {
        setTextFieldError(true)
      }
      updateTemplateDraftKey(templateRow.id, newKey)
    }
  }
  const handleUpdateDirection = (newDirection: Direction['value']) => {
    if (isDraft && templateRow.id !== undefined) {
      updateTemplateDraftDirection(templateRow.id, newDirection)
    }
  }

  return (
    <Box position='relative'>
      <ListItemButton
        onClick={() => setOpen(!open)}
        divider
        disableRipple
        sx={{
          height: '56px',
          boxSizing: 'border-box',
          backgroundColor: alpha(theme.palette.secondary.light, 0.01),
          ':hover': { backgroundColor: `${alpha(theme.palette.secondary.light, 0.01)}!important` }
        }}
      >
        <ListItemText>{isDraft ? `${marker}.` : `${marker}. ${templateRow.key}`}</ListItemText>
        {open ? <ExpandLess color='primary' /> : <ExpandMore color='primary' />}
      </ListItemButton>
      <Collapse in={open} sx={{ backgroundColor: alpha(theme.palette.secondary.light, 0.1) }}>
        <Grid container p={2} columnSpacing={4} rowSpacing={2}>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel id='relativePositionLabel'>
                <FormattedMessage id='relativePosition' defaultMessage='Suhteellinen sijainti' />
              </InputLabel>
              <Select
                labelId='relativePositionLabel'
                color='secondary'
                size='small'
                value={templateRow.direction}
                disabled={!isDraft}
                onChange={(e: SelectChangeEvent<Direction['value']>) => {
                  if (typeof e.target.value !== 'string') handleUpdateDirection(e.target.value)
                }}
                IconComponent={ExpandMore}
                label={
                  <FormattedMessage id='relativePosition' defaultMessage='Suhteellinen sijainti' />
                }
              >
                {directions.map((dir) => (
                  <MenuItem key={dir.intlId} value={dir.value}>
                    <FormattedMessage id={dir.intlId} defaultMessage={dir.defaultMessage} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        <Divider sx={{ borderColor: theme.palette.grey[300] }} />
      </Collapse>
      {isDraft && (
        <>
          <Stack
            direction='row'
            sx={{
              maxWidth: 'calc(100vw - 200px)',
              minWidth: '120px',
              position: 'absolute',
              top: '8px',
              left: '50px'
            }}
          >
            <TextField
              color='secondary'
              size='small'
              defaultValue={templateRow.key}
              autoFocus={!templateRow.key}
              error={textFieldError}
              onBlur={(e) => {
                handleUpdateKey(e.target.value)
              }}
              label={<FormattedMessage id='keyWord' defaultMessage='Avainsana' />}
            />
          </Stack>
          <IconButton
            onClick={handleDeleteRow}
            sx={{
              position: 'absolute',
              top: '8px',
              right: '-48px',
              ':hover': {
                backgroundColor: alpha(theme.palette.error.light, 0.1),
                transitionDuration: '200ms',
                '.MuiSvgIcon-root': {
                  color: theme.palette.error.main,
                  transition: 'color 200ms'
                }
              }
            }}
          >
            <DeleteIcon color='primary' />
          </IconButton>
        </>
      )}
    </Box>
  )
}

export default TemplateItemRow
