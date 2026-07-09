import { useState, type FormEvent } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { useTableStore } from '@/store/table-store'

export function CreateCustomViewModal() {
  const isOpen = useTableStore((s) => s.isCreateViewModalOpen)
  const setOpen = useTableStore((s) => s.setCreateViewModalOpen)
  const addSavedView = useTableStore((s) => s.addSavedView)
  const [name, setName] = useState('')

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    addSavedView(name.trim())
    setName('')
    setOpen(false)
  }

  return (
    <Modal
      open={isOpen}
      onClose={() => setOpen(false)}
      title="Create Custom View"
      footer={
        <>
          <Button variant="secondary" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" form="create-view-form">
            Create View
          </Button>
        </>
      }
    >
      <form id="create-view-form" onSubmit={handleSubmit}>
        <Input
          label="Enter View Name"
          placeholder="e.g. Daily Review"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoFocus
          required
        />
      </form>
    </Modal>
  )
}
