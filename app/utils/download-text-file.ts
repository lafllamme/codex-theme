export interface DownloadTextFileOptions {
  filename: string
  text: string
  mimeType?: string
}

export function downloadTextFile(options: DownloadTextFileOptions): boolean {
  if (!import.meta.client || typeof document === 'undefined')
    return false

  const { filename, text, mimeType = 'text/plain;charset=utf-8' } = options
  const blob = new Blob([text], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')

  try {
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    return true
  }
  finally {
    link.remove()
    URL.revokeObjectURL(url)
  }
}
