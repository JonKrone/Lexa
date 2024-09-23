import { Box, List, ListItem, Paper } from '@mui/material'
import React from 'react'
import { SubmitButton } from '../components/SubmitButton'
import { Body2, H3 } from '../components/Typography'

const Home: React.FC = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Paper elevation={1} sx={{ p: 2, borderRadius: 2 }}>
        <H3 sx={{ mb: 1 }}>Today's Progress</H3>
        <List disablePadding>
          <ListItem sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Body2 color="text.secondary">Words Learned:</Body2>
            <Body2 color="success.main" fontWeight="medium">
              12
            </Body2>
          </ListItem>
          <ListItem sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Body2 color="text.secondary">Streak:</Body2>
            <Body2 color="primary.main" fontWeight="medium">
              5 days
            </Body2>
          </ListItem>
        </List>
      </Paper>
      <SubmitButton>Start Learning</SubmitButton>
    </Box>
  )
}

export default Home
