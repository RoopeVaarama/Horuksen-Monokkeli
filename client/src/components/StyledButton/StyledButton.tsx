import { Button, Palette, PaletteColor, styled } from '@mui/material'

type PaletteKey = keyof {
  [Key in keyof Palette as Palette[Key] extends PaletteColor ? Key : never]: true
}
const StyledButton = styled(Button)(({ theme, color }) => {
  const defaultColor: PaletteKey = 'primary'
  const col: PaletteKey = !color || color === 'inherit' ? defaultColor : color
  return {
    backgroundColor: theme.palette.primary.main,
    color: `${theme.palette.background.default}!important`,
    borderRadius: 3,
    minWidth: 'max-content',
    padding: '8px 16px',
    svg: {
      color: color === 'inherit' ? 'inherit' : theme.palette[col].main,
      width: 26,
      height: 26
    },
    '&:hover': {
      backgroundColor: color === 'inherit' ? 'inherit' : theme.palette[col].light,
      boxShadow: '2px 4px 5px rgba(0, 0, 0, 0.2)'
    },
    '&:active': {
      backgroundColor: color === 'inherit' ? 'inherit' : theme.palette[col].dark,
      boxShadow: 'none'
    }
  }
})

export default StyledButton
