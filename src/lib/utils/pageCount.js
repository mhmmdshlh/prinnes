import * as pdfjsLib from 'pdfjs-dist'
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url'

const PDF_TYPE = 'application/pdf'

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker

async function countPdfPage(file) {
  const buffer = await file.arrayBuffer()
  const pdf = await pdfjsLib.getDocument({ data: buffer }).promise
  return pdf.numPages
}

export async function extractTotalPages(files) {
  let total = 0
  for (const file of files) {
    const type = file.type
    if (type === PDF_TYPE) {
      total += await countPdfPage(file)
    } else {
      total += 1
    }
  }
  return total
}
