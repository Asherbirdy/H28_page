import { useGoogleSheetRequest } from '../http'

export const useGoogleSheetApi = {
  ganghuMeeting: () => useGoogleSheetRequest.get({
    url: '/AKfycbzJfW01fM3a9PnlQvOufaPc3N7I2Y-nUPzJkAXZYlTr9emQZSROzQLKu-eFp9uA8axV/exec'
  })
}