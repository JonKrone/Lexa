import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  IconButton,
  Skeleton,
  TextField,
  Typography,
  useTheme,
} from '@mui/material'
import { GenerateObjectResult } from 'ai'
import {
  LucideBookOpen,
  LucideClipboardPenLine,
  LucideNotebook,
  MessageSquareQuote,
  Star,
} from 'lucide-react'
import { FC, memo, useState } from 'react'
import { ITranslationDetails } from '../../ai/generateTranslationDetails'
import { useTranslationDetails } from '../../queries/translation-details'
import {
  useCreateOrUpdateUserPhrase,
  useUserPhrase,
} from '../../queries/user-phrase'
import { ShadowSafeTooltip } from '../ShadowSafeTooltip'
import { Body2, Subtitle1 } from '../Typography'
import { LexaCardAuthGuard } from './LexaCardAuthGuard'
import { PlayPhraseButton } from './PlayPhraseButton'
import { QuickCheckQuiz } from './QuickCheckQuiz'

const borderStyle = '1.5px solid rgba(255,255,255,0.1)'

type TabValue = 'details' | 'notes' | 'quiz' | 'feedback'

interface LexaCardContentProps {
  translation: string
  original: string
  context: string
}

export const LexaCardContent: FC<LexaCardContentProps> = memo(
  ({ translation, original, context }) => {
    const theme = useTheme()

    const updateUserPhrase = useCreateOrUpdateUserPhrase()
    const { mastery_level: masteryLevel, starred } =
      useUserPhrase(original) || {}
    const [tabValue, setTabValue] = useState<TabValue>('details')
    const [notes, setNotes] = useState('')

    const {
      data: translationDetails = {} as GenerateObjectResult<ITranslationDetails>,
    } = useTranslationDetails(original, translation, context)

    const details = translationDetails.object

    const handleStarToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation()
      updateUserPhrase.mutate({
        phrase_text: original,
        starred: !starred,
      })
    }

    const handleTabChange = (tab: TabValue) => () => {
      setTabValue(tab)
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
        <LexaCardAuthGuard>
          <CardHeader
            sx={{
              pb: 1,
              pt: 2,
              borderBottom: borderStyle,
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
                        onClick={handleStarToggle}
                        aria-label="favorite"
                      >
                        <Star fill={starred ? 'gold' : 'gray'} size={20} />
                      </IconButton>
                    </ShadowSafeTooltip>
                  </Box>
                </Box>
                <QuickCheckQuiz
                  original={original}
                  wordGender={details?.wordGender}
                />
                <PlayPhraseButton phrase={translation} />
              </>
            }
          />
          <CardContent
            sx={{
              p: 4,
              py: 2,
              height: 300,
              overflowY: 'auto',
              flexGrow: 1,
            }}
          >
            {tabValue === 'details' && (
              <Box>
                <Subtitle1
                  sx={{
                    mb: 1,
                    pb: 0.5,
                    borderBottom: borderStyle,
                    fontWeight: 500,
                  }}
                >
                  Other Ways to Say
                </Subtitle1>
                <Box mb={2}>
                  <OtherWaysToSay otherWaysToSay={details?.otherWaysToSay} />
                </Box>
                <Subtitle1 mb={1} pb={0.5} borderBottom={borderStyle}>
                  Insights
                </Subtitle1>
                <Insights insights={details?.culturalInsights} />
              </Box>
            )}

            {tabValue === 'notes' && (
              <Box>
                <Subtitle1
                  sx={{
                    mb: 2,
                    pb: 0.5,
                    borderBottom: borderStyle,
                    fontWeight: 500,
                  }}
                >
                  Your Notes
                </Subtitle1>
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
                <Subtitle1>Quick Quiz</Subtitle1>
                <Body2>Quizzes are coming soon!</Body2>
                <Button variant="contained" sx={{ marginTop: 2 }}>
                  Start Quiz
                </Button>
              </Box>
            )}
            {tabValue === 'feedback' && <FeedbackPage />}
          </CardContent>
          <CardActions
            sx={{
              justifyContent: 'space-between',
              padding: '4px 16px',
              borderTop: borderStyle,
              '.MuiIconButton-root': {
                borderRadius: '25%',
                cursor: 'pointer',
              },
            }}
          >
            <ShadowSafeTooltip title="Details" enterDelay={500}>
              <IconButton
                aria-label="Details"
                onClick={handleTabChange('details')}
                color={tabValue === 'details' ? 'secondary' : 'default'}
              >
                <LucideBookOpen />
              </IconButton>
            </ShadowSafeTooltip>
            <ShadowSafeTooltip title="Notes" enterDelay={500}>
              <IconButton
                aria-label="Notes"
                onClick={handleTabChange('notes')}
                color={tabValue === 'notes' ? 'secondary' : 'default'}
              >
                <LucideNotebook />
              </IconButton>
            </ShadowSafeTooltip>
            <ShadowSafeTooltip title="Quiz" enterDelay={500}>
              <IconButton
                aria-label="Quiz"
                onClick={handleTabChange('quiz')}
                color={tabValue === 'quiz' ? 'secondary' : 'default'}
              >
                <LucideClipboardPenLine />
              </IconButton>
            </ShadowSafeTooltip>
            <ShadowSafeTooltip title="Feedback" enterDelay={500}>
              <IconButton
                aria-label="Feedback"
                onClick={handleTabChange('feedback')}
                color={tabValue === 'feedback' ? 'secondary' : 'default'}
              >
                <MessageSquareQuote />
              </IconButton>
            </ShadowSafeTooltip>
          </CardActions>
        </LexaCardAuthGuard>
      </Card>
    )
  },
)

interface OtherWayToSay {
  translation: string
  explanation: string
}

const OtherWaysToSay = ({
  otherWaysToSay,
}: {
  otherWaysToSay?: OtherWayToSay[]
}) => {
  if (!otherWaysToSay) {
    return (
      <>
        {[1, 2].map((i) => (
          <Box key={i} mb={2}>
            <Skeleton variant="text" width="60%" height={24} />
            <Skeleton variant="text" width="80%" height={20} />
          </Box>
        ))}
      </>
    )
  }

  return (
    <>
      {otherWaysToSay.map(({ translation, explanation }) => (
        <Box
          key={translation}
          display="flex"
          flexDirection="column"
          gap={0.5}
          mb={1}
        >
          <Body2 color="secondary.main">{translation}</Body2>
          <Body2 pl={2} color="text.secondary">
            {explanation}
          </Body2>
        </Box>
      ))}
    </>
  )
}

const Insights = ({ insights }: { insights?: string }) => {
  if (!insights) {
    return <Skeleton variant="text" height={100} />
  }

  return (
    <Body2 color="text.secondary" lineHeight={1.6}>
      {insights}
    </Body2>
  )
}

const FeedbackPage = () => {
  return (
    <Box>
      <Box
        component="form"
        sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
      >
        <TextField label="What's up?" multiline rows={4} />
        <Button type="submit">Submit</Button>
      </Box>
    </Box>
  )
}
