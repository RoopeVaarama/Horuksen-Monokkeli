import AddIcon from '@mui/icons-material/Add'
import { Button, Stack, Typography, CircularProgress, Box, useTheme } from '@mui/material'
import { TemplateItem } from '../common'
import { FormattedMessage } from 'react-intl'
import { useTemplateStore } from '../../store/templateStore'
import { useEffect } from 'react'
import Alert from '../common/Alert'
import { useUserStore } from '../../store/userStore'
import { Template } from '../../types'

/**
 * Page container for url /templates
 */
const TemplatesContainer = () => {
  const theme = useTheme()
  const {
    draftIsEdit,
    fetching,
    templates,
    templateDraft,
    resetTemplates,
    createTemplateDraft,
    deleteTemplateDraft,
    createTemplate,
    updateTemplate
  } = useTemplateStore()
  const { userId } = useUserStore()

  const filteredTemplates = (oldTemplates: Template[]) => {
    if (templateDraft?._id) {
      return oldTemplates.filter((template) => template._id !== templateDraft._id)
    } else {
      return oldTemplates
    }
  }
  const handleCreateTemplateDraft = () => {
    createTemplateDraft(userId)
  }
  const handleDeleteTemplateDraft = () => {
    deleteTemplateDraft()
  }
  const handleCreateTemplate = () => {
    if (draftIsEdit) {
      updateTemplate()
    } else {
      createTemplate()
    }
  }

  useEffect(() => {
    resetTemplates(userId)
  }, [])

  return (
    <Stack spacing={2} id='templatesContainer'>
      {fetching ? (
        <CircularProgress color='secondary' sx={{ alignSelf: 'center' }} />
      ) : (
        <>
          {templateDraft && (
            <Alert
              message={
                <FormattedMessage
                  id='unsavedChanges'
                  defaultMessage='Sinulla on tallentamattomia muutoksia.'
                />
              }
              onCancel={handleDeleteTemplateDraft}
              onSave={handleCreateTemplate}
            />
          )}
          <Stack spacing={1} width='100%' display='flex'>
            <Box display='flex' justifyContent='space-between' className='templatesListheader'>
              <Typography variant='h6'>
                <FormattedMessage id='templates' defaultMessage='Templatet' />
              </Typography>
              {!templateDraft && (
                <Button
                  id='newTemplateBtn'
                  onClick={handleCreateTemplateDraft}
                  startIcon={<AddIcon />}
                  sx={{ maxWidth: 'max-content', alignSelf: 'center' }}
                >
                  <FormattedMessage id='createNewTemplate' defaultMessage='Luo uusi template' />
                </Button>
              )}
            </Box>
            {templateDraft && (
              <Box
                id='draftContainer'
                sx={{ '&>div': { boxShadow: `0px 0px 0px 1px ${theme.palette.secondary.main}` } }}
              >
                <TemplateItem template={templateDraft} variant='draft' />
              </Box>
            )}
            {Array.isArray(templates) &&
              filteredTemplates(templates).map((template) => (
                <TemplateItem key={template._id} template={template} variant='noEdit' />
              ))}
            {Array.isArray(templates) && templates.length === 0 && !templateDraft && (
              <Alert
                message={
                  <FormattedMessage
                    id='noTemplatesCreated'
                    defaultMessage='Et ole luonut yhtään templatea vielä.'
                  />
                }
              />
            )}
          </Stack>
        </>
      )}
    </Stack>
  )
}

export default TemplatesContainer
