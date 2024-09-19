import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material'
import React from 'react'
import { IgnoredSitesManager } from '../components/IgnoredSitesManager'
import { debounce } from '../lib/utils'
import { useSettings, useUpdateSetting } from '../queries/settings'

const Settings: React.FC = () => {
  const [open, setOpen] = React.useState(false)
  const { data: settings } = useSettings()
  const { mutate: updateSetting } = useUpdateSetting()
  const debouncedUpdateSetting = debounce(updateSetting, 350)

  if (!settings) return null

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <Box sx={{ '& > *': { marginBottom: 3 } }}>
      <Typography variant="h5" gutterBottom>
        Settings
      </Typography>
      <FormControl fullWidth>
        <InputLabel id="target-language-label">Target Language</InputLabel>
        <Select
          labelId="target-language-label"
          id="target-language"
          label="Target Language"
          defaultValue={settings.target_language ?? ''}
          onChange={(e) => {
            updateSetting({ target_language: e.target.value })
          }}
        >
          <MenuItem value="fr">French</MenuItem>
          <MenuItem value="es">Spanish</MenuItem>
          <MenuItem value="de">German</MenuItem>
        </Select>
      </FormControl>

      <FormControl fullWidth sx={{ mt: 2, mb: 2 }}>
        <InputLabel htmlFor="learning-goals" shrink>
          Learning Goals
        </InputLabel>
        <TextField
          id="learning-goals"
          multiline
          rows={3}
          draggable
          placeholder="Describe your language learning goals here..."
          defaultValue={settings.learning_goals ?? ''}
          onChange={(e) => {
            debouncedUpdateSetting({ learning_goals: e.target.value })
          }}
        />
      </FormControl>

      <IgnoredSitesManager />

      <Button variant="contained" fullWidth onClick={handleClickOpen}>
        Advanced Settings
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Advanced Settings</DialogTitle>
        <DialogContent>
          <FormControlLabel
            control={<Checkbox defaultChecked />}
            label="Notifications"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default Settings
