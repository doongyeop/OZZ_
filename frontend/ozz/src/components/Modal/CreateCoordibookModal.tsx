'use client'

import { useState } from 'react'

type CreateCoordibookModalProps = {
  onClose: () => void
  onCreate: (name: string) => void
}

export default function CreateCoordibookModal({
  onClose,
  onCreate,
}: CreateCoordibookModalProps) {
  const [name, setName] = useState('')

  const handleSubmit = () => {
    if (name.trim()) {
      onCreate(name.trim())
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-secondary bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-4 w-80">
        <h2 className="text-lg font-semibold mb-4">Create New Coordibook</h2>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Coordibook Name"
          className="w-full p-2 mb-4 border rounded-lg"
        />
        <div className="flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 mr-4"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="bg-primary-400 text-white p-2 rounded-lg"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  )
}
