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
import { useQuery } from '@tanstack/react-query'
import { GenerateObjectResult } from 'ai'
import {
  MessageSquareQuote,
  Settings,
  Star,
  ThumbsDown,
  ThumbsUp,
} from 'lucide-react'
import React, { useState } from 'react'
import {
  generateTranslationDetails,
  ITranslationDetails,
} from '../../ai/generateTranslationDetails'
import { getPageLanguage, getPageTitle } from '../../utils/documentUtils'

type TabValue = 'details' | 'notes' | 'quiz'

interface LexaCardContentProps {
  translation: string
  original: string
  context: string
  // wordGender: string
  // masteryLevel: string
  // isFavorited: boolean
  // onFavoriteToggle: () => void
}

/**
 * TODO: Allow users to add their own notes to the translation
 * TODO: Mastery Levels: New, Learning, Mastered based on..? Quiz progress; # of times seen; # of
 * times marked known
 * TODO: Translation toggle: Show/hide original word
 * TODO: Engagement metrics like words learned; streaks; or daily goals
 * TODO: Daily/Weekly challenges: quizzes on words learned or seen daily/weekly
 * TODO: Report issues: incorrect translation, suggest improvements, etc
 * TODO: Settings shortcut (new ideas: reminders for daily/weekly quizzes)
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
  } = useQuery({
    queryKey: ['translationDetails', context],
    queryFn: async () => {
      const inputs = {
        word: original,
        translation,
        pageTitle: getPageTitle() ?? '',
        surroundingContext: context,
        url: window.location.href,
        targetLanguage: 'English',
        dialectOrRegion: getPageLanguage() ?? '',
      }

      return generateTranslationDetails(inputs)
    },
  })
  console.log('translationDetails', translationDetails.object)

  const masteryLevel = 'Learning'
  const isFavorited = false
  const onFavoriteToggle = () => {}
  const details = translationDetails.object

  const handleTabChange = (event: React.SyntheticEvent, newValue: TabValue) => {
    setTabValue(newValue)
  }

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
        height: '100%', // Adjust height as needed
      }}
    >
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
          onChange={handleTabChange}
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
                {details?.otherWaysToSay.map(({ translation, explanation }) => (
                  <React.Fragment key={translation}>
                    {translation} - {explanation}
                    <br />
                  </React.Fragment>
                ))}
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
              <Typography variant="body2">Quizzes are coming soon!</Typography>
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

interface StyledTabsProps {
  children?: React.ReactNode
  value: number
  onChange: (event: React.SyntheticEvent, newValue: number) => void
}

const StyledTabs = styled((props: StyledTabsProps) => (
  <Tabs
    {...props}
    TabIndicatorProps={{
      style: { display: 'none' },
      // children: <span className="MuiTabs-indicatorSpan" />
    }}
  />
))({
  '& .MuiTabs-indicator': {
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  '& .MuiTabs-indicatorSpan': {
    maxWidth: 40,
    width: '100%',
    backgroundColor: '#635ee7',
  },
})

interface StyledTabProps {
  label: string
}

const StyledTab = styled((props: StyledTabProps) => (
  <Tab disableRipple {...props} />
))(({ theme }) => ({
  textTransform: 'none',
  fontWeight: theme.typography.fontWeightRegular,
  fontSize: theme.typography.pxToRem(15),
  marginRight: theme.spacing(1),
  minHeight: 32,
  padding: '8px 12px',
  '&.Mui-focusVisible': {
    backgroundColor: 'rgba(100, 95, 228, 0.32)',
  },
}))
