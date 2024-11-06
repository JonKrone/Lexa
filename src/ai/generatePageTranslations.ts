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
  original: z.string().describe('The exact text segment from the markdown.'),
  translation: z.string().describe('The translated text.'),
  context: z.string().describe('Surrounding text or sentence for reference.'),
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
    model: Models.openai.gpt4oMini,
    system:
      'You are an assistant that helps users learn a language by translating select words or phrases in a given website text.',
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
  return dedent`Generate a list of words or phrases to translate from a given markdown-formatted webpage.

**User Preferences**:
- **Target Language**: ${targetLanguage}
- **Learning Goals**: ${learningGoals}
- **Proficiency Level**: ${proficiencyLevel}
- **Translation Density**: Aim to translate approximately one phrase per paragraph or up to ${translationDensityPercent}% of the total text.
- **Webpage Title**: ${pageTitle}
- **URL**: ${url}

**Translation Length Guidelines Based on Proficiency Level**:
- **Beginner**: Translate simple single words or phrases of 2-3 words. Avoid difficult or complex vocabulary.
- **Intermediate**: Translate more challenging words and longer phrases. Include some idiomatic expressions.
- **Advanced**: Translate complex words and entire sentences. Focus on advanced vocabulary and nuanced phrases.

**Important Instructions**:
- **Do not translate any text within code blocks** (denoted by triple backticks \`\`\`), **inline code** (text enclosed in single backticks \`), or **markdown links** (e.g., [link text](url)).
- **Do not translate text within markdown images**, blockquotes, tables, or any other special markdown elements.
- **Only translate plain text** that is outside of these special markdown elements.

**Task**:
1. Read the following markdown text.
2. **Avoid translating any text within code blocks, inline code, links, images, blockquotes, tables, or other markdown formatting elements.**
3. Based on the user's **Proficiency Level**, select appropriate words, phrases, or sentences to translate:
   - For **Beginner**, focus on simple words and common phrases.
   - For **Intermediate**, include more difficult words and longer phrases.
   - For **Advanced**, select complex words and consider translating entire sentences.
4. Ensure a mix of single words and phrases, with variability according to proficiency level.
5. Follow the translation density guideline to avoid overwhelming the user.
6. Focus on content that aligns with the user's proficiency level and learning goals.
7. Translate the selected words or phrases into ${targetLanguage}.
8. For each selection, provide:
   - **original**: The exact text segment from the markdown.
   - **translation**: The translated text.
   - **context**: The exact surrounding text or sentence for reference.

<text_to_translate>
${textToTranslate}
</text_to_translate>`
}
