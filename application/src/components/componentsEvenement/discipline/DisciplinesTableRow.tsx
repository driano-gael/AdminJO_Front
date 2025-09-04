import { Discipline } from '@/types/sportEvenement/discipline';
import Image from "next/image";

interface Props {
  discipline: Discipline;
  onDelete: (id: number) => void;
  onEdit: (discipline: Discipline) => void;
}

export default function DisciplinesTableRow({ discipline, onDelete, onEdit }: Props) {
  return (
    <tr className="hover:bg-gray-50">
      
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center space-x-3">
          {discipline.icone && (
            <Image
              src={`${discipline.icone}`}
              alt={`Icône ${discipline.nom}`}
              width={24}
              height={24}
            />
          )}
          <div className="text-sm font-medium text-gray-900">{discipline.nom}</div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <button 
          onClick={() => onEdit(discipline)}
          className="text-blue-600 hover:text-blue-900 mr-3"
        >
          Modifier
        </button>
        <button 
          onClick={() => onDelete(discipline.id)}
          className="text-red-600 hover:text-red-900"
        >
          Supprimer
        </button>
      </td>
    </tr>
  );
}
