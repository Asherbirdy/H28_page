import Axios from './axios/Axios'
import _RequstInterceptors from './axios/requestInterceptors'
import { urlGoogleSheet } from './config'

// **
const useGoogleSheetRequest = new Axios({
  directlyGetData: true,
  baseURL: urlGoogleSheet,
  timeout: 1000 * 60 * 5,
  interceptors: _RequstInterceptors,
  abortRepetitiveRequest: true,
  retryConfig: {
    count: 0,
    waitTime: 0
  }
})

export {
  useGoogleSheetRequest
}
