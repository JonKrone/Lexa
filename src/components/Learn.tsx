import { useQuery } from '@tanstack/react-query'
import React from 'react'

// Mock function to fetch words (replace with actual API call)
const fetchWords = async () => {
  return ['bonjour', 'merci', 'au revoir']
}

const Learn: React.FC = () => {
  const { data: words, isLoading, error } = useQuery(['words'], fetchWords)

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>An error occurred</div>

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Words to Learn</h2>
      <ul>
        {words?.map((word) => (
          <li key={word} className="mb-2">
            {word}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Learn
