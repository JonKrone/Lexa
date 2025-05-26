import {
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
  Slider,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import React from 'react'
import { useLocation } from 'wouter'
import { IgnoredSitesManager } from '../components/IgnoredSitesManager'
import { Caption, H5 } from '../components/Typography'
import { Database } from '../config/database.types'
import { debounce } from '../lib/utils'
import { useSignOut } from '../queries/auth'
import { useSettingsSuspense, useUpdateSetting } from '../queries/settings'

type LearningLevel = Database['public']['Enums']['learning_levels']

const Settings: React.FC = () => {
  return (
    <Stack spacing={4}>
      <H5 gutterBottom>Settings</H5>

      <TargetLanguageField />
      <LearningLevelField />
      <LearningGoalsField />
      <IgnoredSitesManager />

      <AdvancedSettingsButton />
      <LogoutButton />
    </Stack>
  )
}

const LogoutButton = () => {
  const { mutateAsync: signOut } = useSignOut()
  const [_, setLocation] = useLocation()

  return (
    <Button
      variant="contained"
      fullWidth
      onClick={async () => {
        await signOut()
        setLocation('/auth/login')
      }}
    >
      Logout
    </Button>
  )
}

const AdvancedSettingsButton = () => {
  const [open, setOpen] = React.useState(false)

  const handleClose = () => setOpen(false)

  return (
    <>
      <Button variant="contained" fullWidth onClick={() => setOpen(true)}>
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
    </>
  )
}

const TargetLanguageField = () => {
  const { data: settings } = useSettingsSuspense()
  const { mutate: updateSetting } = useUpdateSetting()

  return (
    <FormControl fullWidth>
      <InputLabel id="target-language-label">Target Language</InputLabel>
      <Select
        labelId="target-language-label"
        id="target-language"
        label="Target Language"
        value={settings?.target_language}
        onChange={(e) => {
          updateSetting({ target_language: e.target.value })
        }}
      >
        <MenuItem value="fr">French</MenuItem>
        <MenuItem value="es">Spanish</MenuItem>
        <MenuItem value="de">German</MenuItem>
      </Select>
    </FormControl>
  )
}

const LearningLevelField = () => {
  const { data: settings } = useSettingsSuspense()
  const { mutate: updateSetting } = useUpdateSetting()
  const debouncedUpdateSetting = debounce(updateSetting, 350)
  const [currentLevel, setCurrentLevel] = React.useState<LearningLevel>(
    (settings?.learning_level as LearningLevel) ?? 'beginner',
  )

  const getLevelCaption = (level: LearningLevel) =>
    ({
      beginner: 'Just starting out.',
      intermediate: 'Some experience.',
      advanced: 'Fluent and beyond.',
    })[level]

  return (
    <FormControl fullWidth sx={{ mt: 2, mb: 2 }}>
      <Typography id="learning-level-slider" gutterBottom>
        Learning Level
      </Typography>
      <Slider
        aria-labelledby="learning-level-slider"
        value={LevelValueMap[currentLevel as LearningLevel]}
        onChange={(_, value) => {
          const level = LevelValueMap[value as 0 | 1 | 2] as LearningLevel
          setCurrentLevel(level)
          debouncedUpdateSetting({ learning_level: level })
        }}
        step={null}
        marks={[
          { value: 0, label: 'Beginner' },
          { value: 1, label: 'Intermediate' },
          { value: 2, label: 'Advanced' },
        ]}
        min={0}
        max={2}
        sx={{
          '& span.MuiSlider-markLabel': {
            '&[data-index="0"]': {
              left: '9% !important',
            },
            '&[data-index="2"]': {
              left: '91% !important',
            },
          },
        }}
      />
      <Caption color="text.secondary">{getLevelCaption(currentLevel)}</Caption>
    </FormControl>
  )
}

const LearningGoalsField = () => {
  const { data: settings } = useSettingsSuspense()
  const { mutate: updateSetting } = useUpdateSetting()
  const debouncedUpdateSetting = debounce(updateSetting, 350)

  return (
    <FormControl fullWidth sx={{ mt: 2, mb: 2 }}>
      <InputLabel htmlFor="learning-goals" shrink>
        Learning Goals
      </InputLabel>
      <TextField
        id="learning-goals"
        multiline
        minRows={3}
        fullWidth
        variant="outlined"
        placeholder="Describe your language learning goals here..."
        defaultValue={settings?.learning_goals ?? ''}
        onChange={(e) => {
          debouncedUpdateSetting({ learning_goals: e.target.value })
        }}
        slotProps={{
          input: {
            style: { resize: 'vertical' },
          },
        }}
      />
    </FormControl>
  )
}

const LevelValueMap = {
  beginner: 0,
  intermediate: 1,
  advanced: 2,
  0: 'beginner',
  1: 'intermediate',
  2: 'advanced',
}

export default Settings
