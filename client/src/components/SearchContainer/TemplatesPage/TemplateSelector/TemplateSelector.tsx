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
  FormControlLabel,
  Checkbox,
  SelectChangeEvent
} from '@mui/material'
import { FormattedMessage } from 'react-intl'
import { useSearchStore } from '../../../../store/searchStore'
import { relativePositions, locationsOnPage } from '../../../../constants'
import { RelativePosition, LocationOnPage, Template } from '../../../../types'

const TemplateSelector = ({ marker, template }: { marker: number; template: Template }) => {
  const [open, setOpen] = useState(true)
  const [textFieldError, setTextFieldError] = useState(false)
  const {
    deleteTemplate,
    updateKeyword,
    updateRelativePosition,
    updateLocationOnPage,
    updateBoolOnlyKeyword,
    updateBoolFontSizeDependent
  } = useSearchStore()

  const theme = useTheme()
  return (
    <li style={{ position: 'relative' }}>
      <ListItemButton
        onClick={() => setOpen(!open)}
        divider
        disableRipple
        sx={{ height: '56px', boxSizing: 'border-box' }}
      >
        <ListItemText>{marker}.</ListItemText>
        {open ? <ExpandLess color='primary' /> : <ExpandMore color='primary' />}
      </ListItemButton>
      <Collapse in={open} sx={{ backgroundColor: alpha(theme.palette.secondary.light, 0.05) }}>
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
                  labelId='relativePositionLabel'
                  color='secondary'
                  size='small'
                  value={template.relativePosition}
                  onChange={(e: SelectChangeEvent<RelativePosition['value']>) => {
                    if (typeof e.target.value !== 'string')
                      updateRelativePosition(template.id, e.target.value)
                  }}
                  IconComponent={ExpandMore}
                  label={
                    <FormattedMessage
                      id='relativePosition'
                      defaultMessage='Suhteellinen sijainti'
                    />
                  }
                >
                  {relativePositions.map((relPos) => (
                    <MenuItem key={relPos.intlId} value={relPos.value}>
                      <FormattedMessage id={relPos.intlId} defaultMessage={relPos.defaultMessage} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id='pagePositionLabel'>
                  <FormattedMessage id='pagePosition' defaultMessage='Sijainti sivulla' />
                </InputLabel>
                <Select
                  labelId='pagePositionLabel'
                  color='secondary'
                  size='small'
                  value={template.locationOnPage}
                  onChange={(e: SelectChangeEvent<LocationOnPage['value']>) => {
                    if (typeof e.target.value !== 'string')
                      updateLocationOnPage(template.id, e.target.value)
                  }}
                  IconComponent={ExpandMore}
                  label={<FormattedMessage id='pagePosition' defaultMessage='Sijainti sivulla' />}
                >
                  {locationsOnPage.map((item) => (
                    <MenuItem key={item.intlId} value={item.value}>
                      <FormattedMessage id={item.intlId} defaultMessage={item.defaultMessage} />
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
              checked={template.onlyKeyword}
              control={
                <Checkbox
                  color='secondary'
                  onChange={(e) => updateBoolOnlyKeyword(template.id, e.target.checked)}
                />
              }
              label={<FormattedMessage id='onlyTheKeyword' defaultMessage='Vain avainsana' />}
            />
            <FormControlLabel
              sx={{
                maxWidth: 'max-content',
                '.MuiTypography-root': { fontSize: '14px' },
                '.MuiButtonBase-root': { p: '4px', mr: '4px' }
              }}
              checked={template.fontSizeDependent}
              control={
                <Checkbox
                  color='secondary'
                  onChange={(e) => updateBoolFontSizeDependent(template.id, e.target.checked)}
                />
              }
              label={
                <FormattedMessage id='fontSizeDependent' defaultMessage='Merkkikokoriippuvainen' />
              }
            />
          </Grid>
        </Grid>
        <Divider sx={{ borderColor: theme.palette.grey[300] }} />
      </Collapse>
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
          defaultValue={template.keyword}
          autoFocus={!template.keyword}
          error={textFieldError}
          onBlur={(e) => {
            if (e.target.value) {
              setTextFieldError(false)
            } else {
              setTextFieldError(true)
            }
            updateKeyword(template.id, e.target.value)
          }}
          label={<FormattedMessage id='keyWord' defaultMessage='Avainsana' />}
        />
      </Stack>
      <IconButton
        onClick={() => deleteTemplate(template.id)}
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
    </li>
  )
}

export default TemplateSelector
