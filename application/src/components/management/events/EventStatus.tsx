import { getEventStatus, getStatusColor } from "@/utils/evenement/statutEvenement";

interface EventStatusProps {
  date: string;
  time: string;
}

export default function EventStatus({ date, time }: EventStatusProps) {
  const status = getEventStatus(date, time);
  
  return (
    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(status)}`}>
      {status}
    </span>
  );
}
