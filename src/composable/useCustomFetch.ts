export default async function useCustomFetch<T>(url: string, options?: RequestInit): Promise<T> {
  return fetch(url, options).then((response) => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    return response.json()
  })
}
