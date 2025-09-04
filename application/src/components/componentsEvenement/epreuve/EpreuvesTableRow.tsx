import { Epreuve } from '@/types/sportEvenement/epreuve';
import Image from "next/image";

interface Props {
  epreuve: Epreuve;
  onDelete: (id: number) => void;
  onEdit: (epreuve: Epreuve) => void;
}

export default function EpreuvesTableRow({ epreuve, onDelete, onEdit }: Props) {
  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-900">{epreuve.libelle}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-2">
          <div className="text-sm text-gray-500">{epreuve.discipline.nom}</div>
          {epreuve.discipline.icone && <Image src={epreuve.discipline.icone} alt={"icone"} width={20} height={20}/>}
          </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <button 
          onClick={() => onEdit(epreuve)}
          className="text-blue-600 hover:text-blue-900 mr-3"
        >
          Modifier
        </button>
        <button 
          onClick={() => onDelete(epreuve.id)}
          className="text-red-600 hover:text-red-900"
        >
          Supprimer
        </button>
      </td>
    </tr>
  );
}
