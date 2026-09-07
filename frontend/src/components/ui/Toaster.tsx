import { Toaster as SonnerToaster } from 'sonner'

export const Toaster = () => {
  return (
    <SonnerToaster
      position="top-right"
      closeButton
      toastOptions={{
        className: '!font-sans !text-sm !text-ink !border !border-line !rounded-lg !shadow-lg',
        style: {
          background: 'var(--color-surface)',
        },
      }}
    />
  )
}