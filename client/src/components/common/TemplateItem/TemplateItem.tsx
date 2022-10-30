import { useState } from 'react'
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined'
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
import { Template } from '../../../types'
import StyledPaper from '../StyledPaper/StyledPaper'
import { FormattedMessage } from 'react-intl'
import { useTemplateStore } from '../../../store/templateStore'
import TemplateItemRow from './TemplateItemRow'

const TemplateItem = ({ template, isDraft = false }: { template: Template; isDraft?: boolean }) => {
  const theme = useTheme()
  const { deleteTemplateDraft, updateTemplateDraftTitle, addTemplateDraftRow, deleteTemplate } =
    useTemplateStore()
  const [open, setOpen] = useState(isDraft)
  const [textFieldError, setTextFieldError] = useState(false)

  const handleDelete = () => {
    if (isDraft) {
      deleteTemplateDraft()
    } else if (template._id) {
      deleteTemplate(template._id)
    }
  }
  const handleUpdateTitle = (newTitle: string) => {
    if (newTitle) {
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
      sx={{
        position: 'relative',
        width: 'calc(100% - 48px)',
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
          {!isDraft && <ListItemText>{template.title}</ListItemText>}
          {open ? <ExpandLess color='primary' /> : <ExpandMore color='primary' />}
        </ListItemButton>
        <Collapse in={open} sx={{ backgroundColor: alpha(theme.palette.secondary.light, 0.05) }}>
          {template.terms.map((row, i) => (
            <TemplateItemRow key={row.id ?? i} templateRow={row} marker={i + 1} isDraft={isDraft} />
          ))}
          {isDraft && (
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
              <AddCircleOutlineOutlinedIcon color='primary' />
            </ListItemButton>
          )}
        </Collapse>
        {isDraft && (
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
          onClick={handleDelete}
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
      </Stack>
    </StyledPaper>
  )
}

export default TemplateItem
