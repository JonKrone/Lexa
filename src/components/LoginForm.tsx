import { TextField } from '@mui/material'
import { useSignInWithOtp } from '../queries/auth'

import { SubmitButton } from './SubmitButton'
import { Body2 } from './Typography'

interface LoginFormProps {
  onLogin?: () => void
}

export const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
  const { mutateAsync: signInWithOtp, isPending } = useSignInWithOtp()

  const handleSubmit = async (formData: FormData) => {
    const email = formData.get('email') as string
    await signInWithOtp(email)
    onLogin?.()
  }

  return (
    <form noValidate autoComplete="off" action={handleSubmit}>
      <Body2 mt={2}>Login or Signup</Body2>
      <TextField
        name="email"
        label="Email"
        variant="outlined"
        type="email"
        fullWidth
        margin="normal"
        placeholder="Enter your email"
      />
      <SubmitButton variant="contained" color="primary" fullWidth>
        {isPending ? 'Sending...' : 'Continue'}
      </SubmitButton>
    </form>
  )
}
