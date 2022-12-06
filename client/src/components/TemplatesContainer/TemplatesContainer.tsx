import AddIcon from '@mui/icons-material/Add'
import { Button, Stack, Typography, CircularProgress, Box, useTheme } from '@mui/material'
import { TemplateItem, ToggleButton } from '../common'
import { FormattedMessage } from 'react-intl'
import { useTemplateStore } from '../../store/templateStore'
import { useEffect, useState } from 'react'
import Alert from '../common/Alert'
import { Template } from '../../types'
import { getUid } from '../../tools/auth'

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
  const [openTabs, setOpenTabs] = useState<boolean>(true)

  const filteredTemplates = (oldTemplates: Template[]) => {
    if (templateDraft?._id) {
      return oldTemplates.filter((template) => template._id !== templateDraft._id)
    } else {
      return oldTemplates
    }
  }
  const handleCreateTemplateDraft = () => {
    const uid = getUid()
    if (uid) {
      createTemplateDraft(uid)
    }
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
    const uid = getUid()
    if (uid) {
      resetTemplates(uid)
    }
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
            <Box
              display='flex'
              flexDirection={{ xs: 'column', sm: 'row' }}
              justifyContent='space-between'
              alignItems='start'
              className='templatesListheader'
            >
              <Stack direction='row' spacing={2}>
                <Typography variant='h6'>
                  <FormattedMessage id='templates' defaultMessage='Templatet' />
                </Typography>
                <ToggleButton open={openTabs} setOpen={setOpenTabs} />
              </Stack>
              {!templateDraft && (
                <Button
                  id='newTemplateBtn'
                  onClick={handleCreateTemplateDraft}
                  startIcon={<AddIcon />}
                  sx={{
                    maxWidth: 'max-content',
                    alignSelf: { xs: 'start', sm: 'center' },
                    mt: { xs: 1, sm: 0 }
                  }}
                >
                  <FormattedMessage id='createNewTemplate' defaultMessage='Luo uusi template' />
                </Button>
              )}
            </Box>
            {templateDraft && (
              <Box
                id='draftContainer'
                sx={{ '&>div': { boxShadow: `0px 0px 0px 1px ${theme.palette.success.main}` } }}
              >
                <TemplateItem template={templateDraft} variant='draft' toggleOpen={openTabs} />
              </Box>
            )}
            {Array.isArray(templates) &&
              filteredTemplates(templates).map((template) => (
                <TemplateItem
                  key={template._id}
                  template={template}
                  variant='noEdit'
                  toggleOpen={openTabs}
                />
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
