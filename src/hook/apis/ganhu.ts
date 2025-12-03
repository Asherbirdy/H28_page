import type { GanhuParticipantsResponse } from '@/types/apis/ganhu'

const GANHU_API_URL = import.meta.env.VITE_API_MEETING

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