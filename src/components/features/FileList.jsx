import { useState } from 'react'
import { Eye, FileText } from 'lucide-react'
import { formatFileSize } from '../../lib/utils/format'
import { supabase } from '../../lib/supabase/client'
import FilePreviewModal from './FilePreviewModal'

export default function FileList({ files = [] }) {
  const [previewFile, setPreviewFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState('')

  if (!files.length) return null

  function openPreview(file) {
    const { data } = supabase.storage
      .from('order-files')
      .getPublicUrl(file.file_path)
    setPreviewUrl(data.publicUrl)
    setPreviewFile(file)
  }

  return (
    <>
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="font-heading mb-4 text-lg font-semibold">File Dokumen</h2>
        <div className="space-y-2">
          {files.map((file) => (
            <div
              key={file.id}
              className="border-outline flex items-center justify-between rounded-lg border p-3"
            >
              <div className="flex items-center gap-3">
                <FileText className="text-muted h-5 w-5" />
                <div>
                  <p className="text-sm font-medium">{file.file_name}</p>
                  <p className="text-muted text-xs">{formatFileSize(file.file_size)}</p>
                </div>
              </div>
              <button
                onClick={() => openPreview(file)}
                className="text-primary hover:bg-primary/5 flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors"
              >
                <Eye className="h-3.5 w-3.5" />
                Lihat
              </button>
            </div>
          ))}
        </div>
      </div>

      {previewFile && (
        <FilePreviewModal
          file={previewFile}
          publicUrl={previewUrl}
          onClose={() => {
            setPreviewFile(null)
            setPreviewUrl('')
          }}
        />
      )}
    </>
  )
}