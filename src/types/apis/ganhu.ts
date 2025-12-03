export interface GanhuParticipant {
  districtName: string;
  name: string;
  identity: string;
  departure: string;
  returnRide: string;
  notes: string;
  table: string;
  busGo: string;
  busBlend: string;
  cost: string;
}

export type GanhuParticipantsResponse = GanhuParticipant[];