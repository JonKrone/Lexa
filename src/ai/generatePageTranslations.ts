import { streamObject } from 'ai'
import dedent from 'ts-dedent'
import { z } from 'zod'
import { getPageTitle } from '../lib/documentUtils'
import { Models } from './models'

export interface GeneratePageTranslationsSettings {
  targetLanguage: string
  learningGoals: string
  proficiencyLevel: string
  preferredPhraseLength: string
  translationDensityPercent: number
}

const TranslationSchema = z.object({
  original: z
    .string()
    .describe(
      'The exact text segment from the source content, character-perfect match with no modifications or additions.',
    ),
  translation: z
    .string()
    .describe(
      'Natural, contextually appropriate translation in the target language that maintains the original meaning and tone.',
    ),
  context: z
    .string()
    .describe(
      'Complete sentence or meaningful phrase containing the original text, providing sufficient context for understanding the usage and meaning.',
    ),
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
    translationDensityPercent: 5,
    pageTitle: getPageTitle() ?? '',
    url: window.location.href,
  })

  const result = await streamObject({
    model: Models.openai.gpt41Mini,
    system:
      'You are an expert language learning assistant specializing in contextual translation selection. Your role is to intelligently identify and translate words or phrases that will maximize learning value for users browsing web content.',
    prompt,
    output: 'array',
    schema: TranslationSchema,
  })

  return result
}

interface TranslationPromptParams {
  targetLanguage: string
  textToTranslate: string
  learningGoals: string
  proficiencyLevel: string
  translationDensityPercent: number
  pageTitle: string
  url: string
}

function makeTranslationPrompt({
  targetLanguage,
  textToTranslate,
  learningGoals,
  proficiencyLevel,
  translationDensityPercent,
  pageTitle,
  url,
}: TranslationPromptParams) {
  return dedent`You are tasked with selecting optimal words and phrases for translation to enhance language learning while users browse web content.

## Context Analysis
**Webpage**: ${pageTitle}
**URL**: ${url}
**Target Language**: ${targetLanguage}
**User Proficiency**: ${proficiencyLevel}
**Learning Goals**: ${learningGoals}
**Translation Density**: ~${translationDensityPercent}% of content (approximately one phrase per paragraph)

## Selection Criteria by Proficiency Level

### Beginner Level
- **Primary Focus**: High-frequency vocabulary (top 1000-2000 words)
- **Word Types**: Concrete nouns, basic verbs, common adjectives
- **Phrase Length**: 1-3 words maximum
- **Avoid**: Technical jargon, idioms, complex grammar structures
- **Examples**: "house", "big car", "to eat"

### Intermediate Level
- **Primary Focus**: Mid-frequency vocabulary, common collocations
- **Word Types**: Abstract concepts, phrasal verbs, descriptive phrases
- **Phrase Length**: 2-5 words
- **Include**: Some idiomatic expressions, compound terms
- **Examples**: "take advantage of", "environmental impact", "user-friendly"

### Advanced Level
- **Primary Focus**: Low-frequency vocabulary, nuanced expressions
- **Word Types**: Technical terms, sophisticated phrases, cultural references
- **Phrase Length**: 3-8 words, including full clauses when valuable
- **Include**: Complex idioms, professional terminology, subtle distinctions
- **Examples**: "cutting-edge technology", "paradigm shift", "unprecedented circumstances"

## Content Filtering Rules
**CRITICAL**: Exclude ALL content within:
- Code blocks (\`\`\`...\`\`\`)
- Inline code (\`...\`)
- URLs and links ([text](url))
- Image alt text and captions
- HTML/XML tags
- Mathematical formulas
- Navigation elements
- Metadata and technical annotations

## Learning Value Optimization
Prioritize selections that:
1. **Align with learning goals**: Match stated objectives (business, travel, academic, etc.)
2. **Build vocabulary progressively**: Connect to previously learned concepts
3. **Provide cultural context**: Include culturally significant terms when relevant
4. **Enhance comprehension**: Focus on words that unlock meaning of surrounding text
5. **Encourage retention**: Select memorable, useful phrases over obscure terms

## Quality Assurance
For each selection, ensure:
- **Accuracy**: Exact text match from source material
- **Relevance**: Appropriate for user's proficiency level
- **Context**: Sufficient surrounding text for understanding
- **Utility**: High learning value for stated goals
- **Density**: Maintain target percentage without overwhelming

## Output Requirements
For each selected phrase, provide:
- **original**: Exact text segment from the markdown (character-perfect match)
- **translation**: Natural, contextually appropriate translation in ${targetLanguage}
- **context**: Complete sentence or meaningful phrase containing the original text

## Source Content
<content>
${textToTranslate}
</content>

Analyze the content systematically and select translations that will create an optimal learning experience for this ${proficiencyLevel} level ${targetLanguage} learner.`
}
