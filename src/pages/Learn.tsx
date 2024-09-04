import { useQuery } from '@tanstack/react-query'
import React from 'react'

// Mock function to fetch words (replace with actual API call)
const fetchWords = async () => {
  return [
    { word: 'bonjour', translation: 'hello', partOfSpeech: 'interjection' },
    { word: 'merci', translation: 'thank you', partOfSpeech: 'interjection' },
    { word: 'au revoir', translation: 'goodbye', partOfSpeech: 'interjection' },
  ]
}

const Learn: React.FC = () => {
  const {
    data: words,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['words'],
    queryFn: fetchWords,
  })

  if (isLoading) return <div className="text-center py-4">Loading...</div>
  if (error)
    return (
      <div className="text-center py-4 text-red-600">An error occurred</div>
    )

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-800">Words to Learn</h2>
      <ul className="space-y-3">
        {words?.map((word) => (
          <li key={word.word} className="bg-white p-3 rounded-lg shadow-sm">
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-800">{word.word}</span>
              <span className="text-sm text-gray-500">{word.partOfSpeech}</span>
            </div>
            <p className="text-gray-600 mt-1">{word.translation}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Learn
