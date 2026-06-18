import { useState } from 'react'
import { Upload, FileText, X, Download, Eye } from 'lucide-react'
import { formatFileSize } from '../../lib/utils/format'

function FilePreviewModal({ file, url, onClose }) {
  const isImage = file.name?.match(/\.(jpg|jpeg|png)$/i)
  const isPdf = file.name?.match(/\.pdf$/i)

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="flex w-full max-w-3xl flex-col rounded-xl bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b px-6 py-4">
          <div className="flex items-center gap-3 truncate">
            <FileText className="h-5 w-5 shrink-0 text-primary" />
            <h2 className="truncate text-sm font-semibold">{file.name}</h2>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted hover:text-primary flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm transition-colors"
            >
              <Download className="h-4 w-4" />
              Download
            </a>
            <button
              onClick={onClose}
              className="text-muted hover:text-error rounded-lg p-1.5 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="flex max-h-[80vh] items-start justify-center overflow-auto p-6">
          {isImage ? (
            <img
              src={url}
              alt={file.name}
              loading="lazy"
              className="max-h-[70vh] rounded-lg object-contain"
            />
          ) : isPdf ? (
            <iframe
              src={url}
              title={file.name}
              className="h-[70vh] w-full rounded-lg"
            />
          ) : (
            <div className="flex flex-col items-center gap-4 py-16 text-center">
              <FileText className="text-muted h-16 w-16" />
              <div>
                <p className="font-medium">Pratinjau tidak tersedia</p>
                <p className="text-muted mt-1 text-sm">
                  Format ini tidak dapat ditampilkan di browser.
                </p>
              </div>
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-primary hover:bg-primary-dark inline-flex items-center gap-2 rounded-lg px-6 py-2.5 text-sm font-medium text-white transition-colors"
              >
                <Download className="h-4 w-4" />
                Download File
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function FileUpload({ files, onUpload, onRemove, error }) {
  const [previewFile, setPreviewFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState('')

  function openPreview(file) {
    const url = URL.createObjectURL(file)
    setPreviewUrl(url)
    setPreviewFile(file)
  }

  function closePreview() {
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setPreviewFile(null)
    setPreviewUrl('')
  }

  return (
    <>
      <div className="space-y-4">
        <div className="rounded-xl border bg-white p-8 shadow-sm">
          <div className="flex flex-col items-center justify-center">
            <Upload className="text-muted h-12 w-12" />
            <p className="text-muted mt-4 text-sm">
              Format: PDF, DOCX, DOC, JPG, PNG (maks. 20 MB/file)
            </p>
            <label className="bg-primary hover:bg-primary-dark mt-4 cursor-pointer rounded-lg px-6 py-3 text-sm font-medium text-white transition-colors">
              Pilih File
              <input
                type="file"
                multiple
                accept=".pdf,.docx,.doc,.jpg,.jpeg,.png"
                onChange={onUpload}
                className="hidden"
              />
            </label>
          </div>

          {error && (
            <p className="mt-4 text-center text-sm text-red-500">
              {error}
            </p>
          )}

          {files.length > 0 && (
            <div className="mt-6 space-y-2">
              {files.map((file, i) => (
                <div
                  key={i}
                  className="border-outline flex items-center justify-between rounded-lg border p-3"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="text-muted h-5 w-5" />
                    <div>
                      <p className="text-sm font-medium">{file.name}</p>
                      <p className="text-muted text-xs">
                        {formatFileSize(file.size)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openPreview(file)}
                      className="text-primary hover:bg-primary/5 flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      Lihat
                    </button>
                    <button
                      onClick={() => onRemove(i)}
                      className="text-xs text-red-500 hover:underline"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {previewFile && (
        <FilePreviewModal
          file={previewFile}
          url={previewUrl}
          onClose={closePreview}
        />
      )}
    </>
  )
}