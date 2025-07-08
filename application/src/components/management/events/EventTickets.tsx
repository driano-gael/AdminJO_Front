interface EventTicketsProps {
  capacity?: number;
  ticketsSold?: number;
}

export default function EventTickets({ capacity, ticketsSold }: EventTicketsProps) {
  if (capacity && ticketsSold) {
    return (
      <>
        <div className="text-sm text-gray-900">
          {ticketsSold.toLocaleString()} / {capacity.toLocaleString()}
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
          <div 
            className="bg-blue-600 h-2 rounded-full" 
            style={{ width: `${(ticketsSold / capacity) * 100}%` }}
          />
        </div>
      </>
    );
  }
  
  return (
    <div className="text-sm text-gray-500">Non disponible</div>
  );
}
