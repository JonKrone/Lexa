import {
  IconButton,
  List,
  ListItem,
  ListItemText,
  TextField,
} from '@mui/material'
import { Trash2 } from 'lucide-react'
import { FC, useActionState } from 'react'
import {
  useAddIgnoredSite,
  useIgnoredSites,
  useRemoveIgnoredSite,
} from '../queries/ignored-sites'
import { SubmitButton } from './SubmitButton'
import { Body2, H5 } from './Typography'

interface Props {}

export const IgnoredSitesManager: FC<Props> = () => {
  const { data: ignoredSites = [], isFetched } = useIgnoredSites()
  const { mutateAsync: addSite } = useAddIgnoredSite()
  const { mutateAsync: removeSite } = useRemoveIgnoredSite()
  const sortedIgnoredSites = ignoredSites.sort((a, b) =>
    a.url.localeCompare(b.url),
  )

  // `useActionState` is helpful here to consolidate our error messages to one slice of behavior.
  const [message, addSiteAction] = useActionState(
    async (_prev: null | string, formData: FormData) => {
      const newSite = formData.get('newSite') as string
      if (!newSite) return 'Please enter a url'

      // We need a handle on the promise so that the form is properly marked as pending but we also
      // need to catch errors so they don't crash the app and instead populate the `error` state of
      // the mutation.
      try {
        await addSite(newSite)
      } catch (error: any) {
        return error?.message
      }

      formData.delete('newSite')
    },
    null,
  )

  const handleRemoveSite = async (url: string) => {
    await removeSite(url)
  }

  if (!isFetched) return null

  return (
    <div>
      <H5>Ignored Sites</H5>
      <form action={addSiteAction} style={{ marginBottom: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
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
        </div>
        {/* {error && (
          <Grow in>
            <Body2 color="error">{error.message}</Body2>
          </Grow>
        )} */}
        {message && <Body2 color="error">{message}</Body2>}
      </form>
      <List disablePadding>
        {sortedIgnoredSites.map((site) => (
          <ListItem
            key={site.url}
            disablePadding
            sx={{
              '&:hover': {
                backgroundColor: 'action.hover',
              },
            }}
            secondaryAction={
              <IconButton
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
