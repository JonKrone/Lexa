import { Alert, Box, Button, TextField } from '@mui/material'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Body2 } from './Typography'

interface OtpInputProps {
  onComplete: (otp: string) => void
  onResend: () => void
  isLoading?: boolean
  error?: string | null
  email: string
  otpLength?: number
  expiryMinutes?: number
  startTime?: number // Timestamp when OTP was sent (for restored state)
}

export const OtpInput: React.FC<OtpInputProps> = ({
  onComplete,
  onResend,
  isLoading = false,
  error,
  email,
  otpLength = 6,
  expiryMinutes = 60,
  startTime,
}) => {
  const [otp, setOtp] = useState<string[]>(new Array(otpLength).fill(''))
  const [canResend, setCanResend] = useState(false)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  // Calculate initial time left based on startTime or default to full duration
  const getInitialTimeLeft = () => {
    if (startTime) {
      const elapsed = Math.floor((Date.now() - startTime) / 1000)
      const remaining = expiryMinutes * 60 - elapsed
      return Math.max(0, remaining)
    }
    return expiryMinutes * 60
  }

  const [timeLeft, setTimeLeft] = useState(getInitialTimeLeft())

  // Countdown timer
  useEffect(() => {
    if (timeLeft <= 0) {
      setCanResend(true)
      return
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setCanResend(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft])

  // Format time display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  // Handle input change
  const handleChange = useCallback(
    (index: number, value: string) => {
      // Only allow digits
      if (value && !/^\d$/.test(value)) return

      const newOtp = [...otp]
      newOtp[index] = value

      setOtp(newOtp)

      // Auto-advance to next input
      if (value && index < otpLength - 1) {
        inputRefs.current[index + 1]?.focus()
      }

      // Check if OTP is complete
      if (
        newOtp.every((digit) => digit !== '') &&
        newOtp.join('').length === otpLength
      ) {
        onComplete(newOtp.join(''))
      }
    },
    [otp, otpLength, onComplete],
  )

  // Handle backspace
  const handleKeyDown = useCallback(
    (index: number, e: React.KeyboardEvent) => {
      if (e.key === 'Backspace') {
        if (otp[index]) {
          // Clear current input
          const newOtp = [...otp]
          newOtp[index] = ''
          setOtp(newOtp)
        } else if (index > 0) {
          // Move to previous input and clear it
          const newOtp = [...otp]
          newOtp[index - 1] = ''
          setOtp(newOtp)
          inputRefs.current[index - 1]?.focus()
        }
      }
    },
    [otp],
  )

  // Handle paste
  const handlePaste = useCallback(
    (e: React.ClipboardEvent) => {
      e.preventDefault()
      const pastedData = e.clipboardData
        .getData('text/plain')
        .replace(/\D/g, '')

      if (pastedData.length === otpLength) {
        const newOtp = pastedData.split('')
        setOtp(newOtp)
        onComplete(pastedData)
        // Focus last input
        inputRefs.current[otpLength - 1]?.focus()
      }
    },
    [otpLength, onComplete],
  )

  // Handle resend
  const handleResend = () => {
    setOtp(new Array(otpLength).fill(''))
    setTimeLeft(expiryMinutes * 60)
    setCanResend(false)
    onResend()
    // Focus first input
    inputRefs.current[0]?.focus()
  }

  // Reset OTP when email changes
  useEffect(() => {
    setOtp(new Array(otpLength).fill(''))
    setTimeLeft(getInitialTimeLeft())
    setCanResend(getInitialTimeLeft() <= 0)
  }, [email, otpLength, expiryMinutes, startTime])

  return (
    <Box sx={{ width: '100%' }}>
      <Body2 sx={{ mb: 2, textAlign: 'center' }}>
        Enter the 6-digit code sent to <strong>{email}</strong>
      </Body2>

      <Box
        sx={{
          display: 'flex',
          gap: 1,
          justifyContent: 'center',
          mb: 2,
        }}
      >
        {otp.map((digit, index) => (
          <TextField
            key={index}
            inputRef={(el) => (inputRefs.current[index] = el)}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            variant="outlined"
            size="small"
            disabled={isLoading}
            inputProps={{
              maxLength: 1,
              style: {
                textAlign: 'center',
                fontSize: '1.5rem',
                fontWeight: 'bold',
              },
            }}
            sx={{
              width: 48,
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: digit ? 'primary.main' : 'grey.300',
                },
              },
            }}
            autoFocus={index === 0}
          />
        ))}
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          <Body2>{error}</Body2>
        </Alert>
      )}

      <Box sx={{ textAlign: 'center' }}>
        {timeLeft > 0 ? (
          <Body2 color="text.secondary">
            Code expires in {formatTime(timeLeft)}
          </Body2>
        ) : (
          <Body2 color="error.main">Code has expired</Body2>
        )}

        <Button
          onClick={handleResend}
          disabled={!canResend || isLoading}
          variant="text"
          size="small"
          sx={{ mt: 1 }}
        >
          {isLoading ? 'Sending...' : 'Resend Code'}
        </Button>
      </Box>
    </Box>
  )
}
