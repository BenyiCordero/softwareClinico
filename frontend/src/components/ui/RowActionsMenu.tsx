import { MoreVertical } from 'lucide-react'
import { DropdownMenu, type DropdownMenuItem } from './DropdownMenu'
export interface RowActionsMenuProps { items: DropdownMenuItem[]; label?: string }
export function RowActionsMenu({ items, label = 'Abrir acciones del registro' }: RowActionsMenuProps) { if (items.length === 0) return null; return <DropdownMenu ariaLabel={label} items={items} trigger={<MoreVertical className="h-4 w-4" />} /> }
