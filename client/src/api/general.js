export const handleApiError = (error) => {
  console.error(error)
  throw new Error(typeof error === 'string' ? error : JSON.stringify(error))
}

export const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
