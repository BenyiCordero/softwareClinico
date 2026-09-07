import { AlertTriangle } from 'lucide-react'
import { Modal } from './Modal'
import { Button } from './Button'

export interface ConfirmDialogProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  title?: string
  description?: string
  confirmText?: string
  cancelText?: string
  loading?: boolean
}

export const ConfirmDialog = ({
  open,
  onClose,
  onConfirm,
  title = '¿Estás seguro?',
  description = 'Esta acción no se puede deshacer.',
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  loading = false,
}: ConfirmDialogProps) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      size="sm"
      hideClose
      closeOnBackdrop={!loading}
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            {cancelText}
          </Button>
          <Button variant="danger" onClick={onConfirm} loading={loading}>
            {confirmText}
          </Button>
        </>
      }
    >
      <div className="flex flex-col items-center px-2 py-4 text-center">
        <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-warning-light text-warning">
          <AlertTriangle className="h-7 w-7" />
        </div>
        <h4 className="text-lg font-bold text-ink">{title}</h4>
        <p className="mt-1 max-w-sm text-sm text-ink-muted">{description}</p>
      </div>
    </Modal>
  )
}