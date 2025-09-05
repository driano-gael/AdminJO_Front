import {Offre} from "@/types/offre/offre";

interface Props {
  offre: Offre;
  onDelete: (id: number) => void;
  onEdit: (offre: Offre) => void;
}

export default function OffresTableRow({ offre, onDelete, onEdit }: Props) {
  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-900">{offre.libelle}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-900">{offre.nb_personne}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-900">{offre.montant}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <button
          onClick={() => onEdit(offre)}
          className="text-blue-600 hover:text-blue-900 mr-3"
        >
          Modifier
        </button>
        <button
          onClick={() => onDelete(offre.id)}
          className="text-red-600 hover:text-red-900"
        >
          Supprimer
        </button>
      </td>
    </tr>
  );
}
