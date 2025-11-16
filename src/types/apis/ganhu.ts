export interface GanhuParticipant {
  districtName: string;
  name: string;
  identity: string;
  departure: string;
  returnRide: string;
  notes: string;
}

export type GanhuParticipantsResponse = GanhuParticipant[];