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
  Checkbox
} from '@mui/material'
import { FormattedMessage } from 'react-intl'

const ITEMS_RELATIVE_POSITION = ['test1', 'test2', 'test3']
const ITEMS_PAGE_POSITION = ['test1', 'test2', 'test3']

const TemplateSelector = ({ marker }: { marker: number }) => {
  const [open, setOpen] = useState(false)
  const [relativePosition, setRelativePosition] = useState(ITEMS_RELATIVE_POSITION[0])
  const [pagePosition, setPagePosition] = useState(ITEMS_PAGE_POSITION[0])

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
                  value={relativePosition}
                  onChange={(e) => setRelativePosition(e.target.value)}
                  IconComponent={ExpandMore}
                  label={
                    <FormattedMessage
                      id='relativePosition'
                      defaultMessage='Suhteellinen sijainti'
                    />
                  }
                >
                  {ITEMS_RELATIVE_POSITION.map((item) => (
                    <MenuItem key={item} value={item}>
                      {item}
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
                  value={pagePosition}
                  onChange={(e) => setPagePosition(e.target.value)}
                  IconComponent={ExpandMore}
                  label={<FormattedMessage id='pagePosition' defaultMessage='Sijainti sivulla' />}
                >
                  {ITEMS_PAGE_POSITION.map((item) => (
                    <MenuItem key={item} value={item}>
                      {item}
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
              control={<Checkbox color='secondary' />}
              label={<FormattedMessage id='onlyTheKeyword' defaultMessage='Vain avainsana' />}
            />
            <FormControlLabel
              sx={{
                maxWidth: 'max-content',
                '.MuiTypography-root': { fontSize: '14px' },
                '.MuiButtonBase-root': { p: '4px', mr: '4px' }
              }}
              control={<Checkbox color='secondary' />}
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
          label={<FormattedMessage id='keyWord' defaultMessage='Avainsana' />}
        />
      </Stack>
      <IconButton
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
