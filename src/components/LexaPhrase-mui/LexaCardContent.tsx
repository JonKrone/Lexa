import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  IconButton,
  styled,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material'
import { GenerateObjectResult } from 'ai'
import {
  MessageSquareQuote,
  Settings,
  Star,
  ThumbsDown,
  ThumbsUp,
} from 'lucide-react'
import React, { useState } from 'react'
import { ITranslationDetails } from '../../ai/generateTranslationDetails'
import { useUser } from '../../queries/auth'
import { useTranslationDetails } from '../../queries/translation-details'

import { LoginForm } from '../LoginForm'
import { H6 } from '../Typography'
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
          title={
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
                <Typography variant="subtitle1" color="textSecondary">
                  {original} {details?.wordGender && `(${details?.wordGender})`}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, auto)',
                  gap: 0.5,
                }}
              >
                <StyledIconButton
                  onClick={onFavoriteToggle}
                  aria-label="favorite"
                >
                  <Star fill={isFavorited ? 'gold' : 'gray'} />
                </StyledIconButton>
                <StyledIconButton
                  onClick={handleThumbsUp}
                  color={thumbsUp ? 'primary' : 'default'}
                  aria-label="thumbs up"
                  sx={{
                    padding: 1,
                    '& > svg': {
                      height: 20,
                      width: 20,
                    },
                  }}
                >
                  <ThumbsUp />
                </StyledIconButton>
                <StyledIconButton
                  onClick={handleThumbsDown}
                  color={thumbsDown ? 'primary' : 'default'}
                  aria-label="thumbs down"
                >
                  <ThumbsDown />
                </StyledIconButton>
              </Box>
            </Box>
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

const StyledIconButton = styled(IconButton)({
  padding: 1,
  '& > svg': {
    height: 20,
    width: 20,
  },
})

interface AuthGuardProps {
  children: React.ReactNode
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const user = useUser()
  // const session = useSession()
  // console.log('session', session)
  // console.log('user', user)

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
