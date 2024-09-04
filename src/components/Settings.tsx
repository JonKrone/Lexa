import * as Dialog from '@radix-ui/react-dialog'
import React from 'react'

const Settings: React.FC = () => {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Settings</h2>
      <Dialog.Root>
        <Dialog.Trigger asChild>
          <button className="bg-blue-500 text-white px-4 py-2 rounded">
            Open Language Settings
          </button>
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50" />
          <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg">
            <Dialog.Title className="text-xl font-bold mb-4">
              Language Settings
            </Dialog.Title>
            <p>Configure your language learning preferences here.</p>
            <Dialog.Close asChild>
              <button className="mt-4 bg-gray-200 px-4 py-2 rounded">
                Close
              </button>
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  )
}

export default Settings
