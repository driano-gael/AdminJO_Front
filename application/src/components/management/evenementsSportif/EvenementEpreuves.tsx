import { Epreuve } from '@/types/sportEvenement/epreuve';

interface Props {
  epreuves: Epreuve[];
}

export default function EvenementEpreuves({ epreuves }: Props) {
  return (
    <div className="text-sm text-gray-900">
        {epreuves && epreuves.length > 0 ? (
            <div className="flex flex-col space-y-1">
                {epreuves.map((epreuve) => (
                    <span
                        key={epreuve.id}
                        className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs w-fit"
                    >
                        {epreuve.libelle}
                    </span>
                ))}
            </div>
        ) : (
            <span className="text-gray-400">Aucune épreuve</span>
        )}
    </div>
  );
}
