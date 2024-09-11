import { Button, Card, CardContent, Typography } from '@mui/material'
import React, { useState } from 'react'

export const ComplexHoverCardContent: React.FC<{ originalText: string }> = ({
  originalText,
}) => {
  const [page, setPage] = useState(1)

  return (
    <Card>
      <CardContent>
        {page === 1 && (
          <>
            <Typography variant="h6">Original Text</Typography>
            <Typography>{originalText}</Typography>
            <Button onClick={() => setPage(2)}>More Info</Button>
          </>
        )}
        {page === 2 && (
          <>
            <Typography variant="h6">Additional Information</Typography>
            <Typography>
              Here you can add more details, etymology, usage examples, etc.
            </Typography>
            <Button onClick={() => setPage(1)}>Back</Button>
          </>
        )}
      </CardContent>
    </Card>
  )
}
