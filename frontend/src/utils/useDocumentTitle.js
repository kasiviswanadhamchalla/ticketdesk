import { useEffect } from 'react';

export const useDocumentTitle = (title) => {
  useEffect(() => {
    document.title = title ? `${title} | TicketDesk` : 'TicketDesk | Enterprise IT Support Management';
  }, [title]);
};
