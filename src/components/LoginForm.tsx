import { Alert, Box, TextField } from '@mui/material'
import { useEffect, useState } from 'react'
import { otpStorage } from '../lib/otpStorage'
import { useSignInWithEmailOtp, useVerifyEmailOtp } from '../queries/auth'
import { OtpInput } from './OtpInput'
import { SubmitButton } from './SubmitButton'
import { Body2 } from './Typography'

interface LoginFormProps {}

const OTP_EXPIRY_MINUTES = 60

export const LoginForm: React.FC<LoginFormProps> = () => {
  const [email, setEmail] = useState('')
  const [step, setStep] = useState<'email' | 'otp'>('email')
  const [isLoadingState, setIsLoadingState] = useState(true)
  const [otpStartTime, setOtpStartTime] = useState<number | undefined>()

  const {
    mutateAsync: signInWithEmailOtp,
    error: sendError,
    isPending: isSending,
    isSuccess: otpSent,
  } = useSignInWithEmailOtp()

  const {
    mutateAsync: verifyEmailOtp,
    error: verifyError,
    isPending: isVerifying,
  } = useVerifyEmailOtp()

  // Load persisted state on component mount
  useEffect(() => {
    const loadPersistedState = async () => {
      try {
        const savedState = await otpStorage.get()

        if (savedState) {
          const isExpired = await otpStorage.isExpired(savedState)

          // If the OTP hasn't expired, restore the state
          if (!isExpired && savedState.step === 'otp') {
            setEmail(savedState.email)
            setStep(savedState.step)
            setOtpStartTime(savedState.timestamp)
          } else {
            // Clear expired state
            await otpStorage.clear()
          }
        }
      } catch (error) {
        console.error('Error loading OTP flow state:', error)
      } finally {
        setIsLoadingState(false)
      }
    }

    loadPersistedState()
  }, [])

  const sendOtp = async (formData: FormData) => {
    const emailValue = formData.get('email') as string
    if (!emailValue) return false

    try {
      await signInWithEmailOtp(emailValue)
      const timestamp = Date.now()
      setEmail(emailValue)
      setStep('otp')
      setOtpStartTime(timestamp)

      await otpStorage.set({
        email: emailValue,
        step: 'otp',
        timestamp,
        expiryMinutes: OTP_EXPIRY_MINUTES,
      })
    } catch (error) {
      console.error('Error sending OTP:', error)
    }
  }

  const verifyOtp = async (token: string) => {
    try {
      await verifyEmailOtp({ email, token })
      // Clear state on successful verification
      await otpStorage.clear()
      // Success - user will be redirected by auth guard
    } catch (error) {
      console.error('Error verifying OTP:', error)
    }
  }

  const handleResendOtp = async () => {
    try {
      await signInWithEmailOtp(email)
      const timestamp = Date.now()
      setOtpStartTime(timestamp)

      await otpStorage.set({
        email,
        step: 'otp',
        timestamp,
        expiryMinutes: OTP_EXPIRY_MINUTES,
      })
    } catch (error) {
      console.error('Error resending OTP:', error)
    }
  }

  const goBackToEmail = async () => {
    setStep('email')
    setEmail('')
    await otpStorage.clear()
  }

  // Show loading state while checking for persisted state
  if (isLoadingState) {
    return (
      <Box sx={{ textAlign: 'center', py: 2 }}>
        <Body2>Loading...</Body2>
      </Box>
    )
  }

  if (step === 'otp') {
    return (
      <Box>
        <Body2 mt={2} mb={2}>
          Verify Your Email
        </Body2>
        <OtpInput
          email={email}
          onComplete={verifyOtp}
          onResend={handleResendOtp}
          isLoading={isVerifying || isSending}
          error={verifyError?.message || sendError?.message}
          expiryMinutes={OTP_EXPIRY_MINUTES}
          startTime={otpStartTime}
        />
        <SubmitButton
          variant="text"
          fullWidth
          onClick={goBackToEmail}
          sx={{ mt: 2 }}
        >
          Use Different Email
        </SubmitButton>
      </Box>
    )
  }

  return (
    <form noValidate autoComplete="off" action={sendOtp}>
      <Body2 mt={2}>Login or Signup</Body2>
      <TextField
        name="email"
        label="Email"
        variant="outlined"
        type="email"
        fullWidth
        defaultValue={__DEBUG__ ? 'jonathankrone@gmail.com' : ''}
        autoFocus
        margin="normal"
        placeholder="Enter your email"
        required
      />
      <SubmitButton variant="contained" color="primary" fullWidth>
        {isSending ? 'Sending...' : 'Continue'}
      </SubmitButton>
      {sendError && (
        <Alert severity="error" sx={{ mt: 2 }}>
          <Body2>{sendError.message}</Body2>
        </Alert>
      )}
      {otpSent && (
        <Alert severity="info" sx={{ mt: 2 }}>
          <Body2>Please check your email for a 6-digit code.</Body2>
        </Alert>
      )}
    </form>
  )
}
