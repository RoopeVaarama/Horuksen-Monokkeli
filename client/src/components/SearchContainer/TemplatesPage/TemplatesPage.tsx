import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined'
import { ListItemButton, Typography, Stack, useTheme } from '@mui/material'
import { useState } from 'react'
import TemplateSelector from './TemplateSelector/TemplateSelector'
import { Template } from '../../../types/Template'
import StyledPaper from '../../common/StyledPaper/StyledPaper'

const testTemplates: Template[] = [
  {
    keyword: 'keyword1',
    relativeLocation: 'relativeLocation1',
    locationOnPage: 'locationOnPage1',
    onlyKeyword: true,
    fontSizeReliant: true
  },
  {
    keyword: 'keyword2',
    relativeLocation: 'relativeLocation2',
    locationOnPage: 'locationOnPage2',
    onlyKeyword: true,
    fontSizeReliant: true
  }
]

const TemplatesPage = ({
  isComplete,
  onComplete
}: {
  isComplete: boolean
  onComplete: () => void
}) => {
  const [templates, setTemplates] = useState<Template[]>(testTemplates)
  const theme = useTheme()
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
          <TemplateSelector key={i} marker={i + 1} />
        ))}
        <ListItemButton
          onClick={onComplete}
          disableRipple
          sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
        >
          <Typography variant='button' color='primary'>
            {isComplete ? 'Poista rivi' : 'Lisää rivi'}
          </Typography>
          <AddCircleOutlineOutlinedIcon color='primary' />
        </ListItemButton>
      </Stack>
    </StyledPaper>
  )
}

export default TemplatesPage
