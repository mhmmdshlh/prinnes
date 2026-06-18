import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url'

const PDF_TYPE = 'application/pdf'
let pdfjsLib = null

async function getPdfjs() {
  if (!pdfjsLib) {
    pdfjsLib = await import('pdfjs-dist')
    pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker
  }
  return pdfjsLib
}

async function countPdfPage(file) {
  const pdf = await getPdfjs()
  const buffer = await file.arrayBuffer()
  const doc = await pdf.getDocument({ data: buffer }).promise
  return doc.numPages
}

export async function extractTotalPages(files) {
  let total = 0
  for (const file of files) {
    if (file.type === PDF_TYPE) {
      total += await countPdfPage(file)
    } else {
      total += 1
    }
  }
  return total
}
