import { Evenement} from '@/types/sportEvenement/evenement';
import EventStatus from './EvenementsStatus';
import EvenementEpreuve from './EvenementEpreuves';

interface Props {
  event: Evenement;
  onDelete: (id: number) => void;
  onEdit: (event: Evenement) => void;
}

export default function EvenementsTableRow({ event, onDelete, onEdit }: Props) {
  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-900">{event.description}</div>
      </td>
      <td className="px-6 py-4">
        <EvenementEpreuve epreuves={event.epreuves} />
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
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <button 
          onClick={() => onEdit(event)}
          className="text-blue-600 hover:text-blue-900 mr-3"
        >
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
