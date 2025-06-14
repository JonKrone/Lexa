import { createOpenAI } from '@ai-sdk/openai'

export const Models = {
  openai: {
    gpt41: createOpenAI({
      compatibility: 'strict',
      apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    })('gpt-4.1-2025-04-14', {
      structuredOutputs: true,
    }),
    gpt41Mini: createOpenAI({
      compatibility: 'strict',
      apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    })('gpt-4.1-mini-2025-04-14', {
      structuredOutputs: true,
    }),
    gpt41Nano: createOpenAI({
      compatibility: 'strict',
      apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    })('gpt-4.1-nano-2025-04-14', {
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
