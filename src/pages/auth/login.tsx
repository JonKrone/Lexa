import { TextField } from '@mui/material'
import { FC } from 'react'
import { useLocation } from 'wouter'
import { SubmitButton } from '../../components/SubmitButton'
import { useSignInWithOtp } from '../../queries/auth'

export const Login: FC = () => {
  const [, setLocation] = useLocation()
  const { mutateAsync: signInWithOtp, isPending } = useSignInWithOtp()

  const handleSubmit = async (formData: FormData) => {
    const email = formData.get('email') as string
    await signInWithOtp(email)

    const params = new URLSearchParams(window.location.search)
    const nextParam = params.get('next')
    const nextPath = nextParam ? decodeURIComponent(nextParam) : '/home'
    setLocation(nextPath)
  }

  return (
    <form noValidate autoComplete="off" action={handleSubmit}>
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
        {isPending ? 'Sending...' : 'Sign In'}
      </SubmitButton>
    </form>
  )
}
