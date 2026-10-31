'use client';

import { useParams } from 'next/navigation';

import { useReportMutation } from '@/common/apis/conversation';
import { useBlockConversation } from '@/common/hooks/useBlockConversation';
import { ReportForm } from '@/components/report/ReportForm/ReportForm';

export default function ReportPage() {
  const { conversationId, messageId } = useParams<{ conversationId: string; messageId: string }>();
  const { mutateAsync: report, isPending } = useReportMutation(conversationId);
  const openBlockConfirm = useBlockConversation(conversationId);

  return (
    <ReportForm
      report={(payload) => report({ messageId, ...payload })}
      isPending={isPending}
      openBlockConfirm={openBlockConfirm}
      notFoundPath="/letter-box"
    />
  );
}
