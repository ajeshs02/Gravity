export const handleError = (error) => {
  console.error(error)
  if (error instanceof Error) {
    throw error
  } else {
    throw new Error(error)
  }
}
