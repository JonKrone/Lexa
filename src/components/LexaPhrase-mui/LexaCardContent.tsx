import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Fade,
  IconButton,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material'
import { GenerateObjectResult } from 'ai'
import {
  Check,
  ChevronsDown,
  ChevronsUp,
  MessageSquareQuote,
  Settings,
  Star,
  X,
} from 'lucide-react'
import React, { useActionState, useState } from 'react'
import { ITranslationDetails } from '../../ai/generateTranslationDetails'
import { useSession, useUser } from '../../queries/auth'
import { useTranslationDetails } from '../../queries/translation-details'

import { LoginForm } from '../LoginForm'
import { ShadowSafeTooltip } from '../ShadowSafeTooltip'
import { H6, Subtitle1 } from '../Typography'

type TabValue = 'details' | 'notes' | 'quiz'

interface LexaCardContentProps {
  translation: string
  original: string
  context: string
}

/**
 * TODO: Before rendering the rest of the content, ask the user to write what they think the translation is
 * TODO: If not logged in, show the sign up/in button
 *
 * TODO: Allow users to add their own notes to the translation
 * TODO: Mastery Levels: New, Learning, Mastered based on..? Quiz progress; # of times seen; # of
 * times marked known
 * TODO: Translation toggle: Show/hide original word
 * TODO: Engagement metrics like words learned; streaks; or daily goals
 * TODO: Daily/Weekly challenges: quizzes on words learned or seen daily/weekly
 * TODO: Report issues: incorrect translation, suggest improvements, etc
 * TODO: Settings shortcut (new ideas: reminders for daily/weekly quizzes)
 *
 * TODO: Gracefully handle if there's no internet -- use chrome.ai(<joke about not being connected>)
 */
