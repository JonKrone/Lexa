import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  IconButton,
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
  Settings,
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
import { QuickCheckQuiz } from './QuickCheckQuiz'

const borderStyle = '1.5px solid rgba(255,255,255,0.1)'

type TabValue = 'details' | 'notes' | 'quiz'

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
                {/* <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    p: 1,
                    bgcolor: 'rgba(255,255,255,0.05)',
                    borderRadius: 1,
                    mb: 2,
                  }}
                >
                  <Body2 color="text.secondary">Mastery Level:</Body2>
                  <Typography variant="body2">{masteryLevel}</Typography>
                </Box> */}

                <Typography
                  variant="subtitle1"
                  sx={{
                    mb: 1,
                    pb: 0.5,
                    borderBottom: borderStyle,
                    fontWeight: 500,
                  }}
                >
                  Other Ways to Say
                </Typography>
                <Box mb={2}>
                  {details?.otherWaysToSay.map(
                    ({ translation, explanation }) => (
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
                    ),
                  )}
                </Box>

                {/* <Box mb={2}>
                  <Body2 color="secondary.main" fontWeight={500}>
                    Antonyms
                  </Body2>
                  <Body2>{details?.antonyms.join(', ')}</Body2>
                </Box> */}

                <Subtitle1 mb={1} pb={0.5} borderBottom={borderStyle}>
                  Cultural Insights
                </Subtitle1>
                <Body2 color="text.secondary" lineHeight={1.6}>
                  {details?.culturalInsights}
                </Body2>
              </Box>
            )}

            {tabValue === 'notes' && (
              <Box>
                <Typography
                  variant="subtitle1"
                  sx={{
                    mb: 2,
                    pb: 0.5,
                    borderBottom: borderStyle,
                    fontWeight: 500,
                  }}
                >
                  Your Notes
                </Typography>
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
                onClick={handleTabChange('details')}
                color={tabValue === 'details' ? 'secondary' : 'default'}
              >
                <LucideBookOpen />
              </IconButton>
            </ShadowSafeTooltip>
            <ShadowSafeTooltip title="Notes" enterDelay={500}>
              <IconButton
                onClick={handleTabChange('notes')}
                color={tabValue === 'notes' ? 'secondary' : 'default'}
              >
                <LucideNotebook />
              </IconButton>
            </ShadowSafeTooltip>
            <ShadowSafeTooltip title="Quiz" enterDelay={500}>
              <IconButton
                onClick={handleTabChange('quiz')}
                color={tabValue === 'quiz' ? 'secondary' : 'default'}
              >
                <LucideClipboardPenLine />
              </IconButton>
            </ShadowSafeTooltip>
            <ShadowSafeTooltip title="Feedback" enterDelay={500}>
              <IconButton aria-label="feedback">
                <MessageSquareQuote />
              </IconButton>
            </ShadowSafeTooltip>
            <ShadowSafeTooltip title="Settings" enterDelay={500}>
              <IconButton aria-label="settings">
                <Settings />
              </IconButton>
            </ShadowSafeTooltip>
          </CardActions>
        </LexaCardAuthGuard>
      </Card>
    )
  },
)
