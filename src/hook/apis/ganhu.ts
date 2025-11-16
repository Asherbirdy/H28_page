import axios from 'axios'

import type { GanhuParticipantsResponse } from '@/types/apis/ganhu'

const GANHU_API_URL = import.meta.env.VITE_API_MEETING

export const fetchGanhuParticipants = async (): Promise<GanhuParticipantsResponse> => {
  try {
    const response = await axios.get<GanhuParticipantsResponse>(GANHU_API_URL)
    return response.data
  } catch (error) {
    console.error('Failed to fetch ganhu participants:', error)
    throw error
  }
}