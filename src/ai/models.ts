import { createOpenAI } from '@ai-sdk/openai'

export const Models = {
  openai: {
    gpt4oMini: createOpenAI({
      compatibility: 'strict',
      apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    })('gpt-4o-mini-2024-07-18', {
      structuredOutputs: true,
    }),
    gpt4o: createOpenAI({
      compatibility: 'strict',
      apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    })('gpt-4o-2024-08-06', {
      structuredOutputs: true,
    }),
    gpt4oAudio: createOpenAI({
      compatibility: 'strict',
      apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    })('gpt-4o-audio-preview', {
      structuredOutputs: true,
    }),
  },
}
