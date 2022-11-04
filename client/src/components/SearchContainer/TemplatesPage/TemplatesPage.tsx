import { Typography, Stack } from '@mui/material'
import { Alert, TemplateItem } from '../../common'
import { useSearchStore } from '../../../store/searchStore'
import { useTemplateStore } from '../../../store/templateStore'
import { FormattedMessage } from 'react-intl'

const TemplatesPage = () => {
  const { searchTemplates } = useSearchStore()
  const { templates } = useTemplateStore()

  const removeSelected = () => {
    return templates.filter((template) => !searchTemplates.find((s) => s._id === template._id))
  }

  return (
    <Stack id='templatesPage' spacing={1} width='100%'>
      <Typography variant='h6' sx={{ py: 1 }}>
        <FormattedMessage id='search' defaultMessage='Haku' />
      </Typography>
      {searchTemplates.map((template, i) => (
        <TemplateItem key={template.title} template={template} variant='searchSelected' />
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
      <Typography variant='h6' sx={{ pt: 2, pb: 1 }}>
        <FormattedMessage
          id='selectTemplatesForSearch'
          defaultMessage='Valitse templatet, joita käyttää haussa'
        />
      </Typography>
      {Array.isArray(templates) &&
        removeSelected().map((template) => (
          <TemplateItem key={template.title} template={template} variant='searchOption' />
        ))}
      {searchTemplates.length === templates.length && (
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
