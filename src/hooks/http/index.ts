import Axios from './axios/Axios'
import _RequstInterceptors from './axios/requestInterceptors'

// ** Clicugo API（使用 dynamicBaseURL 動態獲取 baseURL，優先使用 ConfigStore 的 meta.domain）
const useApiRequest = new Axios({
  directlyGetData: true,
  baseURL: 'adssa',
  timeout: 1000 * 60 * 5,
  interceptors: _RequstInterceptors,
  abortRepetitiveRequest: true,
  retryConfig: {
    count: 0,
    waitTime: 0
  }
})

export {
  useApiRequest
}
