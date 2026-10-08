import 'axios'

declare module 'axios' {
  interface AxiosRequestConfig {
    _authRetry?: boolean
    skipAuthRefresh?: boolean
  }
}
