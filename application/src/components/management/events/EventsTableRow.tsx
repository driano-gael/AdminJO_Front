import { ExtendEvenement} from '@/types/sportEvenement/evenement';
import EventStatus from './EventStatus';
import EventEpreuves from './EventEpreuves';
import EventTickets from './EventTickets';

interface EventsTableRowProps {
  event: ExtendEvenement;
  onDelete: (id: number) => void;
}

export default function EventsTableRow({ event, onDelete }: EventsTableRowProps) {
  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-900">{event.description}</div>
      </td>
      <td className="px-6 py-4">
        <EventEpreuves epreuves={event.epreuves} />
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">
          {new Date(event.date).toLocaleDateString('fr-FR')}
        </div>
        <div className="text-xs text-gray-500">{event.horraire}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{event.lieu.nom}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <EventStatus date={event.date} time={event.horraire} />
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <EventTickets capacity={event.capacity} ticketsSold={event.ticketsSold} />
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <button className="text-blue-600 hover:text-blue-900 mr-3">
          Modifier
        </button>
        <button 
          onClick={() => onDelete(event.id)}
          className="text-red-600 hover:text-red-900"
        >
          Supprimer
        </button>
      </td>
    </tr>
  );
}
