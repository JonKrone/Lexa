import { Box, Fade, IconButton, TextField } from '@mui/material'
import { Check, ChevronsDown, ChevronsUp, X } from 'lucide-react'
import { FC, useActionState } from 'react'
import {
  masteryLevelForTimesCorrect,
  useCreateOrUpdateUserPhrase,
  useUserPhrase,
} from '../../queries/user-phrase'
import { ShadowSafeTooltip } from '../ShadowSafeTooltip'
import { Subtitle1 } from '../Typography'

interface QuickCheckQuizProps {
  original: string
  wordGender: string
  afterSubmit?: (success: boolean) => void
}

export const QuickCheckQuiz: FC<QuickCheckQuizProps> = ({
  original,
  afterSubmit,
  wordGender,
}) => {
  const userPhrase = useUserPhrase(original)
  const updateUserPhrase = useCreateOrUpdateUserPhrase()

  const [result, action] = useActionState((_: any, formData: FormData) => {
    const userAttempt = formData.get('quickCheck') as string
    const success = areStringsMatching(userAttempt, original)

    afterSubmit?.(success)

    const { times_correct = 0, times_incorrect = 0 } = userPhrase || {}
    if (success) {
      const nextCorrect = times_correct + 1
      const nextLevel = masteryLevelForTimesCorrect(nextCorrect)

      updateUserPhrase.mutate({
        phrase_text: original,
        times_correct: nextCorrect,
        mastery_level: nextLevel,
      })
    } else {
      updateUserPhrase.mutate({
        phrase_text: original,
        times_incorrect: times_incorrect + 1,
      })
    }

    return { success }
  }, null)

  if (result) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 1,
        }}
      >
        <Subtitle1 color="textSecondary">
          {original}
          {wordGender !== 'N/A' && ` (${wordGender})`}
        </Subtitle1>
        <Fade in>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {result.success ? (
              <Check color="green" size={20} />
            ) : (
              <X color="red" size={20} />
            )}
            <ShadowSafeTooltip title="See more often">
              <IconButton>
                <ChevronsUp color="orange" size={20} />
              </IconButton>
            </ShadowSafeTooltip>
            <ShadowSafeTooltip title="See less often">
              <IconButton>
                <ChevronsDown color="lightblue" size={20} />
              </IconButton>
            </ShadowSafeTooltip>
          </div>
        </Fade>
      </Box>
    )
  }

  return (
    <form action={action} style={{ display: 'flex', gap: 1 }}>
      <TextField
        name="quickCheck"
        variant="outlined"
        fullWidth
        placeholder="Translate to unlock"
        autoFocus
        autoComplete="off"
        slotProps={{
          input: {
            slotProps: {
              input: {
                sx: {
                  py: 1,
                  px: 2,
                },
              },
            },
          },
        }}
      />
    </form>
  )
}

function normalizeString(
  str: string,
  removeDiacritics: boolean = true,
): string {
  let normalizedStr = str
    .replace(/\s+/g, ' ')
    .replace(/['']/g, '') // Remove apostrophes
    .replace(/["""]/g, '') // Remove quotes
    .replace(/[-–—]/g, '') // Remove dashes
    .replace(/[.,!?]/g, '') // Remove punctuation
    .trim()
    .toLowerCase()

  if (removeDiacritics) {
    normalizedStr = normalizedStr
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
  }

  return normalizedStr
}

function areStringsMatching(a: string, b: string): boolean {
  return normalizeString(a) === normalizeString(b)
}
