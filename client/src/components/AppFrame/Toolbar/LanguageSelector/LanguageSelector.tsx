import { useContext } from 'react'
import { IntlContext } from '../../../TranslationProvider/TranslationProvider'
import { MenuItem, Select, SelectChangeEvent } from '@mui/material'

const LanguageSelector = () => {
  const intlContext = useContext(IntlContext)
  return (
    <>
      {intlContext && (
        <Select
          value={intlContext.locale}
          onChange={(e: SelectChangeEvent<string>) => intlContext.changeLanguage(e.target.value)}
        >
          {Object.keys(intlContext.locales).map((option) => (
            <MenuItem key={option} value={option}>
              {intlContext.locales[option]}
            </MenuItem>
          ))}
        </Select>
      )}
    </>
  )
}

export default LanguageSelector
