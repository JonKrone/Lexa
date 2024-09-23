import {
  Alert,
  Box,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Typography,
} from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { FC } from 'react'
import { Body2, Subtitle1 } from '../components/Typography'

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
  const {
    data: words,
    isLoading,
    error,
  } = useQuery<Word[]>({
    queryKey: ['words'],
    queryFn: fetchWords,
  })

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
        Words to Learn
      </Typography>
      <List disablePadding>
        {words?.map((word) => (
          <ListItem key={word.word} disablePadding>
            <ListItemText
              primary={
                <Box display="flex" justifyContent="space-between">
                  <Subtitle1 color="textPrimary">{word.word}</Subtitle1>
                  <Body2 color="textSecondary">{word.partOfSpeech}</Body2>
                </Box>
              }
              secondary={
                <Body2 color="textSecondary">{word.translation}</Body2>
              }
            />
          </ListItem>
        ))}
      </List>
    </Box>
  )
}

export default Learn
