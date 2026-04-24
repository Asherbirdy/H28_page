import type { ChildrenMeetingParticipantsResponse } from '@/types/apis/childrenMeeting'

const CHILDREN_MEETING_API_URL = import.meta.env.VITE_API_CHILDREN_MEETING

export const fetchChildrenMeetingParticipants = async (): Promise<ChildrenMeetingParticipantsResponse> => {
  try {
    const response = await fetch(CHILDREN_MEETING_API_URL)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Failed to fetch children meeting participants:', error)
    throw error
  }
}