export function LexaCardContent({
  translation,
  original,
  context,
  // wordGender,
  // masteryLevel,
  // isFavorited,
  // onFavoriteToggle,
}: LexaCardContentProps) {
  const [tabValue, setTabValue] = useState<TabValue>('details')
  const [notes, setNotes] = useState('')
  const [thumbsUp, setThumbsUp] = useState(false)
  const [thumbsDown, setThumbsDown] = useState(false)

  const {
    data: translationDetails = {} as GenerateObjectResult<ITranslationDetails>,
  } = useTranslationDetails(original, translation, context)

  const masteryLevel = 'Learning'
  const isFavorited = false
  const onFavoriteToggle = () => {}
  const details = translationDetails.object

  const handleThumbsUp = () => {
    setThumbsUp((prev) => !prev)
    if (thumbsDown) setThumbsDown(false)
  }

  const handleThumbsDown = () => {
    setThumbsDown((prev) => !prev)
    if (thumbsUp) setThumbsUp(false)
  }

  return (
    <Card
      sx={{
        width: 300,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
    >
      <AuthGuard>
        <CardHeader
          sx={{
            pb: 0,
          }}
          title={
            <>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: '1fr auto',
                  alignItems: 'flex-start',
                  gap: 2,
                }}
              >
                <Box>
                  <Typography variant="h6">{translation}</Typography>
                </Box>
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, auto)',
                    gap: 0.5,
                  }}
                >
                  <ShadowSafeTooltip title="Favorite">
                    <IconButton
                      onClick={onFavoriteToggle}
                      aria-label="favorite"
                    >
                      <Star fill={isFavorited ? 'gold' : 'gray'} size={20} />
                    </IconButton>
                  </ShadowSafeTooltip>
                </Box>
              </Box>
              <QuickCheckQuiz
                original={original}
                wordGender={details?.wordGender}
              />
            </>
          }
        />
        <CardContent sx={{ pt: 0, pb: 0, flexGrow: 1 }}>
          <Tabs
            value={tabValue}
            onChange={(_, val) => setTabValue(val)}
            variant="fullWidth"
            indicatorColor="primary"
            textColor="primary"
          >
            <Tab label="Details" value="details" />
            <Tab label="Notes" value="notes" />
            <Tab label="Quiz" value="quiz" />
          </Tabs>
          <Box sx={{ marginTop: 2, overflowY: 'auto', height: 250 }}>
            {tabValue === 'details' && (
              <Box>
                <Typography variant="body2">
                  Mastery Level: {masteryLevel}
                </Typography>
                <Typography variant="subtitle1" sx={{ marginTop: 1 }}>
                  Contextual Examples
                </Typography>
                <Typography variant="body2">
                  {details?.formalUsage}
                  <br />
                  {details?.informalUsage}
                </Typography>
                <Typography variant="subtitle1" sx={{ marginTop: 1 }}>
                  Other Ways to Say
                </Typography>
                <Typography variant="body2">
                  {details?.otherWaysToSay.map(
                    ({ translation, explanation }) => (
                      <React.Fragment key={translation}>
                        {translation} - {explanation}
                        <br />
                      </React.Fragment>
                    ),
                  )}
                  <br />
                  Antonyms: {details?.antonyms.join(', ')}
                </Typography>
                <Typography variant="subtitle1" sx={{ marginTop: 1 }}>
                  Cultural Insights
                </Typography>
                <Typography variant="body2">
                  {details?.culturalInsights}
                </Typography>
              </Box>
            )}
            {tabValue === 'notes' && (
              <Box>
                <Typography variant="subtitle1">Your Notes</Typography>
                <TextField
                  variant="outlined"
                  fullWidth
                  multiline
                  minRows={6}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add your personal notes here..."
                />
              </Box>
            )}
            {tabValue === 'quiz' && (
              <Box>
                <Typography variant="subtitle1">Quick Quiz</Typography>
                <Typography variant="body2">
                  Quizzes are coming soon!
                </Typography>
                <Button variant="contained" sx={{ marginTop: 2 }}>
                  Start Quiz
                </Button>
              </Box>
            )}
          </Box>
        </CardContent>
        <CardActions sx={{ justifyContent: 'flex-end', padding: '8px 16px' }}>
          <IconButton aria-label="feedback">
            <MessageSquareQuote />
          </IconButton>
          <IconButton aria-label="settings">
            <Settings />
          </IconButton>
        </CardActions>
      </AuthGuard>
    </Card>
  )
}

interface QuickCheckQuizProps {
  original: string
  wordGender: string
  afterSubmit?: (success: boolean) => void
}

const normalizeString = (
  str: string,
  removeDiacritics: boolean = true,
): string => {
  let normalizedStr = str
    .replace(/\s+/g, ' ') // remove extra spaces
    .trim()
    .toLowerCase()

  if (removeDiacritics) {
    normalizedStr = normalizedStr
      .normalize('NFD') // break up accented characters into their base characters and diacritics
      .replace(/[\u0300-\u036f]/g, '') // remove the diacritics
  }

  return normalizedStr
}

const areStringsMatching = (a: string, b: string): boolean =>
  normalizeString(a) === normalizeString(b)

const QuickCheckQuiz: React.FC<QuickCheckQuizProps> = ({
  original,
  afterSubmit,
  wordGender,
}) => {
  // const { mutate: createWordInteraction } = useCreateWordInteraction()

  const [result, action] = useActionState((prev: any, formData: FormData) => {
    const userAttempt = formData.get('quickCheck') as string
    const success = areStringsMatching(userAttempt, original)

    afterSubmit?.(success)
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
          {wordGender && ` (${wordGender})`}
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
        placeholder="Your translation..."
        autoFocus
        slotProps={{
          // shrink the input
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

interface AuthGuardProps {
  children: React.ReactNode
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const user = useUser()
  const session = useSession()
  console.log('Card AuthGuard', { session, user })

  if (!user) {
    return (
      <>
        <CardHeader title={<H6>Sign in to continue</H6>} />
        <CardContent>
          <LoginForm />
        </CardContent>
      </>
    )
  }

  return <>{children}</>
}
