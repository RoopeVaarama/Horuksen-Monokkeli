import {
  Checkbox,
  FormControlLabel,
  Grid,
  InputAdornment,
  Stack,
  styled,
  TextField,
  Typography
} from '@mui/material'
import { SearchRounded } from '@mui/icons-material'
import { FormattedMessage } from 'react-intl'
import StyledPaper from '../../common/StyledPaper/StyledPaper'
import FileGroup from './FileGroup'

const files = []
const fileGroups = ['Laskut Reaktorilta', 'CV:t']

const SearchField = styled(TextField)(() => ({
  variant: 'outlined',
  width: '100%'
}))
const UtilityBar = styled(Grid)(() => ({
  padding: '15px'
}))

const StyledDiv = styled('div')(() => ({
  width: '100vh'
}))

const FilesPage = ({ isComplete, onComplete }: { isComplete: boolean; onComplete: () => void }) => {
  return (
    <StyledPaper sx={{ width: 'calc(100% - 48px)' }}>
      <StyledDiv>
        <UtilityBar container alignItems='center'>
          <Grid item sx={{ width: 1 / 3 }}>
            <FormControlLabel
              control={<Checkbox name='chooseAll' size='small' />}
              label={
                <Typography variant='subtitle2'>
                  <FormattedMessage id='chooseAll' defaultMessage='Valitse kaikki' />
                </Typography>
              }
            />
          </Grid>
          <Grid item sx={{ width: 2 / 3 }}>
            <SearchField
              size='small'
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    <SearchRounded />
                  </InputAdornment>
                )
              }}
            />
          </Grid>
        </UtilityBar>
        <Stack
          spacing={2}
          component='ol'
          sx={{
            width: '100%',
            pl: 0,
            listStyleType: 'none',
            my: 2
          }}
        >
          {fileGroups.map((i) => (
            <FileGroup key={i} groupName={i} />
          ))}
        </Stack>
      </StyledDiv>
    </StyledPaper>
  )
}

export default FilesPage

/**
 * return (
    <Stack display='flex' alignItems='center' spacing={2}>
      <Typography>
        <FormattedMessage id='selectFiles' defaultMessage='Valitse tiedostot' />
      </Typography>
      <Button
        id='placeholderButton'
        onClick={onComplete}
        sx={{ width: 'max-content' }}
        variant='contained'
      >
        {isComplete ? 'Merkitse keskeneräiseksi' : 'Merkitse valmiiksi'}
      </Button>
    </Stack>
  )
 */
