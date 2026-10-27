import { useEffect, useId, useRef, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { cn } from '@/lib/cn'

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl'
export interface ModalProps { open: boolean; onClose: () => void; title?: ReactNode; description?: ReactNode; ariaLabel?: string; size?: ModalSize; children: ReactNode; footer?: ReactNode; closeOnBackdrop?: boolean; hideClose?: boolean }
const sizeClasses: Record<ModalSize, string> = { sm: 'max-w-md', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl' }
const focusable = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

export const Modal = ({ open, onClose, title, description, ariaLabel, size = 'md', children, footer, closeOnBackdrop = true, hideClose = false }: ModalProps) => {
  const dialogRef = useRef<HTMLDivElement>(null)
  const previousFocus = useRef<HTMLElement | null>(null)
  const id = useId().replace(/:/g, '')
  const titleId = `modal-title-${id}`
  const descriptionId = `modal-description-${id}`

  useEffect(() => {
    if (!open) return
    previousFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const dialog = dialogRef.current
    const first = dialog?.querySelector<HTMLElement>(focusable)
    ;(first ?? dialog)?.focus()
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { event.preventDefault(); onClose() ; return }
      if (event.key !== 'Tab' || !dialog) return
      const elements = Array.from(dialog.querySelectorAll<HTMLElement>(focusable)).filter((element) => element.offsetParent !== null)
      if (elements.length === 0) { event.preventDefault(); return }
      const firstElement = elements[0]
      const lastElement = elements[elements.length - 1]
      if (event.shiftKey && document.activeElement === firstElement) { event.preventDefault(); lastElement.focus() }
      else if (!event.shiftKey && document.activeElement === lastElement) { event.preventDefault(); firstElement.focus() }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => { document.body.style.overflow = previousOverflow; document.removeEventListener('keydown', onKeyDown); previousFocus.current?.focus() }
  }, [open, onClose])

  if (!open) return null
  return createPortal(<div className="fixed inset-0 z-[100] flex items-center justify-center p-4"><div className="absolute inset-0 animate-fade-in bg-black/40" onClick={closeOnBackdrop ? onClose : undefined} aria-hidden="true" /><div ref={dialogRef} role="dialog" aria-modal="true" aria-label={ariaLabel} aria-labelledby={title ? titleId : undefined} aria-describedby={description ? descriptionId : undefined} tabIndex={-1} className={cn('animate-fade-in-up relative z-10 flex max-h-[90vh] w-full flex-col rounded-2xl bg-surface shadow-2xl focus:outline-none', sizeClasses[size])}>{(title || !hideClose) && <div className="flex items-start justify-between gap-4 border-b border-line-light px-5 py-4"> <div className="min-w-0">{title && <h3 id={titleId} className="text-lg font-bold text-ink">{title}</h3>}{description && <p id={descriptionId} className="mt-0.5 text-sm text-ink-muted">{description}</p>}</div>{!hideClose && <button type="button" onClick={onClose} className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-lg text-ink-muted transition-colors hover:bg-line-light hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40" aria-label="Cerrar"><X className="h-4 w-4" /></button>}</div>}<div className="flex-1 overflow-y-auto px-5 py-4">{children}</div>{footer && <div className="flex flex-wrap items-center justify-end gap-2 border-t border-line-light px-5 py-3">{footer}</div>}</div></div>, document.body)
}
