import { useState } from 'react'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import EditIcon from '@mui/icons-material/Edit'
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import DeleteIcon from '@mui/icons-material/Delete'
import ExpandLess from '@mui/icons-material/ExpandLess'
import ExpandMore from '@mui/icons-material/ExpandMore'
import {
  Collapse,
  ListItemButton,
  ListItemText,
  IconButton,
  useTheme,
  alpha,
  Stack,
  TextField,
  Typography
} from '@mui/material'
import { Template, TemplateVariant } from '../../../types'
import StyledPaper from '../StyledPaper/StyledPaper'
import { FormattedMessage } from 'react-intl'
import { useTemplateStore } from '../../../store/templateStore'
import TemplateItemRow from './TemplateItemRow'
import { useSearchStore } from '../../../store/searchStore'
import { useUserStore } from '../../../store/userStore'
import { titleAlreadyExists } from '../../../tools/validation'

const BUTTON_WIDTH = '48px'
const DB_BUTTON_WIDTH = '88px'

const TemplateItem = ({ template, variant }: { template: Template; variant: TemplateVariant }) => {
  const theme = useTheme()
  const {
    templates,
    deleteTemplateDraft,
    updateTemplateDraftTitle,
    addTemplateDraftRow,
    deleteTemplate,
    createTemplateDraft
  } = useTemplateStore()
  const { addTemplateToSearch, removeTemplateFromSearch } = useSearchStore()
  const { userId } = useUserStore()
  const [open, setOpen] = useState(true)
  const [textFieldError, setTextFieldError] = useState(false)

  const handleAction = () => {
    if (variant === 'draft') {
      deleteTemplateDraft()
    } else if (variant === 'noEdit' && template._id) {
      deleteTemplate(template._id)
    } else if (variant === 'searchOption' && template._id) {
      addTemplateToSearch(template)
    } else if (variant === 'searchSelected' && template._id) {
      removeTemplateFromSearch(template._id)
    }
  }
  const handleEdit = () => {
    window.scrollTo(0, 0)
    createTemplateDraft(userId, template)
  }
  const handleUpdateTitle = (newTitle: string) => {
    if (newTitle && !titleAlreadyExists(templates, newTitle, template._id)) {
      setTextFieldError(false)
    } else {
      setTextFieldError(true)
    }
    updateTemplateDraftTitle(newTitle)
  }
  const handleAddRow = () => {
    addTemplateDraftRow()
  }

  return (
    <StyledPaper
      id={`templateItem-${template._id}`}
      className='templateItem'
      sx={{
        position: 'relative',
        width: `calc(100% - ${variant === 'noEdit' ? DB_BUTTON_WIDTH : BUTTON_WIDTH})`,
        borderBottom: 'none'
      }}
    >
      <Stack
        component='ul'
        sx={{
          width: '100%',
          pl: 0,
          listStyleType: 'none',
          my: 0,
          '.MuiListItemButton-root:hover': {
            backgroundColor: 'background.paper'
          }
        }}
      >
        <ListItemButton
          onClick={() => setOpen(!open)}
          disableRipple
          divider
          sx={{
            height: '56px',
            boxSizing: 'border-box',
            display: 'flex',
            justifyContent: 'flex-end'
          }}
        >
          {variant !== 'draft' && <ListItemText>{template.title}</ListItemText>}
          {open ? <ExpandLess color='primary' /> : <ExpandMore color='primary' />}
        </ListItemButton>
        <Collapse in={open} sx={{ backgroundColor: alpha(theme.palette.secondary.light, 0.05) }}>
          {template.terms.map((row, i) => (
            <TemplateItemRow
              key={row._id ?? row.localId}
              templateRow={row}
              marker={i + 1}
              variant={variant}
            />
          ))}
          {variant === 'draft' && (
            <ListItemButton
              onClick={handleAddRow}
              disableRipple
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: alpha(theme.palette.secondary.light, 0.01),
                ':hover': {
                  backgroundColor: `${alpha(theme.palette.secondary.light, 0.01)}!important`
                }
              }}
            >
              <Typography variant='button' color='primary'>
                <FormattedMessage id='addRow' defaultMessage='Lisää rivi' />
              </Typography>
              <AddCircleOutlineIcon color='primary' />
            </ListItemButton>
          )}
        </Collapse>
        {variant === 'draft' && (
          <Stack
            direction='row'
            sx={{
              maxWidth: 'calc(100vw - 200px)',
              minWidth: '120px',
              position: 'absolute',
              top: '8px',
              left: '16px'
            }}
          >
            <TextField
              color='secondary'
              size='small'
              defaultValue={template.title}
              autoFocus={!template.title}
              error={textFieldError}
              onBlur={(e) => handleUpdateTitle(e.target.value)}
              label={<FormattedMessage id='templateTitle' defaultMessage='Templaten nimi' />}
            />
          </Stack>
        )}
        <IconButton
          onClick={handleAction}
          sx={{
            position: 'absolute',
            top: '8px',
            right: variant === 'noEdit' ? `-${DB_BUTTON_WIDTH}` : `-${BUTTON_WIDTH}`,
            ':hover': {
              backgroundColor: alpha(
                variant === 'searchOption'
                  ? theme.palette.success.light
                  : theme.palette.error.light,
                0.1
              ),
              transitionDuration: '200ms',
              '.MuiSvgIcon-root': {
                color:
                  variant === 'searchOption'
                    ? theme.palette.success.main
                    : theme.palette.error.main,
                transition: 'color 200ms'
              }
            }
          }}
        >
          {variant === 'searchOption' && (
            <AddCircleIcon id={'addTemplateToSearch-' + template._id} color='primary' />
          )}
          {variant === 'searchSelected' && (
            <RemoveCircleIcon id={'removeTemplateFromSearch-' + template._id} color='primary' />
          )}
          {variant === 'noEdit' && (
            <DeleteIcon id={'deleteTemplate-' + template._id} color='primary' />
          )}
          {variant === 'draft' && <CancelIcon id={'cancelEdit-' + template._id} color='primary' />}
        </IconButton>
        {variant === 'noEdit' && (
          <IconButton
            onClick={handleEdit}
            sx={{
              position: 'absolute',
              top: '8px',
              right: '-48px',
              ':hover': {
                backgroundColor: alpha(theme.palette.success.light, 0.1),
                transitionDuration: '200ms',
                '.MuiSvgIcon-root': {
                  color: theme.palette.success.main,
                  transition: 'color 200ms'
                }
              }
            }}
          >
            <EditIcon color='primary' />
          </IconButton>
        )}
      </Stack>
    </StyledPaper>
  )
}

export default TemplateItem
