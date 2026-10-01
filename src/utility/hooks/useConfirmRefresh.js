import { useEffect } from 'react';

export const confirmRefresh = (event) => {
  const okToRefresh = window.confirm("Do you really want to refresh the page?");
  if (!okToRefresh) {
    event.preventDefault();
    event.returnValue = ''; 
  }
};

// use to Avoid direct Refresh Take a confirmation then Refresh 
const useConfirmRefresh = (shouldConfirm) => {
  useEffect(() => {
    if (shouldConfirm) {
      window.addEventListener('beforeunload', confirmRefresh);
    }
    
    return () => {
      if (shouldConfirm) {
        window.removeEventListener('beforeunload', confirmRefresh);
      }
    };
  }, [shouldConfirm]);
};

export default useConfirmRefresh;