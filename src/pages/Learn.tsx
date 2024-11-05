import {
  Alert,
  Box,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Typography,
} from '@mui/material'
import { FC } from 'react'
import { Body2, Subtitle1 } from '../components/Typography'
import { useUserPhrases } from '../queries/user-phrase'

const fetchWords = async (): Promise<Word[]> => {
  return [
    { word: 'bonjour', translation: 'hello', partOfSpeech: 'interjection' },
    { word: 'merci', translation: 'thank you', partOfSpeech: 'interjection' },
    { word: 'au revoir', translation: 'goodbye', partOfSpeech: 'interjection' },
  ]
}

interface Word {
  word: string
  translation: string
  partOfSpeech: string
}

interface Props {}

export const Learn: FC<Props> = () => {
  const { data, isLoading, error } = useUserPhrases()
  const starredPhrases = data?.filter((p) => p.starred)

  if (isLoading)
    return (
      <Box display="flex" justifyContent="center" py={4}>
        <CircularProgress />
      </Box>
    )

  if (error)
    return (
      <Box display="flex" justifyContent="center" py={4}>
        <Alert severity="error">An error occurred</Alert>
      </Box>
    )

  return (
    <Box display="flex" flexDirection="column" gap={4}>
      <Typography variant="h5" color="textPrimary">
        Your Starred Phrases
      </Typography>
      <List disablePadding>
        {starredPhrases?.map((phrase) => (
          <ListItem key={phrase.phrase_text} disablePadding>
            <ListItemText
              primary={
                <Box display="flex" justifyContent="space-between">
                  <Subtitle1 color="textPrimary">
                    {phrase.phrase_text}
                  </Subtitle1>
                  <Body2 color="textSecondary">{phrase.mastery_level}</Body2>
                </Box>
              }
              secondary={<Body2 color="textSecondary">{'Translation'}</Body2>}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  )
}

export default Learn
