import { Discipline } from '@/types/sportEvenement/discipline';
import DisciplinesTableRow from './DisciplinesTableRow';
import Spinner from '@/components/spinner';

interface Props {
  disciplines: Discipline[];
  loading: boolean;
  searchTerm: string;
  onRefresh: () => void;
  onDelete: (id: number) => void;
  onEdit: (discipline: Discipline) => void;
  error: string | null;
}

export default function DisciplinesTable({ 
  disciplines, 
  loading, 
  searchTerm, 
  onRefresh, 
  onDelete, 
  onEdit,
  error 
}: Props) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">
            Disciplines ({disciplines.length})
          </h2>
          <div className="flex items-center space-x-2">
            {loading && (
              <div className="flex items-center text-sm text-gray-500">
                <Spinner size="small" />
                Chargement...
              </div>
            )}
            <button
              onClick={onRefresh}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              disabled={loading}
            >
              🔄 Actualiser
            </button>
          </div>
        </div>
        {error && (
          <div className="mt-2 text-sm text-red-600 bg-red-50 p-2 rounded">
            {error}
          </div>
        )}
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nom de la Discipline
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {disciplines.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-6 py-12 text-center text-gray-500">
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <Spinner size="medium" />
                      Chargement des disciplines...
                    </div>
                  ) : searchTerm ? (
                    <div>
                      <p className="text-lg font-medium">Aucune discipline trouvée</p>
                      <p className="text-sm">Aucune discipline ne correspond à votre recherche &ldquo;{searchTerm}&rdquo;</p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-lg font-medium">Aucune discipline</p>
                      <p className="text-sm">Commencez par créer votre première discipline</p>
                    </div>
                  )}
                </td>
              </tr>
            ) : (
              disciplines.map((discipline) => (
                <DisciplinesTableRow
                  key={discipline.id}
                  discipline={discipline}
                  onDelete={onDelete}
                  onEdit={onEdit}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
