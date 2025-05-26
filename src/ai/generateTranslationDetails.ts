import { generateObject } from 'ai'
import dedent from 'ts-dedent'
import { z } from 'zod'
import { Models } from './models'

const TranslationDetailsSchema = z.object({
  wordGender: z
    .enum(['masc', 'fem', 'neuter', 'masc/fem', 'N/A'])
    .describe(
      "Grammatical gender of the word in the target language. For gendered languages, specify the appropriate gender(s). For non-gendered languages or non-nouns, use 'N/A'. Include multiple genders if the word can have different forms.",
    ),
  regionalVariations: z
    .string()
    .describe(
      'Regional differences in usage across different countries, dialects, or cultural contexts. Include geographic specificity (e.g., "Spain vs. Mexico"). Use "N/A" if no significant variations exist.',
    ),
  otherWaysToSay: z
    .array(
      z.object({
        translation: z
          .string()
          .describe('Alternative translation or expression'),
        explanation: z
          .string()
          .describe(
            'Brief context for when this alternative is most appropriate (formal, informal, regional, etc.)',
          ),
      }),
    )
    .describe(
      'Alternative expressions, synonyms, or colloquialisms that convey the same meaning. Include 1-2 options with explanations of when each is most appropriate. Focus on practical alternatives that enhance communication.',
    ),
  antonyms: z
    .array(z.string())
    .describe(
      'Meaningful opposites or contrasting concepts. Include direct antonyms, conceptual opposites, or contextual contrasts. Use empty array if no relevant antonyms exist.',
    ),
  culturalInsights: z
    .string()
    .describe(
      'Cultural context, significance, or nuances that help learners understand appropriate usage. Include historical context, social implications, or practical applications. Focus on information that enhances cross-cultural communication.',
    ),
})

export type ITranslationDetails = z.infer<typeof TranslationDetailsSchema>

export async function generateTranslationDetails(
  inputs: TranslationDetailsInputs,
) {
  const prompt = makeTranslationDetailsPrompt(inputs)

  const result = await generateObject({
    system:
      'You are an expert language tutor and cultural consultant specializing in providing comprehensive linguistic and cultural insights. Your expertise spans etymology, regional variations, cultural nuances, and pedagogical best practices for language learning.',
    model: Models.openai.gpt41,
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
  return dedent`Generate comprehensive linguistic and cultural metadata for a translated word or phrase to enhance language learning effectiveness.

## Translation Context
- **Source Text**: "${inputs.word}"
- **Translation**: "${inputs.translation}"
- **Context**: "${inputs.surroundingContext}"
- **Page**: ${inputs.pageTitle}
- **URL**: ${inputs.url}
${inputs.sourceLanguage ? `- **Source Language**: ${inputs.sourceLanguage}` : ''}
${inputs.targetLanguage ? `- **Target Language**: ${inputs.targetLanguage}` : ''}
${inputs.partOfSpeech ? `- **Part of Speech**: ${inputs.partOfSpeech}` : ''}
${inputs.dialectOrRegion ? `- **Dialect/Region**: ${inputs.dialectOrRegion}` : ''}

## Analysis Requirements

### 1. Grammatical Gender Analysis
Determine the grammatical gender if applicable to the target language:
- For gendered languages (Spanish, French, German, etc.): Specify masculine, feminine, neuter, or variable
- For compound words: Include all relevant genders
- For non-gendered languages or non-nouns: Use "N/A"
- Include articles or determiners when helpful (e.g., "der/die/das" for German)

### 2. Regional Variation Mapping
Identify significant regional differences in usage:
- **Geographic variations**: Different terms across countries/regions
- **Formality levels**: Formal vs. informal variants
- **Generational differences**: Traditional vs. modern usage
- **Professional contexts**: Industry-specific alternatives
- If no significant variations exist, state "N/A"

### 3. Alternative Expression Analysis
Provide 1-2 alternative ways to express the same concept:
- **Synonyms**: Direct equivalents with subtle differences
- **Colloquialisms**: Informal or slang alternatives
- **Formal variants**: More sophisticated expressions
- **Context-specific**: Alternatives for different situations
- Include brief explanations for when each alternative is most appropriate

### 4. Antonym Identification
Identify meaningful opposites or contrasts:
- **Direct antonyms**: Clear opposites (hot/cold, big/small)
- **Conceptual opposites**: Contrasting ideas or approaches
- **Contextual contrasts**: Opposing concepts within the specific domain
- If no clear antonyms exist, state "N/A"

### 5. Cultural Insight Development
Provide culturally relevant context:
- **Cultural significance**: Special meaning or importance in the culture
- **Historical context**: Origins or evolution of usage
- **Social implications**: How usage reflects cultural values
- **Practical applications**: When and how native speakers use this term
- **Cultural sensitivity**: Any considerations for appropriate usage

## Output Guidelines
- **Conciseness**: Keep each section to 1 sentence maximum
- **Clarity**: Use simple, accessible language
- **Relevance**: Focus on information that enhances learning
- **Accuracy**: Ensure all information is linguistically and culturally correct
- **Practicality**: Emphasize information useful for real-world communication

## Quality Standards
- Verify all linguistic information for accuracy
- Ensure cultural insights are respectful and informative
- Prioritize information that aids comprehension and retention
- Maintain consistency with established linguistic conventions
- Focus on learner-friendly explanations over academic terminology

Generate metadata that will help learners understand not just the translation, but the cultural and linguistic context that makes communication truly effective.`
}
