import { ITranslation } from '../../../ai/generatePageTranslations'

export const testTranslations: ITranslation[] = [
  {
    original: 'work',
    translation: 'funcionan',
    context: 'frameworks like React and Vue work in content scripts',
  },
  {
    original: 'frameworks',
    translation: 'marcos de trabajo',
    context:
      'In addition, frameworks like React and Vue work in content scripts',
  },
  {
    original: 'content scripts',
    translation: 'scripts de contenido',
    context: 'frameworks like React and Vue work in content scripts',
  },
  {
    original: 'React',
    translation: 'React',
    context: 'frameworks like React and Vue work in content scripts',
  },
  {
    original: 'browser extension',
    translation: 'extensión del navegador',
    context: 'This is a browser extension for language learning',
  },
  {
    original: 'language learning',
    translation: 'aprendizaje de idiomas',
    context: 'This is a browser extension for language learning',
  },
]

export const problemTranslations: ITranslation[] = [
  {
    original: 'work',
    translation: 'funcionan',
    context: 'frameworks like React and Vue work in content',
  },
  {
    original: 'the',
    translation: 'el',
    context: 'the same functionality',
  },
  {
    original: 'same',
    translation: 'mismo',
    context: 'the same functionality',
  },
]

export const edgeCaseTranslations: ITranslation[] = [
  {
    original: 'a',
    translation: 'un',
    context: 'I am learning a new language',
  },
  {
    original: 'I',
    translation: 'yo',
    context: 'I am learning',
  },
  {
    original: 'test-case',
    translation: 'caso-de-prueba',
    context: 'This is a test-case for hyphenated words',
  },
  {
    original: 'multi word phrase',
    translation: 'frase de múltiples palabras',
    context: 'This is a multi word phrase that spans several words',
  },
]
