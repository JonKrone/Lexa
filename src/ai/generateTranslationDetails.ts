import { generateObject } from 'ai'
import dedent from 'ts-dedent'
import { z } from 'zod'
import { Models } from './models'

const TranslationDetailsSchema = z.object({
  wordGender: z
    .enum(['masc', 'fem', 'neuter', 'masc/fem', 'N/A'])
    .describe(
      "Identify the grammatical gender (if applicable), considering the target language and whether the word is a noun. If the word has multiple genders or forms, mention them. If gender doesn't apply, write N/A.",
    ),
  regionalVariations: z
    .string()
    .describe('Provide any regional differences, or write N/A.'),
  otherWaysToSay: z
    .array(
      z.object({
        translation: z.string(),
        explanation: z.string(),
      }),
    )
    .describe(
      'Give brief alternative target-language translations or simple phrases in easily understood terms, reflecting natural yet varied usage.',
    ),
  antonyms: z
    .array(z.string())
    .describe('Provide one or more antonyms, if applicable, or write N/A.'),
  culturalInsights: z
    .string()
    .describe(
      'Provide very brief cultural background or nuances relevant to the phrase.',
    ),
})

export type ITranslationDetails = z.infer<typeof TranslationDetailsSchema>

export async function generateTranslationDetails(
  inputs: TranslationDetailsInputs,
) {
  const prompt = makeTranslationDetailsPrompt(inputs)

  const result = await generateObject({
    system:
      'You are a language tutor that provides concise, engaging linguistic and cultural information to help users learn a new language.',
    model: Models.openai.gpt4o,
    prompt,
    schema: TranslationDetailsSchema,
  })

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

export function makeTranslationDetailsPrompt(inputs: TranslationDetailsInputs) {
  return dedent`Generate useful metadata about a translated word or phrase to create an enriched, engaging language learning experience. This is especially aimed at novice learners who need exposure to alternative expressions and colloquialisms.

**Inputs:**
- \`sourceLanguage\`: The source language of the original word or phrase.
- \`targetLanguage\`: The language into which the word or phrase has been translated.
- \`word\`: The word or phrase in the source language.
- \`translation\`: The translation of the word or phrase in the target language.
- \`pageTitle\`: The title of the webpage where the word or phrase appears.
- \`url\`: The URL of the webpage where the word or phrase appears.
- \`surroundingContext\`: The immediate context (e.g., sentence or passage) in which the word or phrase is used.

**Your Task:**
Produce metadata covering various aspects related to the translation.

### **Instructions:**

1. **Identify the grammatical gender** (if applicable), considering the target language and whether the word is a noun. If the word has multiple genders or forms, mention them. If gender doesn't apply, write \`N/A\` for \`wordGender\`.

2. **Mention any regional variations** of the translated term, especially if it has different equivalents in specific versions of the target language (e.g., European vs. Latin American Spanish). If there are no regional variations, write \`N/A\` for \`regionalVariations\`.

3. **Provide alternative ways to say** the word or phrase in simple terms or as used by native speakers. Include colloquial or commonly used variations to help the learner communicate effectively.

4. **Suggest any relevant antonyms** that may enrich the learner's understanding and vocabulary. If there are no direct antonyms, write \`N/A\` for \`antonyms\`.

5. **Share cultural insights** (briefly) that could help the learner understand a local custom or nuance related to the word or phrase.

**Output Format:**
Provide your response in the following structure, keeping each item to one sentence or less:

- \`wordGender\`: [State whether it is masculine, feminine, neuter, both (if applicable), or N/A.]
- \`regionalVariations\`: [Provide any regional differences, or write N/A.]
- \`otherWaysToSay\`: [Give brief alternative translations or simple phrases in easily understood terms, reflecting natural yet varied usage.]
- \`antonyms\`: [Provide one or more antonyms, if applicable, or write N/A.]
- \`culturalInsights\`: [Provide very brief cultural background or nuances relevant to the phrase.]

**Important:**
- **Keep your language engaging and simple** to help learners become familiar with colloquial variations without feeling overwhelmed.
- The tone should be informative but easygoing, encouraging familiarity with variations in natural usage.
- **Each bullet point should be no more than 20 words.**

### **Example:**

#### Input:
- \`sourceLanguage\`: "English"
- \`targetLanguage\`: "Spanish"
- \`word\`: "cake"
- \`translation\`: "pastel"
- \`pageTitle\`: "Top 10 desserts you can make at home"
- \`url\`: "https://example.com/top-10-desserts"
- \`surroundingContext\`: "Here is a simple recipe for making a birthday cake."

#### Output:
- \`wordGender\`: Masculine
- \`regionalVariations\`: In Spain, "tarta" is common; in Mexico, "pastel" is used.
- \`otherWaysToSay\`: "tarta" (Spain), "bizcocho" (some regions), "queque" (Central America)
- \`antonyms\`: "pan salado" (savory bread)
- \`culturalInsights\`: "Tarta" can refer to an elaborate dessert in some countries.

**Troubleshooting:**
- If any field does not apply, write \`N/A\` for that field.
- Ensure the response follows the structure and stays within the length guidelines.
- Focus on providing helpful, learner-friendly information.

### **Input Information:**

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
