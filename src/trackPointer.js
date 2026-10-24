export function trackPointer(event) {
  const rect = event.currentTarget.getBoundingClientRect()
  event.currentTarget.style.setProperty("--px", `${event.clientX - rect.left}px`)
  event.currentTarget.style.setProperty("--py", `${event.clientY - rect.top}px`)
}
