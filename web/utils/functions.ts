export const formatDate = (dateString: string | null | undefined, format: 'short' | 'long' = 'short'): string => {
  if (!dateString) return '-'
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return '-'
    if (format === 'short') {
      return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(date)
    }
    return new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeStyle: 'short' }).format(date)
  } catch {
    return '-'
  }
}

export const formatDateTime = (dateString: string | null | undefined): string => {
  if (!dateString) return '-'
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return '-'
    return new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeStyle: 'short' }).format(date)
  } catch {
    return '-'
  }
}

// format teks jika panjangnya melebihi 10 karakter
export const formatText = (text: string): string => {
  if (text.length > 10) {
    return text.substring(0, 10) + '...'
  }
  return text
}

