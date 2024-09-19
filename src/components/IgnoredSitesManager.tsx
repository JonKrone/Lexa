import {
  Box,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemText,
  TextField,
} from '@mui/material'
import { Trash2 } from 'lucide-react'
import { FC } from 'react'
import {
  useAddIgnoredSite,
  useIgnoredSites,
  useRemoveIgnoredSite,
} from '../queries/ignored-sites'
import { H5 } from './Typography'

interface Props {}

export const IgnoredSitesManager: FC<Props> = () => {
  const { data: ignoredSites = [], isFetched } = useIgnoredSites()
  const { mutate: addSite } = useAddIgnoredSite()
  const { mutate: removeSite } = useRemoveIgnoredSite()

  if (!isFetched) return null

  const handleAddSite = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const newSite = form.elements.namedItem('newSite') as HTMLInputElement
    if (newSite && newSite.value) {
      addSite(newSite.value)
      form.reset()
    }
  }

  const handleRemoveSite = (domain: string) => {
    removeSite(domain)
  }

  return (
    <Box>
      <H5 gutterBottom>Manage Ignored Sites</H5>
      <form
        onSubmit={handleAddSite}
        style={{ display: 'flex', alignItems: 'center' }}
      >
        {/**
         * TODO: Make this very user friendly. Show examples, provide useful error messages.
         */}
        <TextField
          name="newSite"
          placeholder="i.e. lexa.com"
          variant="outlined"
          size="small"
          sx={{ mr: 2, flexGrow: 1 }}
        />
        <Button type="submit" variant="contained" color="primary" size="medium">
          Add
        </Button>
      </form>
      <List>
        {ignoredSites.map((site) => (
          <ListItem
            key={site.domain}
            secondaryAction={
              <IconButton
                edge="end"
                aria-label="delete"
                onClick={() => handleRemoveSite(site.domain)}
                color="error"
              >
                <Trash2 />
              </IconButton>
            }
            sx={{}}
          >
            <ListItemText primary={site.domain} />
          </ListItem>
        ))}
      </List>
    </Box>
  )
}
