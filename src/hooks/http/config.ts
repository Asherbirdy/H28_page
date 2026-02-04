// * Base Url
const url = import.meta.env.VITE_API
const urlApi = import.meta.env.VITE_ENVIRONMENT === 'prod' ? '/' : url

export {
  urlApi
}