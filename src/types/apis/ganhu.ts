export interface GanhuParticipant {
  districtName: string;
  name: string;
  identity: '弟兄' | '姊妹' | '男介朋友' | '女介朋友' | '12歲以下' | string;
  departure: string;
  returnRide: string;
  notes: string | number;
  table: string;
  busGo: string;
  busBlend: string;
  cost: string | number;
}

export type GanhuParticipantsResponse = GanhuParticipant[];