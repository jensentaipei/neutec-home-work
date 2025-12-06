export default async function customFetch<T>(url: string, options?: RequestInit): Promise<T> {
  await new Promise((resolve) => setTimeout(resolve, 500))

  return fetch(url, options).then((response) => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    return response.json()
  })
}
