import { X, Download, FileText } from 'lucide-react'

export default function FilePreviewModal({ file, publicUrl, onClose }) {
  const isImage = file.file_name?.match(/\.(jpg|jpeg|png)$/i)
  const isPdf = file.file_name?.match(/\.pdf$/i)

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
            <h2 className="truncate text-sm font-semibold">{file.file_name}</h2>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={publicUrl}
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
              src={publicUrl}
              alt={file.file_name}
              className="max-h-[70vh] rounded-lg object-contain"
            />
          ) : isPdf ? (
            <iframe
              src={publicUrl}
              title={file.file_name}
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
                href={publicUrl}
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