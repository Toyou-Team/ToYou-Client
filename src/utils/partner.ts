import type { ConversationPartner } from '@/common/apis/conversation';

const WITHDRAWN_NICKNAME = '탈퇴한 사용자';

// 탈퇴한 상대는 남아 있는 닉네임, 프로필 사진 대신 공통 표시로 보여준다
export const getPartnerNickname = (partner: ConversationPartner) =>
  partner.isWithdrawn ? WITHDRAWN_NICKNAME : partner.nickname;

export const getPartnerProfileImage = (partner: ConversationPartner) =>
  partner.isWithdrawn ? null : partner.profileImage;
