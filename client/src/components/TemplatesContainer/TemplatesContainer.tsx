import AddIcon from '@mui/icons-material/Add'
import { Button, Stack, Typography, CircularProgress, Box } from '@mui/material'
import { TemplateItem } from '../common'
import { FormattedMessage } from 'react-intl'
import { useTemplateStore } from '../../store/templateStore'
import { useEffect } from 'react'
import Alert from '../common/Alert'
import { useUserStore } from '../../store/userStore'

/**
 * Page container for url /templates
 */
const TemplatesContainer = () => {
  const {
    fetching,
    templates,
    templateDraft,
    resetTemplates,
    createTemplateDraft,
    deleteTemplateDraft,
    createTemplate
  } = useTemplateStore()
  const { userId } = useUserStore()

  const handleCreateTemplateDraft = () => {
    createTemplateDraft(userId)
  }
  const handleDeleteTemplateDraft = () => {
    deleteTemplateDraft()
  }
  const handleCreateTemplate = () => {
    createTemplate()
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
            <Box display='flex' justifyContent='space-between'>
              <Typography variant='h6'>
                <FormattedMessage id='templates' defaultMessage='Templatet' />
              </Typography>
              {!templateDraft && (
                <Button
                  onClick={handleCreateTemplateDraft}
                  startIcon={<AddIcon />}
                  sx={{ maxWidth: 'max-content', alignSelf: 'center' }}
                >
                  <FormattedMessage id='createNewTemplate' defaultMessage='Luo uusi template' />
                </Button>
              )}
            </Box>
            {templateDraft && <TemplateItem template={templateDraft} isDraft />}
            {Array.isArray(templates) &&
              templates.map((template) => (
                <TemplateItem key={template.title} template={template} />
              ))}
          </Stack>
        </>
      )}
    </Stack>
  )
}

export default TemplatesContainer
