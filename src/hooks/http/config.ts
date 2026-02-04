// * Base Url
const url = import.meta.env.VITE_API
const urlGoogleSheet = import.meta.env.VITE_API_GOOGOLESHEET
const urlApi = import.meta.env.VITE_ENVIRONMENT === 'prod' ? '/' : url
export {
  urlApi,
  urlGoogleSheet
}