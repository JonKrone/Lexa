// Import Statements
import { Button } from '@mui/material'
import OpenAI from 'openai'
import { useRef, useState } from 'react'
import dedent from 'ts-dedent'
import { useSettings } from '../../queries/settings'

// Initialize OpenAI once
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
})

// Props Interface
interface PlayPhraseButtonProps {
  phrase: string
}

// PlayPhraseButton Component
export const PlayPhraseButton = ({ phrase }: PlayPhraseButtonProps) => {
  const { data: settings } = useSettings()
  const targetLanguage = settings?.target_language

  // Refs for AudioContext and AudioBuffer cache
  const audioContextRef = useRef<AudioContext | null>(null)
  const audioBufferCache = useRef<Map<string, AudioBuffer>>(new Map())

  // States for loading and error handling
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleClick = async () => {
    setError(null)
    setIsLoading(true)

    try {
      // Initialize and resume AudioContext
      initializeAudioContext(audioContextRef)

      if (audioContextRef.current?.state === 'suspended') {
        await audioContextRef.current.resume()
      }

      // Fetch audio from OpenAI
      const response = await fetchAudioFromOpenAI(
        openai,
        targetLanguage,
        phrase,
      )

      const audioChoice = findAudioChoice(response)
      if (!audioChoice) {
        setError('Audio not available.')
        return
      }

      const base64Audio = audioChoice.message.audio?.data
      if (!base64Audio) {
        setError('Audio data is empty.')
        return
      }

      // Check cache for existing AudioBuffer
      const cachedBuffer = getCachedAudioBuffer(audioBufferCache, phrase)
      if (cachedBuffer) {
        playAudioBuffer(audioContextRef.current!, cachedBuffer)
        return
      }

      // Decode and cache AudioBuffer
      const arrayBuffer = base64ToArrayBuffer(base64Audio)
      const decodedBuffer = await decodeAudioData(
        audioContextRef.current!,
        arrayBuffer,
      )
      cacheAudioBuffer(audioBufferCache, phrase, decodedBuffer)

      // Play the decoded AudioBuffer
      playAudioBuffer(audioContextRef.current!, decodedBuffer)
    } catch (err) {
      console.error('Error processing audio:', err)
      setError('Failed to play audio.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Button
        onClick={handleClick}
        disabled={!settings?.target_language || isLoading}
      >
        {isLoading ? 'Playing...' : 'Play'}
      </Button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </>
  )
}

// Helper Functions

/**
 * Initializes the AudioContext if it hasn't been initialized yet.
 * @param audioContextRef - Ref to store the AudioContext instance.
 */
const initializeAudioContext = (
  audioContextRef: React.MutableRefObject<AudioContext | null>,
) => {
  if (!audioContextRef.current) {
    const AudioCtx = window.AudioContext || window.webkitAudioContext
    audioContextRef.current = new AudioCtx()
    console.log('AudioContext initialized')
  }
}

/**
 * Converts a base64-encoded string to an ArrayBuffer.
 * @param base64 - The base64 string to convert.
 * @returns ArrayBuffer representation of the base64 string.
 */
const base64ToArrayBuffer = (base64: string): ArrayBuffer => {
  const binaryString = atob(base64)
  const len = binaryString.length
  const bytes = new Uint8Array(len)
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i)
  }
  return bytes.buffer
}

/**
 * Decodes an ArrayBuffer into an AudioBuffer using the provided AudioContext.
 * @param audioContext - The AudioContext to use for decoding.
 * @param arrayBuffer - The ArrayBuffer to decode.
 * @returns A promise that resolves to an AudioBuffer.
 */
const decodeAudioData = async (
  audioContext: AudioContext,
  arrayBuffer: ArrayBuffer,
): Promise<AudioBuffer> => {
  return await audioContext.decodeAudioData(arrayBuffer)
}

/**
 * Plays an AudioBuffer using the provided AudioContext.
 * @param audioContext - The AudioContext to use for playback.
 * @param audioBuffer - The AudioBuffer to play.
 */
const playAudioBuffer = (
  audioContext: AudioContext,
  audioBuffer: AudioBuffer,
) => {
  const source = audioContext.createBufferSource()
  source.buffer = audioBuffer
  source.connect(audioContext.destination)
  source.start(0)
}

/**
 * Caches the decoded AudioBuffer associated with a phrase.
 * @param audioBufferCache - The cache map to store the AudioBuffer.
 * @param phrase - The phrase associated with the AudioBuffer.
 * @param audioBuffer - The decoded AudioBuffer to cache.
 */
const cacheAudioBuffer = (
  audioBufferCache: React.MutableRefObject<Map<string, AudioBuffer>>,
  phrase: string,
  audioBuffer: AudioBuffer,
) => {
  audioBufferCache.current.set(phrase, audioBuffer)
}

/**
 * Retrieves a cached AudioBuffer for a given phrase if available.
 * @param audioBufferCache - The cache map storing AudioBuffers.
 * @param phrase - The phrase whose AudioBuffer is to be retrieved.
 * @returns The cached AudioBuffer or undefined if not found.
 */
const getCachedAudioBuffer = (
  audioBufferCache: React.MutableRefObject<Map<string, AudioBuffer>>,
  phrase: string,
): AudioBuffer | undefined => {
  return audioBufferCache.current.get(phrase)
}

/**
 * Finds the first choice in the OpenAI response that contains audio data.
 * @param response - The response object from OpenAI.
 * @returns The choice object containing audio data or undefined if not found.
 */
const findAudioChoice = (response: any): any => {
  return response.choices.find((m: any) => m.message.audio)
}

/**
 * Fetches audio data from OpenAI's chat completions API.
 * @param openai - The initialized OpenAI instance.
 * @param targetLanguage - The target language for pronunciation.
 * @param phrase - The phrase to be pronounced.
 * @returns The response from OpenAI containing audio data.
 */
const fetchAudioFromOpenAI = async (
  openai: OpenAI,
  targetLanguage: string | undefined,
  phrase: string,
): Promise<any> => {
  return await openai.chat.completions.create({
    model: 'gpt-4o-audio-preview',
    modalities: ['audio', 'text'],
    audio: { voice: 'alloy', format: 'mp3' },
    messages: [
      {
        role: 'system',
        content:
          'You are a helpful assistant that demonstrates pronunciation of phrases for a user trying to learn a new language.',
      },
      {
        role: 'user',
        content: dedent`
          Please pronounce the below phrase in the following language: ${targetLanguage}

          You MUST ONLY say the phrase, nothing else. Please enunciate clearly, but speak in a natural conversational way.

          <phrase>
          ${phrase}
          </phrase>`,
      },
    ],
  })
}
