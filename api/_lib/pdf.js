import { LIMITS } from "../../src/resume/validate.js"

export function validatePdfBase64(value) {
  if (typeof value !== "string" || value.trim() === "") {
    return { ok: false, error: "PDF is missing." }
  }
  const cleaned = value.replace(/^data:application\/pdf;base64,/i, "").replace(/\s+/g, "")
  if (cleaned.length > Math.ceil(LIMITS.pdfBytes * 1.4)) {
    return { ok: false, error: "PDF is too large." }
  }
  if (!/^[A-Za-z0-9+/]+={0,2}$/.test(cleaned)) {
    return { ok: false, error: "PDF is not valid base64." }
  }
  const buffer = Buffer.from(cleaned, "base64")
  if (buffer.length < 800 || buffer.length > LIMITS.pdfBytes) {
    return { ok: false, error: "PDF size is not allowed." }
  }
  if (buffer.subarray(0, 5).toString("latin1") !== "%PDF-") {
    return { ok: false, error: "File is not a PDF." }
  }
  return { ok: true, base64: buffer.toString("base64"), bytes: buffer.length }
}
