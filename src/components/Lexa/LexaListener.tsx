import { FC, useEffect } from 'react'
import {
  generatePageTranslations,
  GeneratePageTranslationsSettings,
} from '../../ai/generatePageTranslations'
import { htmlToMarkdown } from '../../lib/htmlToMarkdown'
import { logger } from '../../lib/logger'
// import { replaceTextSegments } from '../../lib/replaceTextSegments'

import { injectTranslations } from '../../lib/injectTranslations'
import { useSettings } from '../../queries/settings'
import { useUserPhrases } from '../../queries/user-phrase'

/**
 * The entry point for the Lexa extension. It waits for auth and settings to load, then starts the
 * translation process.
 */
export const LexaListener: FC = () => {
  const {
    data: settings,
    isLoading: settingsLoading,
    error: settingsError,
  } = useSettings()
  const { data: _userPhrases = [], isLoading: phrasesLoading } =
    useUserPhrases()

  useEffect(() => {
    if (settingsLoading || phrasesLoading) return

    if (settingsError) {
      logger.log('Error loading settings:', settingsError)
      return
    }

    if (!settings) {
      logger.log(
        'No settings found. User may not be logged in or settings not configured.',
      )
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
      logger.log('Markdown:', { markdown })

      if (true) {
        const result = await generatePageTranslations(markdown, userPreferences)

        // for await (const translation of result.elementStream) {
        //   logger.log('translation:', translation)
        //   // Replace the text segments in the DOM
        //   replaceTextSegments(document.body, [translation])
        // }
        for await (const translation of result.elementStream) {
          // collected.push(translation)
          injectTranslations([translation]) // batch‑inject after GPT finishes
        }
      } else {
        // replaceTextSegments(document.body, [
        //   {
        //     original: 'host page',
        //     translation: 'página anfitriona',
        //     context:
        //       'The page where the script runs is called the **host page**.',
        //   },
        // ])
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
  }, [settings, settingsLoading, settingsError, phrasesLoading])

  return null
}
