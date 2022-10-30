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
import { useSearchStore } from '../../../store/searchStore'
import { directions, locationsOnPage } from '../../../constants'
import { Direction, LocationOnPage } from '../../../types'
import { TemplateRow } from '../../../types/TemplateRowOld'

const TemplateRowSelector = ({
  marker,
  template,
  search = false
}: {
  marker: number
  template: TemplateRow
  search?: boolean
}) => {
  const [open, setOpen] = useState(true)
  const [textFieldError, setTextFieldError] = useState(false)
  const {
    deleteTemplate: searchDeleteTemplate,
    updateKeyword: searchUpdateKeyword,
    updateRelativePosition: searchUpdateRelativePosition,
    updateLocationOnPage: searchUpdateLocationOnPage,
    updateBoolOnlyKeyword: searchUpdateBoolOnlyKeyword,
    updateBoolFontSizeDependent: searchUpdateBoolFontSizeDependent
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
                  onChange={(e: SelectChangeEvent<Direction['value']>) => {
                    if (typeof e.target.value !== 'string')
                      searchUpdateRelativePosition(template.id, e.target.value)
                  }}
                  IconComponent={ExpandMore}
                  label={
                    <FormattedMessage
                      id='relativePosition'
                      defaultMessage='Suhteellinen sijainti'
                    />
                  }
                >
                  {directions.map((relPos) => (
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
                      searchUpdateLocationOnPage(template.id, e.target.value)
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
                  onChange={(e) => searchUpdateBoolOnlyKeyword(template.id, e.target.checked)}
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
                  onChange={(e) => searchUpdateBoolFontSizeDependent(template.id, e.target.checked)}
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
            searchUpdateKeyword(template.id, e.target.value)
          }}
          label={<FormattedMessage id='keyWord' defaultMessage='Avainsana' />}
        />
      </Stack>
      <IconButton
        onClick={() => searchDeleteTemplate(template.id)}
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

export default TemplateRowSelector
