import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Grid2,
  IconButton,
  styled,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import {
  MessageSquareQuote,
  Settings,
  Star,
  ThumbsDown,
  ThumbsUp,
} from 'lucide-react'
import React, { useState } from 'react'
import { generateTranslationDetails } from '../../ai/generateTranslationDetails'

type TabValue = 'details' | 'notes' | 'quiz'

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
export function ComplexHoverCardContent({
  translation,
  original,
  wordGender,
  masteryLevel,
  isFavorited,
  onFavoriteToggle,
}: {
  translation: string
  original: string
  wordGender: string
  masteryLevel: string
  isFavorited: boolean
  onFavoriteToggle: () => void
}) {
  const [tabValue, setTabValue] = useState<TabValue>('details')
  const [notes, setNotes] = useState('')
  const [thumbsUp, setThumbsUp] = useState(false)
  const [thumbsDown, setThumbsDown] = useState(false)

  const { data: translationDetails } = useQuery({
    queryKey: ['translationDetails', translation],
    queryFn: () => {
      return generateTranslationDetails({
        translation,
        original,
        context,
      })
    },
  })

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
          <Grid2 container alignItems="center" spacing={1}>
            <Grid2>
              <Typography variant="h6">{translation}</Typography>
              <Typography variant="subtitle1" color="textSecondary">
                {original} {wordGender && `(${wordGender})`}
              </Typography>
            </Grid2>
            <Grid2>
              <Grid2 container spacing={0.5}>
                <Grid2>
                  <IconButton onClick={onFavoriteToggle} aria-label="favorite">
                    <Star fill={isFavorited ? 'gold' : 'gray'} />
                  </IconButton>
                </Grid2>
                <Grid2>
                  <IconButton
                    onClick={handleThumbsUp}
                    color={thumbsUp ? 'primary' : 'default'}
                    aria-label="thumbs up"
                  >
                    <ThumbsUp />
                  </IconButton>
                </Grid2>
                <Grid2>
                  <IconButton
                    onClick={handleThumbsDown}
                    color={thumbsDown ? 'primary' : 'default'}
                    aria-label="thumbs down"
                  >
                    <ThumbsDown />
                  </IconButton>
                </Grid2>
              </Grid2>
            </Grid2>
          </Grid2>
        }
        // Removed the 'action' prop since buttons are moved to the footer
      />
      <CardContent sx={{ paddingTop: 0, flexGrow: 1 }}>
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
              {/* Mastery Level Indicator */}
              <Typography variant="body2">
                Mastery Level: {masteryLevel}
              </Typography>
              {/* Contextual Examples */}
              <Typography variant="subtitle1" sx={{ marginTop: 1 }}>
                Contextual Examples
              </Typography>
              <Typography variant="body2">
                {/* Placeholder for examples */}
                - Formal usage example.
                <br />- Informal usage example.
              </Typography>
              {/* Synonyms and Antonyms */}
              <Typography variant="subtitle1" sx={{ marginTop: 1 }}>
                Synonyms & Antonyms
              </Typography>
              <Typography variant="body2">
                {/* Placeholder for synonyms/antonyms */}
                Synonyms: example1, example2
                <br />
                Antonyms: example3, example4
              </Typography>
              {/* Cultural Insights */}
              <Typography variant="subtitle1" sx={{ marginTop: 1 }}>
                Cultural Insights
              </Typography>
              <Typography variant="body2">
                {/* Placeholder for cultural insights */}
                This word is often used in idiomatic expressions like...
              </Typography>
            </Box>
          )}
          {tabValue === 'notes' && (
            <Box>
              {/* Personal Notes */}
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
              {/* Quick Quiz Placeholder */}
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
