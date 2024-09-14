interface TranslationPromptParams {
  targetLanguage: string
  textToTranslate: string
  learningGoals: string
  proficiencyLevel: string
  preferredPhraseLength: string
  translationDensityPercent: number
}

export function makeTranslationPrompt({
  targetLanguage,
  textToTranslate,
  learningGoals,
  proficiencyLevel,
  preferredPhraseLength,
  translationDensityPercent,
}: TranslationPromptParams) {
  return `
You are an assistant that helps users learn [Target Language] by translating select words or phrases in a given text.

**User Preferences**:
- **Learning Goals**: ${learningGoals}
- **Proficiency Level**: ${proficiencyLevel}
- **Preferred Phrase Length**: ${preferredPhraseLength}
- **Translation Density**: Aim to translate approximately one phrase per paragraph or up to ${translationDensityPercent}% of the total text.

**Task**:
1. Read the following markdown text.
2. Select words or phrases to translate based on the user's preferences and learning goals. Ensure a mix of single words and phrases (up to 5 words), with some variability.
3. Limit the number of translations to avoid overwhelming the user, following the translation density guideline.
4. Focus on content that aligns with the user's proficiency level and interests.
5. Translate the selected words or phrases into ${targetLanguage}.
6. For each selection, provide:
   - **Original**: The exact text segment from the markdown.
   - **Translation**: The translated text.
   - **Context**: The exact surrounding text or sentence for reference.

**Output Format**:
Provide the output as a JSON array with the following structure:

\`\`\`json
[
  {
    "original": "original text segment",
    "translation": "translated text segment",
    "context": "surrounding text for reference",
  },
  ...
]
\`\`\`

**Text to Process**:
${textToTranslate}
\`\`\`

**2. Incorporating User Preferences**

Including user preferences in the prompt ensures that the LLM tailors the selection and translation of phrases to the user's needs.
- **Learning Goals**: Specify topics or vocabulary areas the user wants to focus on.
- **Proficiency Level**: Helps the LLM select words and phrases appropriate for the user's language level.
- **Preferred Phrase Length**: Indicates the desired variability in phrase lengths.
- **Translation Density**: Sets a limit on the number of translations to prevent cognitive overload.

**3. Ensuring Variability in Phrase Lengths**

By specifying the preferred phrase length and encouraging variability, the LLM will:
- **Select Single Words**: Common or significant words relevant to the user's goals.
- **Select Multi-Word Phrases**: Collocations, expressions, or important terms up to 5 words.
- **Introduce Variability**: Randomize selections within the guidelines to maintain engagement.

**4. Structured Output Format**

The output format remains largely the same but includes an optional "notes" field for additional context.

**Example Output**:

\`\`\`json
[
  {
    "original": "financial markets",
    "translation": "mercados financieros",
    "context": "Understanding financial markets is crucial for investors.",
  },
  {
    "original": "invest",
    "translation": "invertir",
    "context": "Many people choose to invest early.",
  }
]
\`\`\`
`
}

// User Preferences:
// - Learning Goals: Improve understanding of business and financial terminology.
// - Proficiency Level: Intermediate.
// - Preferred Phrase Length: Mix of single words and phrases up to 3 words.
// - Translation Density: Translate approximately 10% of the text.
