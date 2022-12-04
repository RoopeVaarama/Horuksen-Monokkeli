import { Typography, Stack } from '@mui/material'
import { Alert, TemplateItem, ToggleButton } from '../../common'
import { useSearchStore } from '../../../store/searchStore'
import { useTemplateStore } from '../../../store/templateStore'
import { FormattedMessage } from 'react-intl'
import { useState } from 'react'

const TemplatesPage = () => {
  const { searchTemplates } = useSearchStore()
  const { templates } = useTemplateStore()
  const [openTabs, setOpenTabs] = useState<boolean>(true)

  const removeSelected = () => {
    return templates.filter((template) => !searchTemplates.find((s) => s._id === template._id))
  }

  return (
    <Stack id='templatesPage' spacing={1} width='100%'>
      <Typography variant='h6' sx={{ py: 1 }}>
        <FormattedMessage id='search' defaultMessage='Haku' />
      </Typography>
      {searchTemplates.map((template, i) => (
        <TemplateItem
          key={template.title}
          template={template}
          variant='searchSelected'
          toggleOpen
        />
      ))}
      {searchTemplates.length === 0 && (
        <Alert
          message={
            <FormattedMessage
              id='noTemplatesSelected'
              defaultMessage='Et ole valinnut vielä yhtään templatea!'
            />
          }
        />
      )}
      <Stack direction='row' spacing={2} alignItems='center' pt={2} pb={1}>
        <Typography variant='h6'>
          <FormattedMessage
            id='selectTemplatesForSearch'
            defaultMessage='Valitse templatet, joita käyttää haussa'
          />
        </Typography>
        <ToggleButton open={openTabs} setOpen={setOpenTabs} />
      </Stack>
      {Array.isArray(templates) &&
        removeSelected().map((template) => (
          <TemplateItem
            key={template.title}
            template={template}
            variant='searchOption'
            toggleOpen={openTabs}
          />
        ))}
      {Array.isArray(templates) && searchTemplates.length === templates.length && (
        <Alert
          message={
            <FormattedMessage
              id='noTemplatestoSelected'
              defaultMessage='Ei templateja jäljellä valittavaksi.'
            />
          }
        />
      )}
    </Stack>
  )
}

export default TemplatesPage
