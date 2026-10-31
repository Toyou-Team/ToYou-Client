'use client';

import { useParams } from 'next/navigation';

import { useDeliveryReportMutation } from '@/common/apis/delivery';
import { useBlockDelivery } from '@/common/hooks/useBlockConversation';
import { ReportForm } from '@/components/report/ReportForm/ReportForm';

// 첫 답장 전이라 대화방이 없는 편지 신고
export default function DeliveryReportPage() {
  const { deliveryId } = useParams<{ deliveryId: string }>();
  const { mutateAsync: report, isPending } = useDeliveryReportMutation(deliveryId);
  const openBlockConfirm = useBlockDelivery(deliveryId);

  return <ReportForm report={report} isPending={isPending} openBlockConfirm={openBlockConfirm} notFoundPath="/home" />;
}
