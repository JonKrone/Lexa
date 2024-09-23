import {
  IconButton,
  List,
  ListItem,
  ListItemText,
  TextField,
} from '@mui/material'
import { Trash2 } from 'lucide-react'
import { FC } from 'react'
import { urlIsValid } from '../lib/storage'
import {
  useAddIgnoredSite,
  useIgnoredSites,
  useRemoveIgnoredSite,
} from '../queries/ignored-sites'
import { SubmitButton } from './SubmitButton'
import { H5 } from './Typography'

interface Props {}

export const IgnoredSitesManager: FC<Props> = () => {
  const { data: ignoredSites = [], isFetched } = useIgnoredSites()
  const { mutateAsync: addSite } = useAddIgnoredSite()
  const { mutateAsync: removeSite } = useRemoveIgnoredSite()

  if (!isFetched) return null

  const handleAddSite = async (formData: FormData) => {
    const newSite = formData.get('newSite') as string
    if (!newSite) return

    if (!urlIsValid(newSite)) {
      console.error('Invalid URL')
      // TODO: Show error to user
      return
    }

    await addSite(newSite)
    formData.delete('newSite')
  }

  const handleRemoveSite = async (url: string) => {
    await removeSite(url)
  }

  return (
    <div>
      <H5>Ignored Sites</H5>
      <form
        action={handleAddSite}
        style={{ display: 'flex', alignItems: 'center' }}
      >
        {/**
         * TODO: Make this very user friendly. Show examples, provide useful error messages.
         */}
        <TextField
          name="newSite"
          placeholder="i.e. lexa.com"
          variant="outlined"
          sx={{ mr: 2, flexGrow: 1 }}
        />
        <SubmitButton variant="contained" size="medium">
          Add
        </SubmitButton>
      </form>
      <List disablePadding>
        {ignoredSites.map((site) => (
          <ListItem
            key={site.url}
            disablePadding
            secondaryAction={
              <IconButton
                edge="end"
                aria-label="delete"
                onClick={() => handleRemoveSite(site.url)}
                color="error"
              >
                <Trash2 />
              </IconButton>
            }
          >
            <ListItemText primary={site.url} />
          </ListItem>
        ))}
      </List>
    </div>
  )
}
