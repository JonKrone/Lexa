import * as Checkbox from '@radix-ui/react-checkbox'
import * as Dialog from '@radix-ui/react-dialog'
import * as Label from '@radix-ui/react-label'
import * as Select from '@radix-ui/react-select'
import React from 'react'
import { IgnoredSitesManager } from '../components/IgnoredSitesManage'

const Settings: React.FC = () => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-800">Settings</h2>
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <Label.Root htmlFor="target-language" className="text-gray-600">
            Target Language
          </Label.Root>
          <Select.Root>
            <Select.Trigger className="border rounded px-2 py-1">
              <Select.Value placeholder="Select a language" />
            </Select.Trigger>
            <Select.Portal>
              <Select.Content className="bg-white border rounded shadow-lg">
                <Select.Viewport>
                  <Select.Item
                    value="french"
                    className="px-2 py-1 hover:bg-gray-100 cursor-pointer"
                  >
                    <Select.ItemText>French</Select.ItemText>
                  </Select.Item>
                  <Select.Item
                    value="spanish"
                    className="px-2 py-1 hover:bg-gray-100 cursor-pointer"
                  >
                    <Select.ItemText>Spanish</Select.ItemText>
                  </Select.Item>
                  <Select.Item
                    value="german"
                    className="px-2 py-1 hover:bg-gray-100 cursor-pointer"
                  >
                    <Select.ItemText>German</Select.ItemText>
                  </Select.Item>
                </Select.Viewport>
              </Select.Content>
            </Select.Portal>
          </Select.Root>
        </div>
        <IgnoredSitesManager />
        <div className="flex justify-between items-center">
          <Label.Root htmlFor="daily-word-goal" className="text-gray-600">
            Daily Word Goal
          </Label.Root>
          <input
            id="daily-word-goal"
            type="number"
            className="border rounded px-2 py-1 w-16 text-right"
            defaultValue={10}
          />
        </div>
        <Dialog.Root>
          <Dialog.Trigger asChild>
            <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-300">
              Advanced Settings
            </button>
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50" />
            <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg w-80">
              <Dialog.Title className="text-xl font-bold mb-4">
                Advanced Settings
              </Dialog.Title>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label.Root htmlFor="notifications" className="text-gray-600">
                    Notifications
                  </Label.Root>
                  <Checkbox.Root
                    id="notifications"
                    defaultChecked
                    className="w-5 h-5 border rounded"
                  >
                    <Checkbox.Indicator className="flex items-center justify-center">
                      ✓
                    </Checkbox.Indicator>
                  </Checkbox.Root>
                </div>
                <div className="flex justify-between items-center">
                  <Label.Root htmlFor="data-sync" className="text-gray-600">
                    Data Sync
                  </Label.Root>
                  <Checkbox.Root
                    id="data-sync"
                    defaultChecked
                    className="w-5 h-5 border rounded"
                  >
                    <Checkbox.Indicator className="flex items-center justify-center">
                      ✓
                    </Checkbox.Indicator>
                  </Checkbox.Root>
                </div>
              </div>
              <Dialog.Close asChild>
                <button className="mt-4 bg-gray-200 px-4 py-2 rounded hover:bg-gray-300 transition duration-300">
                  Close
                </button>
              </Dialog.Close>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </div>
    </div>
  )
}

export default Settings
