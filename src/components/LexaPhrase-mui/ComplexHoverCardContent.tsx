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
  Tooltip,
  Typography,
} from '@mui/material'
import {
  BookOpen,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  PlayCircle,
  Plus,
  Star,
} from 'lucide-react'
import React, { useState } from 'react'

interface HoverCardProps {
  word: string
  translation: string
  partOfSpeech: string
  example: string
  pronunciation: string
}

export const ComplexHoverCardContent: React.FC<HoverCardProps> = ({
  word,
  translation,
  partOfSpeech,
  example,
  pronunciation,
}) => {
  const [currentTab, setCurrentTab] = useState(0)
  const [expanded, setExpanded] = useState(false)

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue)
  }

  return (
    <Box sx={{ width: 350 }}>
      <Card elevation={3}>
        <CardHeader
          title={
            <Typography variant="h6" component="div">
              {word}
            </Typography>
          }
          subheader={
            <Typography variant="body2" color="text.secondary">
              {partOfSpeech}
            </Typography>
          }
          action={
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Tooltip title="Save word">
                <IconButton size="small">
                  <Star />
                </IconButton>
              </Tooltip>
              <Tooltip title="Mark as learned">
                <IconButton size="small">
                  <CheckCircle />
                </IconButton>
              </Tooltip>
            </Box>
          }
        />
        <CardContent>
          <StyledTabs value={currentTab} onChange={handleTabChange}>
            <StyledTab label="Translation" />
            <StyledTab label="Example" />
            <StyledTab label="Quiz" />
          </StyledTabs>
          <Box sx={{ mt: 2 }}>
            {currentTab === 0 && (
              <>
                <Typography variant="body1">{translation}</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <Tooltip title="Listen to pronunciation">
                    <IconButton size="small">
                      <PlayCircle />
                    </IconButton>
                  </Tooltip>
                  <Typography variant="body2">{pronunciation}</Typography>
                </Box>
              </>
            )}
            {currentTab === 1 && (
              <Typography variant="body2" fontStyle="italic">
                {example}
              </Typography>
            )}
            {currentTab === 2 && (
              <Typography variant="body2">Quiz content here...</Typography>
            )}
          </Box>
        </CardContent>
        <CardActions sx={{ justifyContent: 'space-between' }}>
          <Tooltip title={expanded ? 'Show less context' : 'Show more context'}>
            <Button
              size="small"
              startIcon={expanded ? <ChevronLeft /> : <ChevronRight />}
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? 'Less' : 'More'}
            </Button>
          </Tooltip>
          <Tooltip title="Add to vocabulary list">
            <Button size="small" startIcon={<Plus />}>
              Add
            </Button>
          </Tooltip>
          <Tooltip title="Learn more about this word">
            <Button size="small" startIcon={<BookOpen />}>
              Learn
            </Button>
          </Tooltip>
        </CardActions>
      </Card>
    </Box>
  )
}

// Demo component to show the HoverCard in action
const DemoHoverCard: React.FC = () => {
  const sampleWord = {
    word: 'Bonjour',
    translation: 'Hello',
    partOfSpeech: 'Interjection',
    example: 'Bonjour, comment allez-vous?',
    pronunciation: '/bɔ̃.ʒuʁ/',
  }

  return (
    <Box
      sx={{
        p: 4,
        bgcolor: 'grey.100',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <ComplexHoverCardContent {...sampleWord} />
    </Box>
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
