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
  Box,
  FormControlLabel,
  Checkbox
} from '@mui/material'
import { FormattedMessage } from 'react-intl'
import { directions } from '../../../../constants'
import { Direction, TemplateRow, TemplateVariant } from '../../../../types'
import { useTemplateStore } from '../../../../store/templateStore'

const TemplateItemRow = ({
  marker,
  templateRow,
  variant
}: {
  marker: number
  templateRow: TemplateRow
  variant: TemplateVariant
}) => {
  const theme = useTheme()
  const [open, setOpen] = useState(true)
  const [textFieldError, setTextFieldError] = useState(false)
  const {
    deleteTemplateDraftRow,
    updateTemplateDraftKey,
    updateTemplateDraftDirection,
    updateTemplateDraftKeyOnly
  } = useTemplateStore()
  const isDraft = variant === 'draft'

  const handleDeleteRow = () => {
    if (isDraft) {
      deleteTemplateDraftRow(templateRow._id, templateRow.localId)
    }
  }
  const handleUpdateKey = (newKey: string) => {
    if (isDraft) {
      if (newKey) {
        setTextFieldError(false)
      } else {
        setTextFieldError(true)
      }
      updateTemplateDraftKey(newKey, templateRow._id, templateRow.localId)
    }
  }
  const handleUpdateDirection = (newDirection: Direction['value']) => {
    if (isDraft) {
      updateTemplateDraftDirection(newDirection, templateRow._id, templateRow.localId)
    }
  }
  const handleUpdateKeyOnly = (newState: boolean) => {
    if (isDraft) {
      updateTemplateDraftKeyOnly(newState, templateRow._id, templateRow.localId)
    }
  }

  return (
    <Box className='templateRow' position='relative'>
      <ListItemButton
        onClick={() => setOpen(!open)}
        className='templateRowCollapse'
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
          <Grid
            container
            item
            xs={12}
            sm={6}
            rowSpacing={2}
            sx={{ 'label.Mui-focused': { color: theme.palette.secondary.main } }}
          >
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id='relativePositionLabel'>
                  <FormattedMessage id='relativePosition' defaultMessage='Suhteellinen sijainti' />
                </InputLabel>
                <Select
                  className='relativePositionSelect'
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
                    <FormattedMessage
                      id='relativePosition'
                      defaultMessage='Suhteellinen sijainti'
                    />
                  }
                >
                  {directions.map((dir) => (
                    <MenuItem key={dir.intlId} value={dir.value} id={'direction-' + dir.intlId}>
                      <FormattedMessage id={dir.intlId} defaultMessage={dir.defaultMessage} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          <Grid container item xs={12} sm={6} direction='column'>
            <FormControlLabel
              sx={{
                maxWidth: 'max-content',
                '.MuiTypography-root': { fontSize: '14px' },
                '.MuiButtonBase-root': { p: '4px', mr: '4px' },
                mr: [3, 0]
              }}
              checked={templateRow.keyOnly}
              disabled={!isDraft}
              control={
                <Checkbox
                  className='TemplateRowKeyOnlySelector'
                  color='secondary'
                  onChange={(e) => handleUpdateKeyOnly(e.target.checked)}
                />
              }
              label={<FormattedMessage id='onlyTheKeyword' defaultMessage='Vain avainsana' />}
            />
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
