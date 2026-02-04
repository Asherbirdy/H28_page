import { useGoogleSheetRequest } from '../http'

interface GanghuMeetingResponse {
	time: string
  place: string
  title: string
  name: string
  offsetX: number
  offsetY: number
  description: string
}

export const useGoogleSheetApi = {
  ganghuMeeting: () => useGoogleSheetRequest.get<GanghuMeetingResponse[]>({
    url: '/AKfycbzJfW01fM3a9PnlQvOufaPc3N7I2Y-nUPzJkAXZYlTr9emQZSROzQLKu-eFp9uA8axV/exec'
  })
}