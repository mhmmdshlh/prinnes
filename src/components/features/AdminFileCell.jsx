import { useEffect, useState } from 'react'
import { Eye, FileText } from 'lucide-react'
import { supabase } from '../../lib/supabase/client'

function FileItem({ file }) {
  const [exists, setExists] = useState(null)

  const { data } = supabase.storage.from('order-files').getPublicUrl(file.file_path)
  const publicUrl = data.publicUrl

  useEffect(() => {
    let cancelled = false
    fetch(publicUrl, { method: 'HEAD' })
      .then((res) => { if (!cancelled) setExists(res.ok) })
      .catch(() => { if (!cancelled) setExists(false) })
    return () => { cancelled = true }
  }, [publicUrl])

  if (exists === null) {
    return (
      <span className="text-muted flex items-center gap-1">
        <FileText className="h-3 w-3 shrink-0" />
        <span className="truncate text-xs">{file.file_name}</span>
      </span>
    )
  }

  if (!exists) {
    return (
      <span className="text-muted flex items-center gap-1">
        <FileText className="h-3 w-3 shrink-0" />
        <span className="truncate text-xs">{file.file_name}</span>
      </span>
    )
  }

  return (
    <div className="flex items-center gap-2">
      {file.file_name?.match(/\.(jpg|jpeg|png)$/i) ? (
        <img
          src={publicUrl}
          alt={file.file_name}
          className="h-8 w-8 shrink-0 rounded object-cover"
        />
      ) : (
        <FileText className="text-muted h-4 w-4 shrink-0" />
      )}
      <a
        href={publicUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary hover:underline truncate text-xs"
      >
        {file.file_name}
      </a>
      <a
        href={publicUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-muted hover:text-primary shrink-0 transition-colors"
        title="Preview"
      >
        <Eye className="h-3 w-3" />
      </a>
    </div>
  )
}

export default function AdminFileCell({ files = [] }) {
  if (!files || files.length === 0) {
    return <span className="text-muted text-xs">&mdash;</span>
  }

  return (
    <div className="space-y-1.5">
      {files.map((file) => (
        <FileItem key={file.id} file={file} />
      ))}
    </div>
  )
}
