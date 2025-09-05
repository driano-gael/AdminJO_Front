import Spinner from '@/components/spinner';
import {Offre} from "@/types/offre/offre";
import OffresTableRow from "@/components/componentOffre/OffresTableRaw";

interface Props {
  offres: Offre[];
  loading: boolean;
  onDelete: (id: number) => void;
  onEdit: (offre: Offre) => void;
  error: string | null;
}

export default function OffresTable({
                                          offres,
                                          loading,
                                          onDelete,
                                          onEdit,
                                          error
                                        }: Props) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">
            Disciplines ({offres.length})
          </h2>
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
                Nom de l&apos;offre
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                nombre de personnes
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Prix
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {offres.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-6 py-12 text-center text-gray-500">
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <Spinner size="medium" />
                      Chargement des offres...
                    </div>
                  ) :(
                    <div>
                      <p className="text-lg font-medium">Aucune offre</p>
                      <p className="text-sm">Commencez par créer votre première offre</p>
                    </div>
                  )}
                </td>
              </tr>
            ) : (
              offres.map((offre) => (
                <OffresTableRow
                  key={offre.id}
                  offre={offre}
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
