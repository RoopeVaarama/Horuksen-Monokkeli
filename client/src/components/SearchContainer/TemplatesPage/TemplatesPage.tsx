import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined'
import { ListItemButton, Typography, Stack } from '@mui/material'
import TemplateSelector from './TemplateSelector/TemplateSelector'
import StyledPaper from '../../common/StyledPaper/StyledPaper'
import { useTemplateStore } from '../../../store/templateStore'
import { FormattedMessage } from 'react-intl'

const TemplatesPage = () => {
  const { templates, addTemplate } = useTemplateStore()

  const onAddNewTemplate = () => {
    addTemplate()
  }

  return (
    <StyledPaper sx={{ width: 'calc(100% - 48px)' }}>
      <Stack
        component='ol'
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
        {templates.map((template, i) => (
          <TemplateSelector key={template.id} marker={i + 1} template={template} />
        ))}
        <ListItemButton
          onClick={onAddNewTemplate}
          disableRipple
          sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
        >
          <Typography variant='button' color='primary'>
            <FormattedMessage id='addRow' defaultMessage='Lisää rivi' />
          </Typography>
          <AddCircleOutlineOutlinedIcon color='primary' />
        </ListItemButton>
      </Stack>
    </StyledPaper>
  )
}

export default TemplatesPage
