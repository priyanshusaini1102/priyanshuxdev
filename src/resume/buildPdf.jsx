import { pdf } from "@react-pdf/renderer"
import { ResumeDocument } from "./ResumeDocument.jsx"

export function buildResumePdf(resume) {
  return pdf(<ResumeDocument resume={resume} />).toBlob()
}

export async function blobToBase64(blob) {
  const bytes = new Uint8Array(await blob.arrayBuffer())
  let binary = ""
  const size = 0x8000
  for (let index = 0; index < bytes.length; index += size) {
    binary += String.fromCharCode(...bytes.subarray(index, index + size))
  }
  return btoa(binary)
}

export async function countPdfPages(blob) {
  const raw = new TextDecoder("latin1").decode(new Uint8Array(await blob.arrayBuffer()))
  return raw.match(/\/Type\s*\/Page(?!s)/g)?.length || 1
}
