export enum IdentityEnum {
  家長 = '家長',
  家長福音朋友男 = '家長福音朋友(男)',
  家長福音朋友女 = '家長福音朋友(女)',
  服事者 = '服事者',
  兒童男孩 = '兒童(男孩)',
  兒童女孩 = '兒童(女孩)',
  兒童福音朋友男孩 = '兒童福音朋友(男孩)',
  兒童福音朋友女孩 = '兒童福音朋友(女孩)',
  青少年弟兄隊輔 = '青少年弟兄(隊輔)',
  青少年姊妹隊輔 = '青少年姊妹(隊輔)',
  大專弟兄隊輔 = '大專弟兄(隊輔)',
  大專姊妹隊輔 = '大專姊妹(隊輔)',
}

export enum GradeEnum {
  小班 = '小班',
  中班 = '中班',
  大班 = '大班',
  小一 = '小一',
  小二 = '小二',
  小三 = '小三',
  小四 = '小四',
  小五 = '小五',
  小六 = '小六',
  國一 = '國一',
  國二 = '國二',
  國三 = '國三',
  高一 = '高一',
  高二 = '高二',
  高三 = '高三',
}

export enum GroupEnum {
  不分組 = '不分組',
  第一組 = '第一組',
  第二組 = '第二組',
  第三組 = '第三組',
  第四組 = '第四組',
  第五組 = '第五組',
  第六組 = '第六組',
  第七組 = '第七組',
  第八組 = '第八組',
  第九組 = '第九組',
  第十組 = '第十組',
}


export interface ChildrenMeetingParticipant {
  church: string; // 會所
  name: string; //  名字
  gender: '男' | '女'; // 性別
  identity: IdentityEnum; // 身份
  grade: GradeEnum; // 年級
  clothSize: string; // 衣服尺寸
  school: string; // 學校
  adultName: string; // 家長姓名  
  cost: string;
  firstDay: string | boolean;
  secondDay: string | boolean;
  group: GroupEnum;
}

export type ChildrenMeetingParticipantsResponse = ChildrenMeetingParticipant[];
