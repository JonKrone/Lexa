import { createOpenAI } from '@ai-sdk/openai'
import { streamObject } from 'ai'
import { z } from 'zod'
import { makeTranslationPrompt } from './prompts'
interface GeneratePageTranslationsSettings {
  targetLanguage: string
  learningGoals: string
  proficiencyLevel: string
  preferredPhraseLength: string
  translationDensityPercent: number
}

const TranslationSchema = z.object({
  original: z.string().describe('The exact text segment from the markdown.'),
  translation: z.string().describe('The translated text.'),
  context: z.string().describe('Surrounding text or sentence for reference.'),
  /** Not-yet-useful fields */
  // otherWaysToSay: z.string().describe('Other ways to say the same thing.'),
  // partOfSpeech: z.string().describe('Noun, verb, adjective, etc.'),
  // notes: z
  //   .string()
  //   .nullable()
  //   .describe('Any relevant linguistic or cultural notes.'),
})

export type ITranslation = z.infer<typeof TranslationSchema>

export async function generatePageTranslations(
  markdown: string,
  settings: GeneratePageTranslationsSettings,
) {
  const prompt = makeTranslationPrompt({
    textToTranslate: markdown,
    targetLanguage: settings.targetLanguage,
    learningGoals: settings.learningGoals,
    proficiencyLevel: settings.proficiencyLevel,
    preferredPhraseLength: settings.preferredPhraseLength,
    translationDensityPercent: 1,
  })

  const result = await streamObject({
    model: createOpenAI({
      compatibility: 'strict',
      apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    })('gpt-4o-mini-2024-07-18', {
      structuredOutputs: true,
    }),
    prompt,
    output: 'array',
    schema: TranslationSchema,
  })

  // for await (const element of result.elementStream) {
  //   console.log('chunk:', element)
  // }

  // console.log('fullobj:', await result.object)

  return result
}
