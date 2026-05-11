import type { GanhuParticipantsResponse } from '@/types/apis/ganhu'

interface GanghuMeetingResponse {
	time: string
  place: string
  title: string
  name: string
  offsetX: number
  offsetY: number
  description: string
}

const GANHU_API_URL = import.meta.env.VITE_API_MEETING
const MEETING_DATA_API_URL = import.meta.env.VITE_API_MEETING_DATA

export const fetchGanhuParticipants = async (): Promise<GanhuParticipantsResponse> => {
  try {
    const response = await fetch(GANHU_API_URL)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Failed to fetch ganhu participants:', error)
    throw error
  }
}

export interface WeddingLiveResponse {
  title: string
  liveUrl: string
}

const WEDDING_API_URL = 'https://script.google.com/macros/s/AKfycbw_g8RZJXXhTEC2QNC9nTMlTG7K8FwA4XVhh1W0ZOenhBRqbI9jRoPqzh1ug2gRbi-P/exec'

export const fetchWeddingLive = async (): Promise<WeddingLiveResponse> => {
  try {
    const response = await fetch(WEDDING_API_URL)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    return await response.json()
  } catch (error) {
    console.error('Failed to fetch wedding live:', error)
    throw error
  }
}

export const fetchMeetingData = async (): Promise<GanghuMeetingResponse[]> => {
  try {
    const response = await fetch(MEETING_DATA_API_URL)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Failed to fetch meeting data:', error)
    throw error
  }
}
