import { ExtendEvenement } from "@/types/sportEvenement/evenement";

export function getEventStatus(eventDate: string, eventTime: string): ExtendEvenement['status'] {
  const now = new Date();
  const eventDateTime = new Date(`${eventDate}T${eventTime}`);
  
  // Créer une date pour la fin de l'événement (supposons 2 heures de durée)
  const eventEndDateTime = new Date(eventDateTime.getTime() + (2 * 60 * 60 * 1000));
  
  if (now < eventDateTime) {
    return 'à venir'; // L'événement n'a pas encore commencé
  } else if (now >= eventDateTime && now <= eventEndDateTime) {
    return 'en cours'; // L'événement est en cours
  } else {
    return 'terminé'; // L'événement est terminé
  }
}

export function getStatusColor(status: ExtendEvenement['status']) {
  switch (status) {
    case 'à venir': return 'bg-blue-100 text-blue-800';
    case 'en cours': return 'bg-green-100 text-green-800';
    case 'terminé': return 'bg-gray-100 text-gray-800';
    default: return 'bg-gray-100 text-gray-800';
  }
}
