import { FC, useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import {
  generatePageTranslations,
  GeneratePageTranslationsSettings,
} from '../ai/generatePageTranslations'
import { htmlToMarkdown } from '../lib/htmlToMarkdown'
import { replaceTextSegments } from '../lib/replaceTextSegments'
import { useSettings } from '../queries/settings'
import { Providers } from './Providers'

export const mountLexaListener = () => {
  const customElement = document.createElement('div')
  customElement.id = 'lexa-settings-listener'
  document.body.appendChild(customElement)

  ReactDOM.createRoot(customElement).render(
    <Providers>
      <LexaListener />
    </Providers>,
  )
}

/**
 *
 */
export const LexaListener: FC = () => {
  const { data: settings } = useSettings()

  useEffect(() => {
    if (!settings) {
      console.log('Lexa: You are not logged in. Not starting.')
      return
    }

    const doTranslations = async () => {
      // Define user preferences (these will later be dynamic)
      const userPreferences: GeneratePageTranslationsSettings = {
        targetLanguage: settings.target_language,
        learningGoals: settings.learning_goals ?? '',
        proficiencyLevel: settings.learning_level,
        preferredPhraseLength: 'Short',
        translationDensityPercent: 10,
      }

      const markdown = htmlToMarkdown(document.body)
      console.log('Markdown:', { markdown })

      if (false) {
        const result = await generatePageTranslations(markdown, userPreferences)

        for await (const translation of result.elementStream) {
          // Replace the text segments in the DOM
          replaceTextSegments(document.body, [translation])
        }
      } else {
        replaceTextSegments(document.body, [
          {
            original: 'host page',
            translation: 'página anfitriona',
            context:
              'The page where the script runs is called the **host page**.',
          },
        ])
        // replaceTextSegments(document.body, [
        //   {
        //     original: 'create our root element',
        //     translation: 'crear nuestro elemento raíz',
        //     context:
        //       "Content scripts don't use an HTML file, so we need to create our root element and append it to the DOM.",
        //   },
        // ])
      }
    }

    doTranslations()
  }, [settings])

  return null
}
