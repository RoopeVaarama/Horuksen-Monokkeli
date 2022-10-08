import { Button, Stack, Step, StepButton, Stepper, styled, Typography } from '@mui/material'
import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector'
import { useState } from 'react'
import { FormattedMessage } from 'react-intl'

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
  svg: {
    color: `${
      disabled
        ? theme.palette.grey[400]
        : active
        ? theme.palette.primary.main
        : completed
        ? theme.palette.success.main
        : theme.palette.text.primary
    }!important`
  },
  '.MuiStepLabel-label': {
    color: `${
      disabled
        ? theme.palette.text.disabled
        : active
        ? theme.palette.primary.main
        : theme.palette.text.primary
    }!important`
  }
}))

const SearchContainer = () => {
  const [activeStep, setActiveStep] = useState<number>(0)
  const [completed, setCompleted] = useState<readonly boolean[]>(
    new Array<boolean>(STEPS.length).fill(false)
  )

  const handleStep = (step: number) => () => {
    setActiveStep(step)
  }

  const handleCompletion = (state: boolean) => {
    const newCompleted = [...completed]
    newCompleted[activeStep] = state
    if (state && activeStep + 1 !== STEPS.length) {
      // if step has just been marked as completed, move the user to the next step
      const newActiveStep = isDisabled(activeStep + 1)
        ? newCompleted.findIndex((c) => !c)
        : activeStep + 1
      setActiveStep(newActiveStep)
    }
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

  return (
    <Stack spacing={2}>
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
      <Stack display='flex' alignItems='center' pt={3} spacing={1}>
        <Typography>Sivu: {activeStep + 1}</Typography>
        <FormattedMessage
          id={STEPS[activeStep].intlId}
          defaultMessage={STEPS[activeStep].defaultMessage}
        />
        {activeStep !== STEPS.length - 1 && (
          <Button
            onClick={() => handleCompletion(!completed[activeStep])}
            sx={{ width: 'max-content' }}
            variant='contained'
          >
            {completed[activeStep] ? 'Merkitse keskeneräiseksi' : 'Merkitse valmiiksi'}
          </Button>
        )}
      </Stack>
    </Stack>
  )
}

export default SearchContainer
