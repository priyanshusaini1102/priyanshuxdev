import { Font } from "@react-pdf/renderer"

let registered = false

function fontSource(fileName) {
  const url = new URL(`./fonts/${fileName}`, import.meta.url)
  if (url.protocol === "file:") return decodeURIComponent(url.pathname)
  return url.href
}

export function registerResumeFonts() {
  if (registered) return
  registered = true
  Font.register({
    family: "Arimo",
    fonts: [
      { src: fontSource("Arimo-Regular.ttf"), fontWeight: 400 },
      { src: fontSource("Arimo-Bold.ttf"), fontWeight: 700 },
      { src: fontSource("Arimo-Italic.ttf"), fontWeight: 400, fontStyle: "italic" },
      { src: fontSource("Arimo-BoldItalic.ttf"), fontWeight: 700, fontStyle: "italic" },
    ],
  })
  Font.registerHyphenationCallback((word) => [word])
}
