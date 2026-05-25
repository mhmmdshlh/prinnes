import { ClipboardList } from 'lucide-react'

export default function EmptyState({ icon: Icon = ClipboardList, title, description, action }) {
  return (
    <div className="flex flex-col items-center py-12 text-center">
      <Icon className="text-muted h-12 w-12" />
      <p className="text-muted mt-4">{title}</p>
      {description && <p className="text-muted mt-1 text-sm">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}