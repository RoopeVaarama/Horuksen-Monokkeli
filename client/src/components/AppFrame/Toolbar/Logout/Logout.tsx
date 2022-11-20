import { useContext } from 'react'
import { IntlContext } from '../../../TranslationProvider/TranslationProvider'
import { ToggleButton, ToggleButtonGroup } from '@mui/material'

const Logout = () => {
  const intlContext = useContext(IntlContext)
  return (
    <>
      {intlContext && (
        <ToggleButtonGroup
          sx={{ '.MuiButtonBase-root': { borderRadius: '0px' } }}
          color='primary'
          value={intlContext.locale}
          exclusive
          onChange={(e: React.MouseEvent<HTMLElement>, value: string) =>
            intlContext.changeLanguage(value)
          }
        >
          {Object.keys(intlContext.locales).map((option) => (
            <ToggleButton key={option} value={option}>
              {intlContext.locales[option]}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      )}
    </>
  )
}

export default Logout
