import { Box, Button, ButtonProps, LinearProgress } from '@mui/material'
import { FC } from 'react'
import { useFormStatus } from 'react-dom'

export interface SubmitButtonProps extends ButtonProps {}

export const SubmitButton: FC<SubmitButtonProps> = ({ children, ...props }) => {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" disabled={pending} {...props}>
      {children}
      {pending && (
        <Box
          sx={{
            width: '100%',
            height: '100%',
            position: 'absolute',
            bottom: 0,
          }}
        >
          <LinearProgress
            sx={{
              height: '100%',
              opacity: 0.25,
              borderRadius: 1,
            }}
          />
        </Box>
      )}
    </Button>
  )
}
