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

const Settings: React.FC = () => {
  const [open, setOpen] = React.useState(false)

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
          defaultValue=""
        >
          <MenuItem value="french">French</MenuItem>
          <MenuItem value="spanish">Spanish</MenuItem>
          <MenuItem value="german">German</MenuItem>
        </Select>
      </FormControl>
      <IgnoredSitesManager />
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography>Daily Word Goal</Typography>
        <TextField
          id="daily-word-goal"
          type="number"
          defaultValue={10}
          InputProps={{ inputProps: { min: 1 } }}
          sx={{ width: '80px' }}
        />
      </Box>
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
          <FormControlLabel
            control={<Checkbox defaultChecked />}
            label="Data Sync"
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
