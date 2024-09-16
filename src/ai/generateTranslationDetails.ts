import { generateObject } from 'ai'
import { z } from 'zod'
import { Models } from './models'

//   "word": {
//     "type": "string",
//     "description": "The word or phrase in question."
//   },
//   "translation": {
//     "type": "string",
//     "description": "The translation of the word or phrase into the target language."
//   },
//   "word_gender": {
//     "type": "string",
//     "description": "The grammatical gender of the word (e.g., masculine, feminine, neuter). Applicable only if the word is a noun and the language has grammatical gender."
//   },
//   "formal_usage": {
//     "type": "string",
//     "description": "Explanation of how the word or phrase is used in formal contexts."
//   },
//   "informal_usage": {
//     "type": "string",
//     "description": "Explanation of how the word or phrase is used in informal contexts."
//   },
//   "regional_variations": {
//     "type": "string",
//     "description": "Any regional differences in the usage or translation of the word or phrase."
//   },
//   "other_ways_to_say": {
//     "type": "array",
//     "items": {
//       "type": "string"
//     },
//     "description": "Alternative expressions or phrases that convey the same meaning. Include synonyms and other ways to say the same thing."
//   },
//   "synonyms": {
//     "type": "array",
//     "items": {
//       "type": "string"
//     },
//     "description": "A list of synonyms for the word or phrase. Applicable if the word is a single word or if synonyms make sense in context."
//   },
//   "antonyms": {
//     "type": "array",
//     "items": {
//       "type": "string"
//     },
//     "description": "A list of antonyms for the word or phrase. Applicable if the word is a single word or if antonyms make sense in context."
//   },
//   "cultural_insights": {
//     "type": "string",
//     "description": "Idiomatic uses, expressions, or interesting cultural nuances or traditions related to the word or phrase."
//   }
// },
// "required": ["word", "translation"],
const TranslationDetailsSchema = z.object({
  wordGender: z
    .string()
    .describe(
      'The grammatical gender of the word (e.g., masculine, feminine, neuter). Applicable only if the word is a noun and the language has grammatical gender.',
    ),
  formalUsage: z
    .string()
    .describe(
      'Explanation of how the word or phrase is used in formal contexts.',
    ),
  informalUsage: z
    .string()
    .describe(
      'Explanation of how the word or phrase is used in informal contexts.',
    ),
  regionalVariations: z
    .string()
    .describe(
      'Any regional differences in the usage or translation of the word or phrase.',
    ),
  otherWaysToSay: z
    .array(
      z.object({
        translation: z
          .string()
          .describe(
            'The translation of the word or phrase in the target language.',
          ),
        explanation: z
          .string()
          .describe(
            'The explanation of the word or phrase in the source language.',
          ),
      }),
    )
    .describe(
      'Alternative expressions or phrases that convey the same meaning. Include synonyms and other ways to say the same thing.',
    ),
  antonyms: z
    .array(
      z
        .string()
        .describe('An antonym for the word or phrase in the target language.'),
    )
    .describe(
      'A list of antonyms for the word or phrase. Applicable if the word is a single word or if antonyms make sense in context.',
    ),
  culturalInsights: z
    .string()
    .describe(
      'Idiomatic uses, expressions, or interesting cultural nuances or traditions related to the word or phrase.',
    ),
  notes: z.string().describe('Any relevant linguistic or cultural notes.'),
  // usageInIdiomsOrExpressions: z
  //   .string()
  //   .nullable()
  //   .describe('Usage in idioms or expressions.'),
})

export type ITranslationDetails = z.infer<typeof TranslationDetailsSchema>

export async function generateTranslationDetails(
  inputs: TranslationDetailsInputs,
) {
  const prompt = makeTranslationDetailsPrompt(inputs)

  const result = await generateObject({
    model: Models.openai.gpt4o,
    prompt,
    schema: TranslationDetailsSchema,
  })

  console.log('result', result)

  return result
}

interface TranslationDetailsInputs {
  word: string
  translation: string
  pageTitle: string
  url: string
  surroundingContext: string
  sourceLanguage?: string
  targetLanguage?: string
  partOfSpeech?: string
  dialectOrRegion?: string
}

export function makeTranslationDetailsPrompt(
  inputs: TranslationDetailsInputs,
): string {
  return `
You are an AI language model that provides concise, engaging linguistic and cultural information to help users learn a new language.

**Instructions:**

- Use the provided information to generate content for each field in the JSON schema below.
- Provide synonyms, antonyms, and alternative expressions in the **target language** ("${inputs.targetLanguage || 'target language'}") to enhance learning.
- Keep cultural insights and regional variations brief and relevant.
- Tailor your language to be engaging and suitable for someone learning "${inputs.targetLanguage || 'the target language'}".
- Use context and webpage information to clarify meanings if necessary.
- Exclude any explanations or additional text outside of the JSON output.

**Input Information:**

- **Word or Phrase**: "${inputs.word}"
- **Translation**: "${inputs.translation}"
- **Title of the Webpage**: "${inputs.pageTitle}"
- **URL**: "${inputs.url}"
- **Surrounding Context**: "${inputs.surroundingContext}"
${inputs.sourceLanguage ? `- **Source Language**: "${inputs.sourceLanguage}"` : ''}
${inputs.targetLanguage ? `- **Target Language**: "${inputs.targetLanguage}"` : ''}
${inputs.partOfSpeech ? `- **Part of Speech**: "${inputs.partOfSpeech}"` : ''}
${inputs.dialectOrRegion ? `- **Dialect or Region**: "${inputs.dialectOrRegion}"` : ''}
`
}
