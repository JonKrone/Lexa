import { Alert, TextField } from '@mui/material'
import { useSignInWithOtp } from '../queries/auth'

import { SubmitButton } from './SubmitButton'
import { Body2 } from './Typography'

interface LoginFormProps {}

export const LoginForm: React.FC<LoginFormProps> = () => {
  const {
    mutateAsync: signInWithOtp,
    error,
    isPending,
    isSuccess,
  } = useSignInWithOtp()

  const signIn = async (formData: FormData) => {
    const email = formData.get('email') as string
    if (!email) return false

    try {
      await signInWithOtp(email)
    } catch (error) {
      console.error('Error signing in with OTP:', error)
    }
  }

  return (
    <form noValidate autoComplete="off" action={signIn}>
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
        {isPending ? 'Sending...' : 'Continue'}
      </SubmitButton>
      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          <Body2>{error.message}</Body2>
        </Alert>
      )}
      {isSuccess && (
        <Alert severity="info" sx={{ mt: 2 }}>
          <Body2>Please check your email for a login link.</Body2>
        </Alert>
      )}
    </form>
  )
}
