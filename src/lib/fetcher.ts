import axios, { AxiosRequestConfig } from 'axios'

const fetcher = async <T = any>(url: string, options?: AxiosRequestConfig): Promise<T> => {
  try {
    const response = await axios.get<T>(url, options)
    return response.data
  } catch (err) {
    console.log('fetch', { err })
    throw err
  }
}

export default fetcher
