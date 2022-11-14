import { CircularProgress, Stack, Step, StepButton, Stepper, styled } from '@mui/material'
import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector'
import { useEffect, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { useSearchStore } from '../../store/searchStore'
import { useTemplateStore } from '../../store/templateStore'
import { useUserStore } from '../../store/userStore'
import FilesPage from './FilesPage'
import ResultsPage from './ResultsPage'
import TemplatesPage from './TemplatesPage'

const STEPS = [
  { intlId: 'selectKeywords', defaultMessage: 'Valitse avainsanat' },
  { intlId: 'selectFiles', defaultMessage: 'Valitse tiedostot' },
  { intlId: 'examineResults', defaultMessage: 'Tarkastele tuloksia' }
]

const StyledStepConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.active},&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderTopWidth: 3,
      borderRadius: 1
    }
  }
}))

const StyledStep = styled(Step)(({ theme, completed, active, disabled }) => ({
  '.MuiButtonBase-root': {
    paddingTop: `${theme.spacing(1)}!important`,
    paddingBottom: `${theme.spacing(1)}!important`
  },
  svg: {
    color: `${
      disabled
        ? theme.palette.grey[400]
        : active
        ? theme.palette.secondary.main
        : completed
        ? theme.palette.success.main
        : theme.palette.primary.main
    }!important`
  },
  '.MuiStepLabel-label': {
    color: `${
      disabled
        ? theme.palette.text.disabled
        : active
        ? theme.palette.secondary.dark
        : theme.palette.text.primary
    }!important`
  },
  [theme.breakpoints.down('sm')]: {
    '.MuiStepLabel-root': {
      display: 'flex',
      flexDirection: 'column',
      '.MuiStepLabel-iconContainer': {
        paddingBottom: theme.spacing(1),
        paddingRight: 0
      }
    }
  }
}))

const SearchContainer = () => {
  const [activeStep, setActiveStep] = useState<number>(0)
  const [completed, setCompleted] = useState<readonly boolean[]>(
    new Array<boolean>(STEPS.length).fill(false)
  )
  const { searchTemplates, resetSearchParamaters, fileIDs } = useSearchStore()
  const { fetching, resetTemplates } = useTemplateStore()
  const { userId } = useUserStore()

  const handleStep = (step: number) => () => {
    setActiveStep(step)
  }

  const handleCompletion = (state: boolean) => {
    const newCompleted = [...completed]
    newCompleted[activeStep] = state
    if (stepsBeforeFinalAreCompleted(newCompleted)) {
      // mark final step as completed if every other step is completed as well
      newCompleted[STEPS.length - 1] = true
    }
    if (!state) {
      // mark final step as uncompleted if another step becomes uncompleted as well
      newCompleted[STEPS.length - 1] = false
    }
    setCompleted(newCompleted)
  }

  const stepsBeforeFinalAreCompleted = (completedArr: readonly boolean[]) => {
    return completedArr.slice(0, -1).every((status) => status)
  }

  const isDisabled = (step: number) => {
    return step === STEPS.length - 1 && !stepsBeforeFinalAreCompleted(completed)
  }

  useEffect(() => {
    handleCompletion(searchTemplates.length > 0)
  }, [searchTemplates])

  useEffect(() => {
    handleCompletion(fileIDs.length > 0)
  }, [fileIDs])

  useEffect(() => {
    resetSearchParamaters()
    resetTemplates(userId)
  }, [])

  return (
    <Stack spacing={2} width='100%'>
      <Stepper nonLinear connector={<StyledStepConnector />} sx={{ py: 2 }}>
        {completed &&
          STEPS.map((step, i) => (
            <StyledStep
              key={step.intlId}
              completed={completed[i]}
              active={i === activeStep}
              disabled={isDisabled(i)}
            >
              <StepButton onClick={handleStep(i)}>
                <FormattedMessage id={step.intlId} defaultMessage={step.defaultMessage} />
              </StepButton>
            </StyledStep>
          ))}
      </Stepper>
      <Stack width='100%' display='flex' alignItems='center'>
        {activeStep === 0 &&
          (fetching ? <CircularProgress color='secondary' /> : <TemplatesPage />)}
        {activeStep === 1 && <FilesPage />}
        {activeStep === 2 && <ResultsPage />}
      </Stack>
    </Stack>
  )
}

export default SearchContainer
